import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const getDefaultState = () => {
  return {
    category: '',
    annunci: [],
    search: false,
    keyword: '',
    noNavBar: false,
    //dataAuth: {success: true, message: 'Benvenuto man', token:'', user_id:'', nome:'Federico', cognome:'Menegoz', username:'FirstUser'},
    dataAuth: {success: false, message: '', token:'', user_id:'', },
    datiUtente: {},
    annuncioSelezionato: {},
    prodottoInBallo: false,
    transazione:{},
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
    resetState(state) {
      Object.assign(state, getDefaultState())
      console.log("resettato")
    },
    resetResult(state) {
      state.category='',
      state.keyword=''
    }

  },
  actions,
  modules: {
  }
})
