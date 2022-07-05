import Request from "../../../services/request";

export default {
    state: {
        showDetailAnswer: false,
        listAnswers: [],
        loadingList: false,
        showFilters: false,
    },
    mutations: {
        changeShowDetailAnswer(state, value) {
            state.showDetailAnswer = value
        },
        changeShowFilters(state, value) {
            state.showFilters = value
        },
        changeListAnswers(state, array) {
            state.listAnswers = []
            state.listAnswers = array
        },
        changeLoadingList(state, value) {
            state.loadingList = value
        },
    },
    actions: {
        async getListAnswers({commit}, params) {
            commit('changeLoadingList', true)

            const filter = {}

            for (let key in params) {
                params[key] ? filter[`filter[${key}]`] = params[key] : null
            }

            console.log(filter)

            try {
                const result = await Request.get(this.state.BASE_URL+'/entity/answers', filter)
                commit('changeListAnswers', result.data)
            } catch (e) {
                console.log(e)
                commit('change_notification_modal', e, { root: true })
            }
            commit('changeLoadingList', false)
        },
    },
    getters: {
    },
}
