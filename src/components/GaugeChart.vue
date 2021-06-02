<template>
    <highcharts class="gauge" :constructor-type="'chart'" :options="gaugeOptions"></highcharts>
</template>



<script>

    export default {
        props : [
            'dataGaugeChart',

        ],
        data() {
            return {
                gaugeOptions: {
                    chart: {
                        type: 'solidgauge',

                    },

                   title : null,

                    pane: {
                        center: ['50%', '75%'],
                        size: '100%',
                        startAngle: -90,
                        endAngle: 90,
                        background: {

                            innerRadius: '60%',
                            outerRadius: '100%',
                            shape: 'arc'
                        }
                    },

                    tooltip: {
                        enabled: true
                    },

                    yAxis: {
                        stops: [
                            [0.1, '#DF5353'], // green 55BF3B
                            [0.5, '#DDDF0D'], // yellow
                            [0.9, '#55BF3B'] // red DF5353
                        ],
                        min : 0,
                        max : 3,
                        lineWidth: 0,
                        tickWidth: 0,
                        minorTickInterval: null,
                        tickAmount: 2,


                    },

                    credits : false,

                    exporting: {
                        enabled: false
                    },
                    series: [{
                        name: 'Batterie',
                        data: [],
                        dataLabels: {
                            format:
                                '<div style="text-align:center" >' +
                                '<span>{y} V </span>' +
                                '</div>'
                        },
                        tooltip: {
                            valueSuffix: ' V'
                        }
                    }]


                }
            }

        },

        watch: {
            dataGaugeChart(newValue) {

                this.gaugeOptions.series[0].data = [newValue]


            },
        }

    }

</script>
<style scoped>


</style>
