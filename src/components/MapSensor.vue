<template>
<div>
  <b-overlay rounded="sm" :opacity="0.75" variant='light'>

    <b-card>
      <h4 class="card-title">Emplacements mesurés &nbsp; &nbsp;
        <!-- Nice CSS animation for information circle -->
        <i
          v-bind:class="[hovered ? 'fa fa-info-circle text-muted animate__animated animate__rubberBand' : 'fa fa-info-circle text-muted']"
          v-on:mouseover="hovered=true" v-on:mouseout="hovered=false" @click="info = !info">
        </i>
      </h4>

      <br>
      <l-map
        target="themap"
        style="min-height: 500px; width: 100%"
        :zoom="zoom"
        :center="center"
        @update:zoom="zoomUpdated"
        @update:center="centerUpdated"
        @update:bounds="boundsUpdated"
        @click="printPosition"

        class="leaflet-control-layers-list">
        <l-control-layers ref="control"/>
        <l-tile-layer
          v-for="tileProvider in tileProviders"
          :key="tileProvider.name"
          :name="tileProvider.name"
          :visible="tileProvider.visible"
          :url="tileProvider.url"
          :attribution="tileProvider.attribution"
          layer-type="base"/>
        <l-layer-group
          layer-type="overlay"
          name="Capteurs"
          :visible="true">
          <div v-for="(sensor,index) in sensors.filter( s=>s.type === 'hei')">
            <div v-if=" sensor.frostRiskValue == -1">
              <l-marker :lat-lng="[sensor.lat+0.0001,sensor.lng+0.0001]" :key="index + 100" :icon="deviceIcon">
                <l-popup>
                  <div>
                    <div>
                      <h5>Risque de givre : nul</h5>
                    </div>
                  </div>
                </l-popup>
              </l-marker>
            </div>
            <div v-else-if=" sensor.frostRiskValue == 0">
              <l-marker :lat-lng="[sensor.lat+0.0001,sensor.lng+0.0001]" :key="index + 100"
                        :icon="deviceIconLightFrost">
                <l-popup>
                  <div>
                    <div>
                      <h5>Risque de givre : modéré</h5>
                    </div>
                  </div>
                </l-popup>
              </l-marker>
            </div>
            <div v-else-if="sensor.frostRiskValue == 1">
              <l-marker :lat-lng="[sensor.lat+0.0001,sensor.lng+0.0001]" :key="index + 100"
                        :icon="deviceIconFrost">
                <l-popup>
                  <div>
                    <div>
                      <h5>Risque de givre : élevé</h5>
                    </div>
                  </div>
                </l-popup>
              </l-marker>
            </div>
      <!--      <div v-else-if="sensor.snow-sensor.snowOffset[0] <= 50 && sensor.frostRiskValue == 0">
              <l-marker :lat-lng="[sensor.lat+0.0001,sensor.lng+0.0001]" :key="index + 100"
                        :icon="deviceIconLightFrost">
                <l-popup>
                  <div>
                    <div>
                      <h5>Hauteur de neige : {{ ((sensor.snow-sensor.snowOffset[0])/10).toFixed(0)}}cm</h5>
                      <h5>Risque de givre : modéré</h5>
                    </div>
                  </div>
                </l-popup>
              </l-marker>
            </div>
            <div v-else-if="sensor.snow-sensor.snowOffset[0] <= 50 && sensor.frostRiskValue == 1">
              <l-marker :lat-lng="[sensor.lat+0.0001,sensor.lng+0.0001]" :key="index + 100" :icon="deviceIconFrost">
                <l-popup>
                  <div>
                    <div>
                      <h5>Hauteur de neige : {{ ((sensor.snow-sensor.snowOffset[0])/10).toFixed(0)}}cm</h5>
                      <h5>Risque de givre : élevé</h5>
                    </div>
                  </div>
                </l-popup>
              </l-marker>
            </div>
            <div v-else>
              <l-marker :lat-lng="[sensor.lat+0.0001,sensor.lng+0.0001]" :key="index + 100" :icon="deviceIcon">
                <l-popup>
                  <div>
                    <div>
                      <h5>Lieu : {{sensor.realName}}</h5>
                      <h5>Valeur lue le : {{new Date(sensor.when).toLocaleString('fr-CH')}}</h5>
                    </div>
                  </div>
                </l-popup>
              </l-marker>
            </div>-->
          </div>
<!--special case for prodesavioz where there is no snow lovel sensor-->
          <div v-for="(sensor,index) in sensors.filter( s=>s.type === 'decentlab')">
            <div v-if="sensor.frostRiskValue == 1 && sensor.where==='prodesavioz'">
              <l-marker :lat-lng="[sensor.lat+0.0001,sensor.lng+0.0001]" :key="index + 100"
                        :icon="deviceIconFrost">
                <l-popup>
                  <div>
                    <div>
                      <h5>Hauteur de neige : {{ ((sensor.snow-sensor.snowOffset[0])/10).toFixed(0)}}cm</h5>
                      <h5>Risque de givre : élevé</h5>
                    </div>
                  </div>
                </l-popup>
              </l-marker>
            </div>
            <div v-if="sensor.frostRiskValue == 0 && sensor.where==='prodesavioz'">
              <l-marker :lat-lng="[sensor.lat+0.0001,sensor.lng+0.0001]" :key="index + 100"
                        :icon="deviceIconLightFrost">
                <l-popup>
                  <div>
                    <div>
                      <h5>Hauteur de neige : {{ ((sensor.snow-sensor.snowOffset[0])/10).toFixed(0)}}cm</h5>
                      <h5>Risque de givre : élevé</h5>
                    </div>
                  </div>
                </l-popup>
              </l-marker>
            </div>
            <div v-if="sensor.frostRiskValue == -1 && sensor.where==='prodesavioz'">
              <l-marker :lat-lng="[sensor.lat+0.0001,sensor.lng+0.0001]" :key="index + 100" :icon="deviceIcon">
                <l-popup>
                  <div>
                    <div>
                      <h5>Lieu : {{sensor.realName}}</h5>
                      <h5>Valeur lue le : {{new Date(sensor.when).toLocaleString('fr-CH')}}</h5>
                    </div>
                  </div>
                </l-popup>
              </l-marker>
            </div>
          </div>

        </l-layer-group>
      </l-map>

      <!-- Additional map information-->
      <div v-if="info" class="animate__animated animate__fadeInDown" transition="zoomInOut">
        <b-container>
          <b-row cols="1" cols-sm="1" cols-md="2" cols-lg="2">
            <b-col class="py-1">
              <b-media>
                <template #aside>
                  <b-img src="static/img/gps.png" align="center" width="32" height="32"></b-img>
                </template>
                Emplacement des capteurs
              </b-media>
            </b-col>
            <b-col class="py-1">
              <b-media>
                <template #aside>
                  <b-img src="static/img/warningFrost.png" align="center" width="32" height="32"></b-img>
                </template>
                Risque de givre élevé
              </b-media>
            </b-col>
            <b-col class="py-1">
              <b-media>
                <template #aside>
                  <b-img src="static/img/warningLightFrost.png" align="center" width="32" height="32"></b-img>
                </template>
                Risque de givre modéré
              </b-media>
            </b-col>
            <b-col class="py-1">
  <!--            <b-media>
                <template #aside>
                  <b-img src="static/img/snowwarning.png" align="center" width="32" height="32"></b-img>
                </template>
                Présence de neige
              </b-media><-->
            </b-col>
          </b-row>
        </b-container>
      </div>
    </b-card>
  </b-overlay>
</div>
</template>

<script>
import {Card, StatsCard, Table as LTable} from "@/components/index";
import {LControlLayers, LLayerGroup, LMap, LMarker, LPopup, LTileLayer} from "vue2-leaflet";
import L from "leaflet";

export default {
  name: "Map",
  components: {
    Card, StatsCard, LMap, LTileLayer, LMarker, LPopup, LControlLayers, LLayerGroup, LTable
  },
  props:{
      sensors: '',
      center: '',

  },
  data() {
    return {
      hovered: false,
      info: false,
      tileProviders: [
        {
          name: 'OpenTopoMap',
          visible: false,
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        },
        {
          name: 'OSM',
          visible: true,
          attribution:
            '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        },
        {
          name: 'Stadia',
          visible: false,
          url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=d4378e12-a0a7-4ae4-a2ff-508d8a238448',
          attribution:
            '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org">OpenMapTiles</a>, &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
        },
        {
          name: 'OpenStreetMap',
          visible: true,
          attribution:
            '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          url: 'https://tile.osm.ch/switzerland/{z}/{x}/{y}.png',
        },
      ],
      deviceIconFrost: L.icon({
        iconUrl: require('../../public/static/img/warningFrost.png'),
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -20]
      }),
      deviceIconLightFrost: L.icon({
        iconUrl: require('../../public/static/img/warningLightFrost.png'),
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -20]
      }),
      deviceIconSnow: L.icon({
        iconUrl: require('../../public/static/img/snowwarning.png'),
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -20]
      }),
      deviceIconFrostAndSnow: L.icon({
        iconUrl: require('../assets/frostAndSnowRisk.png'),
        iconSize: [64, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -20]
      }),
      deviceIconLightFrostAndSnow: L.icon({
        iconUrl: require('../assets/lightFrostAndSnowRisk.png'),
        iconSize: [64, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -20]
      }),
      deviceIcon: L.icon({
        iconUrl: require('../../public/static/img/gps.png'),
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -20]
      }),

      series_chart: [{                                                        //serie of the 3 sensors, used just in this page
        data: [],
      }],

      arrow: require('../assets/svg/left_arrow.svg'),
      showStatus: false,                                                     // right button to show antenna status
      timer: null,
      timerIsRunning: false,
      seconds: 30,

      // Leaflet
      maxZoom: 10,
      zoom: 12.5, //13.5
      bounds: null,

      markers: [
        [46.096715752047594, 7.214045226573945],
        [46.093561170654304, 7.212307155132295],
      ],
    }


  },
  mounted() {

    },
  methods:{
    zoomUpdated(zoom) {
      this.zoom = zoom;
    },
    centerUpdated(center) {
  //    this.center = center;
    },
    boundsUpdated(bounds) {
      this.bounds = bounds;
    },
    /**
     * print position clicked with the mouse
     */
    printPosition(event) {
      console.log(event.latlng);
    },
  }
}
</script>

<style scoped>
@import "../../node_modules/leaflet/dist/leaflet.css";

</style>
