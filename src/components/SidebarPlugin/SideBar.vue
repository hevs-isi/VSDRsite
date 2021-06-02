<template>
  <div class="sidebar"
       :style="sidebarStyle"
       :data-color="backgroundColor"
       :data-image="backgroundImage"
       :data-active-color="activeColor">

    <div class="sidebar-wrapper" ref="sidebarScrollArea">
      <div class="logo">
        <a class="logo-mini">
          <div class="logo-img">
            <img :src="logo" alt="logo">
          </div>
        </a>
        <a href="" class="simple-text logo-normal">
          {{title}}
        </a>
      </div>

      <ul class="nav">
        <slot name="links">
          <sidebar-item v-for="(link, index) in sidebarLinks"
                        :key="link.name + index"
                        :link="link">

            <sidebar-item v-for="(subLink, index) in link.children"
                          :key="subLink.name + index"
                          :link="subLink">
            </sidebar-item>
          </sidebar-item>
        </slot>
      </ul>

      <!--      <div align="center">-->
      <!--        <a href="https://www.hevs.ch/fr/" target="_blank">-->
      <!--          <img class="" src="https://www.hevs.ch/media/image/3/normal/1_HES_SO_VS_CMJN_picto.png" height="50em">-->
      <!--        </a>-->
      <!--      </div>-->
      <!--      <br>-->
      <!--      <div align="center">-->
      <!--        <a href="https://www.ayent.ch/" target="_blank">-->
      <!--          <img class="" :src="require('src/assets/svg/ayent.svg')" height="70em">-->
      <!--        </a>-->
      <!--      </div>-->
      <!--        <a href="https://www.hevs.ch/fr/" target="_blank">-->
      <!--          <img class="" src="https://www.hevs.ch/media/image/3/normal/1_HES_SO_VS_CMJN_picto.png" height="50em">-->
      <!--        </a>-->
    </div>
    <!--      <div class="d-flex bg-dark text-light align-items-center px-3 py-2">-->
    <!--        <strong class="mr-auto">Footer</strong>-->
    <!--        <b-button size="sm" @click="hide">Close</b-button>-->
    <!--      </div>-->

    <!--    <div class="px-3 py-2">-->
    <!--      <p>-->
    <!--        <b-img src="https://www.hevs.ch/media/image/3/normal/1_HES_SO_VS_CMJN_picto.png" fluid thumbnail></b-img>-->
    <!--        &lt;!&ndash;        <a href="https://www.hevs.ch/fr/" target="_blank">&ndash;&gt;&ndash;&gt;-->
    <!--        &lt;!&ndash;          &lt;!&ndash;          <img class="" src="https://www.hevs.ch/media/image/3/normal/1_HES_SO_VS_CMJN_picto.png" height="50em">&ndash;&gt;&ndash;&gt;-->
    <!--        &lt;!&ndash;          &lt;!&ndash;        </a>&ndash;&gt;&ndash;&gt;-->

    <!--      </p>-->
    <!--    </div>-->
  </div>


</template>

<script>
  export default {
    name: 'sidebar',
    props: {
      title: {
        type: String,
        default: 'Ayent Snow'
      },
      backgroundColor: {
        type: String,
        default: 'black',
        validator: (value) => {
          let acceptedValues = ['', 'blue', 'azure', 'green', 'orange', 'red', 'purple', 'black']
          return acceptedValues.indexOf(value) !== -1
        }
      },
      backgroundImage: {
        type: String,
        default: 'static/img/sidebar-7.jpg'
      },
      activeColor: {
        type: String,
        default: 'success',
        validator: (value) => {
          let acceptedValues = ['primary', 'info', 'success', 'warning', 'danger']
          return acceptedValues.indexOf(value) !== -1
        }
      },
      logo: {
        type: String,
        default: 'static/img/logo.png'
      },
      sidebarLinks: {
        type: Array,
        default: () => []
      },
      autoClose: {
        type: Boolean,
        default: true
      }
    },
    provide() {
      return {
        autoClose: this.autoClose
      }
    },
    computed: {
      sidebarStyle() {
        return {
          backgroundImage: `url(${this.backgroundImage})`
        }
      }
    },
    methods: {
      async initScrollBarAsync() {
        await import('perfect-scrollbar/dist/css/perfect-scrollbar.css')
        const PerfectScroll = await import('perfect-scrollbar')
        PerfectScroll.initialize(this.$refs.sidebarScrollArea)
      }
    },
    mounted() {
      this.initScrollBarAsync()
    },
    beforeDestroy() {
      if (this.$sidebar.showSidebar) {
        this.$sidebar.showSidebar = false
      }
    }
  }

</script>
<style>
  @media (min-width: 992px) {
    .navbar-search-form-mobile,
    .nav-mobile-menu {
      display: none;
    }
  }

</style>
