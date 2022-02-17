import Vue from 'vue'
import Vuex from 'vuex'
import axios from "axios";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    BASE_URL: process.env.NODE_ENV === 'development' ? 'https://api-test.agregatorus.com' : 'https://api.agregatorus.com',
    listQuestions: [],
    listTypesOfQuestions: [],
    listGeneralTags: [],
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
    set_list_general_tags(state, result) {
      state.listGeneralTags = []
      state.listGeneralTags = result
    },
  },
  actions: {
    async setListQuestions({commit}) {
      axios.get(`${this.state.BASE_URL}/entity/questions`)
          .then((response) => {
            commit('set_list_questions', response.data)
          })
          .catch(() => {
            console.log('test')
          })
    },
    async setListTypesQuestions({commit}) {
      axios.get(`${this.state.BASE_URL}/dictionary/type-answers`)
          .then((response) => {
            commit('set_list_types_questions', response.data)
          })
    },
    async getGeneralTags({commit}) {
      axios.get(`${this.state.BASE_URL}/dictionary/tags`)
          .then((response) => {
            commit('set_list_general_tags', response.data)
          })
    },
  },
  modules: {
  }
})
