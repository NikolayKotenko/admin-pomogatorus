import Vue from 'vue'
import Vuex from 'vuex'
// import axios from "axios";

Vue.use(Vuex)

// Modules import
import QuestionsModule from "./modules/questions";

export default new Vuex.Store({
  state: {
    BASE_URL: process.env.NODE_ENV === 'development' ? 'https://api-test.agregatorus.com' : 'https://api.agregatorus.com',
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    QuestionsModule
  }
})
