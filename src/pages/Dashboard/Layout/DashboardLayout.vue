<template>
  <div class="wrapper" :class="{'nav-open': $sidebar.showSidebar}">
    <notifications></notifications>
    <side-bar :title="sideBarTitle">
      <mobile-menu></mobile-menu>
      <template slot-scope="props" slot="links">
        <hr class="mt-2 border-top">
        <sidebar-item :link="{name: 'Vue générale', icon: 'fa fa-home', path: '/admin/overview'}">
        </sidebar-item>
        <sidebar-item :link="{name: 'Fontaines', icon: 'nc-icon nc-tap-01'}" >

          <!----------------------------------------------------------------------------------------------------------->
          
          <sidebar-item  v-for="loc in sensorListJson.filter(s=>s.type==='Fontaine')" :key="loc.location" :link="{name: loc.realName, path: '/Fontaines/'+loc.location }"></sidebar-item>
          
        </sidebar-item>

        <sidebar-item :link="{name: 'Hauteur d\'eau', icon: 'nc-icon nc-chart-bar-32'}">
          <sidebar-item v-for="loc in sensorListJson.filter(s=>s.type==='Hauteur d\'eau')" :key="loc.location":link="{name: loc.realName, path: '/Hauteurdeau/'+loc.location} "></sidebar-item>
        </sidebar-item>


        <hr class="mt-2 border-top">
        <sidebar-item :link="{name: 'Infos techniques', icon: 'nc-icon nc-settings-90', path: '/admin/Technique'}"></sidebar-item>
        <hr class="mt-2 border-top" v-if="$auth.isAuthenticated">
        <sidebar-item v-if="$auth.isAuthenticated" :link="{name: 'Administration', icon: 'nc-icon nc-settings-gear-64', path: '/admin/Administration'}"></sidebar-item>
        <hr class="mt-2 border-top">
        <sidebar-item :link="{name: 'Contact', icon: 'fa fa-envelope', path: '/admin/Contact'}"></sidebar-item>
      </template>

    </side-bar>
    <div class="main-panel">
      <top-navbar></top-navbar>
      <dashboard-content @click.native="toggleSidebar">
      </dashboard-content>
      <content-footer></content-footer>
    </div>
  </div>
</template>

<script>
  import TopNavbar from './TopNavbar.vue'
  import ContentFooter from './ContentFooter.vue'
  import DashboardContent from './Content.vue'
  import MobileMenu from './Extra/MobileMenu.vue'
  import axios from "axios"


  export default {
    components: {
      TopNavbar,
      ContentFooter,
      DashboardContent,
      MobileMenu
    },
    data() {
      return {
        sideBarTitle : '',
        sensorListJson:[]
      }
    },
    mounted() {
      this.sideBarTitle = this.$PROJECT
      axios.get('https://snow-server.watermon.ch:443/vsdr_sensorList') 
        .then(res => {
          let tempVar=[]
          tempVar.push(res.data)
          var i = 0;
          tempVar[0].forEach(element => {
              if(element.project.toLowerCase() === this.sideBarTitle) {
                //this.sensorListJson[i]=element;
                this.sensorListJson.push(element)
              }
              //this.$SENSORSLISTJSON.push(element)
              i++
              },

          )
          //console.log(this.sensorListJson)
        })
        .catch(error => {
          console.log(error)
        })

    },
    methods: {
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false)
        }
      },



    }
  }

</script>

<style scoped>
  /deep/ #dropdown
  #drop{
    color: #0a6715;
  }
</style>

<style>
  /*Styling the small HR line*/
  .border-top {
    border-top: 1px solid rgba(255,255,255,.3) !important;
    width: calc(100% - 24px);
    margin-left: 12px;
  }
</style>
