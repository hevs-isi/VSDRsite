<template>
  <div>
    <div class="row">
      <div class="col-lg-4"  v-for="sensor in mySensorList.filter(s=> (s.project.toLowerCase() === project.toLowerCase()))">
        <fountains-valve-card :location="sensor.location"></fountains-valve-card> <!--Add the operating times-->
      </div>
      
    </div>
  </div>
</template>


<script>
import FountainsValveCard from '../../../components/FountainsValveCard.vue'
   export default {
  components: { FountainsValveCard },
    name: "Overview",
    
    
        
    data() {
      return {
        locationName: this.$route.name,             //route of the page
        project : this.$PROJECT,
        mySensorList : this.$SENSORSLISTJSON


      }
    },
    mounted() {
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
