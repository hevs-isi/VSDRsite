<template>
  <div>
    <div class="p-0 shadow-sm rounded" style="display:block; margin: 0 auto;height:380px"
         v-if="window.width <= 360">

      <iframe class="d-inline-block" scrolling="no" :src="src"
              frameborder="0" style="border:0; height:100%;width:100%" allowfullscreen></iframe>
    </div>

    <div class="card" v-if="window.width > 360">
      <div class="p-2 w-100 vh-100 height-correction" style="min-height:430px; display:block; margin: 0 auto">
        <iframe class="h-100 w-100 d-inline-block" :src="src"
                frameborder="0" style="border:0" allowfullscreen></iframe>
      </div>
    </div>
  </div>
</template>

<script>
export default {
name: "Meteo",
  props:{
    src : ''
  },

  data() {
    return {
      window: {                                                             //Windows size, used for meteo widget
        width: window.innerWidth,
        height: window.innerHeight,
      }
    }
  },
}
</script>

<style scoped>
.height-correction {
  height: calc(51vh) !important;
}
</style>
