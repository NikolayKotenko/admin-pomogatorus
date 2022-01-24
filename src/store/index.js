import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    listQuestions: []
  },
  mutations: {
    set_list_questions({state}, result) {
      state.listQuestions = []
      state.listQuestions = result
    },
  },
  actions: {
    async setListQuestions({commit}) {
      axios.get('https://api-test.agregatorus.com/entity/questions')
      .then((response) => {
        commit('set_list_questions', response)
      })
    }
  },
  modules: {
  }
})
