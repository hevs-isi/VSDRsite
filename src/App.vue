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
      // this.$notify(
      //   {
      //     component: NotificationSample,
      //     icon: 'fa fa-snowflake-o',
      //     topCenter: false,
      //     horizontalAlign: 'center',
      //     verticalAlign: 'center',
      //     type: 'info'
      //   })
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
</style>
