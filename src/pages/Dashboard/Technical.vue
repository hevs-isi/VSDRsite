<template>
  <div>
   <h2>Status des antennes</h2>
    <!-- This has been optimized a bit   -->
    <b-card-group columns>
      <div v-for="(antenna, index) in this.gateway">
        <antenna-card :time = antenna.timeStamp :location=antenna.position_name :timeStamp=antenna.timestamp :eui=antenna.eui :status="antenna.isUp? 'up':'down'" :pending="pending ? true : false"></antenna-card>
      </div>
    </b-card-group>

    <h2>Status des capteurs</h2>
    <div class="row">
      <div class="col-lg-6">
        <h3>Fontaine</h3>
        <card>
          <vue-tabs value="Description">
            <v-tab v-for="valve in this.sensorsStrega" :title=valve.location :key=valve.location>
              <div class="row">
                <div class="col-lg-12">
                  <br>
                  <h5>Valeur lue le <b>{{new Date(valve.when).toLocaleString('fr-CH')}}</b>
                    <div v-if="(new Date() - new Date(valve.when)<=1200000 )">Etat du capteur : en ligne
                      <img src="../../assets/sensorOk.png" align="center">
                    </div>
                    <div v-else>Etat du capteur : hors ligne
                      <img src="../../assets/sensorNotOk.png" align="center">
                    </div>
                  </h5>

                  <card title="RSSI">
                   <h2 align="center">{{valve.rssi}}
                    <img v-if="valve.rssi!='no data' " :src="valve.rssiIcone" align="center">
                   </h2>
                  <p align="center">[dBm]</p>
                  </card>

                  <card title="SNR">
                     <h2 align="center">{{valve.snr}}
                      <img v-if="valve.snr !='no data' " :src="valve.snrIcone" align="center">
                    </h2>
                    <p align="center">[dB]</p>
                  </card>

                  <card title="Batterie">
                    <div v-if="valve.battery != undefined ">
                      <h2 align="center">{{valve.battery}}
                      <img v-if="valve.battery !='no data' " :src="valve.batteryIcone" align="center" width="70"
                         height="40">
                      </h2>
                      <p align="center">[%]</p>
                    </div>
                    <div v-else>
                      <h2 align="center">No Data</h2>
                      <p align="center">[%]</p>
                    </div>
                  </card>

                </div>
              </div>
            </v-tab>  
          </vue-tabs>
        </card>
      </div>

      <div class="col-lg-6">
          <h3>Hauteur d'eau</h3>
          <card>
          <vue-tabs value="Description">
            <v-tab v-for="valve in this.sensorsDragino" :title=valve.location :key=valve.location>
              <div class="row">
                <div class="col-lg-12">
                  <br>
                  <h5>Valeur lue le <b>{{new Date(valve.when).toLocaleString('fr-CH')}}</b>
                    <div v-if="(new Date() - new Date(valve.when)<=1200000 )">Etat du capteur : en ligne
                      <img src="../../assets/sensorOk.png" align="center">
                    </div>
                    <div v-else>Etat du capteur : hors ligne
                      <img src="../../assets/sensorNotOk.png" align="center">
                    </div>
                  </h5>

                  <card title="RSSI">
                   <h2 align="center">{{valve.rssi}}
                    <img v-if="valve.rssi!='no data' " :src="valve.rssiIcone" align="center">
                   </h2>
                  <p align="center">[dBm]</p>
                  </card>

                  <card title="SNR">
                     <h2 align="center">{{valve.snr}}
                      <img v-if="valve.snr !='no data' " :src="valve.snrIcone" align="center">
                    </h2>
                    <p align="center">[dB]</p>
                  </card>

                  <card title="Batterie">
                    <div v-if="valve.battery != undefined ">
                      <h2 align="center">{{valve.battery}}
                      <img v-if="valve.battery !='no data' " :src="valve.batteryIcone" align="center" width="70"
                         height="40">
                      </h2>
                      <p align="center">[%]</p>
                    </div>
                    <div v-else>
                      <h2 align="center">No Data</h2>
                      <p align="center">[%]</p>
                    </div>
                  </card>

                </div>
              </div>
            </v-tab>  
          </vue-tabs>
        </card>


      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import chirpstackCredentials from '../../constants/chirpstack.json'      //credentials for chirpstack server
import AntennaCard from "../../components/AntennaCard";
import { min } from 'd3';


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
      this.sensorsStrega = this.$stregaValveValues
      this.sensorsDragino = this.$draginoValues
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


      //test rtc synch
      this.encodeDateForRtc(new Date())

    },



    methods: {
      encodeDateForRtc : function(date){
        console.log(date)
        let hours = date.getHours().toString()
        let minutes = (date.getMinutes()<10?'0':'') + date.getMinutes().toString()
        let seconds = date.getSeconds().toString()
        let weekday = date.getDay().toString()
        let day = date.getDate().toString()
        let month = date.getMonth().toString()
        let year  = date.getFullYear().toString().substr(-2)

        let res = hours + minutes + seconds + weekday + day + month + year

        let resB64 = (btoa(res.match(/\w{2}/g).map(function(a){return String.fromCharCode(parseInt(a, 16));} ).join("")) )
        console.log(resB64)
      },
      
   
    },


   }

</script>

<style>
  .lightText {
    color: darkgrey;
  }
</style>
