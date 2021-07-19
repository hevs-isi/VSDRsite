<template>
  <div>
   <h2>Status des antennes</h2>
    <!-- This has been optimized a bit   -->
    <b-card-group columns>
      <div v-for="(antenna, index) in this.gateway">
        <antenna-card :time = antenna.timeStamp :location=antenna.position_name :timeStamp=antenna.timestamp :eui=antenna.eui :status="antenna.isUp? 'up':'down'" :pending="pending ? true : false"></antenna-card>
      </div>
    </b-card-group>

    <h2>Status des capteur</h2>
    <div class="row">
      <div class="col-lg-6">
        <h2>Fontaine</h2>
      </div>

      <div class="col-lg-6">
          <h2>Hauteur d'eau</h2>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import chirpstackCredentials from '../../constants/chirpstack.json'      //credentials for chirpstack server
import AntennaCard from "../../components/AntennaCard";


   export default {
  components: { AntennaCard },
  name: "Technical",
    
    
        
    data() {
      return {
        gateway : [],
        sensorsDragino : [],
        sensorsStrega : [],
        pending : false, 




      }
    },
    mounted() {
      this.sensorsStrega.push(this.$stregaValveValues)

      for(let i = 0; i< this.$SENSORSLISTJSON.length; i++){
        if(this.$SENSORSLISTJSON[i].project.toLowerCase() === this.$PROJECT){
          if(this.$SENSORSLISTJSON[i].type === 'gateway'){
            var gw = {
                position_name: this.$SENSORSLISTJSON[i].location,
                position: this.$SENSORSLISTJSON[i].coordinates,
                eui: this.$SENSORSLISTJSON[i].eui,
                lastSeen: "-",
                timeStamp: "",
                isUp: false,
            }
            this.gateway.push(gw)

          }
        }
      }

       
      var promises = []

      for(let i = 0; i<this.gateway.length; i++){
        promises.push(
          axios(chirpstackCredentials.url+ 'gateways' + '/' + this.gateway[i].eui, {
            method: 'GET', // *GET, POST, PUT, DELETE, etc.
            mode: 'origin', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Grpc-Metadata-Authorization' : 'Bearer ' + chirpstackCredentials.token,
            }
          }))
      }

       Promise.all(promises)
        .then((res) => {
          for (let i = 0; i < res.length; i++) {
            //TODO : get gw info and check if online or not
            for(let i = 0; i<this.gateway.length; i++){
              if(this.gateway[i].position_name.toLowerCase() === res[i].data.gateway.name.split("_")[1]){
                //console.log(res[i].data.updatedAt)
                this.gateway[i].lastSeen = res[i].data.updatedAt
                
                let timestamp = new Date(res[i].data.updatedAt)
                this.gateway[i].timeStamp = timestamp.toLocaleString('fr-CH', {dateStyle: 'short'}) + ' à ' + timestamp.toLocaleString('fr-CH', {timeStyle: 'short'}) 

                let now = new Date()

                if(this.$secondBetweenDate (now,timestamp) < 300){
                  this.gateway[i].isUp = true
                }else{
                  this.gateway[i].isUp = false
                }
                
              }

            }
            
          }
        })
        .finally(x => {
          setTimeout(() => {
            this.pending = false;
          }, 500
        )
        })


      

    },



    methods: {

      
     
    }


   }

</script>

<style>
  .lightText {
    color: darkgrey;
  }
</style>
