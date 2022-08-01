import axios from "axios";
import qs from "qs";

import ConstructorElem from "../../../helpers/undo_redo_article";

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
        selection: null,
        range: null,
        counters: {
            layout: 0,
            image: 0,
            auth: 0,
            questions: 0,
        },
        selectComponent: {
            questions: false,
            image: false,
            auth: false,
        },
        list_components: [],
        name_component: '',

        list_questions: [],
        components_after_request: [],
        loadingModalList: false,
        selectedComponent: {},
        deletedComponent: 0,

        /* UNDO/REDO */
        startRender: false,
        txtSave: [], // array to save values.
        txtDisplay: [],// array to display values.
    },
    mutations: {
        /* UNDO/REDO */
        change_by_action_editor(state) {
            const index = state.txtDisplay.length;
            const saveCount = state.txtSave.length;
            state.txtSave.splice(index, saveCount);

            state.txtDisplay.push(new ConstructorElem(JSON.stringify(state.content), state.list_components)); // takes whatever was entered in the input and adds it too the displayed array.
            state.txtSave.push(state.txtDisplay.slice(-1)[0]); // takes the last value in the displayed array and adds it to the end of the saved array.

            console.log(state.txtDisplay.map(elem => elem.html))
        },
        undo_editor(state) {
            state.txtDisplay.pop();

            if (state.txtDisplay.length) {
                state.content_from_server = JSON.parse(state.txtDisplay.slice(-1)[0].html)
                state.list_components = state.txtDisplay.slice(-1)[0].components
            }
        },
        redo_editor(state) {
            const txtGetLength = state.txtDisplay.length;
            const txtGetValue = state.txtSave[txtGetLength];

            if (txtGetValue) {
                state.txtDisplay.push(txtGetValue);
                state.content_from_server = JSON.parse(txtGetValue.html)
                state.list_components = txtGetValue.components
            }
        },
        change_start_render(state, value) {
            state.startRender = value
        },

        change_loading_modal_list(state, value) {
            state.loadingModalList = value
        },
        get_range(state, should_collapse) {
            state.range = null
            if (window.getSelection) {
                state.selection = null
                state.selection = window.getSelection();
                if (state.selection.getRangeAt && state.selection.rangeCount) {
                    state.range = null
                    state.range = state.selection.getRangeAt(0);
                    should_collapse ? state.range.collapse(false) : ''
                }
            } else if (document.selection && document.selection.createRange) {
                state.range = null
                state.range = document.selection.createRange();
                should_collapse ? state.range.collapse(false) : ''
            }
        },
        set_list_questions(state, result) {
            state.list_questions = []
            if (Array.isArray(result)) {
                state.list_questions = result
            } else {
                for (let key in result) {
                    state.list_questions.push(result[key])
                }
            }

        },
        change_counter(state, object) {
            const {name, count} = object
            state.counters[name] = count
        },
        change_name_component(state, value) {
            state.name_component = value
        },
        change_select_component(state, object) {
            const {name, value} = object
            state.selectComponent[name] = value
        },

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
                    state.components_after_request = []
                    if (JSON.parse(JSON.parse(result[key])).length) {
                        let parsed = null
                        parsed = JSON.parse(JSON.parse(JSON.parse(result[key])))
                        console.log(parsed)
                        if (Array.isArray(parsed)) {
                            parsed.forEach(elem => {
                                state.components_after_request.push(elem)
                            })
                        }
                    }
                } else state.newArticle[key] = result[key]
            }
            state.nonEditState = Object.assign({}, state.newArticle)
        },
        change_id_newArticle(state, result) {
            state.newArticle.id = result
        },

        /* INSERT COMPONENT */
        add_to_list_components(state, elem) {
          state.list_components.push(elem)
        },
        change_list_components(state, result) {
            state.list_questions = result
        },
        delete_component_by_id(state, id) {
            state.deletedComponent = id
        },
        changeSelectedComponent(state, {data, index, component}) {
            const obj = Object.assign({}, {data, index: index, component})
            state.list_components.push(obj)
        },
        changeContent(state, result) {
            state.content = result
        },
        changeSelectedObject(state, value) {
            state.selectedComponent = value
        },

        /* CLEANER */
        clean_store(state) {
            state.list_questions = []
            state.selectedComponent = {}
            for (let key in state.counters) {
                state.counters[key] = 0
            }
            state.name_component = ''
            state.content_from_server = ''
            state.content = ''
            state.inserted_components = []
            state.list_components = []
            state.components_after_request = []
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
                this.state.ArticleModule.newArticle = Object.assign({}, defaultArticle)
                this.state.ArticleModule.newArticle = JSON.parse(localStorage.getItem('article'))
            }
        },
    },
    actions: {
        /* UNDO/REDO */
        getUndo({commit}) {
            commit('undo_editor')
            commit('change_start_render', true)
        },
        getRedo({commit}) {
            commit('redo_editor')
            commit('change_start_render', true)
        },

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
        async setFilteredListQuestionsModal({state, commit}, data) {
            return new Promise((resolve, reject) => {
                state.loadingList = true

                const {tag, updated_at, name} = data

                const filter = {}
                filter['filter[tag]'] = tag
                filter['filter[updated_at]'] = updated_at
                filter['filter[name]'] = name

                axios.get(`${this.state.BASE_URL}/entity/questions`, {
                    headers: {
                        Authorization: '666777'
                    },
                    params: {
                        ...filter
                    }
                })
                    .then((response) => {
                        console.log(response)
                        commit('set_list_questions', response.data.data)
                        state.loadingList = false
                        resolve()
                    })
                    .catch((error) => {
                        state.loadingList = false
                        commit('set_list_questions', [])
                        state.questionNotification = error.response.data.message
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
                // state.loadingArticle = true
                let bodyFormData = new FormData()
                for (let key in data) {
                    if (typeof data[key] === 'object' && data[key] !== null) {
                        if (data[key].value) {
                            bodyFormData.append(key, data[key].value)
                        }
                    } else bodyFormData.append(key, data[key])
                }
                const arr = []
                state.list_components.forEach(elem => {
                  arr.push(elem.data)
                })
                const inserted_components = JSON.stringify(arr)
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
                                // state.loadingArticle = false
                                resolve()
                            })
                        })
                        commit('change_id_newArticle', response.data.data.id)
                    })
                    .catch((response) => {
                        //handle error
                        state.loadingRequest = false
                        // state.loadingArticle = false
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
                // state.loadingArticle = true
                const requestData = {}
                for (let key in data) {
                    if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
                        if (data[key] !== null && data[key].value) {
                            requestData[key] = data[key].value
                        }
                    } else requestData[key] = data[key]
                }
                requestData['content'] = JSON.stringify(state.content)
                const arr = []
                state.list_components.forEach(elem => {
                    arr.push(elem.data)
                })
                requestData['inserted_components'] = JSON.stringify(JSON.stringify(arr))

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
                        // state.loadingArticle = false
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
                        // state.loadingArticle = false
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
        get_auth({commit, state, rootState}, params) {
            rootState.AuthModule.inserting_component = true
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
        get_image({commit, state}, params) {
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
        get_questions({commit, state}, params) {
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
        getListQuestions({commit, state}, params) {
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
    },
    getters: {
        getTagsArticle(state) {
            return state.newArticle._all_tags
        }
    },
}
