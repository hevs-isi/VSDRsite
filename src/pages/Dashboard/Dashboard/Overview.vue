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
  </div>
</template>


<script>
import FountainsValveCard from '../../../components/FountainsValveCard.vue'
import TemperatureChart from '../../../components/TemperatureChart.vue'

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
      let token = ''
      let req = 'api/devices/'
      let devId = 'a84041a6b1827b7f'



      axios.get('https://lora.pignat.org/api/applications', {headers : {
        'Accept': 'application/json',
        'Grpc-Metadata-Authorization' : 'Bearer ',
      }})      
        .then(res => {
          console.log(res)
        })
        .catch(error => {
          console.log(error)
        })



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
