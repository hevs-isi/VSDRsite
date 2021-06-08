<template>
  <div class="info" id="contact">
    <h1 class="p-0" style="margin-top: 0">VSDR : {{this.contactTitle}}</h1>
    <hr>

    <h3>Bienvenue</h3>
    <p v-if="contactTitle==='Grimisuat'">
      Bienvenue sur le site du projet <b>Valais Smart Dynamic Region {{this.contactTitle}}</b>, une collaboration entre la <a href="https://www.grimisuat.ch/">commune
      de {{this.contactTitle}}</a> et la <a href="https://www.hevs.ch/fr/hautes-ecoles/haute-ecole-d-ingenierie/">Haute école
      d'Ingénierie</a> de la HES-SO Valais-Wallis.
    </p>
    <p v-if="contactTitle==='Saviese'">
      Bienvenue sur le site du projet <b>Valais Smart Dynamic Region {{this.contactTitle}}</b>, une collaboration entre la <a href="https://www.saviese.ch/">commune
      de {{this.contactTitle}}</a> et la <a href="https://www.hevs.ch/fr/hautes-ecoles/haute-ecole-d-ingenierie/">Haute école
      d'Ingénierie</a> de la HES-SO Valais-Wallis.
    </p>

    <h3>Objectifs du projet</h3>
    <p>
      L'objectif de ce projet est de mettre en place un système de surveillance de hauteur d'eau dans des lacs ainsi que de piloter à distance des 
      fontaines, ceci afin de faciliter et optimiser le travail du service technique et faire des économies d'eau.
      Ce réseau de surveillance est composé de plusieurs capteurs qui permettent de connaître la hauteur d'eau des lacs, le débit et la consommation des fontaines. 
      Il est ainsi possible de déclencher des alertes au service technique de la commune lorsque la hauteur d'eau varie de manière significative.
    </p>

    <h3>Considérations techniques</h3>
    <p>
      Ce système de monitoring fonctionne sur batterie et utilise une technologie de communication à très basse
      consommation et longue distance nommé LoRa. Cette communication sans fil est très peu énergétique. En effet, les
      énergies d'émission en jeu sont de l'ordre de celles émise par les thermomètres sans fils que l'on peut acheter
      dans les grandes surfaces et qui communiquent avec un affichage dans la maison.
    </p>

    <h3>Informations de contact</h3>
    <p v-if="contactTitle==='Grimisuat'">
      Pour plus d'information, vous pouvez contacter pour la commune de Grimisuat M. XXXXXX, responsable des travaux
      publics et pour la Haute école d'Ingénierie, <a
      href="https://www.hevs.ch/fr/rad-instituts/institut-systemes-industriels/collaborateurs/professeure-hes/mudry-1640">Prof.
      Pierre-André Mudry</a>
    </p>
    <p v-if="contactTitle==='Saviese'">
      Pour plus d'information, vous pouvez contacter pour la commune de Saviese M. XXXX, responsable des travaux
      publics et pour la Haute école d'Ingénierie, <a
      href="https://www.hevs.ch/fr/rad-instituts/institut-systemes-industriels/collaborateurs/professeure-hes/mudry-1640">Prof.
      Pierre-André Mudry</a>
    </p>

    <br>
    <hr>
    <br>

      <b-container>
          <b-carousel
            id="carousel-fade"
            style="text-shadow: 0px 0px 3px #000"
            fade
            indicators
            v-model="slide"
            img-width="880"
            img-height="600"
          >
            <b-carousel-slide
              caption="Pralan"
              :img-src="require('../../assets/installation/pralan1.jpeg')"
            ></b-carousel-slide>

            <b-carousel-slide
              caption="Pralan"
              :img-src="require('../../assets/installation/pralan2.jpeg')"
            ></b-carousel-slide>

            <b-carousel-slide
              caption="Pro de Savioz"
              :img-src="require('../../assets/installation/prodesavioz1.jpeg')"
            ></b-carousel-slide>

            <b-carousel-slide
              caption="Le Sex Rouge"
              :img-src="require('../../assets/installation/prodesavioz2.jpeg')"
            ></b-carousel-slide>

            <b-carousel-slide
              caption="Pro de Savioz"
              :img-src="require('../../assets/installation/prodesavioz3.jpeg')"
            ></b-carousel-slide>

       <!--     <b-carousel-slide
              caption="Le Rawyl"
              text="Source: site web d'Ayent"
              :img-src="require('../../assets/installation/pralan1.jpeg')"
            ></b-carousel-slide>

            <b-carousel-slide
              caption="Lourantze"
              text="Source: site web d'Ayent"
              :img-src="require('../../assets/installation/pralan1.jpeg')"
            ></b-carousel-slide>

            <b-carousel-slide
              caption="L'étang de Lombardon"
              text="Source: site web d'Ayent"
              :img-src="require('../../assets/installation/pralan1.jpeg')"
            ></b-carousel-slide>

            <b-carousel-slide
              caption="La Lienne"
              text="Source: site web d'Ayent"
              :img-src="require('../../assets/installation/pralan1.jpeg')"
            ></b-carousel-slide>-->
          </b-carousel>
    </b-container>

  </div>
</template>

<script>
  import VueResponsiveImage from 'vue-responsive-image'

  export default {
    name: "Contact",
    components: {
      VueResponsiveImage
    },
    data(){
      return {
        slide:0,
        contactTitle : this.capitalizeFirstLetter(location.hostname.split('.')[0]),
        communeUrl : this.setCommuneUrl(location.hostname.split('.')[0]),
      }
    },
    created() {
      this.$PROJECT = location.hostname.split('.')[0]
    },
    methods:{
        capitalizeFirstLetter : function(project) {
          if(project === "st-leo"){
            return "St-Léonard"
          }else{
            return project.charAt(0).toUpperCase() + project.slice(1)
          }
        },

        setCommuneUrl : function(project){
          if(project === "ayent"){
            return "https://www.ayent.ch"
          }else if(project === "st-leo"){
            return "https://www.st-leonard.ch/"
          }
        }
    }
  }
</script>

<style scoped>
  #contact {
    text-align: left;
  }

  h1 {
    text-align: center;
  }

  /*.carousel {*/
  /*  width:600px*/
  /*}*/
</style>
