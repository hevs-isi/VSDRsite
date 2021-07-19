import moment from "moment";
import {latLng} from "leaflet/dist/leaflet-src.esm"
import L from "leaflet";
import NProgress from "nprogress";
import {toFront} from "leaflet/src/dom/DomUtil";
import fr from "element-ui/src/locale/lang/fr";


//VSDR imports
import chirpstackCredentials from './constants/chirpstack.json'      //credentials for chirpstack server
import credInflux from './constants/influx'
import db_req from "./constants/influx_requests.json"

import axios from 'axios'


const Influx = require('influx')



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
              "flow_serie": null
            }
            this.$stregaValveValues.push(strega)
          }
        }
      }
     }

     /**
      * TODO: initDraginoSensorArray
      */


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
                for(let i = 0; i<this.$stregaValveValues.length; i++){
                  if(this.$stregaValveValues[i].eui === eui){
                    this.$stregaValveValues[i].battery = resBat[0][0].last.toFixed(1)
                    this.$stregaValveValues[i].temperature = resTemp[0][0].last.toFixed(1)
                    this.$stregaValveValues[i].counter = resCounter[0][0].last
                    this.$stregaValveValues[i].valveState = resValve[0][0].last
                    
                    //calcule flow
                    this.$calculateFlow(eui)
                  }
                }
              
            }).catch(error => console.log(error))
          }).catch(error => console.log(error))
        }).catch(error => console.log(error))
      }).catch(error => console.log(error))
      
     }

    /**
     * Calcule the flow with counter : 1 pulse = 1 liter
     * @param {} eui 
     */
    Vue.prototype.$calculateFlow = function(eui){
      let queryCounter30min = `SELECT ("value")
      FROM
          "device_frmpayload_data_Counter" 
      WHERE
          ("dev_eui" = '$dEUI')  
      AND 
          time>now()-30m 
      order by 
          time asc limit 1    
      `;

      queryCounter30min = queryCounter30min.replace("$dEUI", eui.toLowerCase())
      
      Promise.all([
        influxClient.query(queryCounter30min)
      ]).then(resCounter30min => {
       // if (resCounter30min[0][0] != undefined){
          for(let i = 0; i<this.$stregaValveValues.length; i++){
            if(this.$stregaValveValues[i].eui === eui){
              if (resCounter30min[0][0] != undefined){
              let counterDifference = this.$stregaValveValues[i].counter - resCounter30min[0][0].value
              this.$stregaValveValues[i].flow_now = counterDifference
              }
              this.$stregaValveValues[i].flow_total = this.$stregaValveValues[i].counter 

              //calculate conso without system
              let timeOn = parseInt(this.$stregaValveValues[i].stopTime) - parseInt(this.$stregaValveValues[i].startTime)
              this.$stregaValveValues[i].flow_without_strega = (this.$stregaValveValues[i].flow_total * 2400 / timeOn).toFixed(1)
              

            //}
          }
        }
        
      }).catch(error => console.log(error))



    }

// SELECT ("value") FROM "device_frmpayload_data_Battery" WHERE ("dev_eui" = '0004a30b00f7da1c') AND time>now()-30m order by time asc limit 1

    }
  }

