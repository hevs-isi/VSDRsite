<template>
  <div>
   <h1>{{locationName}}</h1>
  </div>
</template>

<script>
    export default {
    name: "WaterLevel",
    
    component: {
      
    },
    data() {
      return {
        locationName: this.$route.name,             //route of the page
      }
    },
    mounted() {
    },
    watch: {
      '$route.route': {                               //watch if the route has change (this is how i now that i've change page)
        handler: function () {                        //if the route change, reload data
          this.locationName = this.$route.name

         
          
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
    }

}
  
</script>
<style scoped>
</style>
