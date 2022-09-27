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
import AnswersModule from "./modules/answers";
import TagsModule from "./modules/tags";
import Request from "../services/request";
import axios from "axios";

export default new Vuex.Store({
  state: {
    BASE_URL: process.env.NODE_ENV === 'development' ? 'http://127.0.0.1:8000' : 'https://api.agregatorus.com',
    notification_modal: {
      show_notification: false,
      error: false,
      message: '',
    },
    cur_num: 0,
    loadingAgents: false,
    listAgents: [],
    loadingRequestGeneral: false,
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
    changeListAgents(state, array) {
      state.listAgents = array
    },
    changeLoadingAgents(state, value) {
      state.loadingAgents = value
    }
  },
  actions: {
    async getListAgents({commit}) {
      commit('changeLoadingAgents', true)

      try {
        // const { data } = await Request.get(`${this.state.BASE_URL}/entity/groups`, {'sort[name]': 'asc'})
        //
        // let arr = []
        //
        // if (Array.isArray(data)) {
        //   arr = data
        // } else {
        //   arr = Object.values(data)
        // }
        // const id = arr.filter(elem => elem.code === 'agenty')[0].id
        const result = await Request.get(`${this.state.BASE_URL}/users/get-list-users`, {'filter[is_agent]': true})
        commit('changeListAgents', result.data)
      } catch (e) {
        console.log(e)
        commit('change_notification_modal', e, { root: true })
      }

      commit('changeLoadingAgents', false)
    },
    deleteFileGeneral({state}, id) {
      state.loadingRequestGeneral = true
      return new Promise((resolve) => {

        const options = {
          method: 'DELETE',
          url: `${this.state.BASE_URL}/entity/files/${id}`,
          headers: {
            Authorization: '666777'
          },
        }

        axios(options)
            .then((response) => {
              //handle success
              state.loadingRequestGeneral = false
              resolve()
              console.log(response);
            })
            .catch((response) => {
              //handle error
              state.loadingRequestGeneral = false
              resolve()
              console.log(response.body);
            });
      })
    },
  },
  modules: {
    QuestionsModule,
    ArticleModule,
    AuthModule,
    AnswersModule,
    TagsModule
  }
})
