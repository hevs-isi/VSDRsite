<template>
  <div>
    <h2>Status des antennes</h2>
    <!-- This has been optimized a bit   -->
    <b-card-group columns>
      <div v-for="(antenna, index) in this.antennas">
        <antenna-card :location=antenna.position_name :timeStamp=antenna.timestamp :eui=antenna.eui :status="antenna.isUp? 'up':'down'" :pending="pending ? true : false"></antenna-card>
      </div>
    </b-card-group>
    <h2>Status des capteurs</h2>
    <card>
      <vue-tabs value="Description">
        <!--<v-tab v-for="location in ['Télécabine', 'Pralan', 'Pro de Savioz']" :title=location :key=location>-->
          <v-tab v-for="location in this.$SENSORSLISTJSON[0].filter(s => (s.project === this.$PROJECT && s.type === 'decentlab'))" :title=location.realName :key=location.location>
          <div class="row">
            <div class="col-lg-6"
                 v-for="(sensor, index) in sensors.filter(s => (s.where === location.location.latinize().replace(/\s/g, '').toLowerCase()))">

              <h3 v-if="sensor.type==='decentlab'">Capteur de température du sol </h3>

              <h3 v-if="sensor.type==='hei'">Capteur de hauteur de neige et d'humidité</h3>

              <h5>Valeur lue le <b>{{new Date(sensor.when).toLocaleString('fr-CH')}} </b>

                <div v-if="(new Date() - new Date(sensor.when)<=1200000 )">Etat du capteur : en ligne
                  <img src="../../assets/sensorOk.png" align="center">
                </div>
                <div v-else>Etat du capteur : hors ligne
                  <img src="../../assets/sensorNotOk.png" align="center">
                </div>
              </h5>

              <card title="RSSI">
                <h2 align="center">{{sensor.rssi}}
                  <img v-if="sensor.rssi!='no data' " :src=sensor.iconRSSI align="center">
                </h2>
                <p align="center">[dBm]</p>
              </card>

              <card title="SNR">
                <h2 align="center">{{sensor.snr}}
                  <img v-if="sensor.snr !='no data' " :src="sensor.iconSNR" align="center">
                </h2>
                <p align="center">[dB]</p>
              </card>

              <card title="Batterie">
                <div v-if="sensor.batt_voltage != undefined ">
                  <h2 align="center">{{sensor.batt_voltage.toFixed(2)}}
                    <img v-if="sensor.batt_voltage !='no data' " :src="sensor.iconBattery" align="center" width="70"
                         height="40">
                  </h2>
                  <p align="center">[Volt]</p>
                </div>
                <div v-else>
                  <h2 align="center">No Data</h2>
                  <p align="center">[Volt]</p>
                </div>
              </card>
            </div>
          </div>
        </v-tab>
      </vue-tabs>
    </card>
    <downloadData :location="this.getLocations()"></downloadData>
  </div>
</template>

<script>
  import LCheckbox from "@/components/Inputs/Checkbox";
  import TemperatureChart from "@/components/TemperatureChart";
  import downloadCsv from "vue-json-csv";
  import {Collapse, CollapseItem, Option, Select} from "element-ui";
  import {FormGroupInput as FgInput} from "@/components";
  import db_req from "@/constants/influx_requests.json";
  import axios from "axios"
  import latinize from '../../js/latinize'
  import AntennaCard from "../../components/AntennaCard";
  import downloadData from "../../components/downloadData";

  export default {
    name: "Technical",
    components: {AntennaCard, LCheckbox, downloadData},
    component: {
      TemperatureChart, downloadCsv,
      [Collapse.name]: Collapse,
      [CollapseItem.name]: CollapseItem,
      LCheckbox, FgInput,
      [Select.name]: Select,
      [Option.name]: Option
    },

    mounted() {
      this.$PROJECT = location.hostname.split('.')[0]
      console.log(this.$SENSORSLISTJSON)
      for(var i = 0; i<this.$SENSORSLISTJSON[0].length; i++){
        if((this.$SENSORSLISTJSON[0][i].type === 'hei' || this.$SENSORSLISTJSON[0][i].type === 'decentlab') && this.$SENSORSLISTJSON[0][i].project == this.$PROJECT){
          this.$globalLoadData(this.$SENSORSLISTJSON[0][i].type, this.$SENSORSLISTJSON[0][i].location)
        }else if (this.$SENSORSLISTJSON[0][i].type === 'gateway' &&  this.$SENSORSLISTJSON[0][i].project == this.$PROJECT){
         var gateway = {
              type: 1,
              id: 1,
              position_name: this.$SENSORSLISTJSON[0][i].realName,
              position: [this.$SENSORSLISTJSON[0][i].lat, this.$SENSORSLISTJSON[0][i].lng],
              eui: this.$SENSORSLISTJSON[0][i].eui,
              lastSeen: "-",
              timeStamp: "",
              isUp: false,
            }
            this.antennas.push(gateway)
        }
      }
      console.log(this.antennas)

      //local copy of the sensors array
      this.sensors = this.$globalSensors

      /**
       * Update antenna states
       */
      var promises = []

      // We first create an array of promises from remote data containing antennas statuses
      for (let i = 0; i < this.antennas.length; i++) {
        promises.push(
          axios('https://nodered.watermon.ch/gateway?eui=' + this.antennas[i].eui, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'origin', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
              'Content-Type': 'application/json'
            }
          }))
      }

      // When all promises will be resolved, when then do update timestamps
      Promise.all(promises)
        .then((res) => {
          for (let i = 0; i < res.length; i++) {
            let timestamp = new Date(res[i].data.timestamp);

            this.antennas[i].timestamp = timestamp.toLocaleString('fr-CH', {dateStyle: 'short'}) + ' à ' + timestamp.toLocaleString('fr-CH', {timeStyle: 'short'})
            let now = new Date();

            if (this.$secondBetweenDate(now, timestamp) < 60) {
              this.antennas[i].isUp = true;
            } else {
              this.antennas[i].isUp = false;
            }
          }
        })
        .finally(x => {
          setTimeout(() => {
            this.pending = false;
          }, 500
        )
        })

      for(var i = 0; i < this.$SENSORSLISTJSON[0].length; i++){
        if(this.$SENSORSLISTJSON[0][i].type === 'decentlab' && this.$SENSORSLISTJSON[0][i].project === this.$PROJECT){
          var temp = {"location" : this.$SENSORSLISTJSON[0][i].location ,
            "realName" : this.$SENSORSLISTJSON[0][i].realName}
          this.locat.push(temp)
        }
      }
    },

    data() {
      return {
        locat : [],
        sensorState: '',                 //state of the sensors
        antennas: [],
        pending: true,
        sensors : []
      }
    },

    methods: {
      getLocations : function () {
        var locat = []
        for(var i = 0; i < this.$SENSORSLISTJSON[0].length; i++){
          if(this.$SENSORSLISTJSON[0][i].type === 'decentlab' && this.$SENSORSLISTJSON[0][i].project === this.$PROJECT){
            var temp = {"location" : this.$SENSORSLISTJSON[0][i].location ,
                        "realName" : this.$SENSORSLISTJSON[0][i].realName}
            locat.push(temp)
          }
        }
        //console.log(locat)
        return locat
      }

    }
  }
</script>
