<template>
  <div> 
    <div class="row justify-content-md-center">
      <div class="col-lg-4">
        <card title="Etat de la vanne">
          <h5>Horaire de fonctionnement : {{startTime}}-{{stopTime}}</h5>
          <h5 v-if="valveState===0">Etat actuel : fermée  <img src="../../assets/sensorNotOk.png" align="center"> </h5>
          <h5 v-if="valveState===1">Etat actuel : ouverte  <img src="../../assets/sensorOk.png" align="center"> </h5>
          <h5 v-if="valveState===2">Etat actuel : en transition  <img src="../../assets/sensorTransition.png" align="center"> </h5>
          
          <div class="container">
          <div class="row justify-content-md-center" v-if="valveState === 0">
            <button type="button" class="btn btn-success" v-on:click="toggleValve">Ouvrir</button>
          </div>
          
          <div class="row justify-content-md-center" v-if="valveState === 1">
            <button type="button" class="btn btn-danger" v-on:click="toggleValve">Fermer</button>
          </div>

          <div class="row justify-content-md-center" v-if="valveState === 2">
            <button type="button" class="btn btn-light"  disabled = "disabled">En transition</button>
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

  <!--Change auto activation time-->
   <card>
      <div class="col-lg-12">
        <el-collapse class="collapse-info">
          <el-collapse-item style="background-color: white" title="Changer les horaires d'activation" name="1">

            
          </el-collapse-item>
        </el-collapse>
      </div>
    </card>


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
        valveState : 0,                             //state of the valve, toggled by the button and the function toggleValve 0-close, 1 open, 2 in transition
        startTime : 0,
        stopTime : 0
      }
    },
    mounted() {
    },
    watch: {
      '$route.route': {                               //watch if the route has change (this is how i now that i've change page)
        handler: function () {                        //if the route change, reload data
          this.locationName = this.$route.name
          /**
           * reload all data here
           */
          //reload automatic activation time
          for(let i = 0; i< this.$SENSORSLISTJSON.length; i++){
            if(this.$SENSORSLISTJSON[i].project.toLowerCase() === this.$PROJECT && this.$SENSORSLISTJSON[i].location === this.locationName){
              this.startTime = this.$SENSORSLISTJSON[i].startTime
              this.stopTime = this.$SENSORSLISTJSON[i].stopTime
            }

          }
          


         
          
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
        if(this.valveState === 1){
          console.log("close Valve")
          this.valveState = 2
        }else{
          console.log("open valve")
          this.valveState = 2
        }
        
      }
    }

}
</script>
<style scoped>
</style>
