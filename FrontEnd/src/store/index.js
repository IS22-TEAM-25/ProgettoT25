import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const getDefaultState = () => {
  return {
    category: '',
    search: false,
    loginupForms: false,
    dataAuth: {success: false, message: '', token:'', user_id:''},
    username: '',

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
    autenticazione(state, { dataAuth, username}) {
      localStorage.setItem('dataAuth', dataAuth);
      localStorage.setItem('username', username);
      state.dataAuth = dataAuth,
      state.username = username
    },
    resetState(state) {
      Object.assign(state, getDefaultState())
      console.log("resettato")
    }

  },
  actions,
  modules: {
  }
})