import Request from "@/services/request";

export default {
    state: {
        userData: {}
    },
    getters: {},
    actions: {
        async loginCreateUser({commit}, email) {

            let bodyFormData = new FormData()
            bodyFormData.append('email', email)

            //Делаем запрос на создание пользователя, если такой есть то будет 409 конфликт ошибка ну и бог с ней
            await Request.post(this.state.BASE_URL+'/users/create-from-only-email', bodyFormData)

            //Собственно, сразу аутентифицировали его
            const authUser = await Request.post(this.state.BASE_URL+'/auth/login', bodyFormData)
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
