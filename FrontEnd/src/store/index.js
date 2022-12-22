import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const getDefaultState = () => {
  return {
    annunci: [],
    search: false,
    keyword: '',
    noNavBar: false,
    //dataAuth: {success: true, message: 'Benvenuto man', token:'', user_id:'', nome:'Federico', cognome:'Menegoz', username:'FirstUser'},
    dataAuth: {success: false, message: '', token:'', user_id:'', },
    datiUtente: {},
    profiloUtente: {},
    annuncioSelezionato: {},
    prodottoInBallo: false,
    transazione:{},
    dallaWL: false,
    pubblicazioneAnnuncioSsuccess: false,
    annunciUtente: [],
    filtri: {
      affitto:'true',
      vendita:'true',
      prezzoVenditaMin: 0,
      prezzoVenditaMax: Number.MAX_SAFE_INTEGER,
      prezzoAffittoMin: 0,
      prezzoAffittoMax: Number.MAX_SAFE_INTEGER,
      categoria: '',
      pagamentoOnline: false
    },
    controlliFiltri: {
      filterMaxVendita: 0.0,
      filterMinVendita: 0.0,
      filterMaxAffitto: 0.0,
      filterMinAffitto: 0.0,
    }
  }
}

const state = getDefaultState()
const actions = {
  resetSessionState ({ commit }) {
    commit('resetState')
  }
}

export default new Vuex.Store({
  state,
  getters: {
    user_id: state => state.dataAuth.user_id,
    token: state => state.dataAuth.token,
    messageAuth: state => state.dataAuth.message
  },
  mutations: {
    selectCat(state, cat) {
      state.category = cat;
    },
    isResultView (state, a) {
      state.search = a;
    },
    autenticazione(state, dataAuth) {
      //localStorage.setItem('dataAuth', dataAuth);
      // localStorage.setItem('username', username);
      state.dataAuth = dataAuth;
      // state.username = username
    },
    prendiDatiUtente(state, datiUtente) {
      state.datiUtente = datiUtente;
    },
    prendiProfiloUtente(state, profiloUtente) {
      state.profiloUtente = profiloUtente;
    },
    resetState(state) {
      Object.assign(state, getDefaultState())
      console.log("resettato")
    },
    resetResult(state) {
      state.category='',
      state.keyword='',
      state.noNavBar=false
    },
    resettaFiltri(state) {
        state.filtri = {
          affitto:'true',
          vendita:'true',
          pagamentoOnline: false,
          prezzoVenditaMin: 0,
          prezzoVenditaMax: Number.MAX_SAFE_INTEGER,
          prezzoAffittoMin: 0,
          prezzoAffittoMax: Number.MAX_SAFE_INTEGER,
          categoria: ''
      }
    },
    setPubblicazioneAnnuncio(state) {
      state.pubblicazioneAnnuncio = {
        success: false,
        error: false,
        message: ''
      }
    }

  },
  actions,
  modules: {
  }
})
