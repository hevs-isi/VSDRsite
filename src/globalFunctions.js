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
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
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
//Query on influxDB
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

     Vue.prototype.$initStregaSensorArray = function (){


      for(let i = 0 ; i< this.$SENSORSLISTJSON.length; i++){
        if(this.$SENSORSLISTJSON[i].project.toLowerCase() === this.$PROJECT){
          if(this.$SENSORSLISTJSON[i].type === "Fontaine"){
            let strega = {
              "eui" : this.$SENSORSLISTJSON[i].dev_eui,
              "location" : this.$SENSORSLISTJSON[i].location,
              "coordinates" : this.$SENSORSLISTJSON[i].coordinates,
              "valveState" : null,
              "temperature" :null,
              "flow_now" : null,
              "flow_year" : null,
              "flow_without_strega": null,
              "flow_serie": null
            }
            this.$stregaValveValues.push(strega)

          }
        }
      }


     }



    }
  }