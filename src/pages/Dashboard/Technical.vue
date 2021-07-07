<template>
  <div>
   <h1>Technical page</h1>
  </div>
</template>

<script>

import axios from 'axios'
import chirpstackCredentials from '../../constants/chirpstack.json'      //credentials for chirpstack server


   export default {
  components: {  },
    name: "Technical",
    
    
        
    data() {
      return {
        gateway : [],
        sensor : [],




      }
    },
    mounted() {
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

          }else if(this.$SENSORSLISTJSON[i].type === 'Fontaine' || this.$SENSORSLISTJSON[i].type === "Hauteur d'eau"){
            var sen = {
              position_name: this.$SENSORSLISTJSON[i].location,
              position: this.$SENSORSLISTJSON[i].coordinates, 
              isUp : null,
              rssi : null,
              snr : null
            }
            this.sensor.push(sen)
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
            console.log(res[i].data)
            //TODO : get gw info and check if online or not
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
