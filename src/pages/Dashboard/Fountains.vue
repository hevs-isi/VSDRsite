<template>
  <div> 
    <div class="row justify-content-md-center">
      <!--Valve card-->
      <div class="col-lg-4">
            <fountains-valve-card 
              :location="this.$route.name" 
              :startTime="this.startTime.toString()" 
              :stopTime="this.stopTime.toString()" >
            </fountains-valve-card>
      </div>
    </div>
    <!--Information about water consumption-->
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
        locationName: this.$route.name,             //route of the page
        valveState : 0,                             //state of the valve, toggled by the button and the function toggleValve 0-close, 1 open, 2 in transition
        startTime : 0,
        stopTime : 0,
        newStartTime : "",
        newStopTime : "",
        vsdrSensorJson : this.$SENSORSLISTJSON


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

      }


     
    }

}
</script>
<style scoped>
</style>
