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

/* CONSTRUCTORS */
function InsertedComponents(elem) {
    this.index = elem.index
    this.id_component = elem.id_component
    this.type_component = elem.type_component
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

        /* INSERT COMPONENT */
        listComponents: [],
        components_after_request: [],
        loadingModalList: false,
        selectedComponent: {},
        countLayout: 0,
        count_of_images: 0,
        count_of_questions: 0,
        count_of_auth: 0,
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

        /* TAGS */
        set_list_general_tags_article(state, result) {
            state.listGeneralTags = []
            state.listGeneralTags = result
        },
        reset_articles_tags(state) {
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
                } else if (key === 'inserted_components') {
                    let parsed = null
                    parsed = JSON.parse(JSON.parse(result[key]))
                    if (Array.isArray(parsed)) {
                        state.inserted_components = []
                        parsed.forEach(elem => {
                            state.inserted_components.push(new InsertedComponents(elem))
                        })
                    } else {
                        state.inserted_components = []
                    }
                } else state.newArticle[key] = result[key]
            }
            state.nonEditState = Object.assign({}, state.newArticle)
        },
        change_id_newArticle(state, result) {
            state.newArticle.id = result
        },

        /* INSERT COMPONENT */
        change_list_components(state, result) {
            state.listComponents = result
        },
        delete_component_by_id(state, id) {
            state.deletedComponent = id
        },
        changeSelectedComponent(state, {data, index, component}) {
            const obj = Object.assign({}, {data, index: index, component})
            state.components_after_request.push(obj)
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
        async setListArticles({commit, state}) {
            return new Promise((resolve, reject) => {
                state.loadingList = true
                axios.get(`${this.state.BASE_URL}/entity/articles`, {
                    headers: {
                        Authorization: '666777'
                    },
                })
                    .then((response) => {
                        commit('set_list_articles', response.data.data)
                        state.loadingList = false
                        resolve()
                    })
                    .catch((error) => {
                        console.log('test')
                        state.loadingList = false
                        reject(error)
                    })
            })
        },
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

        /* TAGS */
        async getGeneralTagsArticle({commit, state}) {
            return new Promise((resolve) => {
                state.tagsLoaded = true
                axios.get(`${this.state.BASE_URL}/dictionary/tags`, {
                    headers: {
                        Authorization: '666777'
                    },
                })
                    .then((response) => {
                        state.tagsLoaded = false
                        commit('set_list_general_tags_article', response.data.data)
                        resolve()
                    })
                    .catch(() => {
                        state.tagsLoaded = false
                        resolve()
                    })
            })
        },
        async setNewTagToListArticle({dispatch, state}, newTag) {
            return new Promise((resolve) => {
                state.tagsLoaded = true
                let bodyFormData = new FormData()
                bodyFormData.append('name', newTag)
                axios.post(`${this.state.BASE_URL}/dictionary/tags`, bodyFormData, {
                    headers: {
                        Authorization: '666777'
                    },
                })
                    .then((response) => {
                        //handle success
                        console.log(response);
                        dispatch('getGeneralTagsArticle').then(() => {
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
        createRelationTagArticle({state}, name) {
            return new Promise((resolve, reject) => {
                if (state.newArticle._all_tags.length) {
                    let finded = state.listArticles.filter(elem => {
                        return elem.name === name
                    })
                    state.newArticle._all_tags.forEach(tag => {
                        let mtmIndex = state.newArticle.mtomtags.findIndex(elem => {
                            return elem.id_tag === tag.id
                        })
                        if (mtmIndex === -1) {
                            let tagsFormData = new FormData()
                            tagsFormData.append('id_tag', tag.id)
                            tagsFormData.append('id_article', finded[0].id)
                            // tagsFormData.append('id_answer', finded[0].id_type_answer)
                            axios.post(`${this.state.BASE_URL}/m-to-m/tags`, tagsFormData, {
                                headers: {
                                    Authorization: '666777'
                                },
                            })
                                .then((response) => {
                                    console.log(response)
                                    resolve()
                                })
                                .catch((error) => {
                                    console.log(error)
                                    reject(error)
                                })
                        }
                    })
                }
                resolve()
            })
        },
        deleteRelationTagArticle({state}, id) {
            return new Promise((resolve, reject) => {
                state.loadingArticle = true

                const options = {
                    method: 'DELETE',
                    url: `${this.state.BASE_URL}/m-to-m/tags/${id}`,
                    headers: {
                        Authorization: '666777'
                    },
                }

                axios(options)
                    .then((response) => {
                        //handle success
                        state.loadingArticle = false
                        resolve()
                        console.log(response);
                    })
                    .catch((error) => {
                        //handle error
                        state.loadingArticle = false
                        reject(error)
                    });
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
        async createArticle({dispatch, state, commit}, data) {
            return new Promise((resolve, reject) => {
                state.loadingRequest = true
                state.loadingArticle = true
                let bodyFormData = new FormData()
                for (let key in data) {
                    if (typeof data[key] === 'object' && data[key] !== null) {
                        if (data[key].value) {
                            bodyFormData.append(key, data[key].value)
                        }
                    } else bodyFormData.append(key, data[key])
                }
                const inserted_components = JSON.stringify(state.inserted_components)
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
                        state.loadingRequest = false
                        dispatch('setListArticles').then(() => {
                            dispatch('createRelationTagArticle', data.name.value).then(() => {
                                state.loadingArticle = false
                                resolve()
                            })
                        })
                        commit('change_id_newArticle', response.data.data.id)
                    })
                    .catch((response) => {
                        //handle error
                        state.loadingRequest = false
                        state.loadingArticle = false
                        const data = Object.assign({}, {message: response.response.data.message}, {error: true})
                        commit('change_notification_modal', data, { root: true })
                        reject()
                        console.log(response.response.data.message);
                    });
            })
        },
        updateArticle({dispatch, state}, data) {
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
                requestData['inserted_components'] = JSON.stringify(state.inserted_components)

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
                        dispatch('setListArticles').then(() => {
                            dispatch('createRelationTagArticle', data.name.value).then(() => {
                                resolve()
                            })
                        })
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
        getAuth({commit, state}, params) {
            return new Promise((resolve) => {
                const {index, component} = params

                state.loadingModalList = true

                const data = {
                    name: 'auth'
                }

                commit('changeSelectedComponent', {data, index, component})
                state.loadingModalList = false
                resolve()
            })
        },
        imageFromServer({commit, state}, params) {
            return new Promise((resolve) => {
              const {index, component} = params

              state.loadingModalList = true

              const data = {
                  name: 'image'
              }

              commit('changeSelectedComponent', {data, index, component})
              state.loadingModalList = false
              resolve()
            })
        },
        getComponentsById({commit, state}, params) {
            return new Promise((resolve, reject) => {
                const {index, component} = params

                state.loadingModalList = true
                axios.get(`${this.state.BASE_URL}/entity/${component.name}/${component.id}`, {
                    headers: {
                        Authorization: '666777'
                    },
                })
                    .then((response) => {
                        const data = response.data.data
                        console.log('uploaded COMPONENT')
                        commit('changeSelectedComponent', {data, index, component})
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
        deleteFile({state}, id) {
            state.loadingRequest = true
            return new Promise((resolve) => {

                const options = {
                    method: 'DELETE',
                    url: `${this.state.BASE_URL}/entity/files/${id}`,
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
    getters: {
        getTagsArticle(state) {
            return state.newArticle._all_tags
        }
    },
}
