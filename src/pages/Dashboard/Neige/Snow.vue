<template>
  <div>
   <h1>Snow page</h1>
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
