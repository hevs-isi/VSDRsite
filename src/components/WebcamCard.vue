
<template>
  <div class="col-lg-12">
    <h4> Webcam {{location}} </h4>
    <b-card>
      <b-img :src="src" fluid alt="Responsive image"></b-img>
    </b-card>
  </div>

</template>

<script>

export default {
name: "WebcamCard",
  props:{
    src : '',
    location: ''
  },
  data () {
    return {
      srcImg : "http://172.22.22.128/cgi-bin/api.cgi?cmd=Snap&channel=0&rs=wuuPhkmUCeI9WG7C&user=admin&password=Amos.jerome1",


    }
  },






}
</script>

<style scoped>

</style>
