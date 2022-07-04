import Request from "../../../services/request";

export default {
    state: {
        showDetailAnswer: false,
        listAnswers: [],
        loadingList: false,
    },
    mutations: {
        changeShowDetailAnswer(state, value) {
            state.showDetailAnswer = value
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

            // const {
            //     id_question,
            //     id_user,
            //     id_agent_utm,
            //     id_article,
            //     created_at,
            //     name,
            //     updated_at,
            //     sort_created_at
            // } = params

            // id_question ? filter['filter[id_question]'] = id_question :
            // filter['filter[id_user]'] = id_user
            // filter['filter[id_agent_utm]'] = id_agent_utm
            // filter['filter[id_article]'] = id_article
            // filter['filter[created_at]'] = created_at
            // filter['sort[name]'] = name
            // filter['sort[updated_at]'] = updated_at
            // filter['sort[id_agent_utm]'] = sort_created_at

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
