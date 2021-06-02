<template>
    <highcharts class="stock" :constructor-type="'stockChart'" :options="stockOptions"></highcharts>
</template>

<script>
    export default {
        props : [
            'dataSnowChart',

        ],
        data () {
            return {
                stockOptions: {
                    title:{
                        //text : "Hauteur de neige"
                    },
                  time:{
                    timezoneOffset : -60
                  },
                    chart:{
                        style:{
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

                    yAxis: [{ // Primary yAxis
                        title: {
                            //text: 'Hauteur de neige',
                            style : {
                                color :  '#4285f4'
                            },
                        },
                        labels: {
                            format: '{value} cm',
                        },

                        opposite : true,
    //                  min : 0,
                      softMax : 200

                    }],

                    rangeSelector: {

                        selected: 'all',
                        buttons: [{
                            type: 'hour',
                            count: 12,
                            text: '12h',
                        }, {
                            type: 'hour',
                            count: 24,
                            text: '24h'
                        }, {
                            type: 'day',
                            count: 7,
                            text: '7d'
                        }, /*{
                            type: 'month',
                            count: 1,
                            text: '1m'
                        }, {
                            type: 'month',
                            count: 3,
                            text: '3m'
                        }, {
                            type: 'all',
                            text: 'All' }*/
                        ]
                    },
                    series: this.dataSnowChart,

                    legend :{
                        enabled : true,
                        layout: 'horizontal',
                        align: 'center',
                        x: 0,
                        verticalAlign: 'top',
                        y: 0,
                        floating: true,

                    },
                    tooltip:{
                        pointFormat : '{series.name}: <b>{point.y:.1f} cm</b><br/>'
                    },

                }
            }
        },


        watch: {
            dataSnowChart (newValue) {
                this.stockOptions.series = newValue
            },
        }
    }
</script>
<style scoped>
    .stock {
        width: auto;

    }
</style>
