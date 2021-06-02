import credInflux from './constants/influx'
import moment from "moment";
import db_req from "./constants/influx_requests.json"
import {latLng} from "leaflet/dist/leaflet-src.esm"
import axios from "axios";
import L from "leaflet";
import NProgress from "nprogress";
import {toFront} from "leaflet/src/dom/DomUtil";
import fr from "element-ui/src/locale/lang/fr";
const Influx = require('influx')

/**
 * The fields to build the queries with, taken from constants file
 */
const field_rssi = db_req.field_rssi // RSSI storage topic in InfluxDB
const field_snr = db_req.field_snr   // SNR storage topic in InfluxDB
const field_battery = db_req.field_battery // Battery storage topic in InfluxDB
const data_table = db_req.data_table // Which database to request in InfluxDB
const topic_header = db_req.topic_header
const data_fields = [
  "payload_fields_temperature_head_value",
  "payload_fields_temperature_target_value",
  "metadata_gateways_0_rf_chain",
  "metadata_gateways_0_timestamp",
  "metadata_airtime",
  field_snr,
  field_rssi,
  field_battery, //battery decentlab
  "payload_fields_WaterHeightMm",
  "payload_fields_BatteryV", //battery hei
  "payload_fields_HumiditySHT30"
]


export default {
  install(Vue, options) {
    Vue.prototype.$PROJECT = location.hostname.split('.')[0]
    Vue.prototype.$SENSORSLISTJSON=[];
    Vue.prototype.$GATEWAYLISTJSON=[];
   // Vue.prototype.$SERVERURL = 'http://localhost:4500/';
    Vue.prototype.$SERVERURL = 'https://snow-server.watermon.ch:443/';



    /**
     * The singleton instance of influxClient, which should be used everywhere
     * @type {InfluxDB}
     */
    const influxClient = new Influx.InfluxDB({
      database: credInflux.database,
      host: credInflux.host,
      port: credInflux.port,
      protocol: credInflux.protocol,
      username: credInflux.username,
      password: credInflux.password
    });

    Vue.prototype.$influxClient = influxClient

    /**
     *Sensors Array
     * @type {*[]}
     */
    Vue.prototype.$globalSensors = []

    /**
     * Loads all global data, should be optimized !
     */
    Vue.prototype.$globalLoadData = function (sensorType, location) {
      this.$globalSensors = []

      let query = `SELECT $FIELDS
             FROM
                    "$DATABASE"
             WHERE
                    "topic" = '$TOPIC_HEADER/$DEVICEID/up'
             ORDER BY time DESC
             LIMIT
                    1
             `;

      // Build the real query from the template one
      // console.log("Data fields query is : " + data_fields)
      let dField = data_fields
      let dFieldMerged = dField.join(",")

      query = query.replace("$FIELDS", dFieldMerged)
      query = query.replace("$DATABASE", data_table)
      query = query.replace("$TOPIC_HEADER", topic_header)
      query = query.replace("$DEVICEID", sensorType + "-" + location);
      query = query.replace(/\n|\r/g, " ")

      function RSSI_Icon(val) {
        let icon = undefined
        if (val > -100) {
          icon = 'static/img/technical/Network_full.png'
        } else if (val > -110 && val <= -100) {
          icon = 'static/img/technical/Network_good.png'
        } else if (val > -120 && val <= -110) {
          icon = 'static/img/technical/Network_bad.png'
        } else if (val < -120) {
          icon = 'static/img/technical/Network_nothing.png'
        }

        return icon
      }

      function SNR_Icon(val) {
        if (val > -7.5) {
          return 'static/img/technical/Network_full.png'
        } else if (val - 12.5 && val <= -7.5) {
          return 'static/img/technical/Network_good.png'
        } else if (val > -17.5 && val <= -12.5) {
          return 'static/img/technical/Network_bad.png'
        } else if (val < -17.5) {
          return 'static/img/technical/Network_nothing.png'
        }
      }

      function battery_Icon(val) {
        if (val >= 2.79) {
          return 'static/img/technical/battery/Battery_full.png';
        } else if (val < 2.79 && val >= 2.54) {
          return 'static/img/technical/battery/Battery_good.png';
        } else if (val < 2.54 && val >= 2.42) {
          return 'static/img/technical/battery/Battery_medium.png';
        } else if (val < 2.42 && val >= 2.34) {
          return 'static/img/technical/Battery_middleBad.png';
        } else if (val < 2.18) {
          return 'static/img/technical/battery/Battery_bad.png';
        }
      }

      /**
       * set the GPS latitude, used into overview.vue for the map
       * @param location
       * @returns {number[]}
       */
      function setLatitude(location) {
        if (location === 'telecabine') {
          return 46.29411
        } else if (location === 'pralan') {
          return 46.29894
        } else if (location === 'prodesavioz') {
          return 46.26721
        }else if(location === 'stepstleo'){
          return 46.250091
        }
      }

      function setLongitude(location) {
        if (location === 'telecabine') {
          return 7.39557
        } else if (location === 'pralan') {
          return 7.40549
        } else if (location === 'prodesavioz') {
          return 7.39827
        }else if(location === 'stepstleo'){
          return 7.425921
        }
      }

      function setRealLocationName(location) {
        if (location === 'telecabine') {
          return 'Télécabine'
        } else if (location === 'pralan') {
          return 'Pralan'
        }else if(location === 'prodesavioz'){
          return 'Pro de Savioz'
        }else if(location == 'stepstleo'){
          return 'Step'
        }
      }




    //  console.log(query)
        Promise.all([
          influxClient.query(query)
        ]).then(parsedRes => {
          parsedRes.map(arr => {
            // If we got something from the DB
            if (arr[0] != undefined) {
              // The DB returns a single value with all the data in it
              let value = arr[0]

              // This is what we are going to put in the data model
              if (sensorType === 'decentlab') {
                let sensor = {
                  when: value.time,
                  where: location,
                  realName: setRealLocationName(location),
                  lat: setLatitude(location),
                  lng: setLongitude(location),
                  type: sensorType,
                  rssi: value.metadata_gateways_0_rssi,
                  snr: value.metadata_gateways_0_snr,
                  batt_voltage: value.payload_fields_battery_voltage_value,
                  temp_head: this.$loadDataTimeLimit(sensorType, location, data_fields[0], '10m'),//value.payload_fields_temperature_head_value,
                  temp_head30m: this.$loadDataTimeLimit(sensorType, location, data_fields[0], '30m'),
                  temp_head1h: this.$loadDataTimeLimit(sensorType, location, data_fields[0], '1h'),
                  temp_target: this.$loadDataTimeLimit(sensorType, location, data_fields[1], '10m'),//value.payload_fields_temperature_target_value,
                  temp_target30m: this.$loadDataTimeLimit(sensorType, location, data_fields[1], '30m'),
                  temp_target1h: this.$loadDataTimeLimit(sensorType, location, data_fields[1], '1h'),
                  iconRSSI: RSSI_Icon(value.metadata_gateways_0_rssi),
                  iconSNR: SNR_Icon(value.metadata_gateways_0_snr),
                  iconBattery: battery_Icon(value.payload_fields_battery_voltage_value),
                  frostRiskValue: this.$loadFrostRisk('hei', location)[0], // this is from the HEI sensor
                  humidity : this.$loadDataTimeLimit('hei',location, 'payload_fields_HumiditySHT30', '10m'),
                  frostPointValue: this.$loadFrostRisk('hei', location)[1],
                  snowOffset: ''
                }

                // Push the created sensor value to the data
                // To push the data, we must make a deep copy as Javascript is not clever enough
                // to see changes there
                const v = this.$globalSensors
                v.push(sensor)
                this.$globalSensors = v

              } else if (sensorType === 'hei') {
                let sensor = {
                  when: value.time,
                  where: location,
                  realName: setRealLocationName(location),
                  lat: setLatitude(location),
                  lng: setLongitude(location),
                  type: sensorType,
                  rssi: value.metadata_gateways_0_rssi,
                  snr: value.metadata_gateways_0_snr,
                  batt_voltage: value.payload_fields_BatteryV,
                //  snow: this.$loadDataTimeLimit(sensorType, location, 'payload_fields_WaterHeightMm', '10m'),//value.payload_fields_WaterHeightMm,
                //  snow_30m: this.$loadDataTimeLimit(sensorType, location, 'payload_fields_WaterHeightMm', '30m'),
                //  snow_1h: this.$loadDataTimeLimit(sensorType, location, 'payload_fields_WaterHeightMm', '1h'),
                //  snow_4h: this.$loadDataTimeLimit(sensorType, location, 'payload_fields_WaterHeightMm', '4h'),
                //  cumul_snow4h: this.$loadCumulateSnowData(sensorType, location, '4h'),
                //  cumul_snow1h: this.$loadCumulateSnowData(sensorType, location, '1h'),
                //  cumul_snow30m: this.$loadCumulateSnowData(sensorType, location, '30m'),
                  iconRSSI: RSSI_Icon(value.metadata_gateways_0_rssi),
                  iconSNR: SNR_Icon(value.metadata_gateways_0_snr),
                  iconBattery: battery_Icon(value.payload_fields_BatteryV),
                 // frostRiskValue: this.$loadFrostRisk('hei', location)[0], // this is from the HEI sensor
                  snowOffset : this.$getSnowOffset(this.$PROJECT, location),
                  frostRiskValue: this.$loadFrostRisk('hei', location)[0], // this is from the HEI sensor

                }

                // Push the created sensor value to the data
                // To push the data, we must make a deep copy as Javascript is not clever enough
                // to see changes there
                const v = this.$globalSensors
                v.push(sensor)

                this.$globalSensors = v.sort((a,b) => (a.realName > b.realName) ? 1 : ((b.realName > a.realName) ? -1 : 0))

              }
            }
          });
        }).catch(error => console.log(error))

    }

    /**
     * Load a given serie, cleaned
     * @param paramQuery, field
     */
    Vue.prototype.$loadSerie = function (sensorType, location, field, serieName, groupByTime = "10m", backTime = "7d" , offset = 0) {
     /* let query = `SELECT median("$FIELDS")
             FROM
                    "$DATABASE"
             WHERE
                    "topic" = '$TOPIC_HEADER/$DEVICEID/up'
             AND

             time>now()-$BACKTIME GROUP BY time($TIMEGROUP)
            `;*/
      let query = `SELECT moving_average("$FIELDS",10)
             FROM
                    "$DATABASE"
             WHERE
                    "topic" = '$TOPIC_HEADER/$DEVICEID/up'
             AND

             time>now()-$BACKTIME
            `;


      query = query.replace("$FIELDS", field)
      query = query.replace("$DATABASE", data_table)
      query = query.replace("$TOPIC_HEADER", topic_header)
      query = query.replace("$DEVICEID", sensorType + "-" + location);
      query = query.replace("$TIMEGROUP", groupByTime)
      query = query.replace("$BACKTIME", backTime)
      query = query.replace(/\n|\r/g, " ")

      return Promise.all([
        influxClient.query(query)
      ]).then(parsedRes => {
        const mutatedArray = parsedRes.map(arr => {

          if(field === 'payload_fields_WaterHeightMm'){ // if this is snow, i hav to dediuce the offset and reverse the chart.
            return Object.assign({}, {
              name: serieName, // name on the chart
              color: '#4285f4',
              lineWidth: 0.6,
              turboThreshold: 60000,
              // tooltip: {
              //   valueSuffix: ' V'
              // },
              data: arr.map(obj => Object.assign({}, {
                x: (moment(obj.time).unix()) * 1000,
                y: obj['moving_average'] == null ? obj['moving_average'] : ((obj['moving_average']-offset)*(-1)/10) //*-1 pour retourner le graph
              }))
            });
          }else{
            return Object.assign({}, {
              name: serieName, // name on the chart
              color: '#4285f4',
              lineWidth: 0.6,
              turboThreshold: 60000,
              // tooltip: {
              //   valueSuffix: ' V'
              // },
              data: arr.map(obj => Object.assign({}, {
                x: (moment(obj.time).unix()) * 1000,
                y: obj['moving_average'] == null ? obj['moving_average'] : ((obj['moving_average']-offset))
              })),

            });
          }
        /*  return Object.assign({}, {
            name: serieName, // name on the chart
            color: '#4285f4',
            lineWidth: 0.6,
            turboThreshold: 60000,
            // tooltip: {
            //   valueSuffix: ' V'
            // },
            data: arr.map(obj => Object.assign({}, {
              x: (moment(obj.time).unix()) * 1000,
              y: obj['median'] == null ? obj['median'] : ((obj['median']-offset)*(-1)) //*-1 pour retourner le graph
            }))
          });*/


        });
        return mutatedArray
      }).catch(error => console.log(error))
    }

    /**
     * Load data that have time limit
     * @param sensorType
     * @param location
     * @param field
     * @param timeLimit
     * @returns {[]}
     */
    Vue.prototype.$loadDataTimeLimit = function (sensorType, location, field, timeLimit) {
      let query = `SELECT first($FIELDS)
             FROM
                    "$DATABASE"
             WHERE
                    "topic" = '$TOPIC_HEADER/$DEVICEID/up'
             AND

             time>now()-$timeLimit order by time asc limit 1
            `;
      query = query.replace("$FIELDS", field)
      query = query.replace("$DATABASE", data_table)
      query = query.replace("$TOPIC_HEADER", topic_header)
      query = query.replace("$DEVICEID", sensorType + "-" + location);
      query = query.replace("$timeLimit", timeLimit)
      query = query.replace(/\n|\r/g, " ")
      // console.log(query)
      let value = []
      Promise.all([
        influxClient.query(query)
      ]).then(parsedRes => {
        parsedRes.map(arr => {
          if (arr[0] != undefined) {
            if(field === 'payload_fields_WaterHeightMm'){
              //change offset : arr[0].first-offset
              value.push(arr[0].first)

            }else{
              value.push(arr[0].first)
            }

          }
        });
      }).catch(error => console.log(error))
      //console.log(value)
      return value
    }

    /**
     * chart reference min and max for overview page
     * @type {string}
     */
    Vue.prototype.$refMaxTempValue = ''
    Vue.prototype.$refMinTempValue = ''

    /**
     * set reference min max for a chart
     */
    Vue.prototype.$setRefTempChart = function () {
      let actualMonth = new Date().getMonth();
      //console.log("ActualMonth : " + actualMonth)
      //source : https://planificateur.a-contresens.net/europe/suisse/canton_du_valais/anzere/6559505.html
      // valeur choisie : max +15° min -15°
      switch (actualMonth) {
        case 0: //janvier
          this.$refMaxTempValue = 15;
          this.$refMinTempValue = -20;
          break;
        case 1: // févier
          this.$refMaxTempValue = 15;
          this.$refMinTempValue = -20;
          break;
        case 2: // mars
          this.$refMaxTempValue = 21;
          this.$refMinTempValue = -15;
          break;
        case 3: // avril
          this.$refMaxTempValue = 25;
          this.$refMinTempValue = -15;
          break;
        case 4: // mai
          this.$refMaxTempValue = 30;
          this.$refMinTempValue = 0;
          break;
        case 5: // juin
          this.$refMaxTempValue = 45;
          this.$refMinTempValue = 10;
          break;
        case 6: // juillet
          this.$refMaxTempValue = 45;
          this.$refMinTempValue = 5;
          break;
        case 7: // aout
          this.$refMaxTempValue = 40;
          this.$refMinTempValue = 5;
          break;
        case 8: // septembre
          this.$refMaxTempValue = 30;
          this.$refMinTempValue = 0;
          break;
        case 9: // octobre
          this.$refMaxTempValue = 25;
          this.$refMinTempValue = -10;
          break;
        case 10: // novembre
          this.$refMaxTempValue = 20;
          this.$refMinTempValue = -15;
          break;
        case 11: //decembre
          this.$refMaxTempValue = 18;
          this.$refMinTempValue = -20;
          break;
      }
    }


    /**
     * to Json array
     * @param serieChart
     * @returns {any}
     */
    Vue.prototype.$exportToJson = function (serieChart) {
      let toJsonised = JSON.stringify(serieChart)
      return JSON.parse(toJsonised)
    }

    /**
     * find time between two dates, used to check the antennas
     * @param date1
     * @param date2
     * @returns {number}
     */
    Vue.prototype.$secondBetweenDate = function (date1, date2) {
      return Math.ceil(Math.abs(date1 - date2) / 1000);
    }


    /**
     * Load frost risk value, calculate from humidity, air temperature and soil temperature
     */
    Vue.prototype.$loadFrostRisk = function (sensorType, location) {
      let queryHum = `SELECT last($FIELDS)
             FROM
                    "mqtt_consumer"
             WHERE
                    "topic" = 'hes_ayent-snow/devices/$DEVICEID/up'
            `;
      queryHum = queryHum.replace("$FIELDS", "payload_fields_HumiditySHT30")
      queryHum = queryHum.replace("$DEVICEID", 'hei' + "-" + location);
      queryHum = queryHum.replace(/\n|\r/g, " ")

      let queryTempHead = `SELECT last($FIELDS)
             FROM
                    "mqtt_consumer"
             WHERE
                    "topic" = 'hes_ayent-snow/devices/$DEVICEID/up'
            `;

      queryTempHead = queryTempHead.replace("$FIELDS", "payload_fields_temperature_head_value")
      queryTempHead = queryTempHead.replace("$DEVICEID", 'decentlab' + "-" + location);
      queryTempHead = queryTempHead.replace(/\n|\r/g, " ")

      let queryTempTarget = `SELECT last($FIELDS)
             FROM
                    "mqtt_consumer"
             WHERE
                    "topic" = 'hes_ayent-snow/devices/$DEVICEID/up'
            `;

      queryTempTarget = queryTempTarget.replace("$FIELDS", "payload_fields_temperature_target_value")
      queryTempTarget = queryTempTarget.replace("$DEVICEID", 'decentlab' + "-" + location);
      queryTempTarget = queryTempTarget.replace(/\n|\r/g, " ")

       let valueHum = 0
       let valueTempHead = 0
       let valueTempTarget = 0


      let frostRisks = []
      let frostPoint = []
      var promises = [influxClient.query(queryHum), influxClient.query(queryTempHead), influxClient.query(queryTempTarget)]
      Promise.all(promises)
        .then((res) => {
            if( res[0][0] != undefined &&res[1][0] != undefined && res[2][0] != undefined){
              //console.log("hum : " + res[0][0].last)
              //console.log("head : " + res[1][0].last)
              //console.log("target : " + res[2][0].last)
              if (res[2][0].last < 0) {
                  valueTempHead = res[1][0].last
                  valueTempTarget =res[2][0].last
                  valueHum = res[0][0].last
                  frostPoint.push(this.$calculateFrostPoint(valueTempHead, valueHum/100, location))
                  frostRisks.push(this.$frostRisk(frostPoint, valueTempTarget, valueTempHead));

              } else {
                frostRisks.push(-1)
                frostPoint='-'
              }
            }else{
              frostRisks.push(-1)
              frostPoint='-'
            }
        }).finally(x => {
            setTimeout(() => {
                this.pending = false;
              }, 500
            )
     })
      /*if (valueTempTarget < 0) {
        frostPoint = this.$calculateFrostPoint(valueTempHead, valueHum)
        frostRisks.push(this.$frostRisk(frostPoint, valueTempTarget));

      } else {
        frostRisks.push(-1);
      }*/

      return [frostRisks,frostPoint]

    }


    /**
     * * Formule from :
     * frostPoint : https://fr.wikipedia.org/wiki/Point_de_givrage
     * dewPoint : https://fr.wikipedia.org/wiki/Point_de_ros%C3%A9e
     *
     * @param tempHead
     * @param hum : not in % but 0.XY
     * @returns {string}
     */
    Vue.prototype.$calculateFrostPoint = function (tempHead, hum, location ) {
//      console.log("il y a un souci : temphead et hum n'ont pas de valeur => pas de point de givrage correct")
//      console.log(Math.pow(hum, 1 / 8))
      var dewPoint = Math.pow(hum, 1 / 8) * (112 + (0.9 * tempHead)) + 0.1 * tempHead - 112;
      var tempKelvin = tempHead + 273.15;
      var dewPointKelvin = dewPoint + 273.15;
//      console.log(location)
//      console.log("temp head : "+ tempHead)
//      console.log("hum : " + hum)
//      console.log("dewpoint : " + dewPoint)
      var frostpointKelvin = 0;
      var denominateur = (2954.61 / tempKelvin) + 2.193665 * Math.log(tempKelvin) - 13.3448;
//      console.log(denominateur)
      frostpointKelvin = dewPointKelvin + (2671.02 / denominateur) - tempKelvin;


      var frostpoint = (frostpointKelvin - 273.15).toFixed(2);
//      console.log("frost Point : " + frostpoint)
      return frostpoint
    }



    /**
     * returns : 1 frost, 0 perhaps frost, -1 no risk
     * @param frostPoint
     * @param tempTarget
     * @returns {number}
     */
    Vue.prototype.$frostRisk = function (frostPoint, tempTarget,tempHead) {
    //  console.log(frostPoint)
      var margin = 2; // margin between temp target and frostPoint
      if (tempTarget <= frostPoint && tempHead <=1) {
        // frost

//        console.log("frostRisk :  1")
        return 1
      } else if (frostPoint > (tempTarget - (margin )) && tempTarget > frostPoint && tempHead <=1) {
        // maybe frost

//        console.log("frostRisk :  0")
        return 0
      } else {
        //no frost
//        console.log("frostRisk :  -1")
        return -1
      }
    }


    /**
     * load cumulate snow data since 365days
     * @param sensorType
     * @param location
     * @param timelimit
     * @returns {[]}
     */
    Vue.prototype.$loadCumulateSnowData = function (sensorType, location, timelimit) {
      /*create the query*/
      let query = `SELECT payload_fields_WaterHeightMm
             FROM
                    mqtt_consumer
             WHERE
                    "topic" = 'hes_ayent-snow/devices/$DEVICEID/up'
             AND time>now()-$TIMELIMIT

             `;
      query = query.replace("$DEVICEID", sensorType + "-" + location)
      query = query.replace("$TIMELIMIT", timelimit)

      let cumulSnowQuery = 0;
      let cumulArray = [];

      Promise.all([
        influxClient.query(query), // WHERE time>now()-365d
      ]).then(parsedRes => {
        parsedRes.map(arr => {
          if (arr[0] != undefined) {
            //to change arr[0]['payload_fields_WaterHeightMm']-offset
            cumulSnowQuery = arr[0]['payload_fields_WaterHeightMm'];
            /*
            this loop show if the value at position i+i is bigger than the previous, if yes, add the difference
            to cumulsnow
             */
            for (var i = 1; i < arr.length - 1; i++) {
              if (arr[i]['payload_fields_WaterHeightMm'] <= arr[i - 1]['payload_fields_WaterHeightMm']) {
                continue;
              } else {
                cumulSnowQuery = cumulSnowQuery + (arr[i]['payload_fields_WaterHeightMm'] - arr[i - 1]['payload_fields_WaterHeightMm']);
              }
            }
            cumulArray.push(cumulSnowQuery)
          }
        });
        NProgress.done();
      }).catch(error => console.log(error))
      return cumulArray
    }


    /**
     * get snow offset from json File
     * @param project
     * @param location
     * @returns {[]}
     */
    Vue.prototype.$getSnowOffset = function (project, location) {
      var toto = [];
      axios.get('https://snow-server.watermon.ch:443/snowOffset')
        .then(res => {
          for(var i = 0 ; i< res.data.length; i++){
            if(res.data[i].project === project && res.data[i].location === location){
              toto.push(res.data[i].offset)
            }
          }

        })
        .catch(error => {
          console.log(error)
        })
      return toto
    }

    Vue.prototype.$getRealName = function(project, location){
      var toto = [];
      axios.get('https://snow-server.watermon.ch:443/snowOffset')
        .then(res => {
          for(var i = 0 ; i< res.data.length; i++){
            if(res.data[i].project === project && res.data[i].location === location){
              toto.push(res.data[i].realName)
            }
          }

        })
        .catch(error => {
          console.log(error)
        })
      return toto
    }



    }
}
