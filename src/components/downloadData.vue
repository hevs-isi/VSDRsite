<template>
  <div>
    <card>
      <div class="col-lg-12">
        <el-collapse class="collapse-info">
          <el-collapse-item style="background-color: white" title="Exporter les valeurs disponibles" name="1">
            <card>
              <div>
                <h3>Valeurs à télécharger</h3>
                <div class="row">
                  <div class="col-lg-2">
                    <h4>Emplacement</h4>
                    <el-select class="select-default" size="large" placeholder="Single Select"
                               v-model="selects_location.simple">
                      <el-option v-for="option in selects_location.download_location_unit" class="select-default"
                                 :value="option.value" :label="option.label" :key="option.label">
                      </el-option>
                    </el-select>
                  </div>

                  <div class="col-lg-2">
                    <h4>Depuis</h4>
                    <fg-input placeholder="Valeur de temps" v-model="download_time_value"></fg-input>
                    <el-select class="select-default" size="large" placeholder="Single Select"
                               v-model="selects_time.simple">
                      <el-option v-for="option in selects_time.download_time_unit" class="select-default"
                                 :value="option.value" :label="option.label" :key="option.label">
                      </el-option>
                    </el-select>
                  </div>
                </div>

                <br>

                <div class="row">
                  <div class="col-lg-2">
                    <h4>Capteurs</h4>
                  </div>
                  <div class="col-lg-2" style="margin-top: 35px">
                    <l-checkbox v-model="sensor_dl">Capteur de température</l-checkbox>
                  </div>
                  <div class="col-lg-2" style="margin-top: 35px">
                    <l-checkbox v-model="sensor_hei">Capteur de hauteur de neige</l-checkbox>
                  </div>
                </div>

                <el-collapse class="collapse-info" v-if="this.sensor_dl==true">
                  <el-collapse-item style="background-color: white" title="Capteur de température du sol et de l'air"
                                    name="1">
                    <br><br>
                    <div class="row" align="center">
                      <div class="col-lg-2">
                        <p>Température de l'air</p>
                        <l-checkbox v-model="download_head_temp_dl"></l-checkbox>
                      </div>
                      <div class="col-lg-2">
                        <p>Température du sol</p>
                        <l-checkbox v-model="download_target_temp_dl"></l-checkbox>
                      </div>
                      <div class="col-lg-2">
                        <p>Niveau de batterie</p>
                        <l-checkbox v-model="download_battery_dl"></l-checkbox>
                      </div>
                      <div class="col-lg-2">
                        <p>RSSI </p>
                        <l-checkbox v-model="download_RSSI_dl"></l-checkbox>
                      </div>
                      <div class="col-lg-2">
                        <p>SNR</p>
                        <l-checkbox v-model="download_SNR_dl"></l-checkbox>
                      </div>
                    </div>
                    <br><br>
                  </el-collapse-item>
                </el-collapse>

                <el-collapse class="collapse-info" v-if="this.sensor_hei==true">
                  <el-collapse-item style="background-color: white" title="Capteur de hauteur de neige et d'humidité"
                                    name="1">
                    <br><br>
                    <div class="row" align="center">
                      <div class="col-lg-2">
                        <p>Hauteur de neige</p>
                        <l-checkbox v-model="download_snow_height_hei"></l-checkbox>
                      </div>
                      <div class="col-lg-2">
                        <p>Humidité</p>
                        <l-checkbox v-model="download_humidity_hei"></l-checkbox>
                      </div>
                      <div class="col-lg-2">
                        <p>Niveau de batterie</p>
                        <l-checkbox v-model="download_battery_hei"></l-checkbox>
                      </div>
                      <div class="col-lg-2">
                        <p>RSSI </p>
                        <l-checkbox v-model="download_RSSI_hei"></l-checkbox>
                      </div>
                      <div class="col-lg-2">
                        <p>SNR</p>
                        <l-checkbox v-model="download_SNR_hei"></l-checkbox>
                      </div>
                    </div>
                    <br><br>
                  </el-collapse-item>
                </el-collapse>

                <br><br>
                <div class="text-center">
                  <l-button type="info" outline="" align="center" @click="loadData()"><b>
                    1. Valider</b></l-button>
                  <p></p>

                  <l-button type="info" outline="" align="center" v-if="json_data[0]!=undefined">
                    <download-csv
                      :data="json_data">
                      <b>2. Télécharger</b>
                    </download-csv>
                  </l-button>

                </div>
              </div>
            </card>
          </el-collapse-item>
        </el-collapse>
      </div>
    </card>
  </div>
</template>

<script>
import LCheckbox from "@/components/Inputs/Checkbox";
import downloadCsv from "vue-json-csv";
import {Collapse, CollapseItem, Option, Select} from "element-ui";
import {FormGroupInput as FgInput} from "@/components/index";
import db_req from "@/constants/influx_requests.json";

export default {
  name: "downloadData",
  components: {LCheckbox},
  component: {
    downloadCsv,
    [Collapse.name]: Collapse,
    [CollapseItem.name]: CollapseItem,
    LCheckbox, FgInput,
    [Select.name]: Select,
    [Option.name]: Option
  },
  props : {
    location : Array
  },
  data() {
    return {


      sensorState: '',                 //state of the sensors
      sensors: [],                     //array contain all sensors basics data
      json_data: [],                   //json array for export and download part

      // Download all data decentlab
      sensor_dl: false,
      download_head_temp_dl: false,                  //checkbox values
      download_target_temp_dl: false,                //
      download_battery_dl: false,                    //
      download_RSSI_dl: false,                       //
      download_SNR_dl: false,                        //

      //Download all data hei
      sensor_hei: false,
      download_snow_height_hei: false,                  //checkbox values
      download_humidity_hei: false,                //
      download_battery_hei: false,                    //
      download_RSSI_hei: false,                       //
      download_SNR_hei: false,                        //

      download_time_value: '12',                  //input value
      selects_time: {                                  //input selector
        simple: 'h',
        download_time_unit: [
          {value: 'h', label: 'Heure(s)'},
          {value: 'd', label: 'Jour(s)'},
          {value: 'w', label: 'Semaine(s)'},
        ]
      },
      selects_location: {                         //input selector
        simple: "",
        download_location_unit: [
        ]
      },


    }
  },
  beforeMount() {
    this.selects_location.simple = this.location[0].location
    // set the select component with the values taken in the json file
    for(var i = 0 ; i< this.location.length;i++){
      this.selects_location.download_location_unit.push(
        {
          value : this.location[i].location, label: this.location[i].realName
        })
    }
  },


  methods: {
    loadData: function () {
      this.json_data = [];
      this.json_dataDL = [];
      this.json_dataHei = [];

      let queryDl = 'SELECT '
      let queryHei = 'SELECT '

      let fieldDl = [];
      let fieldHei = [];
      if (this.download_target_temp_dl != false) {
        fieldDl.push('payload_fields_temperature_target_value')
      }
      if (this.download_head_temp_dl != false) {
        fieldDl.push('payload_fields_temperature_head_value')
      }
      if (this.download_battery_dl != false) {
        fieldDl.push(db_req.field_battery)
      }
      if (this.download_RSSI_dl != false) {
        fieldDl.push(db_req.field_rssi)
      }
      if (this.download_SNR_dl != false) {
        fieldDl.push(db_req.field_snr)
      }
      /*
        for loop to create the query field with the checkbox values
      */
      for (let i = 0; i < fieldDl.length; i++) {
        if (i != fieldDl.length - 1) {
          queryDl += fieldDl[i] + ', '
        } else {
          queryDl += fieldDl[i]
        }
      }
      queryDl += ' FROM mqtt_consumer where \"topic\"=\'hes_ayent-snow/devices/decentlab' + '-' + this.selects_location.simple + '/up\'' +
        ' AND time>now()-' + this.download_time_value + this.selects_time.simple

      if (this.download_snow_height_hei != false) {
        fieldHei.push('payload_fields_WaterHeightMm')
      }
      if (this.download_humidity_hei != false) {
        fieldHei.push('payload_fields_HumiditySHT30')
      }
      if (this.download_battery_hei != false) {
        fieldHei.push("payload_fields_BatteryV")
      }
      if (this.download_RSSI_hei != false) {
        fieldHei.push(db_req.field_rssi)
      }
      if (this.download_SNR_hei != false) {
        fieldHei.push(db_req.field_snr)
      }
      /*
      for loop to create the query field with the checkbox values
    */
      for (let i = 0; i < fieldHei.length; i++) {
        if (i != fieldHei.length - 1) {
          queryHei += fieldHei[i] + ', '
        } else {
          queryHei += fieldHei[i]
        }
      }
      queryHei += ' FROM mqtt_consumer where \"topic\"=\'hes_ayent-snow/devices/hei' + '-' + this.selects_location.simple + '/up\'' +
        ' AND time>now()-' + this.download_time_value + this.selects_time.simple


      //       console.log("query dl")
      //       console.log(queryDl)
      //       console.log("query hei")
      //       console.log(queryHei)

      /**
       * promise part : 3 possibility
       * 1. one query for dl
       * 2. one query for hei
       * 3. query for both -> 2 different query
       */
      if (this.sensor_dl === true && this.sensor_hei != true) {
        Promise.all([
          this.$influxClient.query(queryDl)
        ]).then(parsedRes => {
          parsedRes.map(arr => {
            if (arr[0] != undefined) {
              for (let i = 0; i < arr.length; i++) {
                let value = arr[i]
                this.json_data.push(this.exportToJson(value))

              }
            }
          });
        }).catch(error => console.log(error))

      } else if (this.sensor_hei === true && this.sensor_dl != true) {
        Promise.all([
          this.$influxClient.query(queryHei)
        ]).then(parsedRes => {
          parsedRes.map(arr => {
            if (arr[0] != undefined) {
              for (let i = 0; i < arr.length; i++) {
                let value = arr[i]
                this.json_data.push(this.exportToJson(value))

              }
            }
          });
        }).catch(error => console.log(error))
      } else if (this.sensor_hei === true && this.sensor_dl === true) {
        let query1 = 'Select ' + fieldDl + ', ' + fieldHei + ' FROM mqtt_consumer where \"topic\"=\'hes_ayent-snow/devices/decentlab' + '-' + this.selects_location.simple + '/up\'' +
          ' or ' + '\"topic\"=\'hes_ayent-snow/devices/hei' + '-' + this.selects_location.simple + '/up\'' +
          ' AND time>now()-' + this.download_time_value + this.selects_time.simple

        Promise.all([
          this.$influxClient.query(query1)
        ]).then(parsedRes => {
          parsedRes.map(arr => {
            if (arr[0] != undefined) {
              for (let i = 0; i < arr.length; i++) {
                let value = arr[i]
                this.json_data.push(this.exportToJson(value))
              }
            }
          });

        }).catch(error => console.log(error))
      }
    },

    /**
     * to Json array
     * @param serieChart
     * @returns {any}
     */
    exportToJson: function (serieChart) {
      let toJsonised = JSON.stringify(serieChart)
      let jsonised = JSON.parse(toJsonised)
      return jsonised
    },
  }

}
</script>

<style scoped>

</style>
