import DashboardLayout from 'src/pages/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from 'src/pages/GeneralViews/NotFoundPage.vue'
// Dashboard pages
import Overview from 'src/pages/Dashboard/Dashboard/Overview.vue'


//--------------------------------------------------------------------------------------------------------------

import Contact from "../pages/Dashboard/Contact";
import Technical from "../pages/Dashboard/Technical";
import Login from "../pages/Dashboard/Admin";

import Fountains from "../pages/Dashboard/Fountains";
import WaterLevel from "../pages/Dashboard/WaterLevel";

// Auth0 related
import Profile from "../components/Profile.vue";
import {authGuard} from "../auth";

let fountainsMenu ={
  path: '/Fontaines',
  component: DashboardLayout,
  children: [
   {
      path: 'Patinoire',
      name: 'Patinoire',
      component: Fountains
    },
    {
      path: 'Sonvillez',
      name: 'Sonvillez',
      component: Fountains
    }
    
  ]
}

let waterLevelMenu ={
  path: '/Hauteurdelac',
  component: DashboardLayout,
  children: [
   {
      path: 'Besson',
      name: 'Besson',
      component: WaterLevel
    }
    
  ]
}


//-------------------------------------------------------------------------------------------------------------------

const routes = [
  {
    path: "/profile",
    name: "profile",
    component: Profile,
    beforeEnter: authGuard
  },
  {
    path: '/',
    redirect: '/admin/overview'
  },
  {
    path: '/admin',
    component: DashboardLayout,
    redirect: '/admin/overview',
    children: [
      {
        path: 'overview',
        name: 'Vue générale',
        component: Overview
      },
      {
        path: 'Contact',
        name: 'Informations de contact',
        component: Contact,
      },
      {
        path : 'Technique',
        name : 'Informations techniques',
        component: Technical
      },
      {
        path : 'Administration',
        name : 'Administration',
        component : Login,
        beforeEnter: authGuard
      },

    ]
  },
  fountainsMenu,
  waterLevelMenu,

  {path: '*', component: NotFound}
]


export default routes
