<template>
  <div> 
    <div class="row justify-content-md-center">
      <!--Valve card-->
      <div class="col-lg-4">
            <fountains-valve-card 
              :location="this.$route.name" 
              :startTime="this.startTime.toString()" 
              :stopTime="this.stopTime.toString()"
              :installation="this.installation_date.toString()" 
              >
              
            </fountains-valve-card>
      </div>
    </div>


    <!--Information about water consumption-->
    <div class="row" v-for="valve in this.sensors.filter(s=> (s.location.toLowerCase() === this.locationName.toLowerCase()))">
      <div class="col-lg-4">
        <card title="Débit actuel">
          <h1 v-if="valve.valveState === '1'" align="center">{{valve.flow_now}} L/h</h1>
          <h1 v-if="valve.valveState === '0'" align="center">Vanne fermée</h1>
          <br>
        </card>
      </div>
      <div class="col-lg-4">
        <card title="Consommation totale">
           <h1  align="center">{{valve.flow_total}} L</h1>
           <br>
        </card>        
      </div>
      <div class="col-lg-4">
        <card title="Economie d'eau"> 
          
          <h1 align="center">{{valve.flow_without_strega}} L </h1>
          <i style="float:right" v-bind:class="[hovered ? 'fa fa-info-circle text-muted animate__animated animate__rubberBand' : 'fa fa-info-circle text-muted']"
          v-on:mouseover="hovered=true" v-on:mouseout="hovered=false" @click="info = !info">
          </i>
          <br>
          <div v-if="info" class="animate__animated animate__fadeInDown" transition="zoomInOut">
            <br>
            <h5 align="justify">Economie d'eau avec le système de vanne connectée. Cette valeur est calculée sur la base du temps d'écoulement journalier
              de la fontaine.
            </h5>
          </div> 
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
                  <b-form-input id="example-input" type="time" v-model="newStartTime" placeholder="HH:mm:ss"></b-form-input>
                  <b-input-group-append>
                    <b-form-timepicker button-only right disabled ></b-form-timepicker>
                  </b-input-group-append>
                </b-input-group>
            </div>
            <br>
              <div>
               <label for="example-input">Heure de désactivation</label>
                <b-input-group class="mb-3">
                  <b-form-input id="example-input" type="time" v-model="newStopTime"  placeholder="HH:mm:ss"></b-form-input>
                  <b-input-group-append>
                    <b-form-timepicker button-only right disabled></b-form-timepicker>
                  </b-input-group-append>
                </b-input-group>
            </div>
            <br>
            <div class="col-lg-2">
                <button type="button" class="btn btn-light" v-on:click="saveNewValveTime">Enregistrer</button>
            </div>
            <br>
          </el-collapse-item>
        </el-collapse>
      </div>
    </card>


  </div>
</template>

<script>

import FountainsValveCard from '../../components/FountainsValveCard.vue'
import axios from "axios"




  export default {
    components: {FountainsValveCard},
    name: "Fountains",
    
    
        
    data() {
      return {
        hovered: false,
        info:false,
        locationName: this.$route.name,             //route of the page
        sensors : [],
        valveState : 0,                             //state of the valve, toggled by the button and the function toggleValve 0-close, 1 open, 2 in transition
        startTime : 0,
        stopTime : 0,
        installation_date : '',
        newStartTime : "",
        newStopTime : "",
        vsdrSensorJson : this.$SENSORSLISTJSON,
        flowOffset : 0,

      }
    },

    mounted() {
      this.sensors = this.$stregaValveValues 
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
              this.valveState = this.$SENSORSLISTJSON[i].valveState
              if(this.$SENSORSLISTJSON[i].installation_date != undefined){
                this.installation_date = this.$SENSORSLISTJSON[i].installation_date
              }else{
                this.installation_date = "Pas encore installée"
              }
              //console.log(this.$SENSORSLISTJSON[i])
            }
          }
        },
        deep: true,
        immediate: true
      
        

      }

      
    },


    methods: {

      saveNewValveTime : function(){
        let location = this.locationName
        //check the right object into the JSON array
        for(let i = 0; i< this.vsdrSensorJson.length; i++){
          if(this.vsdrSensorJson[i].project.toLowerCase() === this.$PROJECT.toLowerCase()){
            if(this.vsdrSensorJson[i].location.toLowerCase() === this.locationName.toLowerCase()){
              this.vsdrSensorJson[i].startTime = this.newStartTime
              this.vsdrSensorJson[i].stopTime = this.newStopTime
              this.startTime= this.newStartTime
              this.stopTime = this.newStopTime
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
            console.log(res)
          })
          .catch(err =>{
            console.log("error axios : " + err)
          })

          /**
           * Send on all day ports the new time start and stop
           */
          for(let i = 0; i<this.sensors.length; i++){
            if(this.sensors[i].location.toLowerCase() === this.locationName.toLowerCase()){
              for(let port = 14; port<21; port++){
                let time = this.encodeDownlinkValveTime(this.startTime, this.stopTime)
                //encode time to base64!!

                this.$postDownlinkChirpStack ("devices", this.sensors[i].eui, time, port, true) 
              }             
            }
          }


         
      },

    /**
     * send new start/stop automatic time to valve, refer to strega manual p77
     * @param {*} start 
     * @param {*} stop 
     */
      encodeDownlinkValveTime : function(start, stop){
        //console.log("startTime : " + start)
        //console.log("stopTime : " + stop)

        //Convert all values in Hex
        let startHourDozen = start[0]
        let startHex = (0b1000 | startHourDozen.toString(16)).toString(16) //encode the open valve

        let startHourUnit = start[1].toString(16)
        let startMinuteDozen = start[3].toString(16)
        let startMinuteUnit = start[4].toString(16)

        let stopHourDozen = stop[0].toString(16)
        let stoptHourUnit = stop[1].toString(16)
        let stopMinuteDozen = stop[3].toString(16)
        let stopMinuteUnit = stop[4].toString(16)

        
               
        let finalFrame = ("FF" + startHex + startHourUnit +startMinuteDozen + startMinuteUnit + "FF" +
                           stopHourDozen + stoptHourUnit + stopMinuteDozen + stopMinuteUnit + 
                           "FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF")
        console.log("Time frame to send : " + finalFrame)

        //encode to base64 for chirpstack
        let finalFrameB64 = (btoa(finalFrame.match(/\w{2}/g).map(function(a){return String.fromCharCode(parseInt(a, 16));} ).join("")) )

        //--------------------------

        return finalFrameB64
      },



      

     
    }

}
</script>
<style scoped>
</style>
