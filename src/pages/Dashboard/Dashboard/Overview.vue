<template>
  <div>
    <div class="row">
      <div class="col-lg-4"  v-for="sensor in mySensorList.filter(s=> (s.project.toLowerCase() === project.toLowerCase() && s.type === 'Fontaine'))">
        <fountains-valve-card :location="sensor.location" :startTime="sensor.startTime" :stopTime="sensor.stopTime" :installation="sensor.installation_date"></fountains-valve-card>   
      </div>
    </div>
   
    <div class="col-lg-12"  v-for="sensor in draginoValues.filter(s=> (s.project.toLowerCase() === project.toLowerCase()))">
        <b-card>
          <h4 class="card.title">Hauteur d'eau {{sensor.location}}  <i  style="float:right" v-bind:class="[hovered ? 'fa fa-info-circle text-muted animate__animated animate__rubberBand' : 'fa fa-info-circle text-muted']"
          v-on:mouseover="hovered=true" v-on:mouseout="hovered=false" @click="info = !info"></i>
          <div v-if="info" class="animate__animated animate__fadeInDown" transition="zoomInOut">
              <br>
              <h5 align="justify">Distance entre le capteur et le niveau d'eau. Par conséquent, si la courbe descend c'est que le niveau d'eau a augmenté.</h5>
          </div> </h4>
          <water-height-chart style="padding-right: 10px" :dataWaterChart="sensor.waterHeightSerie" ></water-height-chart>
        </b-card>           
    </div>
  </div>
</template>


<script>
import FountainsValveCard from '../../../components/FountainsValveCard.vue'
import chirpstackCredentials from '../../../constants/chirpstack.json'
import axios from 'axios'
import WaterHeightChart from '../../../components/WaterHeightChart.vue'


   export default {
  components: { FountainsValveCard, WaterHeightChart },
    name: "Overview",
    
    
        
    data() {
      return {  
        hovered: false,
        info:false,
        locationName: this.$route.name,             //route of the page
        project : this.$PROJECT,
        mySensorList : this.$SENSORSLISTJSON,
        draginoValues : this.$draginoValues


      }
    },

    mounted() {
      

    axios.get('https://snow-server.watermon.ch:443/vsdr_sensorList') 
        .then(res => {
          let tempVar=[]
          tempVar.push(res.data)
          var i = 0;
          if(this.$SENSORSLISTJSON.length === 0){
            tempVar[0].forEach(element => {
                  //  console.log(element)
                  this.$SENSORSLISTJSON.push(element)
                  i++
                },
            )
            this.$initStregaSensorArray()
            this.$initDraginoSensorArray()
            //make request devices here
            for(let i = 0 ; i<this.$SENSORSLISTJSON.length;i++){
              if(this.$SENSORSLISTJSON[i].project.toLowerCase() === this.$PROJECT){
                if(this.$SENSORSLISTJSON[i].type.toLowerCase() === "fontaine"){
                  this.$getStregaLastValues(this.$SENSORSLISTJSON[i].dev_eui)
                  //console.log(this.$SENSORSLISTJSON[i].dev_eui)
                }else if(this.$SENSORSLISTJSON[i].type.toLowerCase() === "hauteur d'eau"){
                  //console.log(this.$SENSORSLISTJSON[i].dev_eui)
                  this.$getDraginoLastValues(this.$SENSORSLISTJSON[i].dev_eui)
                }
              }
            }

          }          
        })
        .catch(error => {
          console.log(error)
        })




    },

    watch: {
      '$route.route': {                               //watch if the route has changed (this is how i now that i've changed page)
        handler: function () {                        //if the route changed, reload data
          this.locationName = this.$route.name

          for(let i = 0 ; i<this.$SENSORSLISTJSON.length;i++){
            if(this.$SENSORSLISTJSON[i].project.toLowerCase() === this.$PROJECT){
                if(this.$SENSORSLISTJSON[i].type.toLowerCase() === "hauteur d'eau"){
                  this.$getDraginoLastValues(this.$SENSORSLISTJSON[i].dev_eui)
                }
            }
          }
        },
        deep: true,
        immediate: true
      }
    },


    methods: {

      
     
    }


   }

</script>

<style>
  .lightText {
    color: darkgrey;
  }
</style>
