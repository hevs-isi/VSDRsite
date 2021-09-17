<template>
  <div>
    <div class="row">
      <div class="col-lg-4"  v-for="sensor in mySensorList.filter(s=> (s.project.toLowerCase() === project.toLowerCase() && s.type === 'Fontaine'))">
        <fountains-valve-card :location="sensor.location" :startTime="sensor.startTime" :stopTime="sensor.stopTime" :installation="sensor.installation_date"></fountains-valve-card>   
      </div>
    </div>
   
    <div class="col-lg-12"  v-for="sensor in draginoValues.filter(s=> (s.project.toLowerCase() === project.toLowerCase()))">
        <b-card>
          <h4 class="card.title">Hauteur d'eau {{sensor.location}}</h4>
          <water-height-chart style="padding-right: 10px" :dataWaterChart="sensor.waterHeightSerie"></water-height-chart>
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
