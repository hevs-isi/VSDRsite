<template>
  <div>
      <b-card :border-variant="myBorder">
          
          <h4 class="card.title" >Etat de la vanne {{location}}
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
              <div v-if="downlinkSend === true">
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

            <div class="col-lg-4" align="right" v-for="valve in this.sensors.filter(s=> (s.location.toLowerCase() === location.toLowerCase()))">
              <h5>{{valve.temperature}} °C</h5>
            </div>

          </div>
           <!--Additionnal informations-->
          <div v-if="info" class="animate__animated animate__fadeInDown" transition="zoomInOut">
            <br>
            <h5 align="justify">Le système de communication que nous utilisons ne permet pas d'envoyer des ordres d'ouvertures ou de fermeture en tout temps,
              cependant, la demande est mise en attente. Un seul click suffit.</h5>
          </div> 
        </b-card>
  </div>
</template>

<script>
import axios from "axios"

import credInflux from '../constants/influx'
const Influx = require('influx')

    const influxClient = new Influx.InfluxDB({
      database: credInflux.database,
      host: credInflux.host,
      port: credInflux.port,
      protocol: credInflux.protocol,
      username: credInflux.username,
      password: credInflux.password
    });
    let infClient = influxClient

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
        sensors : [],
        valveState :0,
        hovered: false,
        myBorder : "danger",
        info:false,
        timerReload : null,
        sendTime : "", 
        downlinkSend : false, 
        vsdrSensorJson : this.$SENSORSLISTJSON //A SUPPRIMER SI ON VEUT QUE PRENDRE LETAT DE LA VANNE DANS LA DB
        
      }
    },

    mounted() {
      this.sensors = this.$stregaValveValues    
      this.setVavleState()


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
        var date = new Date()

        
        this.sendTime =  date.toLocaleString('fr-CH', {timeStyle: 'short'})
        this.downlinkSend = true
        
        if(this.valveState === 1){
          this.valveState = 0
          this.myBorder="danger"        
          //send the downlink to the right device to close the valve
          for(let i = 0; i< this.$stregaValveValues.length;i++){
            if(this.$stregaValveValues[i].location.toLowerCase() === this.location.toLowerCase()){
              this.$postDownlinkChirpStack("devices", this.$stregaValveValues[i].eui, "MA==", 1, true)
            }
          }
        }else{
          this.valveState = 1
          this.myBorder="success"
          //send the downlink to the right device to open the valve
          for(let i = 0; i< this.$stregaValveValues.length;i++){
            if(this.$stregaValveValues[i].location.toLowerCase() === this.location.toLowerCase()){
              this.$postDownlinkChirpStack("devices", this.$stregaValveValues[i].eui, "MQ==", 1, true)
              
            }
          }
        }
        this.saveValveState(this.valveState)

      },





 

    /**
    * Save new valve state into the JSON File
     */
    saveValveState : function (state){
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

    setVavleState : function (){

      let queryValve = `SELECT last("value")
      FROM
          "device_frmpayload_data_Valve" 
      WHERE
          ("dev_eui" = '$dEUI')  
      `;


      for(let i = 0; i<this.sensors.length; i++){
        if(this.sensors[i].location.toLowerCase() === this.location.toLowerCase()){
          queryValve = queryValve.replace("$dEUI", this.sensors[i].eui.toLowerCase())
          Promise.all([
            infClient.query(queryValve)
          ]).then(resValve => {
            //console.log(resValve[0][0].last)
            for(let i = 0; i< this.vsdrSensorJson.length; i++){
              if(this.vsdrSensorJson[i].project.toLowerCase() === this.$PROJECT.toLowerCase()){
                if(this.vsdrSensorJson[i].location.toLowerCase() === this.location.toLowerCase()){
                  let dbVal = parseInt(resValve[0][0].last)
                  let jsonVal = this.vsdrSensorJson[i].state
                  //console.log (this.vsdrSensorJson[i].location +" json : " + jsonVal + " db " + dbVal)
                  if(jsonVal === 0 && dbVal === 0){
                    this.myBorder = "danger"
                    this.valveState = 0

                  }else if(jsonVal === 1 && dbVal === 0){
                    this.myBorder = "success"
                    this.valveState = 1
                  }else if(jsonVal === 1 && dbVal === 1){
                     this.myBorder = "success"
                    this.valveState = 1                   
                  }else if(jsonVal === 0 && dbVal === 1){
                    this.myBorder = "success"
                    this.valveState = 1                  
                  }
                }
              }
            }
          }).catch(error => console.log(error))
        }
      }

    }
   

        
      
    },

        watch: {
      '$route.route': {                               //watch if the route has changed (this is how i now that i've changed page)
        handler: function () {                        //if the route changed, reload data
          this.setVavleState()
        },
        deep: true,
        immediate: true
      }
    },
  }
</script>

<style scoped>
</style>
