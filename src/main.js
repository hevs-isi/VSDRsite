import Vue from 'vue'
import VueRouter from 'vue-router'
import LightBootstrap from './light-bootstrap-main'

// Auth0 related
import {Auth0Plugin} from "./auth";
import {domain, clientId} from "../auth_config.json";

// Plugins
import App from './App.vue'

// Router setup
import routes from './routes/routes'

// highCharts
import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'
import mapInit from 'highcharts/modules/map'

// Custom Charts
import SnowChart from "./components/SnowChart";
import TemperatureChart from "./components/TemperatureChart";
import BatteryChart from "./components/BatteryChart";
import GaugeChart from "./components/GaugeChart";

// Responsive picture
import VueResponsiveImage from 'vue-responsive-image'

// Auth0
import {BootstrapVue, IconsPlugin} from 'bootstrap-vue'
import HighlightJs from "./directives/highlight";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faLink, faUser, faPowerOff, faSignInAlt, faInfo, faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// For highlight text (used in profile page for users)
Vue.directive("highlightjs", HighlightJs);

/**
 * Auth0 library loading
 */
Vue.use(Auth0Plugin, {
  domain,
  clientId,
  onRedirectCallback: appState => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    ).catch((err)=>{
      // Ignore the vuex err regarding  navigating to the page they are already on.
      if (
        err.name !== 'NavigationDuplicated' &&
        !err.message.includes('Avoided redundant navigation to current location')
      ) {
        // But print any other errors to the console
        logError(err);
      }
    });
  }
});

// Font awesome
library.add(faLink, faUser, faPowerOff, faSignInAlt, faInfo, faInfoCircle);
Vue.component("font-awesome-icon", FontAwesomeIcon);

// Plugins setup
Vue.use(VueRouter)
Vue.use(LightBootstrap)
Vue.use(VueResponsiveImage)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)

stockInit(Highcharts)
mapInit(Highcharts)
Vue.use(HighchartsVue)

Highcharts.setOptions({
  lang: {
    rangeSelectorFrom: "De",
    rangeSelectorTo: "à",
    shortMonths: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aout", "Sept", "Oct", "Nov", "Déc"],
    weekdays: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ve", "Sa"],
    downloadCSV: "Télécharger le CSV",
    viewFullscreen: "Plein écran",
    printChart: "Imprimer le graphique",
    downloadJPEG: "Télécharger format JPEG",
    downloadPDF: "Télécharger format PDF",
    downloadPNG: "Télécharger format PNG",
    downloadXLS: "Télécharger format XLS",
    downloadSVG: "Télécharger format SVG",
    exitFullscreen: "Quitter le plein écran"
  },
  credits: {
    enabled: false
  }
});

// height animations
//import 'vue-height-tween-transition/index.css'
//Vue.component('height-tween', require('vue-height-tween-transition'))

// set custom charts
Vue.component("SnowChart", SnowChart)
Vue.component("TemperatureChart", TemperatureChart)
Vue.component("BatteryChart", BatteryChart)
Vue.component("GaugeChart", GaugeChart)

// Load our functions
import MyPlugin from './globalFunctions'
Vue.use(MyPlugin)

// For exporting CSV data
import JsonCSV from 'vue-json-csv'
Vue.component('downloadCsv', JsonCSV)

// Router configuration
const router = new VueRouter({
  routes, // short for routes: routes
  linkActiveClass: 'active'
})

import {Collapse, CollapseItem} from 'element-ui'
Vue.use(Collapse)
Vue.use(CollapseItem)

import {Select, Option} from 'element-ui'
Vue.use(Select)
Vue.use(Option)

import {FormGroupInput as FgInput} from 'src/components'
Vue.component(FgInput)


new Vue({
  el: '#app',
  render: h => h(App),
  router
})


