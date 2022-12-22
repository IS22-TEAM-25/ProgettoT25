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

Vue.mixin({
  methods: {
    
    /** computa il numero di annunci online 
     * (dopo vendita modifica e pubblica)
     * @param {*} nomeUtente a cui va aggiornato il numero di annunci online 
     */
    async contaAnnunciOnline(nomeUtente) {
      try {
        fetch(this.$url + "api/p/updateao", {
          method: 'PATCH',
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({ 
            id: nomeUtente,
          })
        }).then(console.log("Numero annunci aggiornati per ", nomeUtente, "!"))
      } catch (error) {
        console.error(error); // If there is any error you will catch them here
      }
    },
    async getProfile() {
      console.log("dentro get profile")
      try {
        fetch(this.$url + "api/p/getp/" + this.$store.state.datiUtente.username, {
          method: 'GET',
          headers: { "Content-Type": "application/json" }
        }).then((resp) => resp.json())
        .then(data => {
          this.$store.commit('prendiProfiloUtente', data);
          console.log(data);
        })
      } catch(error) {
        console.error(error); 
      }
    },
  }, 
})

new Vue({
  router,
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
