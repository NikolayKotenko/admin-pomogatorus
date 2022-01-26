import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    listQuestions: [],
    listTypesOfQuestions: [],
  },
  mutations: {
    set_list_questions(state, result) {
      state.listQuestions = []
      state.listQuestions = result
    },
    set_list_types_questions(state, result) {
      state.listTypesOfQuestions = []
      state.listTypesOfQuestions = result
    },
  },
  actions: {
    async setListQuestions({commit}) {
      axios.get('https://api-test.agregatorus.com/entity/questions')
          .then((response) => {
            commit('set_list_questions', response.data)
          })
    },
    async setListTypesQuestions({commit}) {
      axios.get('https://api-test.agregatorus.com/dictionary/type-answers')
          .then((response) => {
            commit('set_list_types_questions', response.data)
          })
    }
  },
  modules: {
  }
})
