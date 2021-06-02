<template>
  <div>
    <div class="row">
      <!--temperature part-->
      <div class="col-xl-8 col-md-16">

        <card>
          <h4 class="card-title">Températures du sol - 24 dernières heures</h4>
          <TemperatureChartGlobal :dataTemperatureGlobalChart="series_chart"/>
        </card>

        <h4>Mesures actuelles</h4>
        <div class="row">
          <div class="col-lg-4" v-for="(sensor) in sortedSensors.filter( s=>s.type === 'decentlab')">

            <!--{{sensor.frostPointValue}}-->

            <div v-if="sensor.frostRiskValue[0] == 1">
              <card :title="sensor.realName"><!--NO FROST-->
                <div class="row vertical-center">
                  <div class="col-lg-6"
                       style="text-align: center; border-right-style: solid ; border-right-color: #dcdcdc">
                    <h3>{{sensor.temp_target[0]}}°C</h3>
                    <div class="lightText">Sol</div>
                  </div>
                  <div class="col-lg-6" style="text-align: center">
                    <h3>{{sensor.temp_head[0]}}°C</h3>
                    <div class="lightText">Air</div>
                  </div>
                </div>
                <br>
                <div class="row vertical-center" v-if="sensor.humidity[0] != undefined">
                  <div class="col-lg-6" style="text-align: center; border-right-style: solid ; border-right-color: #dcdcdc">
                    <h3 v-if="sensor.temp_head <= 0">{{sensor.frostPointValue[0]}}°C</h3>
                    <h3 v-else>-</h3>
                    <div class="lightText">Point de givrage</div>
                  </div>
                  <div class="col-lg-6" style="text-align: center">
                    <h3>{{sensor.humidity[0].toFixed(1)}}%</h3>
                    <div class="lightText">Humidité</div>
                  </div>
                </div>
                <div class="col-lg-12" style="text-align: center">
                  <h4>Risque de givre élevé </h4>
                  <img src="../../../../public/static/img/warningFrost.png" align="center" width="35%">
                </div>
              </card>
            </div>

            <div v-if="sensor.frostRiskValue[0] == 0">
              <card :title="sensor.realName"><!--NO FROST-->
                <div class="row vertical-center">
                  <div class="col-lg-6"
                       style="text-align: center; border-right-style: solid ; border-right-color: #dcdcdc">
                    <h3>{{sensor.temp_target[0]}}°C</h3>
                    <div class="lightText">Sol</div>
                  </div>
                  <div class="col-lg-6" style="text-align: center">
                    <h3>{{sensor.temp_head[0]}}°C</h3>
                    <div class="lightText">Air</div>
                  </div>

                </div>
                <br>
                <div class="row vertical-center" v-if="sensor.humidity[0] != undefined">
                  <div class="col-lg-6" style="text-align: center; border-right-style: solid ; border-right-color: #dcdcdc">
                    <h3 v-if="sensor.temp_head <= 0">{{sensor.frostPointValue[0]}}°C</h3>
                    <h3 v-else>-</h3>
                    <div class="lightText">Point de givrage</div>
                  </div>
                  <div class="col-lg-6" style="text-align: center">
                    <h3>{{sensor.humidity[0].toFixed(1)}}%</h3>
                    <div class="lightText">Humidité</div>
                  </div>
                </div>
                <div class="col-lg-12" style="text-align: center">
                  <h4>Risque de givre modéré</h4>
                  <img src="../../../../public/static/img/warningLightFrost.png" align="center" width="35%">
                </div>
              </card>
            </div>

            <div v-if="sensor.frostRiskValue[0] == -1">
              <card :title="sensor.realName"><!--NO FROST-->
                <div class="row vertical-center">
                  <div class="col-lg-6"
                       style="text-align: center; border-right-style: solid ; border-right-color: #dcdcdc">
                    <h3>{{sensor.temp_target[0]}}°C</h3>
                    <div class="lightText">Sol</div>
                  </div>
                  <div class="col-lg-6" style="text-align: center">
                    <h3>{{sensor.temp_head[0]}}°C</h3>
                    <div class="lightText">Air</div>
                  </div>
                </div>
                <br>
                <div class="row vertical-center" v-if="sensor.humidity[0] != undefined">
                  <div class="col-lg-6" style="text-align: center; border-right-style: solid ; border-right-color: #dcdcdc">
                    <h3 v-if="sensor.temp_head <= 0">{{sensor.frostPointValue[0]}}°C</h3>
                    <h3 v-else>-</h3>
                    <div class="lightText">Point de givrage</div>
                  </div>
                  <div class="col-lg-6" style="text-align: center">
                    <h3>{{sensor.humidity[0].toFixed(1)}}%</h3>
                    <div class="lightText">Humidité</div>
                  </div>
                </div>
              </card>
            </div>

          </div>
        </div>

  <!--      <card>
          <div>
            <h4 class="card-title">Précipitations</h4>
            <br>
            <table class="table table-striped">
              <thead class="thead-light">
              <tr>
                <th scope="col"></th>
                <th scope="col" v-if="window.width > 500">Depuis 4 h</th>
                <th scope="col" v-if="window.width <= 500">4 h</th>
                <th scope="col" v-if="window.width > 500">Depuis 1 h</th>
                <th scope="col" v-if="window.width <= 500">1 h</th>
                <th scope="col" v-if="window.width > 500">Depuis 30 m</th>
                <th scope="col" v-if="window.width <= 500">30 m</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(sensor,index) in sortedSensors.filter( s=>s.type === 'hei')">
                <th scope="row">{{sensor.realName}}</th>
                <td v-if="sensor.cumul_snow4h[0] != undefined && ((sensor.cumul_snow4h[0]-sensor.snowOffset[0])/10) >=0">{{ ((sensor.cumul_snow4h[0]-sensor.snowOffset[0])/10).toFixed(0)}} cm</td>
                <td v-else>0 cm</td>
                <td v-if="sensor.cumul_snow1h[0] != undefined && ((sensor.cumul_snow1h[0]-sensor.snowOffset[0])/10) >=0">{{ ((sensor.cumul_snow1h[0]-sensor.snowOffset[0])/10).toFixed(0)}} cm</td>
                <td v-else>0 cm</td>
                <td v-if="sensor.cumul_snow30m[0] != undefined && ((sensor.cumul_snow30m[0]-sensor.snowOffset[0])/10) >=0">{{ ((sensor.cumul_snow30m[0]-sensor.snowOffset[0])/10).toFixed(0)}} cm</td>
                <td v-else>0 cm</td>
              </tr>
              </tbody>
            </table>
          </div>
        </card>

        <card>
          <div>
            <h4 class="card-title">Hauteurs de neige</h4>
            <br>
            <table class="table table-striped">
              <thead class="thead-light">
              <tr>
                <th scope="col"></th>
                <th scope="col" v-if="window.width > 500">Il y a 4 h</th>
                <th scope="col" v-if="window.width <= 500">4h</th>
                <th scope="col" v-if="window.width > 500">Il y a 1 h</th>
                <th scope="col" v-if="window.width <= 500">1h</th>
                <th scope="col" v-if="window.width > 500">Il y a 30 m</th>
                <th scope="col" v-if="window.width <= 500">30 m</th>
                <th scope="col" v-if="window.width > 500">Actuellement</th>
                <th scope="col" v-if="window.width <= 500">Maint.</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(sensor) in sortedSensors.filter( s=>s.type === 'hei')">

                <th scope="row">{{sensor.realName}}</th>
                <td v-if="sensor.snow_4h[0] != undefined && (sensor.snow_4h[0]-sensor.snowOffset[0])/10 >= 0">{{ ((sensor.snow_4h[0]-sensor.snowOffset[0])/10).toFixed(0)}} cm</td>
                <td v-else>0 cm</td>
                <td v-if="sensor.snow_1h[0] != undefined && (sensor.snow_1h[0]-sensor.snowOffset[0])/10 >= 0">{{ ((sensor.snow_1h[0]-sensor.snowOffset[0])/10).toFixed(0)}} cm</td>
                <td v-else>0 cm</td>
                <td v-if="sensor.snow_30m[0] != undefined && (sensor.snow_30m[0]-sensor.snowOffset[0])/10 >= 0">{{ ((sensor.snow_30m[0]-sensor.snowOffset[0])/10).toFixed(0)}} cm</td>
                <td v-else>0 cm</td>
                <td v-if="sensor.snow[0] != undefined && (sensor.snow[0]-sensor.snowOffset[0])/10 >= 0">{{ ((sensor.snow[0]-sensor.snowOffset[0])/10).toFixed(0)}} cm</td>
                <td v-else>0 cm</td>
              </tr>
              </tbody>
            </table>
          </div>
        </card>-->

        <WebcamCard :src="cam.url" :location="cam.location"></WebcamCard>
      </div>

      <div class="col-xl-4 col-md-7">
        <!--Map part-->
        <MapSensor v-if="this.$PROJECT=='ayent'" :sensors="this.sensors" :center="centerMapAyent"></MapSensor>
        <MapSensor v-if="this.$PROJECT=='st-leo'" :sensors="this.sensors" :center="centerMapStleo"></MapSensor>

        <!--Meteo widget-->
        <meteo v-if="this.$PROJECT=='ayent'" :src="meteoSrcAyent"></meteo>
        <meteo v-if="this.$PROJECT=='st-leo'" :src="meteoSrcStleo"></meteo>
      </div>
    </div>
  </div>
</template>


<script>
  import {Table, TableColumn} from 'element-ui'
  //divers
  import TemperatureChartGlobal from "../../../components/TemperatureChartGlobal";
  import MapSensor from "@/components/MapSensor";
  import Meteo from "@/components/Meteo";
  import axios from "axios"
  import WebcamCard from "@/components/WebcamCard";
  //QUERY
  const field_groundTemperature = 'payload_fields_temperature_target_value'
  export default {
    components: {
      WebcamCard,
      Meteo,
      MapSensor,
      [Table.name]: Table,
      [TableColumn.name]: TableColumn,
      TemperatureChartGlobal,

    },
    data() {
      return {
        centerMapAyent : [46.283, 7.40],
        centerMapStleo : [46.249, 7.426],
        meteoSrcAyent : 'https://meteo.search.ch/widget/Anzère.fr.html',
        meteoSrcStleo : 'https://meteo.search.ch/widget/St-léonard',

        sensors: [],                                                           //contain all sensors
        sensorListJson : [],

        series_chart: [{                                                        //serie of the 3 sensors, used just in this page
          data: [],
        }],
        window: {                                                             //Windows size, used for meteo widget
          width: 0,
          height: 0,
        },
        cam : {
          url :"",
          location:""
        }
      }
    },
    computed :{
      sortedSensors : function(){
        return this.sensors.sort((a,b) => (a.realName > b.realName) ? 1 : ((b.realName > a.realName) ? -1 : 0)) //sorted by alphabetic order


      }
    },

    created() {
      //this.$PROJECT = location.hostname.split('.')[0]
      //listener for window size
      window.addEventListener('resize', this.handleResize, {passive: true});
      this.handleResize();
    },


    mounted() {
      let s = []
      let color = []

      axios.get(this.$SERVERURL +'sensorList') //http://localhost:4500/sensorList
        .then(res => {
          this.sensorListJson.push(res.data);
          for (var i = 0; i < this.sensorListJson[0].length; i++) {
            if (this.sensorListJson[0][i].project === this.$PROJECT) {

              this.$globalLoadData(this.sensorListJson[0][i].type, this.sensorListJson[0][i].location)
               this.sensors = this.$globalSensors.sort((a,b) => (a.location > b.location) ? 1 : ((b.location > a.location) ? -1 : 0))

              if (this.sensorListJson[0][i].type === 'decentlab') {
                color.push(this.sensorListJson[0][i].color)
                var colorIndex = 0;
                //console.log(color)
                this.$loadSerie('decentlab', this.sensorListJson[0][i].location, field_groundTemperature, this.sensorListJson[0][i].realName, "30m", "24h").then(
                  result => {
                    result[0].color = color[colorIndex];
                    colorIndex++
                    s.push(result[0]);
                  }
                )
              } else if (this.sensorListJson[0][i].type === 'gateway') {
                //console.log(this.sensorListJson[0][i])
                this.$GATEWAYLISTJSON.push(this.sensorListJson[0][i])
              }else if(this.sensorListJson[0][i].type ==='cam'){
                //console.log(this.sensorListJson[0][i].url)
                this.cam.url = this.sensorListJson[0][i].url
                this.cam.location=this.sensorListJson[0][i].realName

              }
            }
          }
          this.$SENSORSLISTJSON.push(this.sensorListJson[0])
          this.series_chart = s
        }).catch(error => {
          console.log(error)
          // Manage errors if found any
        })

      axios.get(this.$SERVERURL+'collaboratorList') //http://localhost:4500/sensorList
        .then(res => {
         // console.log(res.data)
        })
        .catch(error => {
          console.log(error)
          // Manage errors if found any
        })
    },

    destroyed() {
      window.removeEventListener('resize', this.handleResize);
    },

    methods: {
      //----------------------------------WINDOW PART --------------------------------------------------------------------
      /**
       * function to get the window size
       */
      handleResize: function () {
        this.window.width = window.innerWidth;
        this.window.height = window.innerHeight;
      },

    },
  }
</script>

<style>
  .lightText {
    color: darkgrey;
  }
</style>
