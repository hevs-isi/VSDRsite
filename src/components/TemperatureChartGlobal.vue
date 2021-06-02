<template>
  <highcharts class="stock" :constructor-type="'stockChart'" :options="stockOptions"
              id="dataTemperatureGlobalChart"></highcharts>
</template>

<script>
  const alertTemperature = 1;

  Date.prototype.morning = function(){
    let newDate = new Date(this.getTime())
    newDate.setHours(0+7)
    newDate.setMinutes(0)
    return newDate;
  }

  Date.prototype.evening = function(){
    let newDate = new Date(this.getTime())
    newDate.setHours(0+19)
    newDate.setMinutes(0)
    return newDate;
  }

  // Compute some important dates
  let now = new Date()
  let yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  let tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)


  export default {
    props: [
      'dataTemperatureGlobalChart'
    ],
    data() {
      this.$setRefTempChart()

      return {
        stockOptions: {
          title: {
            text: ""
          },
          time: {
            timezoneOffset: -60, //-120

          },

          chart: {
            style: {
              fontFamily: 'Roboto',
            },
            height: 400,
          },

          boost: {
            enabled: true
          },

          series: this.dataTemperatureGlobalChart,


          // La barre au fond pour l'aperçu
          navigator: {
            enabled: false, handles: {
              enable: false
            }
          },

          // La barre de scroll
          scrollbar: {
            enabled: false
          },

          // Pour choisir les dates
          rangeSelector: {
            enabled: false
          },

          // scrollbar: {
          //     barBackgroundColor: '#cccccc',
          //     //barBorderRadius: 7,
          //     //barBorderWidth: 0,
          //     //buttonBackgroundColor: '#cccccc',
          //     buttonBorderWidth: 0,
          //     buttonBorderRadius: 7,
          //     trackBackgroundColor: 'none',
          //     trackBorderWidth: 1,
          //     trackBorderRadius: 8,
          //     trackBorderColor: '#CCC'
          // },
          //

          // TODO This is not over, check with this https://stackoverflow.com/questions/47314448/filling-xaxis-for-all-nights-in-highcharts
          xAxis: {
           plotBands: [
              {
                color: 'ghostwhite', // Color value
                from: yesterday.evening(),
                to: now.morning(),
                label: {
                  text: '\uD83C\uDF19',
                  style: {
                    fontSize: '16px'
                  },
                  align: 'center',
                  y: 25,
                }
              },
              {
                color: 'ghostwhite', // Color value
                from: now.evening(),
                to: tomorrow.morning(),
                label: {
                  text: '\uD83C\uDF19',
                  style: {
                    fontSize: '16px'
                  },
                  align: 'center',
                  y: 25
                }
              },
            ],
          },

          yAxis: [{ // Primary yAxis
            title: {
              style: {
                color: '#4285f4'
              },
            }
            ,

            softMin : this.$refMinTempValue,
            softMax : this.$refMaxTempValue,

            // gridLineColor: '#000000',
            // gridZIndex: 0,

            labels: {
              format: '{value} °C',
            },

            opposite: false,

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
              // text: 'Pralan',
              style: {
                color: '#f4b400'
              },
            },
            labels: {
              format: '{value} °C',
            },

            opposite: true
          }, { // third yAxis
            title: {
              // text: 'Pro de Savioz',
              style: {
                color: '#006600'
              },
            },
            labels: {
              format: '{value} °C',
            },

            opposite: true
          }],

          legend: {
            enabled: true,
            layout: 'horizontal',
            align: 'center',
            x: 0,
            verticalAlign: 'top',
            y: 0,
            floating: true,
          },

          tooltip: {
            enabled: true,
 //           xDateFormat: '%Y-%m-%d',
            crosshairs: true,
            shared: false,
            split : false,
            hideDelay : 50,
            pointFormat: '{series.name}: <b>{point.y:.1f}°C</b>',
          }

        }
      }
    },

    watch: {
      dataTemperatureGlobalChart(newValue) {
        this.stockOptions.series = newValue
       // console.log(this.minValue)
       // console.log(this.maxValue)
      },
    }
  }
</script>

<style scoped>
  .stock {
    width: available;
  }
</style>
