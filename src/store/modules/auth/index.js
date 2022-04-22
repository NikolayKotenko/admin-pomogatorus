import Request from "@/services/request";

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
        async createUserByEmail(_, objData) {
            //Делаем запрос на создание пользователя, если такой есть то будет 409 конфликт ошибка ну и бог с ней
            return await Request.post(
                this.state.BASE_URL+'/users/create-from-only-email',
                Request.bodyFromData(objData)
            )
        },
        async loginUser({commit}, objData) {
            const authUser = await Request.post(this.state.BASE_URL+'/auth/login', objData)
            commit('set_user_data', authUser.data)
            return authUser
        },
    },
    mutations: {
        set_user_data(state, result) {
            state.userData = []
            state.userData = result
        },
    },


}
