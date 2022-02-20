import axios from "axios";

/* DEFAULT STATE */
const defaultQuestion = {
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
        _all_tags: [],
    }

/* CONSTRUCTORS */
function AnswerVariable(answer) {
    this.id = answer.id
    this.answer = answer.answer
    this.commentary = answer.commentary
    this.showComentary = true
    this.focused = false
}

export default {
    state: {
        /* LIST QUESTIONS */
        listQuestions: [],
        listTypesOfQuestions: [],

        /* DETAIL QUESTION */
        loadingQuestion: false,
        loadingRequest: false,
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
            _all_tags: [],
        },
        nonEditState: {},

        /* TAGS */
        listGeneralTags: [],
        tagsLoaded: false,
        createdTag: {},
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
        /* LIST QUESTIONS */
        set_list_questions(state, result) {
            state.listQuestions = []
            state.listQuestions = result
        },
        /* DETAIL QUESTION */
        set_list_types_questions(state, result) {
            state.listTypesOfQuestions = []
            state.listTypesOfQuestions = result
        },
        set_list_general_tags(state, result) {
            state.listGeneralTags = []
            state.listGeneralTags = result
        },
        reset_questions_tags(state) {
            state.tagsLoaded = false
            state.createdTag = {}
            state.showCreateTag = false
            state.newTag = ''
            state.tagSearch = null
            state.tagError = {
                isError: false,
                errObj: {
                    name: '',
                },
            }
            state.showAddTag = false
        },
        set_new_question(state, result) {
            state.newQuestion = Object.assign({}, defaultQuestion)
            for (let key in result) {
                if (
                    (key === 'name') ||
                    (key === 'title') ||
                    (key === 'article') ||
                    (key === 'purpose_of_question') ||
                    (key === 'id_type_answer')
                ) {
                    state.newQuestion[key] =  {
                        value: result[key],
                        focused: false
                    }
                } else if (key === 'value_type_answer') {
                    // FIXME: парсинг чет страдает
                    if (result['id_type_answer'] !== 1 && result['id_type_answer'] !== 2) {
                        let parsed = null
                        parsed = JSON.parse(JSON.parse(result[key]))
                        if (Array.isArray(parsed)) {
                            state.newQuestion[key] = []
                            parsed.forEach(elem => {
                                state.newQuestion[key].push(new AnswerVariable(elem))
                            })
                        } else {
                            state.newQuestion[key] = []
                        }
                    } else {
                        state.newQuestion[key] = JSON.parse(result[key])
                    }
                } else state.newQuestion[key] = result[key]
            }
            state.nonEditState = Object.assign({}, state.newQuestion)
        }
    },
    actions: {
        async setListQuestions({commit}) {
            return new Promise((resolve, reject) => {
                axios.get(`${this.state.BASE_URL}/entity/questions`)
                    .then((response) => {
                        commit('set_list_questions', response.data.data)
                        resolve()
                    })
                    .catch((error) => {
                        console.log('test')
                        reject(error)
                    })
            })
        },
        async setListTypesQuestions({commit}) {
            axios.get(`${this.state.BASE_URL}/dictionary/type-answers`)
                .then((response) => {
                    commit('set_list_types_questions', response.data.data)
                })
                .catch(() => {
                    console.log('test')
                })
        },
        async getGeneralTags({commit, state}) {
            return new Promise((resolve) => {
                state.tagsLoaded = true
                axios.get(`${this.state.BASE_URL}/dictionary/tags`)
                    .then((response) => {
                        state.tagsLoaded = false
                        commit('set_list_general_tags', response.data.data)
                        resolve()
                    })
                    .catch(() => {
                        state.tagsLoaded = false
                        resolve()
                        console.log('test')
                    })
            })
        },
        async setNewTagToList({dispatch, state}, newTag) {
            return new Promise((resolve) => {
                state.tagsLoaded = true
                let bodyFormData = new FormData()
                bodyFormData.append('name', newTag)
                axios.post(`${this.state.BASE_URL}/dictionary/tags`, bodyFormData)
                    .then((response) => {
                        //handle success
                        console.log(response);
                        dispatch('getGeneralTags').then(() => {
                            state.createdTag = state.listGeneralTags.find(elem => {
                                return elem.name === newTag
                            })
                            state.tagsLoaded = false
                            resolve()
                        })
                    })
                    .catch((response) => {
                        //handle error
                        state.tagsLoaded = false
                        resolve()
                        console.log(response.body);
                    });
            })
        },
        async getDetailQuestion({commit, state}, id) {
            state.loadingQuestion = true
            return new Promise((resolve, reject) => {
                axios.get(`${this.state.BASE_URL}/entity/questions/${id}`)
                    .then((response) => {
                        commit('set_new_question', response.data.data)
                        state.loadingQuestion = false
                        resolve()
                    })
                    .catch((error) => {
                        //handle error
                        state.loadingQuestion = false
                        reject(error)
                        console.log(error.body);
                    })
            })
        },
        async concateAllData({dispatch, state}, data) {
            state.loadingRequest = true
            return new Promise((resolve) => {
                let bodyFormData = new FormData()
                for (let key in data) {
                    if (key === 'value_type_answer') {
                        if (Array.isArray(data[key])) {
                            let arr = []
                            let obj = {}
                            data[key].map(elem => {
                                if (elem.answer) {
                                    obj.id = elem.id
                                    obj.answer = elem.answer
                                    obj.commentary = elem.commentary
                                    arr.push(obj)
                                    obj = {}
                                }
                            })
                            bodyFormData.append(key, JSON.stringify(arr))
                        } else bodyFormData.append(key, data[key])
                    } else {
                        if (typeof data[key] === 'object') {
                            if (data[key].value) {
                                bodyFormData.append(key, data[key].value)
                            }
                        } else bodyFormData.append(key, data[key])
                    }
                }
                bodyFormData.append('name_param_env', '')
                axios.post(`${this.state.BASE_URL}/entity/questions`, bodyFormData)
                    .then((response) => {
                        //handle success
                        state.loadingRequest = false
                        dispatch('setListQuestions').then(() => {
                            dispatch('createRelationTag', data.name.value).then(() => {
                                resolve()
                            })
                        })
                        console.log(response);
                    })
                    .catch((response) => {
                        //handle error
                        state.loadingRequest = false
                        resolve()
                        console.log(response.body);
                    });
            }).then(() => {
            })
        },
        createRelationTag({state}, name) {
            return new Promise((resolve, reject) => {
                if (state.newQuestion._all_tags.length) {
                    console.log(name)
                    let finded = state.listQuestions.filter(elem => {
                        return elem.name === name
                    })
                    console.log(finded)
                    state.newQuestion._all_tags.forEach(tag => {
                        let tagsFormData = new FormData()
                        tagsFormData.append('id_tag', tag.id)
                        tagsFormData.append('id_question', finded[0].id)
                        // tagsFormData.append('id_answer', finded[0].id_type_answer)
                        axios.post(`${this.state.BASE_URL}/m-to-m/tags`, tagsFormData)
                            .then((response) => {
                                console.log(response)
                                resolve()
                            })
                            .catch((error) => {
                                console.log(error)
                                reject(error)
                            })
                    })
                }
            })
        }
    },
    getters: {
        getListTypesOfQuestions(state) {
            return state.listTypesOfQuestions
        },
        // FIXME: tag
        getTags(state) {
            return state.newQuestion._all_tags
        }
    },
}
