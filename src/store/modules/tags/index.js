import Request from "../../../services/request";

export default {
    state: {
        listTags: [],
        showFilters: false,
        listVariables: [],
        deleteModal: false,
        tag: {
            id: null,
            code: null,
            name: null,
            public: false,
            description: null,
            seo_title: null,
            seo_keywords: null,
            seo_description: null,
            e_client_files: [],
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
            if (object == null)
                return false;

            state.tag = object;
        },
        clearTag(state){
            state.tag = {
                id: null,
                code: null,
                name: null,
                public: false,
                description: null,
                seo_title: null,
                seo_keywords: null,
                seo_description: null,
                e_client_files: [],
                created_at: null,
                updated_at: null
            };
        },
        deleteModalCommit(state, value){
            state.deleteModal = value
        }
    },
    actions: {
        stateModalAction({commit}, value){
            commit('deleteModalCommit', value)
        },
        clearTag({commit}){
            commit('clearTag')
        },
        async deleteTag({commit, dispatch}) {
            commit('changeLoadingGeneral', true)

            if (this.state.TagsModule.tag.e_client_files.length) {
                await dispatch('deleteFileGeneral', this.state.TagsModule.tag.e_client_files[0].id)
            }
            await Request.delete(this.state.BASE_URL+'/dictionary/tags/'+this.state.TagsModule.tag.id)
            await dispatch('getListTags');
            commit('clearTag')
            commit('changeLoadingGeneral', false)
            commit('deleteModalCommit', false)
        },
        async onSubmit({commit, dispatch}){
            if (this.state.TagsModule.tag.name == null)
                return false;

            //START
            commit('changeLoadingGeneral', true)

            let response = null;
            if (location.search.match('create')) {
                response = await dispatch('createTag');
            } else {
                response = await dispatch('updateTag');
            }
            await dispatch('getListTags', response.data.id);

            //END
            commit('changeLoadingGeneral', false)
        },
        async createTag({commit}){
            commit('changeLoadingGeneral', true)
            try {
                const response = await Request.post(this.state.BASE_URL+'/dictionary/tags', this.state.TagsModule.tag)
                commit('setTag', response.data)
                commit('changeLoadingGeneral', false)
                return response;
            } catch (e) {
                console.log(e)
                commit('change_notification_modal', e, { root: true })
                commit('changeLoadingGeneral', false)
            }
        },
        async updateTag({commit}){
            try {
                return await Request.put(
                    this.state.BASE_URL+'/dictionary/tags/'+this.state.TagsModule.tag.id,
                        this.state.TagsModule.tag)
            } catch (e) {
                console.log(e)
                commit('change_notification_modal', e, { root: true })
            }
        },
        async getListTags({commit}, id) {
            commit('changeLoadingGeneral', true)

            try {
                const result = await Request.get(this.state.BASE_URL+'/dictionary/tags')
                commit('changeListTags', result.data)
                const listTags = this.state.TagsModule.listTags;

                const getTag = () => {
                    if (id){
                        return listTags.find((elem) => elem.id == id)
                    }
                }
                commit('setTag', getTag())

            } catch (e) {
                console.log(e)
                commit('change_notification_modal', e, { root: true })
            }
            commit('changeLoadingGeneral', false)
        },
    },
    getters: {
    },
}
