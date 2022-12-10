import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    category: ''
  },
  getters: {
  },
  mutations: {
    selectCat(state, cat) {
      state.category = cat;
    }
  },
  actions: {
  },
  modules: {
  }
})
