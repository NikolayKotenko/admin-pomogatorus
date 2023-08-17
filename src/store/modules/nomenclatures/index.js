import Request from "../../../services/request";

export default {
  namespaced: true,
  state: {
    listCharacteristic: [],
    listFamily: [],
    loadingList: false,
    deleteModal: false,
    entry: {
      id: null,
      name: null,
      code: null,
      vendor_code: null,
      family: null,
      characteristics: [],
      e_client_files: [],
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
    setListCharacteristics(state, array) {
      state.listCharacteristic = [];
      if (Array.isArray(array)) {
        state.listCharacteristic = array;
      } else {
        state.listCharacteristic = Object.values(array);
      }
    },
    setListFamily(state, array) {
      state.listFamily = [];
      if (Array.isArray(array)) {
        state.listFamily = array;
      } else {
        state.listFamily = Object.values(array);
      }
    },
    setEntry(state, object) {
      if (object == null) return false;

      state.entry = object;
    },
    clearEntry(state) {
      state.entry = {
        id: null,
        name: null,
        code: null,
        vendor_code: null,
        family: null,
        characteristics: [],
        e_client_files: [],
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

      // await Request.delete(
      //   this.state.BASE_URL +
      //     "/users/delete-user/" +
      //     this.state.UsersModule.entry.id
      // );
      await dispatch("getListEntries");
      commit("clearEntry");

      //END
      commit("changeLoadingList", false);
    },
    async onSubmit({ commit, dispatch }) {
      //START
      commit("changeLoadingList", true);
      let response = null;
      if (location.search.match("create")) {
        response = await dispatch("createEntry", this.state.NomenclaturesModule.entry);
      } else {
        response = await dispatch("updateEntry", this.state.NomenclaturesModule.entry);
      }
      await dispatch("getListEntries", response.data.id);
      await dispatch("clearEntry");

      //END
      commit("changeLoadingList", false);
    },
    // async deleteSetGroupUser(_, idUser) {
    //   // Удаляем все группы пользователя
    //   await Request.delete(
    //     this.state.BASE_URL + "/m-to-m/delete-all-groups-by-user/" + idUser
    //   );
    //
    //   //В цикле добавляем новые группы пользователя
    //   for (const item of this.state.UsersModule.entry.groups) {
    //     const newEntry = new ConstructUserGroups(idUser, item.id);
    //     const response = await Request.post(
    //       this.state.BASE_URL + "/m-to-m/users-groups/",
    //       newEntry
    //     );
    //     console.log(response);
    //     if (response.codeResponse === 409) {
    //       return response;
    //     }
    //   }
    // },
    async createEntry({ commit }, objRequest) {
      try {
        //
        // objRequest.characteristics.forEach((item) => {
        //         console.log(item.characteristic)
        // });

        console.log(objRequest);

        // let nomenclature = {
        //   name: objRequest.name,
        //   vendor_code: objRequest.vendor_code
        // }
        //
        // let response = await Request.post(
        //   this.state.BASE_URL + '/entity/nomenclature',
        //     nomenclature
        // );
        //
        // console.log(response);
      } catch (e) {
        console.log(e);
        commit("change_notification_modal", e, { root: true });
      }
    },
    // async updateEntry({ commit }, objRequest) {
    //   try {
    //     return await Request.put(
    //       this.state.BASE_URL + "/users/update-user-data/" + objRequest.id,
    //       objRequest
    //     );
    //   } catch (e) {
    //     console.log(e);
    //     commit("change_notification_modal", e, { root: true });
    //   }
    // },
    // async getListEntries({ commit }, id) {
    //   commit("changeLoadingList", true);
    //
    //   try {
    //     const result = await Request.get(
    //       this.state.BASE_URL + "/entity/nomenclature"
    //     );
    //     commit("changeListEntries", result.data);
    //     const listEntries = this.state.NomenclaturesModule.listEntries;
    //
    //     const getLocalEntry = () => {
    //       if (id) {
    //         return listEntries.find((elem) => elem.id == id);
    //       }
    //     };
    //     commit("setEntry", getLocalEntry());
    //   } catch (e) {
    //     console.log(e);
    //     commit("change_notification_modal", e, { root: true });
    //   }
    //   commit("changeLoadingList", false);
    // },
    // async getEntry(_, id) {
    //   return await Request.get(
    //     this.state.BASE_URL + "/entity/nomenclature/" + id
    //   );
    // },
    async getListFamily ({ commit }) {
      const response = await Request.get(
        this.state.BASE_URL + "/dictionary/nomenclature-family"
      );
      commit("setListFamily", response.data);
    },
    async getListCharacteristic ({ commit }) {
      const response = await Request.get(
          this.state.BASE_URL + "/dictionary/characteristic/nomenclature"
      );
      commit("setListCharacteristics", response.data);
    },
  },
  getters: {},
};
//
// class ConstructUserGroups {
//   constructor(id_user, id_group) {
//     return {
//       id_user: id_user,
//       id_group: id_group,
//     };
//   }
// }
