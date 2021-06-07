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
    Vue.prototype.$SERVERURL = 'https://snow-server.watermon.ch:443/';

    /**
     * Function that save into JSON the new operating time of the fountains valve
     * @param {*} start 
     * @param {*} stop 
     */
    Vue.prototype.$SaveNewValveTime = function(start, stop){
      console.log(start)
      console.log(stop)
    } 

    }
  }