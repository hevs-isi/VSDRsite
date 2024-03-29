import moment from "moment";
import {latLng} from "leaflet/dist/leaflet-src.esm"
import L from "leaflet";
import NProgress from "nprogress";
import {toFront} from "leaflet/src/dom/DomUtil";
import fr from "element-ui/src/locale/lang/fr";


//VSDR imports
import chirpstackCredentials from './constants/chirpstack.json'      //credentials for chirpstack server
import credInflux from './constants/influx'
const Influx = require('influx')

import db_req from "./constants/influx_requests.json"

import axios from 'axios'





export default {
  install(Vue, options) {
    /**
     * Global variables
     */
    Vue.prototype.$PROJECT = location.hostname.split('.')[0]
    Vue.prototype.$SENSORSLISTJSON=[];
    Vue.prototype.$GATEWAYLISTJSON=[];
    Vue.prototype.$SERVERURL = 'https://snow-server.watermon.ch:443/';
    

//------------------------------------------------------------------------------------------------------------------------------
// Querry On chirpstack API
//------------------------------------------------------------------------------------------------------------------------------
    
    /**
     * Function that make the request on the chirpstack server
     * @param {} target ex: gateways 
     * @param {*} eui   ex : 3436323828003400
     */ 
    Vue.prototype.$getFromChirpStack = function (target, eui) {
      axios.get(chirpstackCredentials.url+ target + '/' + eui, {headers : {
        'Accept': 'application/json',
        'Grpc-Metadata-Authorization' : 'Bearer ' + chirpstackCredentials.token,
      }})   
        .then(res => {
          console.log(res.data)
        })
    }


    /**
     * 
     * @param {*} target 
     * @param {*} eui 
     * @param {*} data
     */
    Vue.prototype.$postDownlinkChirpStack = function (target, eui, data, port, confirmed) {

      // data : data to send
      //jsonObject : data to send if a codecs as been configured

      var postData = {
        "deviceQueueItem": {
          "confirmed": confirmed,
          "data": data,
          "devEUI": eui,
          "fCnt": 0,
          "fPort": port
        }
      }

      let axiosConfig = {
        headers: {
          'Accept': 'application/json',
          'Grpc-Metadata-Authorization' : 'Bearer ' + chirpstackCredentials.token,
        }
      };

      axios.post(chirpstackCredentials.url+ target + '/' + eui + '/queue', postData, axiosConfig)
      .then((res) => {
        console.log("RESPONSE RECEIVED: ", res);
        return true
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
        return false
      })
    }
//------------------------------------------------------------------------------------------------------------------------------


     /**
     * find time between two dates, used to check the antennas
     * @param date1
     * @param date2
     * @returns {number}
     */
      Vue.prototype.$secondBetweenDate = function (date1, date2) {
        return Math.ceil(Math.abs(date1 - date2) / 1000);
      }



//------------------------------------------------------------------------------------------------------------------------------
//Query on influxDB : strega Valve
//------------------------------------------------------------------------------------------------------------------------------
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
     Vue.prototype.$stregaValveValues = []

     /**
      * Init a sensor array for stregaValve
      */
     Vue.prototype.$initStregaSensorArray = function (){

      for(let i = 0 ; i< this.$SENSORSLISTJSON.length; i++){
        if(this.$SENSORSLISTJSON[i].project.toLowerCase() === this.$PROJECT){
          if(this.$SENSORSLISTJSON[i].type === "Fontaine"){
            let strega = {
              "eui" : this.$SENSORSLISTJSON[i].dev_eui,
              "when" : null,
              "location" : this.$SENSORSLISTJSON[i].location,
              "coordinates" : this.$SENSORSLISTJSON[i].coordinates,
              "startTime" : this.$SENSORSLISTJSON[i].startTime,
              "stopTime" : this.$SENSORSLISTJSON[i].stopTime,
              "battery" : null,
              "valveState" : null,
              "temperature" :null,
              "counter": null,
              "flow_now" : null,
              "flow_total" : null,
              "flow_without_strega": null,
              "flow_serie": null,
              "installation_date" : this.$SENSORSLISTJSON[i].installation_date,
              "rssi":null,
              "rssiIcone":null,
              "snr":null,
              "snrIcone": null,
              "batteryIcone":null
            }
            this.$stregaValveValues.push(strega)
          }
        }
      }
      //console.log(this.$stregaValveValues)
     }


     /**
      * get last values without flow calculation
      * @param {*} eui 
      */
     Vue.prototype.$getStregaLastValues = function(eui){
      let queryBat = `SELECT last("value")
      FROM
          "device_frmpayload_data_Battery" 
      WHERE
          ("dev_eui" = '$dEUI')  
      `;

      let queryTemp = `SELECT last("value")
      FROM
          "device_frmpayload_data_Temperature" 
      WHERE
          ("dev_eui" = '$dEUI')  
      `;

      let queryCounter = `SELECT last("value")
      FROM
          "device_frmpayload_data_Counter" 
      WHERE
          ("dev_eui" = '$dEUI')  
      `;
      
      let queryCounter30d = `SELECT first("value")
      FROM
          "device_frmpayload_data_Counter" 
      WHERE
          ("dev_eui" = '$dEUI')
      AND
          time>now()-30d    
      `;

      let queryValve = `SELECT last("value")
      FROM
          "device_frmpayload_data_Valve" 
      WHERE
          ("dev_eui" = '$dEUI')  
      `;


      queryBat = queryBat.replace("$dEUI", eui.toLowerCase())
      queryTemp = queryTemp.replace("$dEUI", eui.toLowerCase())
      queryCounter = queryCounter.replace("$dEUI", eui.toLowerCase())
      queryValve = queryValve.replace("$dEUI", eui.toLowerCase())
      queryCounter30d = queryCounter30d.replace("$dEUI", eui.toLowerCase())

      
      let queryRSSI = `SELECT last(rssi)
      FROM
          "device_uplink" 
      WHERE
          ("dev_eui" = '$dEUI')  
      `;

      let querySNR = `SELECT last(snr)
      FROM
          "device_uplink" 
      WHERE
          ("dev_eui" = '$dEUI')  
      `;
      queryRSSI = queryRSSI.replace("$dEUI", eui.toLowerCase())
      querySNR = querySNR.replace("$dEUI", eui.toLowerCase())


      Promise.all([
        influxClient.query(queryBat)
      ]).then(resBat => {
        Promise.all([
          influxClient.query(queryTemp)
        ]).then(resTemp => {
          Promise.all([
            influxClient.query(queryCounter)
          ]).then(resCounter => {
            Promise.all([
              influxClient.query(queryValve)
            ]).then(resValve => {
              Promise.all([
                influxClient.query(queryRSSI)
              ]).then(resRSSI => {
                Promise.all([
                  influxClient.query(querySNR)
                ]).then(resSNR => {
                  Promise.all([
                    influxClient.query(queryCounter30d)
                  ]).then(resCounter30d => {
                    for(let i = 0; i<this.$stregaValveValues.length; i++){
                      if(this.$stregaValveValues[i].eui === eui){
                        if(resBat[0][0] != undefined){
                          this.$stregaValveValues[i].when = resBat[0][0].time
                          this.$stregaValveValues[i].battery = resBat[0][0].last.toFixed(0)
                          this.$stregaValveValues[i].batteryIcone = getBatteryIcone(resBat[0][0].last)
                        }
                        if(resTemp[0][0] != undefined){
                          this.$stregaValveValues[i].temperature = resTemp[0][0].last.toFixed(1)
                        }
                        if(resCounter[0][0] != undefined){
                          this.$stregaValveValues[i].counter =  resCounter[0][0].last -resCounter30d[0][0].first
                        }
                        if(resValve[0][0] != undefined){
                        this.$stregaValveValues[i].valveState = resValve[0][0].last
                        }
                        if(resRSSI[0][0] != undefined){
                          this.$stregaValveValues[i].rssi = resRSSI[0][0].last
                          this.$stregaValveValues[i].rssiIcone = getRssiIcone(resRSSI[0][0].last)
                        }
                        if(resSNR[0][0] != undefined){
                          this.$stregaValveValues[i].snr = resSNR[0][0].last
                          this.$stregaValveValues[i].snrIcone = getSnrIcone(resSNR[0][0].last)
                        }
                        //calcule flow
                        this.$calculateFlow(eui)
                        //console.log(resCounter[0][0].last)
                        //console.log(resCounter30d[0][0].first)
                        

                      }
                    }
                }).catch(error => console.log(error))
              }).catch(error => console.log(error))
            }).catch(error => console.log(error))
            }).catch(error => console.log(error))
          }).catch(error => console.log(error))
        }).catch(error => console.log(error))
      }).catch(error => console.log(error))
     }

    /**
     * Calcule the flow with counter : 1 pulse = 1 liter
     * @param {} eui 
     * select (value) from device_frmpayload_data_Counter where "dev_eui"='0004a30b00f73bd2' and time>=now()-365d and time<=now()
     * faire : arr[arr.lentgh-1] - arr[0]
     */
    Vue.prototype.$calculateFlow = function(eui){
      let queryCounter30min = `SELECT ("value")
      FROM
          "device_frmpayload_data_Counter" 
      WHERE
          ("dev_eui" = '$dEUI')  
      AND 
          time>now()-60m 
      order by 
          time desc    
      `;

      queryCounter30min = queryCounter30min.replace("$dEUI", eui.toLowerCase())
      
      Promise.all([
        influxClient.query(queryCounter30min)
      ]).then(resCounter30min => {
     
          for(let i = 0; i<this.$stregaValveValues.length; i++){
            if(this.$stregaValveValues[i].eui === eui){
              if (resCounter30min[0][0] != undefined && resCounter30min[0][4] != undefined){
                //let counterDifference = this.$stregaValveValues[i].counter - resCounter30min[0][0].value
                //console.log(resCounter30min)
                //console.log(this.$stregaValveValues[i].time)
                //console.log(resCounter30min[0][0].time)
                //TODO : Calculate in function of time beetween 2 values
                let timeVal1 = resCounter30min[0][0].time
                let val1 = resCounter30min[0][0].value
                let timeVal2 = resCounter30min[0][4].time
                let val2 =resCounter30min[0][4].value

                let res = ((60*60*1000)/(timeVal2-timeVal1))*(val2-val1)
               // console.log(new Date(timeVal1).getTime())
               // console.log(val1)
               // console.log(new Date(timeVal2).getTime())
               // console.log(val2)
               // console.log(res)


                this.$stregaValveValues[i].flow_now = res.toFixed(0) //selon calcul, facteur de 0.8 avec la réalité
              }
              this.$stregaValveValues[i].flow_total = this.$stregaValveValues[i].counter 

              //calculate conso without system
              let stop = this.$stregaValveValues[i].stopTime.split(":")[0] + this.$stregaValveValues[i].stopTime.split(":")[1]  
              let start = this.$stregaValveValues[i].startTime.split(":")[0] + this.$stregaValveValues[i].startTime.split(":")[1]

              let timeOn = parseInt(stop) - parseInt(start)
              this.$stregaValveValues[i].flow_without_strega = (this.$stregaValveValues[i].flow_total * 2400 / timeOn).toFixed(0)- this.$stregaValveValues[i].flow_total
          
            }
        }
      }).catch(error => console.log(error))
    }

   
     

   
   

//------------------------------------------------------------------------------------------------------------------------------
//Query on influxDB : dragino waterheight sensor
//------------------------------------------------------------------------------------------------------------------------------

/**
     *Sensors Array
     * @type {*[]}
     */
     Vue.prototype.$draginoValues = []

     /**
      * Init a sensor array for stregaValve
      */
     Vue.prototype.$initDraginoSensorArray = function (){

      for(let i = 0 ; i< this.$SENSORSLISTJSON.length; i++){
        if(this.$SENSORSLISTJSON[i].project.toLowerCase() === this.$PROJECT){
          if(this.$SENSORSLISTJSON[i].type === "Hauteur d'eau"){
            let drag = {
              "eui" : this.$SENSORSLISTJSON[i].dev_eui,
              "when":null,
              "project": this.$SENSORSLISTJSON[i].project,
              "location" : this.$SENSORSLISTJSON[i].location,
              "coordinates" : this.$SENSORSLISTJSON[i].coordinates,
              "offset" : this.$SENSORSLISTJSON[i].offset,
              "battery" : null,
              "softmin":this.$SENSORSLISTJSON[i].softmin,
              "softmax":this.$SENSORSLISTJSON[i].softmax,
              "waterHeight6h":null,
              "waterHeight3h":null,
              "waterHeightNow":null,
              "waterHeightMin":null,
              "waterHeightMax":null,
              "waterHeightSerie":null,
              "rssi":null,
              "rssiIcone":null,
              "snr":null,
              "snrIcone": null,
              "batteryIcone":null
            }
            this.$draginoValues.push(drag)
          }
        }
      }

     }

      /**
      * get last values
      * @param {*} eui 
      */
      Vue.prototype.$getDraginoLastValues = function(eui){
        let queryBat = `SELECT last("value")
                        FROM
                            "device_frmpayload_data_Bat" 
                        WHERE
                            ("dev_eui" = '$dEUI')  
                        `;

        let query6h = `SELECT first(moving_average)
                      FROM
                      (SELECT
                          moving_average(value, 5)
                      FROM
                          "device_frmpayload_data_Dist" 
                      WHERE
                          ("dev_eui" = '$dEUI') 
                      AND
                          time>now()-6h order by time asc limit 1    
                          )      
                      `;

          let query3h = `SELECT first(moving_average)
                      FROM
                      (SELECT
                          moving_average(value, 5)
                      FROM
                          "device_frmpayload_data_Dist" 
                      WHERE
                          ("dev_eui" = '$dEUI') 
                      AND
                          time>now()-3h order by time asc limit 1    
                          )      
                      `;

        let queryNow = `SELECT last(moving_average)
                        FROM
                        (SELECT
                            moving_average(value, 5)
                        FROM
                            "device_frmpayload_data_Dist" 
                        WHERE
                            ("dev_eui" = '$dEUI') )      
                        `;
              

        let querySerie = `SELECT moving_average("value",5)
                      FROM
                          "device_frmpayload_data_Dist" 
                      WHERE
                          ("dev_eui" = '$dEUI')  
                      AND
                          time>now()-8d
                      `;
                      
        let queryMin = `SELECT min("value")
                      FROM
                          "device_frmpayload_data_Dist" 
                      WHERE
                          ("dev_eui" = '$dEUI')  
                      AND
                          time>now()-60d
                      `;

        let queryMax = `SELECT max("value")
                        FROM
                            "device_frmpayload_data_Dist" 
                        WHERE
                            ("dev_eui" = '$dEUI')
                        AND
                          time>now()-60d  
                        `;

        let queryRSSI = `SELECT last("rssi")
                      FROM
                          "device_uplink" 
                      WHERE
                          ("dev_eui" = '$dEUI')  
                      `;

        let querySNR = `SELECT last("snr")
                      FROM
                          "device_uplink" 
                      WHERE
                          ("dev_eui" = '$dEUI')  
                      `;
         
        queryBat = queryBat.replace("$dEUI", eui.toLowerCase())
        query6h = query6h.replace("$dEUI", eui.toLowerCase())             
        query3h = query3h.replace("$dEUI", eui.toLowerCase())
        querySerie = querySerie.replace("$dEUI", eui.toLowerCase())
        queryNow = queryNow.replace("$dEUI", eui.toLowerCase())   
        queryMin = queryMin.replace("$dEUI", eui.toLowerCase()) 
        queryMax = queryMax.replace("$dEUI", eui.toLowerCase())
        queryRSSI = queryRSSI.replace("$dEUI", eui.toLowerCase())
        querySNR = querySNR.replace("$dEUI", eui.toLowerCase())

        Promise.all([
          influxClient.query(queryBat)
        ]).then(resBat => {
          Promise.all([
            influxClient.query(query6h)
          ]).then(res6h => {
            Promise.all([
              influxClient.query(query3h)
            ]).then(res3h => {
              Promise.all([
                influxClient.query(queryNow)
              ]).then(resNow => {
                Promise.all([
                  influxClient.query(querySerie)
                ]).then(resSerie => {
                  Promise.all([
                    influxClient.query(queryMin)
                  ]).then(resMin => {
                    Promise.all([
                      influxClient.query(queryMax)
                    ]).then(resMax => {
                      Promise.all([
                        influxClient.query(queryRSSI)
                      ]).then(resRssi => {
                        Promise.all([
                          influxClient.query(querySNR)
                        ]).then(resSnr => {
                          for(let i = 0; i<this.$draginoValues.length; i++){
                            if(this.$draginoValues[i].eui === eui){
                              let offset = parseInt(this.$draginoValues[i].offset)

                              if(resBat[0][0] != undefined){
                              this.$draginoValues[i].when = resBat[0][0].time
                              this.$draginoValues[i].batteryIcone = getBatteryIcone(calcPercentBat(resBat[0][0].last))
                              this.$draginoValues[i].battery = calcPercentBat(resBat[0][0].last)
                              }
                              if(res6h[0][0] != undefined){
                                this.$draginoValues[i].waterHeight6h = ((res6h[0][0].first*(-1)+offset)/10).toFixed(1)
                              }
                              if(res3h[0][0] != undefined){
                                this.$draginoValues[i].waterHeight3h = ((res3h[0][0].first*(-1)+offset)/10).toFixed(1)
                              }
                              if(resNow[0][0] != undefined){
                                this.$draginoValues[i].waterHeightNow = ((resNow[0][0].last*(-1)+offset)/10).toFixed(1)
                              }
                              if(resMin[0][0] != undefined){
                                this.$draginoValues[i].waterHeightMax = (resMin[0][0].min*(-1)+offset)/10
                              }
                              if(resMax[0][0] != undefined){
                                this.$draginoValues[i].waterHeightMin = (resMax[0][0].max*(-1)+offset)/10                                  
                              }
                              if(resRssi[0][0] != undefined){
                                this.$draginoValues[i].rssi = resRssi[0][0].last
                                this.$draginoValues[i].rssiIcone = getRssiIcone(resRssi[0][0].last)
                              }
                              if(resSnr[0][0] != undefined){
                                this.$draginoValues[i].snr = resSnr[0][0].last    
                                this.$draginoValues[i].snrIcone = getSnrIcone(resSnr[0][0].last)                                
                              }
                              if(resSerie[0]!= undefined){
                                //treatment for serie for chart                              
                                this.$draginoValues[i].waterHeightSerie = Object.assign({}, {
                                  name: "Distance", // name on the chart
                                  color: '#4285f4',
                                  lineWidth: 1,
                                  
                                  turboThreshold: 60000,
                                  data: resSerie[0].map(obj => Object.assign({}, {
                                    x: (moment(obj.time).unix()) * 1000,
                                    y: (obj['moving_average'] == null ? obj['moving_average'] : ((obj['moving_average']*(-1)+offset)))/10
                                    //y: checkDraginoValue(obj['moving_average'], offset)
                                  })),
                                });
                              }


                            }
                          }
                        }).catch(error => console.log(error))
                      }).catch(error => console.log(error))
                    }).catch(error => console.log(error))
                  }).catch(error => console.log(error))
                }).catch(error => console.log(error))
              }).catch(error => console.log(error))
            }).catch(error => console.log(error))
          }).catch(error => console.log(error))
        }).catch(error => console.log(error))

       // console.log(this.$draginoValues)
      }

      let oldVal=0
      function checkDraginoValue(val, offset){
          console.log(val)
         
          
        

      }


//------------------------------------------------------------------------------------------------------------------------------
//Divers
//------------------------------------------------------------------------------------------------------------------------------
      /**
       * retun an icone for the rssi value
       * @param {*} val 
       * @returns 
       */
      function getRssiIcone(val){
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

      /**
       * return an incone for the snr value
       * @param {*} val 
       * @returns 
       */
      function getSnrIcone(val){
        if (val > -7.5) {
          return 'static/img/technical/Network_full.png'
        } else if (val > -12.5 && val <= -7.5) {
          return 'static/img/technical/Network_good.png'
        } else if (val > -17.5 && val <= -12.5) {
          return 'static/img/technical/Network_bad.png'
        } else if (val < -17.5) {
          return 'static/img/technical/Network_nothing.png'
        }
      }

      
      /**
       * Return an icone for the battery value
       * @param {*} val 
       * @returns 
       */
      function getBatteryIcone(val){ 
        if (val > 80) {
          return 'static/img/technical/battery/Battery_full.png';
        } else if (val > 60 && val <= 80) {
          return 'static/img/technical/battery/Battery_good.png';
        } else if (val > 40 && val <= 60) {
          return 'static/img/technical/battery/Battery_medium.png';
        } else if (val > 20 && val <= 40) {
          return 'static/img/technical/Battery_middleBad.png';
        } else if (val <= 20) {
          return 'static/img/technical/battery/Battery_bad.png';
        }
      }

      /**
       * Calculate the battery value in percent
       * @param {*} val 
       * @returns 
       */
      function calcPercentBat(val){
        if (val >= 3) {
          return 95;
        }else if (val <3 && val >= 2.79) {
           return 80;
        } else if (val < 2.79 && val >= 2.54) {
          return 60;
        } else if (val < 2.54 && val >= 2.42) {
          return 40;
        } else if (val < 2.42 && val >= 2.34) {
          return 20;
        } else if (val < 2.18) {
          return 10;
        }
      }


    }
  }

