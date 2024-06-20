import Request from "../../../services/request";
import { Dictionary } from "@/helpers/constructors";

//Entry здесь сам справочник, его атрибуты отдельно обрабатываем
export default {
  namespaced: true,
  state: {
    listEntries: [],
    loadingList: false,
    deleteModal: false,
    entry: new Dictionary(),
    listAttributesByDictionary: [],
    listOccurrencesAttributes: [],
    loadingOccurrencesAttributes: false,
    debounceTimeout: null,
  },
  mutations: {
    changeListEntries(state, array) {
      state.listEntries = [];
      if (Array.isArray(array)) {
        state.listEntries = array;
      } else {
        state.listEntries = Object.values(array);
      }
    },
    setListAttributesByDictionary(state, array) {
      state.listAttributesByDictionary = [];
      state.listAttributesByDictionary = array;
    },
    clearListAttributesByDictionary(state) {
      state.listAttributesByDictionary = [];
    },
    setEntry(state, object) {
      if (!object) state.entry = new Dictionary();
      else state.entry = object;
    },
    clearEntry(state) {
      state.entry = new Dictionary();
    },
    changeLoadingList(state, value) {
      state.loadingList = value;
    },
    changeLoadingOccurrencesAttributes(state, value) {
      state.loadingOccurrencesAttributes = value;
    },
    deleteModalCommit(state, value) {
      state.deleteModal = value;
    },
    setListOccurrencesAttributes(state, value) {
      state.listOccurrencesAttributes = [];
      state.listOccurrencesAttributes = value;
    },
    clearListOccurrencesAttributes(state) {
      state.listOccurrencesAttributes = [];
    },
  },
  actions: {
    stateModalAction({ commit }, value) {
      commit("deleteModalCommit", value);
    },
    async deleteEntry({ commit, dispatch }) {
      //START
      commit("changeLoadingList", true);
      commit("deleteModalCommit", false);

      await Request.delete(
        this.state.BASE_URL +
          "/dictionary/dictionaries/" +
          this.state.DictionariesModule.entry.code
      );
      await dispatch("getListDictionaries");
      commit("clearEntry");

      //END
      commit("changeLoadingList", false);
    },
    async onSubmit({ commit, dispatch }) {
      if (this.state.DictionariesModule.entry.name == null) return false;

      //START
      commit("changeLoadingList", true);

      let response = null;
      if (location.search.match("create")) {
        response = await dispatch("createEntry");
      } else {
        response = await dispatch(
          "updateEntry",
          this.state.DictionariesModule.entry
        );
      }
      await dispatch("getListDictionaries", { code: response.data.code });

      //END
      commit("changeLoadingList", false);
    },
    async createEntry({ commit }) {
      try {
        return await Request.post(
          this.state.BASE_URL + "/dictionary/dictionaries",
          this.state.DictionariesModule.entry
        );
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
    },
    async updateEntry({ commit }, objRequest) {
      try {
        return await Request.put(
          this.state.BASE_URL + "/dictionary/dictionaries/" + objRequest.code,
          objRequest
        );
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
    },
    async getListDictionaries({ commit }, { code, query }) {
      commit("changeLoadingList", true);

      try {
        const result = await Request.get(
          this.state.BASE_URL +
            "/dictionary/dictionaries" +
            Request.ConstructFilterQuery(query)
        );
        commit("changeListEntries", result.data);
        const listEntries = this.state.DictionariesModule.listEntries;

        const getLocalEntry = () => {
          if (code) {
            return listEntries.find((elem) => elem.code == code);
          }
        };
        commit("setEntry", getLocalEntry());
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
      commit("changeLoadingList", false);
    },
    async getEntry(_, code) {
      return await Request.get(
        this.state.BASE_URL + "/dictionary/dictionaries/" + code
      );
    },
    async getListDictionaryAttribute(
      { commit, state },
      additionalQuery = null
    ) {
      commit("changeLoadingList", true);

      const query = Request.ConstructFilterQuery({
        id_dictionary: state.entry.id,
        ...additionalQuery,
      });
      const response = await Request.get(
        this.state.BASE_URL + "/dictionary/dictionary-attributes" + query
      );
      commit("setListAttributesByDictionary", response.data);

      commit("changeLoadingList", false);

      return response;
    },
    async createAttribute({ commit, dispatch }, DictionaryAttribute) {
      commit("changeLoadingList", true);

      const checkExist = await dispatch("getListDictionaryAttribute", {
        code: DictionaryAttribute.code,
      });
      let response;
      if (checkExist.codeResponse === 200) {
        response = await Request.put(
          this.state.BASE_URL +
            "/dictionary/dictionary-attributes/" +
            DictionaryAttribute.code,
          DictionaryAttribute
        );
      } else {
        response = await Request.post(
          this.state.BASE_URL + "/dictionary/dictionary-attributes",
          DictionaryAttribute
        );
      }

      await dispatch("getListDictionaryAttribute");

      commit("changeLoadingList", false);
      return response;
    },
    async deleteAttribute({ commit, dispatch }, codeAttribute) {
      commit("changeLoadingList", true);

      const response = await Request.delete(
        this.state.BASE_URL +
          "/dictionary/dictionary-attributes/" +
          codeAttribute
      );
      await dispatch("getListDictionaryAttribute");

      commit("changeLoadingList", false);
      return response;
    },
    async searchDictionaryAttributeByValue({ commit, state }, string) {
      if (!string) return false;
      if (string.length <= 2) return false;

      const checkExist = state.listOccurrencesAttributes.some(
        (elem) => elem.value === string
      );
      if (checkExist) return false;

      if (state.debounceTimeout) clearTimeout(state.debounceTimeout);
      state.debounceTimeout = setTimeout(async () => {
        commit("changeLoadingOccurrencesAttributes", true);
        const response = await Request.get(
          this.state.BASE_URL +
            "/dictionary/dictionary-attributes/search/{q}?q=" +
            string
        );
        commit("setListOccurrencesAttributes", response.data);
        commit("changeLoadingOccurrencesAttributes", false);
      }, 500);
    },
  },
  getters: {
    getDictionaryByName: (state) => (name) => {
      return state.listEntries.find((obj) => obj.name === name);
    },
  },
};
