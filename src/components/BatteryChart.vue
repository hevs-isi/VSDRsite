<template>
  <highcharts class="stock" :constructor-type="'stockChart'" :options="stockOptions"></highcharts>
</template>

<script>
  const alertBattery = 2.34;
  export default {
    props: [
      'dataBatteryChart',
    ],
    data() {
      return {
        stockOptions: {
          title: {
            text: ""
          },
          time: {
            timezoneOffset: -120
          },
          chart: {
            style: {
              fontFamily: 'Roboto'
            },
          },
          yAxis: [{ // Primary yAxis
            title: {
              style: {
                color: '#7cb5ec'
              },
            },
            min: 2,
            labels: {
              format: '{value} V',
            },

            opposite: true,
            plotLines: [{
              value: alertBattery,
              color: 'red',
              dashStyle: 'shortdash',
              width: 1,
              label: {
                text: 'Niveau critique'
              }
            }]

          }],
          rangeSelector: {
            selected: 'all',
            buttons: [{
              type: 'hour',
              count: 24,
              text: '24 h'
            }, {
              type: 'day',
              count: 5,
              text: '5 j'
            }, {
              type: 'all',
              text: 'Toutes'
            }],
            inputEnabled: false, // date selector
          },
          series: this.dataBatteryChart,

          legend: {
            enabled: false,
            layout: 'vertical',
            align: 'left',
            x: 30,
            verticalAlign: 'top',
            y: 65,
            floating: true,

          },
          tooltip: {
            pointFormat: '{series.name}: <b>{point.y:.2f}V</b><br/>',
          },
          navigator: {
            enabled: false,
            handles:{
              enable:false
            }
          },

          scrollbar: {
            enabled: false
          },
        }
      }
    },


    watch: {
      dataBatteryChart(newValue) {
        this.stockOptions.series = newValue
      },
    }
  }
</script>

<style scoped>
  .stock {
    width: auto;
    height: 250px;
  }
</style>
