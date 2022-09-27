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
        changeLoadingList(state, value) {
            state.loadingList = value
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
            commit('deleteModalCommit', false)
            await Request.delete(this.state.BASE_URL+'/dictionary/tags/'+this.state.TagsModule.tag.id)
            await dispatch('deleteFileGeneral', this.state.TagsModule.tag.e_client_files[0].id)
            await dispatch('getListTags');
            commit('clearTag')
            commit('changeLoadingList', false)
        },
        async onSubmit({commit, dispatch}){
            if (this.state.TagsModule.tag.name == null)
                return false;

            let response = null;
            if (location.pathname.match('edit')){
                response = await dispatch('updateTag');
            }
            else{
                response = await dispatch('createTag');
                if (response.codeResponse === 409){
                    this.state.TagsModule.tag.id = response.data.id;
                    response = await dispatch('updateTag');
                }
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
        async getListTags({commit}, id) {
            commit('changeLoadingList', true)

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
            commit('changeLoadingList', false)
        },
    },
    getters: {
    },
}
