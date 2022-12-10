import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    category: '',
    search: false
  },
  getters: {
  },
  mutations: {
    selectCat(state, cat) {
      state.category = cat;
    },
    isResultView (state, a) {
      state.search = a;
    }
  },
  actions: {
  },
  modules: {
  }
})
