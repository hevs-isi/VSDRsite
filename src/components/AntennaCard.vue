<template>
  <div>
    <b-overlay :show=pending rounded="sm" :opacity="0.75" variant='light'>
      <b-card :title=location :sub-title=eui>
        <b-media right-align vertical-align="center">
          <template v-slot:aside>
            <b-img src="static/img/antennaDown.png" blank-color="#ccc" width="50" height="50" alt="placeholder"
                   v-if="status === 'down'"></b-img>
            <b-img src="static/img/antennaUp.png" blank-color="#ccc" width="50" height="50" alt="placeholder"
                   v-if="status === 'up'"></b-img>
          </template>
          <b-card-body>
            <b-card-text>
              <div v-if="status === 'up'"><b>Etat</b> : En ligne</div>
              <div v-if="status === 'down'"><b>Etat</b> : Hors ligne</div>
              <div><b>Dernier status</b> : {{time}}</div>
            </b-card-text>
          </b-card-body>
        </b-media>
      </b-card>
        {{$stregaValveValues[0]}}

    </b-overlay>

  </div>
</template>

<script>
  export default {
    name: "AntennaCard",
    props: {
      location: String,
      eui: String,
      status: String,
      timeStamp: String,
      pending: Boolean,
      time : String
    },
    data() {
      return {}
    },
    mounted() {
      //console.log("Date", this.timeStamp)
    }
  }
</script>

<style scoped>
</style>
