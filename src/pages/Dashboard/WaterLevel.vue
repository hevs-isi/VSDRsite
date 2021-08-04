<template>
  <div>
    
    <div v-for="sensor in draginoValues.filter(s=> (s.location.toLowerCase() === this.locationName.toLowerCase()))">
      <div class="row" >
        <div class="col-lg-4">
          <b-card>
            <h4 class="card.title">Il y à 6 heures</h4>
              <h1 align="center" v-if="sensor.waterHeight6h != undefined"> {{sensor.waterHeight6h}} cm</h1>
              <h3 align="center" v-else>Capteur hors service</h3>
          </b-card>        
        </div>
        <div class="col-lg-4">
          <b-card>
            <h4 class="card.title">Il y à 3 heure </h4>
              <h1 align="center" v-if="sensor.waterHeight3h != undefined"> {{sensor.waterHeight3h}} cm</h1>
              <h3 align="center" v-else>Capteur hors service</h3>
          </b-card>        
        </div>
        <div class="col-lg-4">
          <b-card>
            <h4 class="card.title">Actuellement </h4>
              <h1 align="center" v-if="sensor.waterHeightNow != undefined"> {{sensor.waterHeightNow}} cm</h1>
              <h3 align="center" v-else>Capteur hors service</h3>
          </b-card>        
        </div>           
      </div>

      <div class="row">
        <div class="col-lg-4 offset-md-2">
          <b-card>
            <h4 class="card.title">Hauteur minimale</h4>
              <h1 align="center"> {{sensor.waterHeightMin}} cm</h1>
          </b-card>        
        </div>
        <div class="col-lg-4 offset-md-1">
          <b-card>
            <h4 class="card.title">Hauteur maximale</h4>
              <h1 align="center"> {{sensor.waterHeightMax}} cm</h1>
          </b-card>        
        </div>
      </div>

      
<!--chart-->      
      <div class="col-lg-12">
        <b-card>
            <h4 class="card.title">Hauteur d'eau {{sensor.location}} </h4>
            <water-height-chart style="padding-right: 10px" :dataWaterChart="sensor.waterHeightSerie"></water-height-chart>

        </b-card>        
      </div>           
    </div>
  </div>
</template>

<script>
import WaterHeightChart from '../../components/WaterHeightChart.vue'

    export default {
    name: "WaterLevel",
      components: { WaterHeightChart },

    
    component: {
      
    },
    data() {
      return {
        locationName: this.$route.name,             //route of the page
        draginoValues : this.$draginoValues,
        project : this.$PROJECT,

      }
    },
    mounted() {
    },
    watch: {
      '$route.route': {                               //watch if the route has change (this is how i now that i've change page)
        handler: function () {                        //if the route change, reload data
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
<style scoped>
</style>
