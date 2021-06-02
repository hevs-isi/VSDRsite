<template>
  <nav class="navbar navbar-expand-lg ">
    <div class="container-fluid">

      <div class="navbar-minimize">
        <button class="btn btn-outline btn-fill btn-round btn-icon d-none d-lg-block" @click="minimizeSidebar">
          <i :class="$sidebar.isMinimized ? 'fa fa-ellipsis-v' : 'fa fa-navicon'"></i>
        </button>
      </div>

      <!--Title vue globale-->
      <a class="navbar-brand" v-if="this.$route.fullPath=='/admin/overview'">Tableau de bord</a>
      <!--Title temperature-->
      <a class="navbar-brand" v-if="this.$route.fullPath=='/temperature/telecabine'">Température - Télécabine</a>
      <!--{{this.$route.name}}-->
      <a class="navbar-brand" v-if="this.$route.fullPath=='/temperature/pralan'">Température - Pralan</a>
      <a class="navbar-brand" v-if="this.$route.fullPath=='/temperature/prodesavioz'">Température - Pro de Savioz</a>
      <!--Title neige-->
      <a class="navbar-brand" v-if="this.$route.fullPath=='/neige/telecabine'">Hauteur de neige - Télécabine</a>
      <a class="navbar-brand" v-if="this.$route.fullPath=='/neige/pralan'">Hauteur de neige - Pralan</a>
      <a class="navbar-brand" v-if="this.$route.fullPath=='/neige/prodesavioz'">Hauteur de neige - Pro de Savioz</a>
      <!--Titel contact-->
      <a class="navbar-brand" v-if="this.$route.fullPath=='/admin/Contact'">{{ this.$route.name }}</a>
      <!--Titel Technique-->
      <a class="navbar-brand" v-if="this.$route.fullPath=='/admin/Technique'">{{ this.$route.name }}</a>
      <!--Titel Administration-->
      <a class="navbar-brand" v-if="this.$route.fullPath=='/admin/Administration'">{{ this.$route.name }}</a>


      <!-- Login menu     -->
      <ul class="navbar-nav">
        <li class="nav-item dropdown" v-if="$auth.isAuthenticated">
          <div class="dropdown-menu dropdown-menu-right">
            <div class="dropdown-header">{{ $auth.user.name }}</div>
            <router-link to="/profile" class="dropdown-item dropdown-profile">
              <font-awesome-icon class="mr-3" icon="user"/>
              Profile
            </router-link>
            <a id="qsLogoutBtn" href="#" class="dropdown-item" @click.prevent="logout">
              <font-awesome-icon class="mr-3" icon="power-off"/>
              Log out
            </a>
          </div>

        </li>
      </ul>


      <!-- For smaller screens -->
      <button type="button"
              class="navbar-toggler navbar-toggler-right"
              :class="{toggled: $sidebar.showSidebar}"
              aria-expanded="false"
              @click="toggleSidebar">
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
        <span class="navbar-toggler-bar burger-lines"></span>
      </button>

      <div class="collapse navbar-collapse justify-content-end">


        <!-- Login button in desktop mode -->
        <ul v-if="!$auth.isAuthenticated && !$auth.loading" class="navbar-nav ml-auto">

          <li class="nav-item">
            <a class="nav-link" href="#" @click.prevent="login">
              <a>
                <font-awesome-icon class="mr-2" icon="sign-in-alt"/>
                Login</a>
            </a>
          </li>
        </ul>

        <!-- When user is logged in in desktop mode -->
        <ul class="navbar-nav">
          <drop-down v-if="$auth.isAuthenticated" position="right">
            <i slot="title">
              <img
                :src="$auth.user.picture"
                alt="User's profile picture"
                class="nav-user-profile rounded-circle"
                width="40"
              />
            </i>


            <div class="dropdown-item-text"><i>{{ $auth.user.name }}</i></div>
            <div class="divider"></div>

            <a href="#" class="dropdown-item">
              <router-link to="/profile" class="dropdown-item dropdown-profile">
                <font-awesome-icon class="mr-md-2" icon="user"/>
                Profil
              </router-link>
            </a>

            <a href="#" class="dropdown-item" @click.prevent="logout">
              <router-link to="#/" class="dropdown-item dropdown-profile">
                <font-awesome-icon class="mr-md-2" icon="power-off"/>
                Déconnexion
              </router-link>
            </a>

          </drop-down>


        </ul>

        <a class="navbar-brand" href="https://www.hevs.ch/fr/" target="_blank">
          <b-img src="https://www.hevs.ch/media/image/3/normal/1_HES_SO_VS_CMJN_picto.png" height="43em"
                 style="padding-right: 1em;padding-left:1em"></b-img>
        </a>
        <a v-if="this.$PROJECT === 'ayent'" class="navbar-brand" href="https://www.ayent.ch/" target="_blank">
          <img class="" :src="require('src/assets/svg/ayent.svg')" height="75em" style="padding-left: 1em">
        </a>
        <a v-if="this.$PROJECT === 'st-leo'" class="navbar-brand" href="https://www.st-leonard.ch/" target="_blank">
          <img class="" :src="require('src/assets/svg/St-leo.svg')" height="75em" style="padding-left: 1em">
        </a>



      </div>
    </div>
  </nav>
</template>

<script>
  export default {
    computed: {
      routeName() {
        const {name} = this.$route
        return this.capitalizeFirstLetter(name)
      }
    },
    data() {
      return {
        activeNotifications: false,
      }
    },
    created() {
      //this.$PROJECT = location.hostname.split('.')[0]

    },

    methods: {

      capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1)
      },
      toggleNotificationDropDown() {
        this.activeNotifications = !this.activeNotifications
      },
      closeDropDown() {
        this.activeNotifications = false
      },
      toggleSidebar() {
        this.$sidebar.displaySidebar(!this.$sidebar.showSidebar)
      },
      hideSidebar() {
        this.$sidebar.displaySidebar(false)
      },
      minimizeSidebar() {
        this.$sidebar.toggleMinimize()
      },
      login() {
        this.$auth.loginWithRedirect('fr')
      },
      logout() {
        //this.$router.push({path: "/"}); // Don't know why this one ??
        this.$auth.logout({
          returnTo: window.location.origin
        })
      }
    }
  }

</script>

<style>
  #mobileAuthNavBar {
    min-height: 125px;
    justify-content: space-between;
  }
</style>
