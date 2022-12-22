import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserLoginSignUp from '../views/UserLoginSignUp.vue'
import ProductSpecs from '../views/ProductSpecs.vue'
import SearchResults from '../views/SearchResults.vue'
import PubblicaAnnuncio from '../views/PubblicaAnnuncio.vue'
import UserProfile from '../views/UserProfile.vue'
import UserReview from '../views/UserReview.vue'
import modificaDatiPersonali from '../views/modificaDatiPersonali.vue'
import classificaUtenti from '../views/classificaUtenti.vue'
import modificaAnnunci from '../views/modificaAnnunci.vue'
import recensioniUtente from '../views/recensioniUtente.vue'
import transazioniUtente from '../views/transazioniUtente.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/userloginsignup',
    name: 'userloginsignup',
    component: UserLoginSignUp
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
  },
  {
    path: '/userreview',
    name:'userreview',
    component: UserReview
  },
  {
    path: '/userprofile',
    name: 'userprofile',
    component: UserProfile
  },
  {
    path: '/modificaDatiPersonali',
    name: 'modificaDatiPersonali',
    component: modificaDatiPersonali
  },
  {
    path: '/classificaUtenti',
    name: 'classificaUtenti',
    component: classificaUtenti
  },
  {
    path: '/modificaAnnunci',
    name: 'modificaAnnunci',
    component: modificaAnnunci

  },
  {
    path: '/recensioniUtente',
    name: 'recensioniUtente',
    component: recensioniUtente
  },
  {
    path: '/transazioniUtente',
    name: 'transazioniUtente',
    component: transazioniUtente
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
