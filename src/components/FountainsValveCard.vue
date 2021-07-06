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
          
          <div class="row">
            <div class="col-lg-4">
              <div v-if="valveState === 2">
                <h5>Envoyé à : <br> {{sendTime}}</h5>
              </div>
            </div>

            <div class="col-lg-4">
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
            </div>

            <div class="col-lg-4" align="right">
              <h5>xx°C</h5>
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
import axios from "axios"


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
        info:false,
        timerReload : null,
        sendTime : "", 
        vsdrSensorJson : this.$SENSORSLISTJSON
      }
    },
    mounted() {
      //get valveState
      for(let i = 0; i< this.vsdrSensorJson.length; i++){
          if(this.vsdrSensorJson[i].project.toLowerCase() === this.$PROJECT.toLowerCase()){
            if(this.vsdrSensorJson[i].location.toLowerCase() === this.location.toLowerCase()){
              this.valveState = this.vsdrSensorJson[i].state
              if(this.valveState == 0){
                this.myBorder = "danger"
              }else if(this.valveState ==1){
                this.myBorder = "success"
              }
            }
          }
        }




    },

    created(){
      
    },

    beforeDestroy(){
      clearInterval(this.timerReload)
    },
    methods:{
         /**
       * Function that toggle the valve and send a message to the sensor
       */
      toggleValve : function (){
        var date = new Date
        var hours = date.getHours()
        var minutes = date.getMinutes()
        
        this.sendTime = hours + "h" + minutes
        
        if(this.valveState === 1){
          console.log("close Valve " + this.location)
          this.valveState = 0
          this.myBorder="danger"
        }else{
          console.log("open valve "  + this.location)
          this.valveState = 1
          this.myBorder="success"
          
          //call here the timerValve, so it start when the button has been clicked
          this.timerValveState()
        }
        this.saveValveState(this.valveState)

      },


      /**
       * timer to check the valve state and change the button color and state
       */
      timerValveState : function(){
        this.timerReload = setInterval(()=>{
          console.log("hello this is the timer from fountain component from : " + this.location)
          //call update_Button here
        },5000) //in millis
      },

/**
 * Ajouter message envoyé à 
 */

/*
    //run each 1min
    update_button(){
      //Read into json
      db.state = db.get()
      if(json.actState == IDLE){
        if(db.state == open){
          button = green
        }if(db.state == close){
          button =close
        }
      }else if (json.actState == open || json.actState == close){
        if(db.state == open){
          button = open
        }if(db.state== close){
          button = close
        }

      }
    }

*/

 

//-----------------------------------------
    /**
    * Save new valve state into the JSON File
     */
    saveValveState : function (state){
       console.log("save")
        //check the right object into the JSON array
        for(let i = 0; i< this.vsdrSensorJson.length; i++){
          if(this.vsdrSensorJson[i].project.toLowerCase() === this.$PROJECT.toLowerCase()){
            if(this.vsdrSensorJson[i].location.toLowerCase() === this.location.toLowerCase()){
              this.vsdrSensorJson[i].state = state
            }
          }
        }
        
        //formate the json array
        const formData = new FormData()
        formData.append("file", new Blob([
        JSON.stringify(this.vsdrSensorJson),
        ], {type : 'application/json'}), 'vsdr_sensorList.json');  //

        //axios request to rewrite the JSON file
        axios.post(this.$SERVERURL + 'vsdr_sensorList', formData)
          .then(res =>{
            console.log("save time to json response : ")
            console.log(res)
          })
          .catch(err =>{
            console.log("save time to json response : ")
            console.log("error axios : " + err)
          })
    },

   

        
      
    }
  }
</script>

<style scoped>
</style>
