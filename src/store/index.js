import Vue from 'vue'
import Vuex from 'vuex'
// import axios from "axios";
// axios.defaults.headers.common['Authorization'] = 666777;
// axios.defaults.withCredentials = true
// axios.defaults.headers.common['withCredentials'] = true
// axios.defaults.headers.common['credentials'] = 'same-origin';
// axios.defaults.headers.common['supportsCredentials'] = true;
// axios.defaults.headers.common['crossdomain'] = true;
// axios.defaults.headers.common['X-CSRF-TOKEN'] = '';
// axios.defaults.headers.post['Sec-Fetch-Site'] = 'same-origin';
// axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
// axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.post['Access-Control-Allow-Headers'] = 'Authorization, withcredentials, cache-control, supportscredentials, Set-Cookie, Origin, X-Requested-With, Accept, X-PINGOTHER, Content-Type';

Vue.use(Vuex)

// Modules import
import QuestionsModule from "./modules/questions";
import ArticleModule from "./modules/article";
import AuthModule from "./modules/auth";

export default new Vuex.Store({
  state: {
    BASE_URL: process.env.NODE_ENV === 'development' ? 'https://api-test.agregatorus.com' : 'https://api.agregatorus.com',
    notification_modal: {
      show_notification: false,
      error: false,
      message: '',
    },
    cur_num: 0,
  },
  mutations: {
    change_notification_modal(state, value) {
      state.notification_modal.show_notification = true
      state.notification_modal.message = value.message
      state.notification_modal.error = value.error
    },
    change_cur_num(state, value) {
      state.cur_num = value
    },
  },
  actions: {
  },
  modules: {
    QuestionsModule,
    ArticleModule,
    AuthModule
  }
})
