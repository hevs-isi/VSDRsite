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
        <div class="col-lg-4">
          <b-card>
            <h4 class="card.title">Hauteur minimale</h4>
              <h1 align="center"> {{sensor.waterHeightMin}} cm</h1>
              <i style="float:right" v-bind:class="[hovered ? 'fa fa-info-circle text-muted animate__animated animate__rubberBand' : 'fa fa-info-circle text-muted']"
              v-on:mouseover="hovered=true" v-on:mouseout="hovered=false" @click="info = !info">
              </i>
              <br>
              <div v-if="info" class="animate__animated animate__fadeInDown" transition="zoomInOut">
                <br>
                <h5 align="justify">Hauteur d'eau minimale sur les 30 derniers jours.
                </h5>
              </div>
          </b-card>        
        </div>
        <div class="col-lg-4">
          <b-card>
            <h4 class="card.title">Hauteur maximale</h4>
              <h1 align="center"> {{sensor.waterHeightMax}} cm</h1>
              <i style="float:right" v-bind:class="[hovered2 ? 'fa fa-info-circle text-muted animate__animated animate__rubberBand' : 'fa fa-info-circle text-muted']"
              v-on:mouseover="hovered2=true" v-on:mouseout="hovered2=false" @click="info2 = !info2">
              </i>
              <br>
              <div v-if="info2" class="animate__animated animate__fadeInDown" transition="zoomInOut">
                <br>
                <h5 align="justify">Hauteur d'eau maximale sur les 30 derniers jours.
                </h5>
              </div>             
          </b-card>        
        </div>
        <div class="col-lg-4">
          <b-card align="center" >
             <!--<b-img :src="require('../../assets/vsdr/'+sensor.location.toLowerCase()+'.jpeg')" fluid alt="Responsive image"></b-img>-->

            <img alt="centered image" width="300" height="190" :src="require('../../assets/vsdr/'+sensor.location.toLowerCase()+'.jpeg')">
            <br>
          </b-card>  
        </div>
      </div>


      
<!--chart-->      
      <div class="col-lg-12">
        <b-card>
            <h4 class="card.title">Hauteur d'eau : {{sensor.location}} </h4>
            <water-height-chart style="padding-right: 10px" :dataWaterChart="sensor.waterHeightSerie" :softmin="sensor.softmin" :softmax="sensor.softmax"></water-height-chart>

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
        hovered: false,
        info:false,
        hovered2: false,
        info2:false,
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
