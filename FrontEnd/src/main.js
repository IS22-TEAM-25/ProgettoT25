import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$categories = [
  { title: 'tecnologia', src: 'Elettronica.png', flex: 3, route: '/searchresult' },
  { title: 'animali', src: 'Animali.png', flex: 3, route: '/searchresult' },
  { title: 'fai da te', src: 'Fai da te.png', flex: 3 },
  { title: 'hobby', src: 'Hobby.png', flex: 3 },
  { title: 'sport', src: 'Sport.png', flex: 3 },
  { title: 'party', src: 'Party.png', flex: 3 },
  { title: 'per la casa', src: 'Per la casa.png', flex: 3 },
  { title: 'trasporti', src: 'Trasporti.png', flex: 3 }
]

Vue.prototype.$url = "http://localhost:8080/"


new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
