import DashboardLayout from 'src/pages/Dashboard/Layout/DashboardLayout.vue'
// GeneralViews
import NotFound from 'src/pages/GeneralViews/NotFoundPage.vue'
// Dashboard pages
import Overview from 'src/pages/Dashboard/Dashboard/Overview.vue'


//--------------------------------------------------------------------------------------------------------------
import Temperature from "../pages/Dashboard/Temperature/Temperature";

import Snow from "../pages/Dashboard/Neige/Snow"

import Contact from "../pages/Dashboard/Contact";
import Technical from "../pages/Dashboard/Technical";
import Login from "../pages/Dashboard/Admin";

// Auth0 related
import Profile from "../components/Profile.vue";
import {authGuard} from "../auth";


//-------------------------------------------------------------------------------------------------------------------
let temperatureMenu ={
  path: '/Temperature',
  component: DashboardLayout,
  //redirect: '/Temperature/Télécabine',
  children: [
   {
      path: 'telecabine',
      name: 'telecabine',
      component: Temperature
    },
    {
      path: 'pralan',
      name: 'pralan',
      component: Temperature
    },
    {
      path: 'prodesavioz',
      name: 'prodesavioz',
      component: Temperature
    },
    {
      path: 'stepstleo',
      name: 'stepstleo',
      component: Temperature
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
   temperatureMenu,
  neigeMenu,

  {path: '*', component: NotFound}
]


export default routes
