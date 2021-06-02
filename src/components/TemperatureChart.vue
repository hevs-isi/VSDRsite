<template>
  <highcharts class="stock" :constructor-type="'stockChart'" :options="stockOptions" id="temperaturechart"></highcharts>
</template>

<script>
  const alertTemperature = 3;
  export default {
    props: [
      'dataTemperatureChart',
    ],

    data() {
      this.$setRefTempChart()
      return {
        stockOptions: {
          title: {
            text: ""
          },
          time: {
            timezoneOffset: -60,
          },

          chart: {
            style: {
              fontFamily: 'Roboto'
            },
          },

          scrollbar: {
            barBackgroundColor: '#cccccc',
            barBorderRadius: 7,
            barBorderWidth: 0,
            buttonBackgroundColor: '#cccccc',
            buttonBorderWidth: 0,
            buttonBorderRadius: 7,
            trackBackgroundColor: 'none',
            trackBorderWidth: 1,
            trackBorderRadius: 8,
            trackBorderColor: '#CCC'
          },

          // xAxis: {
          //   plotBands: plotBands
          // },

          yAxis: [{ // Primary yAxis
            title: {
              // text: 'Température du sol',
              style: {
                color: '#4285f4'
              },

            },
            labels: {
              format: '{value} °C',
            },

            softMin : this.$refMinTempValue,
            softMax : this.$refMaxTempValue,

            opposite: true,
            plotLines: [{
              value: alertTemperature,
              color: 'palevioletred',
              dashStyle: 'longdash',
              width: 1.3,
              label: {
                text: 'Niveau alerte gel',
                style: {
                  color: 'gray'
                }
              }
            }]

          }, { // Secondary yAxis
            title: {
              // text: 'Température du capteur',
              style: {
                color: '#f4b400'
              },
            },
            labels: {
              format: '{value} °C',
            },

            opposite: true
          }],

          rangeSelector: {
            selected: 'all',
            buttons: [{
              type: 'hour',
              count: 12,
              text: '12 h',
              //could be perhaps used to set the group by
              //events:{
              //  click : function(){
              //    alert('12 h clicked')
              //  }
              //}
            }, {
              type: 'hour',
              count: 24,
              text: '24 h'
            }, {
              type: 'day',
              count: 7,
              text: '7 j'
          },/* {
            type: 'month',
            count: 3,
            text: '3m'
          }, {
              type: 'all',
              text: 'Tous'}*/
            ]
          },

          series: this.dataTemperatureChart,

          navigator: {
            enabled: false
          },


          legend: {
            enabled: true,
            layout: 'horizontal',
            align: 'center',
            x: 0,
            verticalAlign: 'top',
            y: 0,
            floating: true,
          },
          exporting: {
            enabled:true,
            buttons: {
              exportButton: {
                enabled: true
              }
            }
          },


          tooltip: {
            enabled: true,
            xDateFormat: '%Y-%m-%d',
            crosshairs: true,
            shared: true,
            split : true,
            hideDelay : 50,
            pointFormat: '{series.name}: <b>{point.y:.1f}°C</b>',
          },
        }
      }
    },

    watch: {
      dataTemperatureChart(newValue) {

        this.stockOptions.series = newValue
      },

    }
  }
</script>
<style scoped>
  .stock {
    width: auto; /*auto*/
  }
</style>
