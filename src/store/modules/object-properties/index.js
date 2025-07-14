import Request from "../../../services/request";
import { ObjectProperties } from "@/helpers/constructors";

export default {
  namespaced: true,
  state: {
    listEntries: [],
    loadingList: false,
    deleteModal: false,
    entry: new ObjectProperties(),
    listPropertyObject: [],
    listTags: [],
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
    setListPropertyObject(state, array) {
      state.listPropertyObject = [];
      if (Array.isArray(array)) {
        state.listPropertyObject = array;
      } else {
        state.listPropertyObject = Object.values(array);
      }
    },
    setListTags(state, array) {
      state.listTags = [];
      state.listTags = array;
    },
    setEntry(state, object) {
      if (object == null) return false;

      state.entry = object;
    },
    clearEntry(state) {
      state.entry = new ObjectProperties();
    },
    changeLoadingList(state, value) {
      state.loadingList = value;
    },
    deleteModalCommit(state, value) {
      state.deleteModal = value;
    },
  },
  actions: {
    stateModalAction({ commit }, value) {
      commit("deleteModalCommit", value);
    },
    clearEntry({ commit }) {
      commit("clearEntry");
    },
    async deleteEntry({ commit, dispatch }) {
      //START
      commit("changeLoadingList", true);
      commit("deleteModalCommit", false);

      await Request.delete(
        this.state.BASE_URL +
          "/dictionary/object-properties/" +
          this.state.ObjectPropertiesModule.entry.code
      );
      await dispatch("getListEntries");
      commit("clearEntry");

      //END
      commit("changeLoadingList", false);
    },
    async onSubmit({ commit, dispatch }) {
      if (this.state.ObjectPropertiesModule.entry.name == null) return false;

      //START
      commit("changeLoadingList", true);

      let response = null;
      if (location.search.match("create")) {
        response = await dispatch("createEntry");
      } else {
        response = await dispatch(
          "updateEntry",
          this.state.ObjectPropertiesModule.entry
        );
      }
      await dispatch("getListEntries", response.data.code);

      //END
      commit("changeLoadingList", false);
    },
    async createEntry({ commit }) {
      try {
        return await Request.post(
          this.state.BASE_URL + "/dictionary/object-properties",
          this.state.ObjectPropertiesModule.entry
        );
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
    },
    async updateEntry({ commit }, objRequest) {
      try {
        return await Request.put(
          this.state.BASE_URL +
            "/dictionary/object-properties/" +
            objRequest.code,
          objRequest
        );
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
    },
    async getListEntries({ commit }, code) {
      commit("changeLoadingList", true);

      try {
        const selects = [
          "*",
          "d_property_objects",
          "d_dictionaries",
          "mtomtags",
          "m_to_m_tags_tech_task",
        ];
        const query = Request.modifyQuery([], selects);
        const result = await Request.get(
          this.state.BASE_URL + `/dictionary/object-properties${query}`
        );
        commit("changeListEntries", result.data);
        const listEntries = this.state.ObjectPropertiesModule.listEntries;

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
    async getInfoByEntry({ commit, dispatch }) {
      const responsePropertyObject = await Request.get(
        this.state.BASE_URL + "/dictionary/property-object"
      );

      const selects = ["*"];
      const filters = { flag_engineering_system: true };
      const query = Request.modifyQuery(filters, selects);
      const responseTags = await dispatch("getUniversalListTag", query, {
        root: true,
      });
      commit("setListPropertyObject", responsePropertyObject.data);
      commit("setListTags", responseTags.data);
    },
  },
  getters: {},
};
