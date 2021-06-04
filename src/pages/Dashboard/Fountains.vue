<template>
  <div>
    <div class="row justify-content-md-center">
      <div class="col-lg-4">
        <card title="Etat de la vanne">
          <h5>Horaire de fonctionnement : </h5>
          <h5 v-if="valveState===false">Etat actuel : fermée  <img src="../../assets/sensorNotOk.png" align="center"> </h5>
          <h5 v-if="valveState===true">Etat actuel : ouverte  <img src="../../assets/sensorOk.png" align="center"> </h5>
          
          <div class="container">
          <div class="row justify-content-md-center" v-if="valveState === false">
            <button type="button" class="btn btn-success" v-on:click="toggleValve">Ouvrir</button>
          </div>
          
          <div class="row justify-content-md-center" v-if="valveState === true">
            <button type="button" class="btn btn-danger" v-on:click="toggleValve">Fermer</button>
          </div>
          </div>
        </card>
      </div>
    </div>

    <div class="row">
      <div class="col-lg-4">
        <card title="Débit actuel">
          <h1 align="center">XXX L/h</h1>
        </card>
      </div>
      <div class="col-lg-4">
        <card title="Consommation annuelle">
          <h1 align="center">XXX L</h1>
        </card>
      </div>
      <div class="col-lg-4">
        <card title="Consommation sans le système">
          <h1 align="center">XXX L</h1>
        </card>
      </div>
    </div>
  </div>
</template>

<script>


  export default {
    components: {  },
    name: "Fountains",
    
    component: {
      
    },
    data() {
      return {
        locationName: this.$route.name,             //route of the page
        valveState : false,                         //state of the valve, toggled by the button and the function toggleValve
      }
    },
    mounted() {
    },
    watch: {
      '$route.route': {                               //watch if the route has change (this is how i now that i've change page)
        handler: function () {                        //if the route change, reload data
          this.locationName = this.$route.name

         
          
        },
        deep: true,
        immediate: true
      }
    },


    methods: {
      /**
       * Function that toggle the valve and send a message to the sensor
       */
      toggleValve : function (){
        if(this.valveState === true){
          console.log("close Valve")
          this.valveState = false
        }else{
          console.log("open valve")
          this.valveState = true
        }
        
      }
    }

}
</script>
<style scoped>
</style>
