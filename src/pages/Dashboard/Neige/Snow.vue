<template>
  <div>
    <div class="row" v-for="(sensor, index) in sensors.filter(s => s.where === locationName , s=>s.type === 'hei')"><!--add : v-for="(sensor, index) in sensors.filter(s => s.where === locationName , s=>s.type === 'hei')" -->
      <div class="col-lg-3">
        <card title="Il y a 4 heures">
          <h1 align="center" v-if="sensor.snow_4h[0]!=undefined && ((sensor.snow_4h[0]-sensor.snowOffset[0])/10)>=0">{{ ((sensor.snow_4h[0]-sensor.snowOffset[0])/10).toFixed(0)}} cm</h1>
          <h1 align="center"  v-if="((sensor.snow_4h[0]-sensor.snowOffset[0])/10)<0"> 0 cm</h1>
          <h1 align="center" style="color: lightgray" v-if="sensor.snow_4h[0]===undefined"> No data</h1>

        </card>
      </div>

      <div class="col-lg-3">
        <card title="Il y a 1 heure">
          <h1 align="center" v-if="sensor.snow_1h[0]!=undefined && ((sensor.snow_1h[0]-sensor.snowOffset[0])/10)>=0">{{((sensor.snow_1h[0]-sensor.snowOffset[0])/10).toFixed(0)}} cm</h1>
          <h1 align="center"  v-if="((sensor.snow_1h[0]-sensor.snowOffset[0])/10)<0"> 0 cm</h1>
          <h1 align="center" style="color: lightgray" v-if="sensor.snow_1h[0]===undefined"> No data</h1>
        </card>
      </div>

      <div class="col-lg-3">
        <card title="Il y a 30 minutes" >
          <h1 align="center" v-if="sensor.snow_30m[0]!=undefined && ((sensor.snow_30m[0]-sensor.snowOffset[0])/10)>=0">{{((sensor.snow_30m[0]-sensor.snowOffset[0])/10).toFixed(0)}} cm</h1>
          <h1 align="center"  v-if="((sensor.snow_30m[0]-sensor.snowOffset[0])/10)<0"> 0 cm</h1>
          <h1 align="center" style="color: lightgray" v-if="sensor.snow_30m[0]===undefined"> No data</h1>
        </card>
      </div>

      <div class="col-lg-3">
        <card title="Actuellement" >
          <h1 align="center" v-if="sensor.snow[0]!=undefined  && ((sensor.snow[0]-sensor.snowOffset[0])/10)>=0">{{((sensor.snow[0]-sensor.snowOffset[0])/10).toFixed(0)}} cm</h1>
          <h1 align="center"  v-if="((sensor.snow[0]-sensor.snowOffset[0])/10)<0"> 0 cm</h1>
          <h1 align="center" style="color: lightgray" v-if="sensor.snow[0]===undefined"> No data</h1>
        </card>
      </div>

      <div class="col-lg-12">
        <card title="Cumul de neige sur les 365 derniers jours" >
          <h1 align="center">{{(cumul_snow/10).toFixed(0)}} cm
          </h1>
        </card>
      </div>
      <div class="col-lg-12">
        <card>
          <SnowChart style="padding-right: 10px" :dataSnowChart="series_chart"></SnowChart>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
  //CHART
  import NProgress from "nprogress";
  import Highcharts from "highcharts";
  import ChartModuleMore from 'highcharts/highcharts-more';
  import HCSolidGauge from 'highcharts/modules/solid-gauge'
  import exportingInit from "highcharts/modules/exporting";
  import axios from "axios";

  exportingInit(Highcharts);
  ChartModuleMore(Highcharts);
  HCSolidGauge(Highcharts);

  const field_snow = 'payload_fields_WaterHeightMm'
  let decimal = 2;
  export default {
      name: "Snow",
      component: {},

      data() {
        return {
          sensors: [],                          //contain the sensors values
          locationName: this.$route.name,       //route to know witch information to load
          series_chart: [],
          delta_snow:"",                        //delta between 1hour ago and now
          cumul_snow:"",                        //snow cumulate since 365 days
          snowOffset : 0
        }
      },
    created() {
 //     console.log(this.sensors)

    },

    watch: {
        '$route.route': {                       // watch if route has changed (this is how page changes are detected)
          handler: function () {
            // If route changed, reload data
            this.locationName = this.$route.name
            this.$globalLoadData('hei',this.locationName);
            this.sensors= this.$globalSensors

            var project  = location.hostname.split('.')[0]
            //get the offset from json file on server
            axios.get('https://snow-server.watermon.ch:443/snowOffset')
              .then(res => {
                for(var i = 0 ; i<res.data.length; i++){
                  if(res.data[i].project === project && res.data[i].location== this.locationName){
                    this.snowOffset = res.data[i].offset
                    this.$loadSerie('hei', this.locationName, field_snow, 'Hauteur de neige', '10m', '7d', this.snowOffset)
                      .then(
                        response => this.series_chart = response
                      )
                    this.loadCumulateSnowData('hei',this.locationName, field_snow, this.snowOffset)
                  }
                }
              })
              .catch(error => {
                console.log(error)
                // Manage errors if found any
              })
          },
          deep: true,
          immediate: true
        },

      },

      methods:{
        /**
         * load cumulate snow data since 365days
         * @returns {*}
         */
        loadCumulateSnowData: function(sensorType, location ,field_snow, offset) {
          /*create the query*/
          let query = 'SELECT ' + field_snow + ' FROM mqtt_consumer where '+
            '"'+ 'topic' +'"'+' =' +"'"+ 'hes_ayent-snow/devices/' +
            sensorType + '-' + location  +'/up' +"'"+ 'AND time>now()-365d'

          let cumulSnowQuery=0;
          Promise.all([
            this.$influxClient.query(query), // WHERE time>now()-365d
          ]).then(parsedRes => {
            parsedRes.map( arr => {
              cumulSnowQuery = arr[0][field_snow]-offset;
              /*
              this loop show if the value at position i+i is bigger than the previous, if yes, add the difference
              to cumulsnow
               */
              for(var i = 1; i<arr.length-1;i++){
                if(arr[i][field_snow]<= arr[i-1][field_snow]){
                  continue;
                }else{
                  cumulSnowQuery = cumulSnowQuery + (arr[i][field_snow] - arr[i-1][field_snow]);
                }
              }
            });
            this.cumul_snow=cumulSnowQuery
            NProgress.done();
          }).catch(error => console.log(error))
        },
      }
    }

</script>

<style scoped>

</style>
