<template>
  <div>
      <div class="row">
        <div class="col-lg-4">
          <b-card>
            <h4 class="card.title">Il y à 3 heures</h4>
              <h1 align="center"> mm</h1>
          </b-card>        
        </div>
        <div class="col-lg-4">
          <b-card>
            <h4 class="card.title">Il y à 1 heure </h4>
              <h1 align="center"> mm</h1>
          </b-card>        
        </div>
        <div class="col-lg-4">
          <b-card>
            <h4 class="card.title">Actuellement </h4>
              <h1 align="center"> mm</h1>
          </b-card>        
        </div>           
      </div>  
      
<!--chart-->      
      <div class="col-lg-4">
        <b-card>
            <h4 class="card.title">WaterHeight chart </h4>
            
        </b-card>        
      </div>           

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
