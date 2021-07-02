<template>
  <div>
      <b-card :border-variant="myBorder">
          
          <h4 class="card.title">Etat de la vanne {{location}}
            <i v-bind:class="[hovered ? 'fa fa-info-circle text-muted animate__animated animate__rubberBand' : 'fa fa-info-circle text-muted']"
          v-on:mouseover="hovered=true" v-on:mouseout="hovered=false" @click="info = !info">
          </i>
        </h4>
          
          <h5>Horaire de fonctionnement : {{startTime}}->{{stopTime}} </h5>
          <h5 v-if="valveState===0">Etat actuel : fermée  <img src="../assets/sensorNotOk.png" align="center"> </h5>
          <h5 v-if="valveState===1">Etat actuel : ouverte  <img src="../assets/sensorOk.png" align="center"> </h5>
          <h5 v-if="valveState===2">Etat actuel : en transition  <img src="../assets/sensorTransition.png" align="center"> </h5>
          
          <div class="container">
          <div class="row justify-content-md-center" v-if="valveState === 0">
            <l-button type="button" class="btn btn-success" outline="" v-on:click="toggleValve">Ouvrir</l-button>
          </div>
          
          <div class="row justify-content-md-center" v-if="valveState === 1">
            <l-button type="button" class="btn btn-danger" outline="" v-on:click="toggleValve">Fermer</l-button>
          </div>

          <div class="row justify-content-md-center" v-if="valveState === 2">
            <l-button type="button" class="btn btn-light" outline="" disabled = "disabled">En transition</l-button>
          </div>

          </div>
           <!--Additionnal informations-->
          <div v-if="info" class="animate__animated animate__fadeInDown" transition="zoomInOut">
            <br>
            <h5 align="justify">Le système de communication que nous utilisons ne permet pas d'envoyer des ordres d'ouvertures ou de fermeture en tout temps,
              cependant, la demande est mise en attente. 
              <br><br>
             L'état <i><b>"en transition"</b></i> survient durant le temps d'attente de réception de la vanne. En principe, ce temps est de 10 minutes.</h5>
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
        myBorder : "danger",
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
          console.log("close Valve " + this.location)
          this.valveState = 2
          this.myBorder="danger"
        }else{
          console.log("open valve "  + this.location)
          this.valveState = 2
          this.myBorder="success"
        }
      },


 
        
      
    }
  }
</script>

<style scoped>
</style>
