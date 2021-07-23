<template>
  <footer class="footer">
    <div class="container-fluid d-flex flex-wrap justify-content-between">
      <!--      <nav>-->
      <!--        <ul class="footer-menu">-->
      <!--          <li>-->
      <!--            <router-link :to="{path:'/admin'}">Page principale</router-link>-->
      <!--          </li>-->
      <!--        </ul>-->
      <!--      </nav>-->
      <div class="copyright">
        &copy; Coded with <i class="fa fa-heart heartBeatAnimation"></i> at <a
        href="https://www.hevs.ch/fr/hautes-ecoles/haute-ecole-d-ingenierie/" target="_blank">HEI,
        HES-SO Valais/Wallis</a> - Build {{ version }}
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      // Do not rename the following, it is updated
      // automatically by the build script located
      // in packages.json
      version: '56710f8f-22.07.21'
    }
  },
}
</script>

<style>
.footer {

}

.footer .copyright {
  color: #797979;
  padding: 5px 10px;
  margin: 5px 3px;
  line-height: 20px;
  font-size: 14px;
}
</style>
