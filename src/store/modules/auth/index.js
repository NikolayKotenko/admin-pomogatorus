import Request from "@/services/request";
import Vue from "vue";

export default {
    state: {
        userData: {},
        inserting_component: false,
    },
    getters: {
        stateAuth(state){
            return Object.keys(state.userData).length !== 0
        },
        checkAdminPanel(){
            if (!process.env.VUE_APP_SERVER)
                return false

            return Boolean(process.env.VUE_APP_SERVER.match('admin'))
        },
    },
    actions: {
        async validateAuth(){
            return await Request.post(this.state.BASE_URL+'/auth/validate-auth')
        },
        async refreshTokens({commit}){
            const tokensData = await Request.post(this.state.BASE_URL+'/auth/refresh')
            commit('set_user_data', tokensData.data)
            return tokensData
        },
        async loginUser({commit}, objData) {
            const tokensData = await Request.post(this.state.BASE_URL+'/auth/login', objData)
            commit('set_user_data', tokensData.data)

            return tokensData
        },
        async createUserByEmail(_, objData) {
            //Делаем запрос на создание пользователя, если такой есть то будет 409 конфликт ошибка ну и бог с ней
            return await Request.post(this.state.BASE_URL+'/users/create-from-only-email', objData)
        },
    },
    mutations: {
        set_user_data(state, result) {
            state.userData = []
            state.userData = result

            if (!result.access_token)
                return false

            const {token, defined_ttl_minutes} = result.access_token;
            Vue.$cookies.set("accessToken", token, defined_ttl_minutes+'min');
        },
    },
}