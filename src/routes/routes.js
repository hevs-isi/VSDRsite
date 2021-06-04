import DashboardLayout from 'src/pages/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from 'src/pages/GeneralViews/NotFoundPage.vue'
// Dashboard pages
import Overview from 'src/pages/Dashboard/Dashboard/Overview.vue'


//--------------------------------------------------------------------------------------------------------------

import Snow from "../pages/Dashboard/Neige/Snow"

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


//-------------------------------------------------------------------------------------------------------------------
let neigeMenu ={
  path: '/neige',
  component: DashboardLayout,
 // redirect: '/neige/Télécabine',
  children: [
    {
      path: 'telecabine',
      name: 'telecabine',
      component: Snow
    },
    {
      path: 'pralan',
      name: 'pralan',
      component: Snow
    },
    {
      path: 'prodesavioz',
      name: 'prodesavioz',
      component: Snow
    },
    {
      path: 'stepstleo',
      name: 'stepstleo',
      component: Snow
    },
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
  neigeMenu,

  {path: '*', component: NotFound}
]


export default routes
