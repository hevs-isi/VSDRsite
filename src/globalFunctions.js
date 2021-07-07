import credInflux from './constants/influx'
import moment from "moment";
import db_req from "./constants/influx_requests.json"
import {latLng} from "leaflet/dist/leaflet-src.esm"
import L from "leaflet";
import NProgress from "nprogress";
import {toFront} from "leaflet/src/dom/DomUtil";
import fr from "element-ui/src/locale/lang/fr";


//VSDR imports
import chirpstackCredentials from './constants/chirpstack.json'      //credentials for chirpstack server
import axios from 'axios'


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
    /**
     * Global variables
     */
    Vue.prototype.$PROJECT = location.hostname.split('.')[0]
    Vue.prototype.$SENSORSLISTJSON=[];
    Vue.prototype.$GATEWAYLISTJSON=[];
    Vue.prototype.$SERVERURL = 'https://snow-server.watermon.ch:443/';
    

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


    

    }
  }