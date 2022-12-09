import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserLogin from '../views/UserLogin.vue'
import UserSignUp from '../views/UserSignUp.vue'
import ProductSpecs from '../views/ProductSpecs.vue'
import SearchResults from '../views/SearchResults.vue'
import PubblicaAnnuncio from '../views/PubblicaAnnuncio.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/userlogin',
    name: 'userlogin',
    component: UserLogin
  },
  {
    path: '/usersignup',
    name: 'usersignup',
    component: UserSignUp
  },
  {
    path: '/productspecs',
    name: 'productspecs',
    component: ProductSpecs
  },
  {
    path: '/searchresults',
    name: 'searchresults',
    component: SearchResults
  },
  {
    path: '/pubblicaannuncio',
    name: 'pubblicaannuncio',
    component: PubblicaAnnuncio
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
