import Request from "../../../services/request";

export default {
  namespaced: true,
  state: {
    listEntries: [],
    listGroups: [],
    loadingList: false,
    deleteModal: false,
    entry: {
      id: null,
      email: null,
      groups: [],
      first_name: null,
      last_name: null,
      middle_name: null,
      email_verified_at: null,
      email_state: 0,
      telephone: null,
      telephone_state: 0,
      home_owner: 0,
      installation_engineering_systems: 0,
      selling_engineering_equipment: 0,
      marketing_and_sales: 0,
      id_company: null,
      id_region: null,
      id_locality: null,
      instagram: null,
      vk: null,
      facebook: null,
      tiktok: null,
      created_at: null,
      updated_at: null,
      is_agent: false,
      is_admin: false,
    },
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
    setListGroups(state, array) {
      state.listGroups = [];
      if (Array.isArray(array)) {
        state.listGroups = array;
      } else {
        state.listGroups = Object.values(array);
      }
    },
    setEntry(state, object) {
      if (object == null) return false;

      state.entry = object;
    },
    clearEntry(state) {
      state.entry = {
        id: null,
        email: null,
        groups: [],
        first_name: null,
        last_name: null,
        middle_name: null,
        email_verified_at: null,
        email_state: 0,
        telephone: null,
        telephone_state: 0,
        home_owner: 0,
        installation_engineering_systems: 0,
        selling_engineering_equipment: 0,
        marketing_and_sales: 0,
        id_company: null,
        id_region: null,
        id_locality: null,
        instagram: null,
        vk: null,
        facebook: null,
        tiktok: null,
        created_at: null,
        updated_at: null,
        is_agent: false,
        is_admin: false,
      };
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
          "/users/delete-user/" +
          this.state.UsersModule.entry.id
      );
      await dispatch("getListEntries");
      commit("clearEntry");

      //END
      commit("changeLoadingList", false);
    },
    async onSubmit({ commit, dispatch }) {
      if (this.state.UsersModule.entry.email == null) return false;

      //START
      commit("changeLoadingList", true);

      let response = null;
      if (location.search.match("create")) {
        response = await dispatch("createEntry", this.state.UsersModule.entry);
      } else {
        response = await dispatch("updateEntry", this.state.UsersModule.entry);
      }
      await dispatch("getListEntries", response.data.id);
      await dispatch("clearEntry");

      //END
      commit("changeLoadingList", false);
    },
    async deleteSetGroupUser(_, idUser) {
      // Удаляем все группы пользователя
      await Request.delete(
        this.state.BASE_URL + "/m-to-m/delete-all-groups-by-user/" + idUser
      );

      //В цикле добавляем новые группы пользователя
      for (const item of this.state.UsersModule.entry.groups) {
        const newEntry = new ConstructUserGroups(idUser, item.id);
        const response = await Request.post(
          this.state.BASE_URL + "/m-to-m/users-groups/",
          newEntry
        );
        console.log(response);
        if (response.codeResponse === 409) {
          return response;
        }
      }
    },
    async createEntry({ commit }, objRequest) {
      try {
        return await Request.post(
          this.state.BASE_URL + "/users/set-user-data",
          objRequest
        );
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
    },
    async updateEntry({ commit }, objRequest) {
      try {
        return await Request.put(
          this.state.BASE_URL + "/users/update-user-data/" + objRequest.id,
          objRequest
        );
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
    },
    async getListEntries({ commit }, id) {
      commit("changeLoadingList", true);

      try {
        const selectQuery = ["*", "groups"];
        const query = Request.modifyQuery([], selectQuery);
        const result = await Request.get(
          this.state.BASE_URL + `/users/get-list-users${query}`
        );
        commit("changeListEntries", result.data);
        const listEntries = this.state.UsersModule.listEntries;

        const getLocalEntry = () => {
          if (id) {
            return listEntries.find((elem) => elem.id == id);
          }
        };
        commit("setEntry", getLocalEntry());
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
      commit("changeLoadingList", false);
    },
    async getListGroups({ commit }) {
      const response = await Request.get(
        this.state.BASE_URL + "/entity/groups"
      );
      commit("setListGroups", response.data);
    },
  },
  getters: {},
};

class ConstructUserGroups {
  constructor(id_user, id_group) {
    return {
      id_user: id_user,
      id_group: id_group,
    };
  }
}
