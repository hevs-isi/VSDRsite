<template>
    <div>
     <highcharts class="stock" :constructor-type="'stockChart'" :options="stockOptions" > </highcharts>

     <!--<i  style="float:right" v-bind:class="[hovered ? 'fa fa-info-circle text-muted animate__animated animate__rubberBand' : 'fa fa-info-circle text-muted']"
          v-on:mouseover="hovered=true" v-on:mouseout="hovered=false" @click="info = !info"></i>
     <div v-if="info"  transition="zoomInOut">
        <br>
        <h5 v-if="info" align="justify">Distance entre le capteur et le niveau d'eau.</h5>
     </div> -->


    </div>
</template>

<script>
    export default {
        props : [
            'dataWaterChart',
            'softmin',
            'softmax'
            

        ],
        data () {
            return {
                hovered: false,
                info:false,
                stockOptions: {
                    title:{
                        //text : "Hauteur de neige"
                    },
                  time:{
                    timezoneOffset : -120
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
                            style : {
                                color :  '#4285f4'
                            },
                        },
                        labels: {
                            format: '{value} cm',
                        },

                      opposite : true,
                      softMin : this.softmin,
                      softMax : this.softmax,
                      //reversed : true, 
                    }],

                    rangeSelector: {
                        enabled : true, 
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
                        }, {
                            type: 'all',
                            text: 'All' 
                        }],
                        selected: 'all',

                    },
                    series: this.dataWaterChart,
                        
              
                    series :{
                        id:"toto"
                    },

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
            dataWaterChart (newValue) {
                
                /*Detect if a value as been sent to 0 by the sensor*/
                let oldVal = 0
                for(const value of newValue.data){
                    if(oldVal == 0){
                        oldVal=value.y
                    }
                    if(value.y >= oldVal+10 || value.y <= oldVal-10){ //10 and -10 are final value (after offset removing) limit to know if the value is valid or not
                        value.y=oldVal                                // if the value is not valid, set the value to the last valid value  

                    }
                   oldVal=value.y
                }

                this.stockOptions.series = newValue
            },

            softmin (newValue){
                this.stockOptions.yAxis.softMin = newValue
            },


            
        }
    }
</script>
<style scoped>
    .stock {
        width: auto;

    }
</style>
