<template>
  <div>
    <div class="row">
      <div class="col-lg-4"  v-for="sensor in mySensorList.filter(s=> (s.project.toLowerCase() === project.toLowerCase() && s.type === 'Fontaine'))">
        <fountains-valve-card :location="sensor.location" :startTime="sensor.startTime" :stopTime="sensor.stopTime"></fountains-valve-card>   
      </div>
    </div>
    <div class="col-lg-12"  v-for="sensor in mySensorList.filter(s=> (s.project.toLowerCase() === project.toLowerCase() && s.type === 'Hauteur d\'eau'))">
      <b-card>
            <h4 class="card.title">Hauteur d'eau {{sensor.location}}</h4>

            <!--waterlevel chart-->
      </b-card>           
    </div>
    {{$stregaValveValues[0]}}
  </div>
</template>


<script>
import FountainsValveCard from '../../../components/FountainsValveCard.vue'
import TemperatureChart from '../../../components/TemperatureChart.vue'
import chirpstackCredentials from '../../../constants/chirpstack.json'
import axios from 'axios'


   export default {
  components: { FountainsValveCard, TemperatureChart },
    name: "Overview",
    
    
        
    data() {
      return {
        locationName: this.$route.name,             //route of the page
        project : this.$PROJECT,
        mySensorList : this.$SENSORSLISTJSON


      }
    },
    mounted() {
      this.$initStregaSensorArray(this.mySensorList)
      console.log(this.$stregaValveValues)
     //this.$getLastStregaValveState("0004a30b00f7da1c", "Trontze")
     //console.log(this.$stregaValveValues)


    },
    watch: {
      '$route.route': {                               //watch if the route has changed (this is how i now that i've changed page)
        handler: function () {                        //if the route changed, reload data
          this.locationName = this.$route.name
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
