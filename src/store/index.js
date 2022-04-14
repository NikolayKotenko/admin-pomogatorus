import Vue from 'vue'
import Vuex from 'vuex'
// import axios from "axios";
// axios.defaults.headers.common['Authorization'] = 666777;

Vue.use(Vuex)

// Modules import
import QuestionsModule from "./modules/questions";
import TitlesModule from "./modules/titles";
import AuthModule from "./modules/auth";

export default new Vuex.Store({
  state: {
    BASE_URL: process.env.NODE_ENV === 'development' ? 'https://api-test.agregatorus.com' : 'https://api.agregatorus.com',
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    QuestionsModule,
    TitlesModule,
    AuthModule
  }
})
