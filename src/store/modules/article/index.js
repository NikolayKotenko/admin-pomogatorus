import _clone from "../../../helpers/deepClone";
import ConstructorElem from "../../../helpers/undo_redo_article";
import Request from "../../../services/request";
import isJson from "../../../helpers/checkJSON";

/* DEFAULT STATE */
const defaultArticle = {
  id: 1,
  name: {
    value: "",
    focused: false,
  },
  short_header: {
    value: "",
    focused: false,
  },
  purpose_of_article: {
    value: "",
    focused: false,
  },

  target_button_placeholder: {
    value: "",
    focused: false,
  },
  target_button_url: {
    value: "",
    focused: false,
  },
  target_main_text: {
    value: "",
    focused: false,
  },
  target_explanation: {
    value: "",
    focused: false,
  },
  target_call_to_action: {
    value: "",
    focused: false,
  },

  preview: {
    value: "",
    focused: false,
  },
  seo_title: {
    value: "",
    focused: false,
  },
  seo_description: {
    value: "",
    focused: false,
  },
  seo_keywords: {
    value: "",
    focused: false,
  },
  activity: "0",
  _all_tags: [],
  mtomtags: [],
};

export default {
  state: {
    /* MAIN ARTICLE */
    loadingList: false,
    articleNotification: "",
    listArticles: [],

    /* dataToCRUD */
    content: "",
    content_from_server: "",
    inserted_components: [],
    loadingInfoArticle: false,
    loadingArticle: false,
    loadingRequest: false,
    listUsersByFilterExpert: [],
    newArticle: {
      id: 1,
      name: {
        value: "",
        focused: false,
      },
      short_header: {
        value: "",
        focused: false,
      },
      purpose_of_article: {
        value: "",
        focused: false,
      },

      target_button_placeholder: {
        value: "",
        focused: false,
      },
      target_button_url: {
        value: "",
        focused: false,
      },
      target_main_text: {
        value: "",
        focused: false,
      },
      target_explanation: {
        value: "",
        focused: false,
      },
      target_call_to_action: {
        value: "",
        focused: false,
      },

      preview: {
        value: "",
        focused: false,
      },
      seo_title: {
        value: "",
        focused: false,
      },
      seo_description: {
        value: "",
        focused: false,
      },
      seo_keywords: {
        value: "",
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
    newTag: "",
    tagSearch: null,
    tagError: {
      isError: false,
      errObj: {},
    },
    showAddTag: false,

    /* INSERT COMPONENT */
    selectedTextURL: "",
    urlText: "",
    urlValue: "",
    selection: null,
    range: null,
    counters: {
      layout: 0,
      image: 0,
      auth: 0,
      questions: 0,
      nomenclature: 0,
      insertedHtml: 0,
      citation: 0
    },
    selectComponent: {
      questions: false,
      image: false,
      auth: false,
      url: false,
      nomenclature: false,
      citation: false
    },
    list_components: [],
    name_component: "",

    list_questions: [],
    components_after_request: [],
    loadingModalList: false,
    selectedComponent: {},
    deletedComponent: 0,
    linkSelection: null,

    /* UNDO/REDO */
    questions_data: [],
    startRender: false,
    isChangedByAction: false,
    txtSave: [], // array to save values.
    txtDisplay: [], // array to display values.

    /* NOMENCLATURE */
    list_nomenclature: [],
    nomenclature_data: [],

    /* CITATION */
    editingCitation: null,

    /** @property {Boolean} - переключаем этот булиан для того чтобы компонент TextRedactor засейвил свое состояние **/
    isSaveArticle: false,
  },
  mutations: {
    /* TOGGLE SAVE ARTICLE */
    toggleSaveArticle(state) {
      state.isSaveArticle = !state.isSaveArticle;
    },

    /* LINK */
    change_link_selection(state, payload) {
      state.linkSelection = payload;
    },

    /* UNDO/REDO */
    change_by_action_editor(state) {
      const index = state.txtDisplay.length;
      const saveCount = state.txtSave.length;
      state.txtSave.splice(index, saveCount);

      const arr = [];
      state.list_components.forEach((elem) => {
        arr.push(_clone(elem.data));
      });
      const inserted_components = JSON.stringify(arr);

      const questions = [];
      state.questions_data.forEach((elem) => {
        questions.push(_clone(elem));
      });
      const JSON_questions = JSON.stringify(questions);

      state.txtDisplay.push(
        new ConstructorElem(
          JSON.stringify(state.content),
          inserted_components,
          JSON_questions
        )
      ); // takes whatever was entered in the input and adds it too the displayed array.
      state.txtSave.push(state.txtDisplay.slice(-1)[0]); // takes the last value in the displayed array and adds it to the end of the saved array.
    },
    undo_editor(state) {
      state.txtDisplay.pop();

      if (state.txtDisplay.length) {
        state.content_from_server = JSON.parse(
          state.txtDisplay.slice(-1)[0].html
        );
        state.components_after_request = JSON.parse(
          state.txtDisplay.slice(-1)[0].components
        );
        state.questions_data = JSON.parse(
          state.txtDisplay.slice(-1)[0].questions
        );
      }
    },
    redo_editor(state) {
      const txtGetLength = state.txtDisplay.length;
      const txtGetValue = state.txtSave[txtGetLength];

      if (txtGetValue) {
        state.txtDisplay.push(txtGetValue);
        state.content_from_server = JSON.parse(txtGetValue.html);
        state.components_after_request = JSON.parse(txtGetValue.components);
        state.questions_data = JSON.parse(txtGetValue.questions);
      }
    },
    change_start_render(state, value) {
      state.startRender = value;
    },
    change_is_changed_by_action(state, value) {
      state.isChangedByAction = value;
    },
    change_questions_data(state, value) {
      state.questions_data = value;
    },
    add_questions_data(state, value) {
      state.questions_data.push(value);
    },

    set_selected_text_url(state, value) {
      state.selectedTextURL = value;
    },
    set_url_text(state, value) {
      state.urlText = value;
    },
    set_url_value(state, value) {
      state.urlValue = value;
    },
    clear_url(state) {
      state.urlText = "";
      state.urlValue = "";
    },

    /* ARTICLE BODY */
    change_loading_modal_list(state, value) {
      state.loadingModalList = value;
    },
    get_range(state, should_collapse) {
      state.range = null;
      if (window.getSelection) {
        state.selection = null;
        state.selection = window.getSelection();
        if (state.selection.getRangeAt && state.selection.rangeCount) {
          state.range = null;
          state.range = state.selection.getRangeAt(0);
          should_collapse ? state.range.collapse(false) : "";
        }
      } else if (document.selection && document.selection.createRange) {
        state.range = null;
        state.range = document.selection.createRange();
        should_collapse ? state.range.collapse(false) : "";
      }
    },
    set_list_questions(state, result) {
      state.list_questions = [];
      if (Array.isArray(result)) {
        state.list_questions = result;
      } else {
        for (let key in result) {
          state.list_questions.push(result[key]);
        }
      }
    },
    change_counter(state, object) {
      const { name, count } = object;
      state.counters[name] = count;
    },
    change_name_component(state, value) {
      state.name_component = value;
    },
    change_select_component(state, object) {
      const { name, value } = object;
      state.selectComponent[name] = value;
    },
    change_range(state, range) {
      state.range = range;
    },

    /* MAIN ARTICLE */
    set_list_articles(state, result) {
      state.listArticles = [];
      if (Array.isArray(result)) {
        state.listArticles = result;
      } else {
        for (let key in result) {
          state.listArticles.push(result[key]);
        }
      }
    },

    /* TAGS */
    clear_list_general_tags_article(state) {
      state.listGeneralTags = [];
    },
    set_list_general_tags_article(state, result) {
      state.listGeneralTags = [];
      state.listGeneralTags = result;
    },

    /* DETAIL ARTICLES */
    set_some_info_article(state, result) {
      state.listUsersByFilterExpert = result;
    },
    set_new_article(state, result) {
      state.newArticle = Object.assign({}, defaultArticle);
      for (let key in result) {
        if (
          key === "name" ||
          key === "short_header" ||
          key === "purpose_of_article" ||
          key === "target_button_placeholder" ||
          key === "target_button_url" ||
          key === "target_main_text" ||
          key === "target_explanation" ||
          key === "target_call_to_action" ||
          key === "preview" ||
          key === "seo_title" ||
          key === "seo_description" ||
          key === "seo_keywords"
        ) {
          state.newArticle[key] = {
            value: result[key] ? result[key] : "",
            focused: false,
          };
        } else if (key === "content") {
          // state.content_from_server = JSON.parse(result[key])
          let parsed = JSON.parse(JSON.parse(result[key]));
          if (typeof parsed === "string") {
            state.content_from_server = parsed;
          } else {
            state.content_from_server = JSON.parse(result[key]);
          }
        } else if (key === "inserted_components") {
          state.components_after_request = [];
          if (JSON.parse(JSON.parse(result[key])).length) {
            let parsed = null;
            parsed = JSON.parse(JSON.parse(JSON.parse(result[key])));
            console.log(parsed);
            if (Array.isArray(parsed)) {
              parsed.forEach((elem) => {
                state.components_after_request.push(elem);
              });
            }
          }
        } else if (key === "activity") {
          state.newArticle[key] = "" + result[key];
        } else state.newArticle[key] = result[key];
      }
      if (state.newArticle.questions && state.newArticle.questions.length) {
        state.questions_data = state.newArticle.questions;
      }
      state.nonEditState = Object.assign({}, state.newArticle);
    },
    change_id_newArticle(state, result) {
      state.newArticle.id = result;
    },

    /* INSERT COMPONENT */
    remove_list_components(state, payload) {
      state.list_components.splice(payload, 1);
    },
    add_to_list_components(state, elem) {
      state.list_components.push(elem);
    },
    clear_list_components(state) {
      state.list_components = [];
    },
    clear_list_questions(state) {
      state.list_questions = [];
    },
    change_list_questions(state, result) {
      state.list_questions = result;
    },
    change_list_nomenclature(state, result) {
      state.list_nomenclature = result;
    },
    delete_component_by_id(state, id) {
      state.deletedComponent = id;
    },
    changeSelectedComponent(state, { data, index, component }) {
      const obj = Object.assign({}, { data, index: index, component });
      state.list_components.push(obj);
    },
    changeContent(state, result) {
      state.content = result;
    },
    changeSelectedObject(state, value) {
      state.selectedComponent = value;
    },
    setEditingCitation(state, data) {
      state.editingCitation = data;
    },
    clearEditingCitation(state) {
      state.editingCitation = null;
    },

    /* CLEANER */
    clean_store(state) {
      state.list_questions = [];
      state.selectedComponent = {};
      for (let key in state.counters) {
        state.counters[key] = 0;
      }
      state.name_component = "";
      state.content_from_server = "";
      state.content = "";
      state.inserted_components = [];
      state.list_components = [];
      state.components_after_request = [];
    },

    /* LOCAL_STORAGE */
    // eslint-disable-next-line no-unused-vars
    set_local_storage({ state }, object) {
      localStorage.setItem("article", JSON.stringify(object));
    },
    remove_local_storage() {
      localStorage.removeItem("article");
    },
    get_from_local_storage() {
      if (localStorage.getItem("article") !== null) {
        this.state.ArticleModule.newArticle = Object.assign({}, defaultArticle);
        this.state.ArticleModule.newArticle = JSON.parse(
          localStorage.getItem("article")
        );
      }
    },
  },
  actions: {
    /* UNDO/REDO */
    getUndo({ commit }) {
      commit("change_is_changed_by_action", true);
      commit("undo_editor");
      commit("change_is_changed_by_action", false);
      commit("change_start_render", true);
    },
    getRedo({ commit }) {
      commit("change_is_changed_by_action", true);
      commit("redo_editor");
      commit("change_is_changed_by_action", false);
      commit("change_start_render", true);
    },

    /* MAIN ARTICLES */
    async setListArticles({ commit, state }) {
      return new Promise((resolve, reject) => {
        state.loadingList = true;
        const selectQuery = ["id", "name", "created_at", "updated_at"];
        const query = Request.modifyQuery([], selectQuery);
        Request.get(`${this.state.BASE_URL}/entity/articles${query}`)
          .then((response) => {
            commit("set_list_articles", response.data);
            state.loadingList = false;
            resolve();
          })
          .catch((error) => {
            state.loadingList = false;
            reject(error);
          });
      });
    },
    async setFilteredListQuestionsModal({ state, commit }, data) {
      return new Promise((resolve, reject) => {
        state.loadingList = true;

        const selectQuery = [
          "id",
          "name",
          "activity",
          "value_type_answer",
          "title",
          "id_type_answer",
          "state_detailed_response",
        ];
        const query = Request.modifyQuery(data, selectQuery);
        Request.get(`${this.state.BASE_URL}/entity/questions${query}`)
          .then((response) => {
            console.log(response);
            commit("set_list_questions", response.data);
            state.loadingList = false;
            resolve();
          })
          .catch((error) => {
            state.loadingList = false;
            commit("set_list_questions", []);
            state.questionNotification = error.response.data.message;
            reject(error);
          });
      });
    },
    async setFilteredListArticles({ state, commit }, query) {
      return new Promise((resolve, reject) => {
        state.loadingList = true;

        Request.get(`${this.state.BASE_URL}/entity/articles${query}`)
          .then((response) => {
            console.log(response.data);
            commit("set_list_articles", response.data);
            state.loadingList = false;
            resolve();
          })
          .catch((error) => {
            state.loadingList = false;
            commit("set_list_articles", []);
            state.articleNotification = error.response.data.message;
            reject(error);
          });
      });
    },

    /* TAGS */
    async getGeneralTagsArticle({ commit, state }) {
      return new Promise((resolve) => {
        state.tagsLoaded = true;
        const selectQuery = ["*"];
        const query = Request.modifyQuery([], selectQuery);
        Request.get(`${this.state.BASE_URL}/dictionary/tags${query}`)
          .then((response) => {
            state.tagsLoaded = false;
            commit("set_list_general_tags_article", response.data);
            resolve();
          })
          .catch(() => {
            state.tagsLoaded = false;
            resolve();
          });
      });
    },
    async setNewTagToListArticle({ dispatch, state }, newTag) {
      return new Promise((resolve) => {
        state.tagsLoaded = true;
        let bodyFormData = {};
        bodyFormData["name"] = newTag;
        Request.post(`${this.state.BASE_URL}/dictionary/tags`, bodyFormData)
          .then((response) => {
            //handle success
            console.log(response);
            dispatch("getGeneralTagsArticle").then(() => {
              state.createdTag = state.listGeneralTags.find((elem) => {
                return elem.name === newTag;
              });
              state.tagsLoaded = false;
              resolve();
            });
          })
          .catch((response) => {
            //handle error
            state.tagsLoaded = false;
            resolve();
            console.log(response.body);
          });
      });
    },
    createRelationTagArticle({ state }, name) {
      return new Promise((resolve, reject) => {
        if (state.newArticle._all_tags.length) {
          state.newArticle._all_tags.forEach((tag) => {
            let mtmIndex = state.newArticle.mtomtags.findIndex((elem) => {
              return elem.id_tag === tag.id;
            });
            if (mtmIndex === -1) {
              Request.post(`${this.state.BASE_URL}/m-to-m/tags`, {
                id_tag: tag.id,
                id_article: state.newArticle.id,
              })
                .then((response) => {
                  console.log(response);
                  resolve();
                })
                .catch((error) => {
                  console.log(error);
                  reject(error);
                });
            }
          });
        }
        resolve();
      });
    },
    deleteRelationTagArticle({ state }, id) {
      return new Promise((resolve, reject) => {
        state.loadingArticle = true;

        Request.delete(`${this.state.BASE_URL}/m-to-m/tags/${id}`)
          .then((response) => {
            //handle success
            state.loadingArticle = false;
            resolve();
            console.log(response);
          })
          .catch((error) => {
            //handle error
            state.loadingArticle = false;
            reject(error);
          });
      });
    },

    /* CRUD */
    async getDetailArticleInfo({ commit, state }) {
      state.loadingInfoArticle = true;
      return new Promise((resolve, reject) => {
        const selects = ["*"];
        const filters = {
          confirmed_users: "true",
          is_admin: "false",
        };
        const query = Request.modifyQuery(filters, selects);
        Request.get(`${this.state.BASE_URL}/users/get-list-users${query}`)
          .then((response) => {
            commit("set_some_info_article", response.data);
            state.loadingInfoArticle = false;
            resolve();
          })
          .catch((error) => {
            //handle error
            state.loadingInfoArticle = false;
            reject(error);
            console.log(error.body);
          });
      });
    },
    async getDetailArticle({ commit, state }, id) {
      state.loadingArticle = true;
      return new Promise((resolve, reject) => {
        const selectQuery = ["*", "_all_tags", "mtomtags", "e_client_files"];
        const query = Request.modifyQuery([], selectQuery);
        Request.get(`${this.state.BASE_URL}/entity/articles/${id}${query}`)
          .then((response) => {
            commit("set_new_article", response.data);
            state.loadingArticle = false;
            resolve();
          })
          .catch((error) => {
            //handle error
            state.loadingArticle = false;
            reject(error);
            console.log(error.body);
          });
      });
    },
    async createArticle({ dispatch, state, commit }, data) {
      return new Promise((resolve, reject) => {
        state.loadingRequest = true;
        // state.loadingArticle = true
        let bodyFormData = {};
        for (let key in data) {
          if (typeof data[key] === "object" && data[key] !== null) {
            if (data[key].value) {
              bodyFormData[key] = data[key].value;
            }
          } else bodyFormData[key] = data[key];
        }
        const arr = [];
        state.list_components.forEach((elem) => {
          arr.push(elem.data);
        });
        const inserted_components = JSON.stringify(arr);
        bodyFormData["code"] = data.name.value;
        bodyFormData["content"] = JSON.stringify(state.content);
        bodyFormData["inserted_components"] = inserted_components;
        bodyFormData["name_param_env"] = "";

        Request.post(`${this.state.BASE_URL}/entity/articles`, bodyFormData)
          .then((response) => {
            //handle success
            state.loadingRequest = false;
            dispatch("createRelationTagArticle", data.name.value).then(() => {
              // state.loadingArticle = false
              resolve();
            });
            commit("change_id_newArticle", response.data.id);
          })
          .catch((response) => {
            //handle error
            state.loadingRequest = false;
            // state.loadingArticle = false
            const data = Object.assign(
              {},
              { message: response.response.data.message },
              { error: true }
            );
            commit("change_notification_modal", data, { root: true });
            reject();
            console.log(response.response.data.message);
          });
      });
    },
    updateArticle({ dispatch, state }, { data, isEditor }) {
      return new Promise((resolve) => {
        state.loadingRequest = true;
        // state.loadingArticle = true;
        const requestData = {};
        for (let key in data) {
          if (typeof data[key] === "object" && !Array.isArray(data[key])) {
            if (data[key] !== null && data[key].value) {
              requestData[key] = data[key].value;
            }
          } else requestData[key] = data[key];
        }

        if (isEditor) {
          requestData["content"] = state.content
            ? JSON.stringify(state.content)
            : JSON.stringify(state.content_from_server);
          const arr = [];

          state.list_components.forEach((elem) => {
            arr.push(elem.data);
          });
          requestData["inserted_components"] = JSON.stringify(
            JSON.stringify(arr)
          );
        } else {
          if (isJson(requestData["content"])) {
            requestData["content"] = JSON.parse(requestData["content"]);
          }
          if (isJson(requestData["inserted_components"])) {
            requestData["inserted_components"] = JSON.parse(
              requestData["inserted_components"]
            );
          }
        }

        Request.put(
          `${this.state.BASE_URL}/entity/articles/${data.id}`,
          requestData
        )
          .then((response) => {
            //handle success
            state.loadingRequest = false;
            // state.loadingArticle = false;
            dispatch("createRelationTagArticle", data.name.value).then(() => {
              resolve();
            });
            console.log(response);
          })
          .catch((response) => {
            //handle error
            state.loadingRequest = false;
            // state.loadingArticle = false;
            resolve();
            console.log(response.body);
          });
      });
    },
    deleteArticle({ state }, data) {
      state.loadingRequest = true;
      return new Promise((resolve) => {
        Request.delete(`${this.state.BASE_URL}/entity/articles/${data.id}`)
          .then((response) => {
            //handle success
            state.loadingRequest = false;
            resolve();
            console.log(response);
          })
          .catch((response) => {
            //handle error
            state.loadingRequest = false;
            resolve();
            console.log(response.body);
          });
      });
    },

    /* INSERT COMPONENT */
    deleteComponent({ commit }, id) {
      commit("delete_component_by_id", id);
    },
    get_auth({ commit, state, rootState }, params) {
      rootState.AuthModule.inserting_component = true;
      return new Promise((resolve) => {
        const { index, component } = params;

        state.loadingModalList = true;

        const data = {
          name: "auth",
        };

        commit("changeSelectedComponent", { data, index, component });
        state.loadingModalList = false;
        resolve();
      });
    },
    get_image({ commit, state }, params) {
      return new Promise((resolve) => {
        const { index, component } = params;

        state.loadingModalList = true;

        const data = {
          name: "image",
        };

        commit("changeSelectedComponent", { data, index, component });
        state.loadingModalList = false;
        resolve();
      });
    },
    get_questions({ commit, state }, params) {
      return new Promise((resolve, reject) => {
        const { index, component } = params;

        state.loadingModalList = true;
        const selects = [
          "id",
          "name",
          "id_type_answer",
          "activity",
          "value_type_answer",
          "state_detailed_response",
        ];
        const query = Request.modifyQuery([], selects);
        Request.get(
          `${this.state.BASE_URL}/entity/${component.name}/${component.id}${query}`
        )
          .then((response) => {
            const data = response.data;
            commit("changeSelectedComponent", { data, index, component });
            state.loadingModalList = false;
            resolve();
          })
          .catch((error) => {
            state.loadingModalList = false;
            reject(error);
          });
      });
    },
    get_nomenclature({ commit, state }, params) {
      return new Promise((resolve) => {
        const { index, component } = params;

        state.loadingModalList = true;

        const data = {
          name: "nomenclature",
          id: component.id,
          nomenclatures_id: component.nomenclatures_id,
          index_nomenclature: component.index_nomenclature,
        };

        commit("changeSelectedComponent", { data, index, component });
        state.loadingModalList = false;
        resolve();
      });
    },
    async get_citation({ commit }, elem) {
      try {
        // TODO: Раскомментируй когда бэк будет готов
        // const result = await Request.get(
        //   `${this.state.BASE_URL}/entity/citation/${elem.component.id}`
        // );
        // 
        // commit("changeSelectedComponent", {
        //   data: result.data, // Ожидается: {id, title, text, user_id}
        //   index: elem.index,
        //   component: elem.component,
        // });
        
        // === ВРЕМЕННАЯ ЗАГЛУШКА (удалить когда бэк готов) ===
        commit("changeSelectedComponent", {
          data: elem.component, // Берём данные из HTML
          index: elem.index,
          component: elem.component,
        });
        
      } catch (error) {
        console.error('Ошибка получения цитаты:', error);
      }
    },
    getListQuestions({ commit, state }, params) {
      return new Promise((resolve, reject) => {
        state.loadingModalList = true;

        const selects = [
          "id",
          "name",
          "activity",
          "value_type_answer",
          "title",
          "id_type_answer",
          "state_detailed_response",
        ];
        const query = Request.modifyQuery([], selects);
        Request.get(`${this.state.BASE_URL}/entity/${params}${query}`)
          .then((response) => {
            commit("change_list_questions", response.data);
            state.loadingModalList = false;
            resolve();
          })
          .catch((error) => {
            state.loadingModalList = false;
            reject(error);
          });
      });
    },
    getListNomenclature({ commit, state }, params) {
      return new Promise((resolve, reject) => {
        state.loadingModalList = true;
        const selects = ["*", "_family"];
        const query = Request.modifyQuery([], selects);
        Request.get(`${this.state.BASE_URL}/entity/${params}${query}`)
          .then((response) => {
            commit("change_list_nomenclature", response.data);
            state.loadingModalList = false;
            resolve();
          })
          .catch((error) => {
            state.loadingModalList = false;
            reject(error);
          });
      });
    },
    deleteFile({ state }, id) {
      state.loadingRequest = true;
      return new Promise((resolve) => {
        Request.delete(`${this.state.BASE_URL}/entity/files/${id}`)
          .then((response) => {
            //handle success
            state.loadingRequest = false;
            resolve();
            console.log(response);
          })
          .catch((response) => {
            //handle error
            state.loadingRequest = false;
            resolve();
            console.log(response.body);
          });
      });
    },

    /* LOCAL_STORAGE */
    setLocalStorageArticle({ commit }, object) {
      commit("set_local_storage", object);
    },
    removeLocalStorageArticle({ commit }) {
      commit("remove_local_storage");
    },
    getFromLocalStorageArticle({ commit }) {
      return new Promise((resolve) => {
        commit("get_from_local_storage");
        resolve();
      });
    },
  },
  getters: {
    getTagsArticle(state) {
      return state.newArticle._all_tags;
    },
    getArticleImages(state) {
      if (!state.list_components.length) {
        return [];
      }
      return state.list_components.filter((component) => {
        return component.data.component.name === "image";
      });
    },
  },
};
