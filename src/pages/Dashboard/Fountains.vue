<template>
  <div> 
    <div class="row justify-content-md-center">
      <div class="col-lg-4">
        <b-card>
          
          <h4 class="card.title">Etat de la vanne 
            <i v-bind:class="[hovered ? 'fa fa-info-circle text-muted animate__animated animate__rubberBand' : 'fa fa-info-circle text-muted']"
          v-on:mouseover="hovered=true" v-on:mouseout="hovered=false" @click="info = !info">
          </i>
        </h4>
          
          <h5>Horaire de fonctionnement : {{startTime}}-{{stopTime}} </h5>
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
           <!--Additionnal informations-->
          <div v-if="info" class="animate__animated animate__fadeInDown" transition="zoomInOut">
            <br>
            <h5>Le système de communication que nous utilisons ne permet pas d'envoyer des ordres d'ouvertures ou de fermeture en tout temps. <br> L'état "en transition"
            survient durant le temps d'attente de réception de la vanne. En principe, ce temps est de 10 minutes.</h5>
          </div> 
        </b-card>
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
            <br>
            <div>
               <label for="example-input">Heure d'activation</label>
                <b-input-group class="mb-3">
                  <b-form-input id="example-input" v-model="newStartTime" type="text" placeholder="HH:mm:ss"></b-form-input>
                  <b-input-group-append>
                    <b-form-timepicker button-only right disabled></b-form-timepicker>
                  </b-input-group-append>
                </b-input-group>
            </div>
            <br>
              <div>
               <label for="example-input">Heure de désactivation</label>
                <b-input-group class="mb-3">
                  <b-form-input id="example-input" v-model="newStopTime" type="text" placeholder="HH:mm:ss"></b-form-input>
                  <b-input-group-append>
                    <b-form-timepicker button-only right disabled></b-form-timepicker>
                  </b-input-group-append>
                </b-input-group>
            </div>
            <br>
            <div class="col-lg-2">
                <button type="button" class="btn btn-light" v-on:click="validateNewTime">Enregistrer</button>
            </div>
            <br>
          </el-collapse-item>
        </el-collapse>
      </div>
    </card>

   
  </div>
</template>

<script>

  export default {
    components: {},
    name: "Fountains",
    
    component: {
      
    },
    data() {
      return {
        locationName: this.$route.name,             //route of the page
        valveState : 0,                             //state of the valve, toggled by the button and the function toggleValve 0-close, 1 open, 2 in transition
        startTime : 0,
        stopTime : 0,
        newStartTime : "",
        newStopTime : "",
        hovered: false,
        info:false

      }
    },
    mounted() {
    },
    watch: {
      '$route.route': {                               //watch if the route has changed (this is how i now that i've changed page)
        handler: function () {                        //if the route changed, reload data
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
      },

      /**
       * validate the time activation change
       */
      validateNewTime : function(){

        console.log(this.newStartTime)
        console.log(this.newStopTime)
      }
    }

}
</script>
<style scoped>
</style>
