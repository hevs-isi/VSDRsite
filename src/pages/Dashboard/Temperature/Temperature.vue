<template>
  <div>
    <h3>Température de l'air</h3>
    <div class="row"
         v-for="(sensor, index) in sensors.filter(s => s.where === locationName , s=>s.type === 'decentlab') ">

      <div class="col-lg-4">
        <card title="Il y a 1 heure">
          <h1 align="center" v-if="sensor.temp_head1h[0]!=undefined">{{sensor.temp_head1h[0]}}°C</h1>
          <h1 align="center" style="color: lightgray" v-if="sensor.temp_head1h[0]===undefined"> No data</h1>
        </card>
      </div>

      <div class="col-lg-4">
        <card title="Il y a 30 minutes">
          <h1 align="center" v-if="sensor.temp_head30m[0]!=undefined">{{sensor.temp_head30m[0]}}°C</h1>
          <h1 align="center" style="color: lightgray" v-if="sensor.temp_head30m[0]===undefined"> No data</h1>
        </card>
      </div>

      <div class="col-lg-4">
        <card title="Actuellement">
          <h1 align="center" v-if="sensor.temp_head[0]!=undefined">{{sensor.temp_head[0]}}°C</h1>
          <h1 align="center" style="color: lightgray" v-if="sensor.temp_head[0]===undefined"> No data</h1>
        </card>
      </div>
    </div>
    <h3>Température du sol</h3>
    <div class="row"
         v-for="(sensor, index) in sensors.filter(s => s.where === locationName , s=>s.type === 'decentlab')">
      <div class="col-lg-4">
        <card title="Il y a 1 heure">
          <h1 align="center" v-if="sensor.temp_target1h[0]!=undefined">{{sensor.temp_target1h[0]}}°C</h1>
          <h1 align="center" style="color: lightgray" v-if="sensor.temp_target1h[0]===undefined"> No data</h1>

        </card>
      </div>

      <div class="col-lg-4">
        <card title="Il y a 30 minutes">
          <h1 align="center" v-if="sensor.temp_target30m[0]!=undefined">{{sensor.temp_target30m[0]}}°C</h1>
          <h1 align="center" style="color: lightgray" v-if="sensor.temp_target30m[0]===undefined"> No data</h1>
        </card>
      </div>

      <div class="col-lg-4">
        <card title="Actuellement">
          <h1 align="center" v-if="sensor.temp_target[0]!=undefined">{{sensor.temp_target[0]}}°C</h1>
          <h1 align="center" style="color: lightgray" v-if="sensor.temp_target[0]===undefined"> No data</h1>

        </card>
      </div>
    </div>
    <div class="col-lg-13">
      <card title="Courbes des températures">
        <TemperatureChart style="padding-right: 10px" :dataTemperatureChart="series_chart" />
      </card>
    </div>
  </div>
</template>

<script>
  //DIVERS
  import moment from 'moment'
  //CHART
  import TemperatureChart from "../../../components/TemperatureChart";

  import downloadCsv from 'vue-json-csv'
  import {Collapse, CollapseItem} from 'element-ui'
  import LCheckbox from "../../../components/Inputs/Checkbox";
  import {Select, Option} from 'element-ui'
  import {FormGroupInput as FgInput} from 'src/components'
  import db_req from "../../../constants/influx_requests.json"

  import Highcharts from "highcharts";
  // don't delete this
  import ChartModuleMore from 'highcharts/highcharts-more';
  import HCSolidGauge from 'highcharts/modules/solid-gauge'
  import exportingInit from "highcharts/modules/exporting";
  exportingInit(Highcharts);
  ChartModuleMore(Highcharts);
  HCSolidGauge(Highcharts);

  const field_groundTemperature = 'payload_fields_temperature_target_value'
  const field_airTemperature = 'payload_fields_temperature_head_value'

  export default {
    name: "Temperature",
    components: {LCheckbox},
    component: {
      TemperatureChart, downloadCsv,
      [Collapse.name]: Collapse,
      [CollapseItem.name]: CollapseItem,
      LCheckbox, FgInput,
      [Select.name]: Select,
      [Option.name]: Option
    },
    data() {
      return {
        sensors: [],                                //array containing all sensors basics values
        locationName: this.$route.name,             //route of the page
        series_chart: [{                            //chart serie, use juste in this page
          data: [],
          turboThreshold: 60000,
        }],
      }
    },
    mounted() {
    },

    watch: {
      '$route.route': {                               //watch if the route has change (this is how i now that i've change page)
        handler: function () {                        //if the route change, reload data
          this.locationName = this.$route.name
          this.$globalLoadData('decentlab', this.locationName)
          this.sensors = this.$globalSensors
          let s = []
          // Let's load the serie asynchronously and resolve the promise when done
          this.$loadSerie('decentlab', this.locationName, field_groundTemperature, 'Température sol').then(
            result => s.push(result[0])
          )
          // Do the same for the second series, adapt the color as well
          this.$loadSerie('decentlab', this.locationName, field_airTemperature, 'Température air').then(
            result => {
              result[0].color = '#f4b400'; //orange
              s.push(result[0]);
            }
          )
          // Update the chart with the updated values
          this.series_chart = s
        },
        deep: true,
        immediate: true
      }
    },

    methods: {

    }
  }
</script>
<style scoped>
</style>
