<template>
  <router-view></router-view>
</template>

<script>
  import NotificationSample from 'src/pages/Dashboard/Components/NotificationSample';
  export default {
    mounted () {
      /**
       * Launched at startup functions
       */
      /* this.$notify(
         {
           component: NotificationSample,
           icon: 'fa fa-snowflake-o',
           topCenter: false,
           horizontalAlign: 'center',
           verticalAlign: 'center',
           type: 'info'
         })*/
      //console.log("This is runned at startup, file src/App.vue L.21")
    }
  }
</script>

<style>
  /**
    Application wide CSS
   */

  .content{
    background-color: #f7f7f8;
  }
  .card{
    box-shadow: 0 2px 2px rgba(204,197,185,.5)
  }
  *{
    font-family: Roboto;
  }
  h1{
    font-family: Roboto;

  }
  h2{
    font-family: Roboto;

  }
  h3{
    font-family: Roboto;

  }
  h4{
    font-family: Roboto;
  }
  h5{
    font-family: Roboto;
  }
  p{
    font-family: Roboto;
  }
</style>
