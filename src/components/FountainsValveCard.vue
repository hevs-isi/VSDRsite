<template>
  <div>
      <b-card>
          
          <h4 class="card.title">Etat de la vanne {{location}}
            <i v-bind:class="[hovered ? 'fa fa-info-circle text-muted animate__animated animate__rubberBand' : 'fa fa-info-circle text-muted']"
          v-on:mouseover="hovered=true" v-on:mouseout="hovered=false" @click="info = !info">
          </i>
        </h4>
          
          <h5>Horaire de fonctionnement : {{startTime}}-{{stopTime}} </h5>
          <h5 v-if="valveState===0">Etat actuel : fermée  <img src="../assets/sensorNotOk.png" align="center"> </h5>
          <h5 v-if="valveState===1">Etat actuel : ouverte  <img src="../assets/sensorOk.png" align="center"> </h5>
          <h5 v-if="valveState===2">Etat actuel : en transition  <img src="../assets/sensorTransition.png" align="center"> </h5>
          
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
</template>

<script>
  export default {
    name: "FountainsValveCard",
    props: {
      location: String,
      startTime : String,
      stopTime : String,
    }
    ,
    data() {
      return {
        valveState :0,
        hovered: false,
        info:false
      }
    },
    mounted() {
      //console.log("Date", this.timeStamp)
    },
    methods:{
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
    }
  }
</script>

<style scoped>
</style>
