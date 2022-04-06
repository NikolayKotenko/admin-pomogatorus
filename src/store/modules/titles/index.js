// import qs from 'qs';
import axios from "axios";
import qs from "qs";


/* DEFAULT STATE */
const defaultArticle = {
    id: 1,
    name: {
        value: '',
        focused: false,
    },
    short_header: {
        value: '',
        focused: false,
    },
    purpose_of_article: {
        value: '',
        focused: false,
    },
    preview: {
        value: '',
        focused: false,
    },
    _all_tags: [],
    mtomtags: [],
}

export default {
    state: {
        /* MAIN ARTICLE */
        loadingList: false,
        articleNotification: '',
        listArticles: [],

        /* dataToCRUD */
        content: '',
        content_from_server: '',
        inserted_components: [],
        loadingArticle: false,
        loadingRequest: false,
        newArticle: {
            id: 1,
            name: {
                value: '',
                focused: false,
            },
            short_header: {
                value: '',
                focused: false,
            },
            purpose_of_article: {
                value: '',
                focused: false,
            },
            preview: {
                value: '',
                focused: false,
            },
            _all_tags: [],
            mtomtags: [],
        },
        nonEditState: {},

        /* INSERT COMPONENT */
        listComponents: [],
        loadingModalList: false,
        selectedComponent: {},
        countQuestion: 0,
        willShow: true,
        deletedComponent: 0,

        /* TEST */
        fonts: [],
        dataFromChild: '',
    },
    mutations: {
        /* MAIN ARTICLE */
        set_list_articles(state, result) {
            state.listArticles = []
            if (Array.isArray(result)) {
                state.listArticles = result
            } else {
                for (let key in result) {
                    state.listArticles.push(result[key])
                }
            }

        },

        /* DETAIL ARTICLES */
        set_new_article(state, result) {
            state.newArticle = Object.assign({}, defaultArticle)
            for (let key in result) {
                if (
                    (key === 'name') ||
                    (key === 'short_header') ||
                    (key === 'purpose_of_article') ||
                    (key === 'preview')
                ) {
                    state.newArticle[key] =  {
                        value: result[key],
                        focused: false
                    }
                } else if (key === 'content') {
                    // state.content_from_server = JSON.parse(result[key])
                    let parsed = JSON.parse(JSON.parse(result[key]))
                    if (typeof parsed === 'string') {
                        state.content_from_server = parsed
                    } else {
                        state.content_from_server = JSON.parse(result[key])
                    }
                } else state.newArticle[key] = result[key]
            }
            state.nonEditState = Object.assign({}, state.newArticle)
        },

        /* INSERT COMPONENT */
        change_list_components(state, result) {
            state.listComponents = result
        },
        delete_component_by_id(state, id) {
            state.deletedComponent = id
        },
        changeSelectedComponent(state, {data, index}) {
            const obj = Object.assign({}, {data, index: index})
            state.listComponents.push(obj)
        },

        /* LOCAL_STORAGE */
        // eslint-disable-next-line no-unused-vars
        set_local_storage({state}, object) {
            localStorage.setItem('article', JSON.stringify(object))
        },
        remove_local_storage() {
            localStorage.removeItem('article')
        },
        get_from_local_storage() {
            if (localStorage.getItem('article') !== null) {
                this.state.TitlesModule.newArticle = Object.assign({}, defaultArticle)
                this.state.TitlesModule.newArticle = JSON.parse(localStorage.getItem('article'))
            }
        },

        /* TEST */
        changeFonts(state, result) {
            state.fonts = result.data.items
        },
        changeDataFromChild(state, result) {
            state.dataFromChild = result
        }
    },
    actions: {
        /* MAIN ARTICLES */
        async setFilteredListArticles({state, commit}, data) {
            return new Promise((resolve, reject) => {
                state.loadingList = true

                const {tag, updated_at, name} = data

                const filter = {}
                filter['filter[tag]'] = tag
                filter['filter[updated_at]'] = updated_at
                filter['filter[name]'] = name

                axios.get(`${this.state.BASE_URL}/entity/articles`, {
                    headers: {
                        Authorization: '666777'
                    },
                    params: {
                        ...filter
                    }
                })
                    .then((response) => {
                        console.log(response)
                        commit('set_list_articles', response.data.data)
                        state.loadingList = false
                        resolve()
                    })
                    .catch((error) => {
                        state.loadingList = false
                        commit('set_list_articles', [])
                        state.articleNotification = error.response.data.message
                        reject(error)
                    })
            })
        },

        /* CRUD */
        async getDetailArticle({commit, state}, id) {
            state.loadingArticle = true
            return new Promise((resolve, reject) => {
                axios.get(`${this.state.BASE_URL}/entity/articles/${id}`, {
                    headers: {
                        Authorization: '666777'
                    },
                })
                    .then((response) => {
                        commit('set_new_article', response.data.data)
                        state.loadingArticle = false
                        resolve()
                    })
                    .catch((error) => {
                        //handle error
                        state.loadingArticle = false
                        reject(error)
                        console.log(error.body);
                    })
            })
        },
        async createArticle({state}, data) {
            return new Promise((resolve) => {
                state.loadingRequest = true
                state.loadingArticle = true
                let bodyFormData = new FormData()
                for (let key in data) {
                    if (typeof data[key] === 'object') {
                        if (data[key].value) {
                            bodyFormData.append(key, data[key].value)
                        }
                    } else bodyFormData.append(key, data[key])
                }
                const inserted_components = JSON.stringify(JSON.stringify(state.inserted_components))
                console.log(inserted_components)
                bodyFormData.append('code', data.name.value)
                bodyFormData.append('content', JSON.stringify(state.content))
                bodyFormData.append('inserted_components', inserted_components)
                bodyFormData.append('name_param_env', '')
                axios.post(`${this.state.BASE_URL}/entity/articles`, bodyFormData, {
                    headers: {
                        Authorization: '666777'
                    },
                })
                    .then((response) => {
                        //handle success
                        /* FIXME: Когда будут тэги */
                       /* state.loadingRequest = false
                        dispatch('setListQuestions').then(() => {
                            dispatch('createRelationTag', data.name.value).then(() => {
                                state.loadingArticle = false
                                resolve()
                            })
                        })*/
                        state.loadingArticle = false
                        resolve()
                        console.log(response);
                    })
                    .catch((response) => {
                        //handle error
                        state.loadingRequest = false
                        state.loadingArticle = false
                        resolve()
                        console.log(response.body);
                    });
            })
        },
        updateArticle({state}, data) {
            return new Promise((resolve) => {
                state.loadingRequest = true
                state.loadingArticle = true
                const requestData = {}
                for (let key in data) {
                    if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
                        if (data[key] !== null && data[key].value) {
                            requestData[key] = data[key].value
                        }
                    } else requestData[key] = data[key]
                }
                requestData['content'] = JSON.stringify(state.content)

                const options = {
                    method: 'PUT',
                    headers: { 'content-type': 'application/x-www-form-urlencoded', Authorization: '666777' },
                    data: qs.stringify(requestData),
                    url: `${this.state.BASE_URL}/entity/articles/${data.id}`,
                }
                axios(options)
                    .then((response) => {
                        //handle success
                        state.loadingRequest = false
                        state.loadingArticle = false
                        resolve()
                        /* TAGS */
                        /*dispatch('setListQuestions').then(() => {
                            dispatch('createRelationTag', data.name.value).then(() => {
                                resolve()
                            })
                        })*/
                        console.log(response);
                    })
                    .catch((response) => {
                        //handle error
                        state.loadingRequest = false
                        state.loadingArticle = false
                        resolve()
                        console.log(response.body);
                    });
            })
        },
        deleteArticle({state}, data) {
            state.loadingRequest = true
            return new Promise((resolve) => {

                const options = {
                    method: 'DELETE',
                    url: `${this.state.BASE_URL}/entity/articles/${data.id}`,
                    headers: {
                        Authorization: '666777'
                    },
                }

                axios(options)
                    .then((response) => {
                        //handle success
                        state.loadingRequest = false
                        resolve()
                        console.log(response);
                    })
                    .catch((response) => {
                        //handle error
                        state.loadingRequest = false
                        resolve()
                        console.log(response.body);
                    });
            })
        },
        /* INSERT COMPONENT */
        deleteComponent({commit}, id) {
          commit('delete_component_by_id', id)
        },
        getComponentsById({commit, state}, params) {
            return new Promise((resolve, reject) => {

                const {id_question, index} = params

                state.loadingModalList = true
                axios.get(`${this.state.BASE_URL}/entity/questions/${id_question}`, {
                    headers: {
                        Authorization: '666777'
                    },
                })
                    .then((response) => {
                        const data = response.data.data
                        console.log('uploaded COMPONENT')
                        commit('changeSelectedComponent', {data, index})
                        state.loadingModalList = false
                        resolve()
                    })
                    .catch((error) => {
                        state.loadingModalList = false
                        reject(error)
                    })
            })
        },
        getListComponents({commit, state}, params) {
            return new Promise((resolve, reject) => {
                state.loadingModalList = true
                axios.get(`${this.state.BASE_URL}/entity/${params}`, {
                    headers: {
                        Authorization: '666777'
                    },
                })
                    .then((response) => {
                        commit('change_list_components', response.data.data)
                        state.loadingModalList = false
                        resolve()
                    })
                    .catch((error) => {
                        state.loadingModalList = false
                        reject(error)
                    })
            })
        },

        /* LOCAL_STORAGE */
        setLocalStorageArticle({commit}, object) {
            commit('set_local_storage', object)
        },
        removeLocalStorageArticle({commit}) {
            commit('remove_local_storage')
        },
        getFromLocalStorageArticle({commit}) {
            return new Promise((resolve) => {
                commit('get_from_local_storage')
                resolve()
            })
        },

        /* TEST */
        testFont({commit}) {
            return new Promise((resolve, reject) => {
                axios.get('https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCnefZ3KzL_qWHIzDin8kUPkmJSzXOZvpM')
                    .then((response) => {
                        console.log(response)
                        commit('changeFonts', response)
                        resolve()
                    })
                    .catch((error) => {
                        reject(error)
                    })
            })
        },
    },
    getters: {}
}
