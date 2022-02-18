import axios from "axios";

export default {
    state: {
        listQuestions: [],
        listTypesOfQuestions: [],
        listGeneralTags: [],
        tagsLoaded: false,
        createdTag: {},
        newQuestion: {
            name: {
                value: '',
                focused: false,
            },
            title: {
                value: '',
                focused: false,
            },
            article: {
                value: '',
                focused: false,
            },
            purpose_of_question: {
                value: '',
                focused: false,
            },
            id_type_answer: {
                value: null,
                focused: false
            },
            state_detailed_response: 0,
            state_attachment_response: 0,
            value_type_answer: null,
            tags: [],
        },
        showCreateTag: false,
        newTag: '',
        tagSearch: null,
        tagError: {
            isError: false,
            errObj: {},
        },
        showAddTag: false,
    },
    mutations: {
        set_list_questions(state, result) {
            state.listQuestions = []
            state.listQuestions = result
        },
        set_list_types_questions(state, result) {
            state.listTypesOfQuestions = []
            state.listTypesOfQuestions = result
        },
        set_list_general_tags(state, result) {
            state.listGeneralTags = []
            state.listGeneralTags = result
        },
    },
    actions: {
        async setListQuestions({commit}) {
            axios.get(`${this.state.BASE_URL}/entity/questions`)
                .then((response) => {
                    commit('set_list_questions', response.data)
                })
                .catch(() => {
                    console.log('test')
                })
        },
        async setListTypesQuestions({commit}) {
            axios.get(`${this.state.BASE_URL}/dictionary/type-answers`)
                .then((response) => {
                    commit('set_list_types_questions', response.data)
                })
                .catch(() => {
                    console.log('test')
                })
        },
        async getGeneralTags({commit}) {
            return new Promise((resole) => {
                this.tagsLoaded = true
                axios.get(`${this.state.BASE_URL}/dictionary/tags`)
                    .then((response) => {
                        this.tagsLoaded = false
                        commit('set_list_general_tags', response.data)
                        resole()
                    })
                    .catch(() => {
                        this.tagsLoaded = false
                        resole()
                        console.log('test')
                    })
            })
        },
        async setNewTagToList({dispatch, state}, newTag) {
            return new Promise((resole) => {
                state.tagsLoaded = true
                let bodyFormData = new FormData()
                bodyFormData.append('name', newTag)
                axios.post(`${this.state.BASE_URL}/dictionary/tags`, bodyFormData)
                    .then(function (response) {
                        //handle success
                        console.log(response);
                        dispatch('getGeneralTags').then(() => {
                            state.createdTag = state.listGeneralTags.find(elem => {
                                return elem.name === newTag
                            })
                            state.tagsLoaded = false
                            resole()
                        })
                    })
                    .catch(function (response) {
                        //handle error
                        state.tagsLoaded = false
                        resole()
                        console.log(response.body);
                    });
            })
        },
    },
    getters: {
        getNewQuestion(state) {
            return state.newQuestion
        },
        getListTypesOfQuestions(state) {
            return state.listTypesOfQuestions
        },
        getTags(state) {
            return state.newQuestion.tags
        }
    },
}
