import Request from "../../../services/request";

export default {
    state: {
        listTags: [],
        loadingList: false,
        showFilters: false,
        listVariables: [],
        deleteModal: false,
        tag: {
            id: null,
            code: null,
            name: null,
            public: false,
            description: null,
            seo_keywords: null,
            seo_description: null,
            created_at: null,
            updated_at: null
        },
    },
    mutations: {
        changeShowFilters(state, value) {
            state.showFilters = value
        },
        changeListTags(state, array) {
            state.listTags = []
            if (Array.isArray(array)) {
                state.listTags = array
            } else {
                state.listTags = Object.values(array)
            }
        },
        setTag(state, object){
            state.tag = {
                id: null,
                code: null,
                name: null,
                public: false,
                description: null,
                seo_keywords: null,
                seo_description: null,
                created_at: null,
                updated_at: null
            };
            state.tag = object;
        },
        changeLoadingList(state, value) {
            state.loadingList = value
        },
    },
    actions: {
        async deleteTag({commit, dispatch}) {
            await Request.delete(this.state.BASE_URL+'/dictionary/tags/'+this.state.TagsModule.tag.id)
            await dispatch('getListTags');
            this.state.TagsModule.deleteModal = false
            commit('changeLoadingList', false)
        },
        async onSubmit({commit, dispatch}){
            let response = await dispatch('createTag');
            if (response.codeResponse === 409){
                this.state.TagsModule.tag.id = response.data.id;
                response = await dispatch('updateTag');
            }
            commit('setTag', response.data)
        },
        async createTag({commit}){
            commit('changeLoadingList', true)
            try {
                const response = await Request.post(this.state.BASE_URL+'/dictionary/tags', this.state.TagsModule.tag)
                commit('changeLoadingList', false)
                return response;
            } catch (e) {
                console.log(e)
                commit('change_notification_modal', e, { root: true })
                commit('changeLoadingList', false)
            }
        },
        async updateTag({commit}){
            commit('changeLoadingList', true)
            try {
                const response =  await Request.put(
                    this.state.BASE_URL+'/dictionary/tags/'+this.state.TagsModule.tag.id,
                        this.state.TagsModule.tag)
                commit('changeLoadingList', false)
                return response;
            } catch (e) {
                console.log(e)
                commit('change_notification_modal', e, { root: true })
                commit('changeLoadingList', false)
            }
        },
        async getListTags({commit}) {
            commit('changeLoadingList', true)

            try {
                const result = await Request.get(this.state.BASE_URL+'/dictionary/tags')
                commit('changeListTags', result.data)
                const listTags = this.state.TagsModule.listTags;
                commit('setTag', listTags[listTags.length - 1])

            } catch (e) {
                console.log(e)
                commit('change_notification_modal', e, { root: true })
            }
            commit('changeLoadingList', false)
        },
    },
    getters: {},
}
