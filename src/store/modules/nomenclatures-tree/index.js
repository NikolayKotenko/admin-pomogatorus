import Request from "@/services/request";
import {
  CharacteristicNomenclature,
  NomenclaturesTreeLeaf,
  Nomenclature,
  MtoMNomenclatureCharacteristics,
  DTypeCharacteristics,
  Dictionary,
} from "@/helpers/constructors";
import Logging from "@/services/logging";

export default {
  namespaced: true,
  state: {
    //Семейство
    newFamily: new NomenclaturesTreeLeaf(),
    selectedFamily: new NomenclaturesTreeLeaf(),
    idParentFamily: null,
    dialogFamily: false,
    listFamiliesBySearch: [],

    //Характеристики
    listCharacteristicsBySearch: [],
    listMtoMNomenclaturesCharacteristics: [],
    listCharacteristicsByFamily: [],
    newCharacteristics: new CharacteristicNomenclature(),
    dialogCharacteristics: false,
    listTypeCharacteristics: [],
    dialogDeleteCharacteristic: false,
    selectedCharacteristic: new MtoMNomenclatureCharacteristics(),

    //Номенклатура
    newNomenclature: new Nomenclature(),
    listNomenclaturesBySearch: [],
    listNomenclatureByFamily: [],
    dialogNomenclature: false,
    responseAddCharacteristics: new Logging(),
    responseAddNomenclature: new Logging(),
    dialogDeleteNomenclature: false,
    selectedNomenclature: new Nomenclature(),

    //Общие
    loading: false,
    debounceTimeout: null,
    tree: [
      // {
      //   id_family: 4,
      //   name_leaf: "Котлы",
      //   id_parent: null,
      //   depth_level: null,
      // },
    ],
    dictionaryUnits: new Dictionary(),
  },
  mutations: {
    changeLoading(state, value) {
      state.loading = value;
    },
    setDictionaryUnits(state, payload = Dictionary) {
      if (!payload) {
        state.dictionaryUnits = new Dictionary();
      }
      state.dictionaryUnits = new Dictionary(
        payload.id,
        payload.name,
        payload.code,
        payload.flag_nomenclature,
        payload.flag_objects,
        payload.d_dictionary_attributes
      );
    },
    // Семейства
    openDialogFamily(state, idCurObj) {
      state.idParentFamily = idCurObj;
      state.dialogFamily = true;
    },
    closeDialogFamily(state) {
      state.dialogFamily = false;

      setTimeout(() => {
        state.newFamily = new NomenclaturesTreeLeaf();
        state.idParentFamily = null;
      }, 300);
    },
    clearListFamiliesBySearch(state) {
      state.listFamiliesBySearch = [];
    },
    setListFamiliesBySearch(state, payload) {
      state.listFamiliesBySearch = [];
      state.listFamiliesBySearch = payload;
    },
    setNewFamily(state, payload = NomenclaturesTreeLeaf) {
      state.newFamily = payload;
    },
    clearNewFamily(state) {
      state.newFamily = new NomenclaturesTreeLeaf();
    },

    // Характеристики
    setListTypeCharacteristics(state, payload) {
      state.listTypeCharacteristics = [];
      state.listTypeCharacteristics = payload;
    },
    closeDialogCharacteristics(state) {
      state.dialogCharacteristics = false;
      state.newCharacteristics = new CharacteristicNomenclature();
      state.responseAddCharacteristics = new Logging();
    },
    openDialogCharacteristics(state) {
      state.dialogCharacteristics = true;
    },
    setListCharacteristicsBySearch(state, payload) {
      state.listCharacteristicsBySearch = [];

      state.listCharacteristicsBySearch = payload.map((itemChar) => {
        const listFamilies = state.listMtoMNomenclaturesCharacteristics
          .map((itemMtoM) => {
            if (itemMtoM.id_characteristic !== itemChar.id) return null;
            return itemMtoM._family.name;
          })
          .filter((item) => Boolean(item));
        itemChar._listFamilies = [...new Set(listFamilies)];
        const stringListFamilies = itemChar._listFamilies.join(", ");
        if (stringListFamilies.length) {
          itemChar.name =
            itemChar.name + " (исп. в семействах: " + stringListFamilies + ")";
        }
        return itemChar;
      });
    },
    setListCharacteristicsByFamily(state, payload) {
      state.listCharacteristicsByFamily = [];
      state.listCharacteristicsByFamily = payload;
    },
    setListMtoMNomenclaturesCharacteristics(state, payload) {
      state.listMtoMNomenclaturesCharacteristics = [];
      state.listMtoMNomenclaturesCharacteristics = payload;
    },
    setNewCharacteristics(state, payload = CharacteristicNomenclature) {
      state.newCharacteristics = new CharacteristicNomenclature(
        payload.id,
        payload.name,
        payload.code,
        payload.description,
        payload.postfix,
        payload.id_type_characteristic,
        payload.id_dictionary,
        payload.type_characteristic,
        payload.dictionary
      );
    },
    setSelectedFamily(state, payload = NomenclaturesTreeLeaf) {
      state.selectedFamily = new NomenclaturesTreeLeaf(
        payload.id_family,
        payload.id_parent,
        payload.name_leaf,
        payload.depth_level,
        payload.children
      );
    },
    addChild(state, curEntry) {
      if (!curEntry.children) {
        this._vm.$set(curEntry, "children", []);
      }

      curEntry.children.push(state.newFamily);

      state.dialogFamily = false;
    },
    setTypeCharacteristic(state, payload = DTypeCharacteristics) {
      if (!payload) {
        state.newCharacteristics.type_characteristic =
          new DTypeCharacteristics();
        state.newCharacteristics.id_type_characteristic = null;

        //Также очищаем справочники
        state.newCharacteristics.dictionary = new Dictionary();
        state.newCharacteristics.id_dictionary = null;
        return false;
      }

      state.newCharacteristics.id_type_characteristic = payload.id;
      state.newCharacteristics.type_characteristic = new DTypeCharacteristics(
        payload.id,
        payload.name,
        payload.code
      );
    },
    setDictionaryCharacteristic(state, payload = Dictionary) {
      if (!payload) {
        state.newCharacteristics.dictionary = new Dictionary();
        state.newCharacteristics.id_dictionary = null;
        return false;
      }

      state.newCharacteristics.id_dictionary = payload.id;
      state.newCharacteristics.dictionary = new Dictionary(
        payload.id,
        payload.name,
        payload.code,
        payload.flag_nomenclature,
        payload.flag_objects,
        payload.d_dictionary_attributes
      );
    },
    setDescriptionCharacteristic(state, string) {
      if (!string) {
        state.newCharacteristics.description = "";
        return false;
      }
      state.newCharacteristics.description = string;
    },
    setPostfixCharacteristic(state, string) {
      console.log("setPostfixCharacteristic", string);
      if (!string) {
        state.newCharacteristics.postfix = "";
        return false;
      }
      state.newCharacteristics.postfix = string;
    },
    openDialogDeleteCharacteristic(state) {
      state.dialogDeleteCharacteristic = true;
    },
    closeDialogDeleteCharacteristic(state) {
      state.dialogDeleteCharacteristic = false;
      state.selectedCharacteristic = new MtoMNomenclatureCharacteristics();
    },
    clearResponseAddCharacteristics(state) {
      state.responseAddCharacteristics = new Logging();
    },
    clearListCharacteristicsBySearch(state) {
      state.listCharacteristicsBySearch = [];
    },
    clearNewCharacteristics(state) {
      state.newCharacteristics = new CharacteristicNomenclature();
    },
    setSelectedCharacteristic(
      state,
      payload = MtoMNomenclatureCharacteristics
    ) {
      state.selectedCharacteristic = payload;
    },

    setResponseAddCharacteristic(state, payload = Logging) {
      state.responseAddCharacteristics = new Logging();
      state.responseAddCharacteristics = new Logging(payload);
    },

    // Дерево
    setTree(state, payload) {
      state.tree = [];
      state.tree = payload;
    },

    // Номенклатура
    openDialogDeleteNomenclature(state) {
      state.dialogDeleteNomenclature = true;
    },
    closeDialogDeleteNomenclature(state) {
      state.dialogDeleteNomenclature = false;
      state.selectedNomenclature = new Nomenclature();
    },
    closeDialogNomenclature(state) {
      state.dialogNomenclature = false;
      state.newNomenclature = new Nomenclature();
      state.responseAddNomenclature = new Logging();
      state.listNomenclaturesBySearch = [];
    },
    openDialogNomenclature(state) {
      state.dialogNomenclature = true;
    },

    clearNewNomenclature(state) {
      state.newNomenclature = new Nomenclature();
    },
    clearListNomenclaturesBySearch(state) {
      state.listNomenclaturesBySearch = [];
    },
    setListNomenclaturesBySearch(state, payload) {
      state.listNomenclaturesBySearch = [];

      // Изменяем приходящий с бэка масив
      payload.map((item) => {
        if (item.id_family) {
          item.name =
            item.name + " существует в семействе - '" + item._family.name + "'";
        }
      });
      state.listNomenclaturesBySearch = payload;
    },
    setListNomenclatureByFamily(state, payload) {
      state.listNomenclatureByFamily = [];
      state.listNomenclatureByFamily = payload;
    },
    setNewNomenclature(state, payload = Nomenclature) {
      state.newNomenclature = new Nomenclature(
        payload.id,
        payload.name,
        payload.code,
        payload.vendor_code,
        payload.id_family,
        payload.seo_title,
        payload.seo_description,
        payload.seo_keywords
      );
    },
    setSelectedNomenclature(state, payload = Nomenclature) {
      state.selectedNomenclature = new Nomenclature(
        payload.id,
        payload.name,
        payload.code,
        payload.vendor_code,
        payload.id_family,
        payload.seo_title,
        payload.seo_description,
        payload.seo_keywords
      );
    },
    setResponseAddNomenclature(state, payload = Logging) {
      state.responseAddNomenclature = new Logging();
      state.responseAddNomenclature = new Logging(payload);
    },
    clearResponseAddNomenclature(state) {
      state.responseAddNomenclature = new Logging();
    },
  },
  actions: {
    async getDictionaryUnits({ commit, dispatch }) {
      const response = await dispatch(
        "DictionariesModule/getListDictionaries",
        {
          query: { codes: ["edenicy-izmereniya"] },
          code: "edenicy-izmereniya",
        },
        { root: true }
      );
      console.log("response", response);
      commit("setDictionaryUnits", response);
    },

    async deleteEntry({ commit, dispatch }, id_family) {
      //START
      commit("changeLoading", true);

      await Request.delete(
        this.state.BASE_URL + "/entity/nomenclatures-tree/" + id_family
      );
      await dispatch("getTreeOnMount");

      //END
      commit("changeLoading", false);
    },
    async getFamilyBySearch({ state, rootState, commit }, string) {
      if (!string) return false;
      if (string.length <= 2) return false;

      const checkExist = state.listFamiliesBySearch.some(
        (elem) => elem.name === string
      );
      if (checkExist) return false;

      if (state.debounceTimeout) clearTimeout(state.debounceTimeout);
      state.debounceTimeout = setTimeout(async () => {
        commit("changeLoading", true);

        const response = await Request.get(
          `${rootState.BASE_URL}/dictionary/nomenclature-family/search/{q}?q=${string}`
        );
        commit("setListFamiliesBySearch", response.data);
        commit("changeLoading", false);

        return response;
      }, 500);
    },
    async setFamilyByName({ state, rootState, commit }, name) {
      if (!name) return false;

      const existFamily = state.listFamiliesBySearch.find(
        (item) => item.name === name
      );
      if (existFamily) {
        commit(
          "setNewFamily",
          new NomenclaturesTreeLeaf(
            existFamily.id,
            state.idParentFamily,
            existFamily.name,
            state.newFamily.depth_level
          )
        );
        return false;
      }

      commit("changeLoading", true);

      const { data } = await Request.post(
        rootState.BASE_URL + "/dictionary/nomenclature-family",
        {
          name: name,
        }
      );
      commit(
        "setNewFamily",
        new NomenclaturesTreeLeaf(
          data.id,
          state.idParentFamily,
          data.name,
          state.newFamily.depth_level
        )
      );
      commit("changeLoading", false);
    },
    async clearListFamiliesBySearchAction({ commit }) {
      commit("clearListFamiliesBySearch");
    },
    async addChildAction({ state, rootState, commit, dispatch }) {
      commit("changeLoading", true);

      const { data } = await Request.post(
        rootState.BASE_URL + "/entity/nomenclatures-tree",
        state.newFamily
      );
      console.log("Response data", data);

      await dispatch("getTreeOnMount");
      commit("closeDialogFamily");
      commit("changeLoading", false);
    },
    async getTreeOnMount({ rootState, commit }) {
      commit("changeLoading", true);

      const { data } = await Request.get(
        rootState.BASE_URL +
          "/entity/nomenclatures-tree/get-tree-by-first-level-leaf"
      );
      commit("setTree", data);
      commit("changeLoading", false);
    },
    async setSelectedFamilyAction(
      { state, commit, dispatch, getters },
      NomenclaturesTreeLeaf
    ) {
      commit("setSelectedFamily", NomenclaturesTreeLeaf);

      //Запрашиваем MToM используется на любом уровне лепестка дерева
      await dispatch(
        "getMToMNomenclatureCharacteristics",
        state.selectedFamily.id_family
      );

      if (getters.getStateExistChildren) return false;

      //TODO Здесь нужно еще
      // определить характеристики по умолчанию в бд

      //Запрашиваем список номенклатуры у последней сущности
      await dispatch("getNomenclatureByFamily", state.selectedFamily.id_family);
    },

    // Характеристики
    async setCharacteristicOnFamily({ state, rootState, commit }, name) {
      if (!name) return false;

      const entry = state.listCharacteristicsBySearch.find(
        (item) => item.name === name
      );
      if (entry) {
        commit("setNewCharacteristics", entry);
        return entry;
      }

      commit("changeLoading", true);
      const { data } = await Request.post(
        rootState.BASE_URL + "/dictionary/characteristic/nomenclature",
        { name: name }
      );
      commit("setNewCharacteristics", data);
      commit("changeLoading", false);
      return data;
    },
    async getCharacteristicsBySearch({ state, rootState, commit }, string) {
      if (!string) return false;
      if (string.length <= 2) return false;

      const checkExist = state.listCharacteristicsBySearch.some(
        (elem) => elem.name === string
      );
      if (checkExist) return false;

      if (state.debounceTimeout) clearTimeout(state.debounceTimeout);
      state.debounceTimeout = setTimeout(async () => {
        commit("changeLoading", true);

        const { data } = await Request.get(
          `${rootState.BASE_URL}/dictionary/characteristic/nomenclature/search/{q}?q=${string}`
        );
        commit("setListCharacteristicsBySearch", data);
        commit("changeLoading", false);
      }, 1000);
    },
    async getCharacteristics({ rootState, commit }, idFamily) {
      commit("changeLoading", true);

      const { data } = await Request.get(
        rootState.BASE_URL +
          "/dictionary/characteristic/nomenclature" +
          Request.ConstructFilterQuery({
            id_family: idFamily,
          })
      );
      commit("setListCharacteristicsByFamily", data);
      commit("changeLoading", false);
    },

    async getMToMNomenclatureCharacteristics({ rootState, commit }, idFamily) {
      commit("changeLoading", true);

      const { data } = await Request.get(
        rootState.BASE_URL +
          "/m-to-m/nomenclature-characteristics" +
          Request.ConstructFilterQuery({ id_family: idFamily })
      );
      commit("setListMtoMNomenclaturesCharacteristics", data);
      commit("changeLoading", false);
    },
    async setMToMCharacteristicsNomenclature(
      { state, rootState, commit, dispatch },
      {
        id,
        id_characteristic,
        id_nomenclature,
        value,
        is_nomenclature,
        required_fill_in_nomenclature,
      }
    ) {
      commit("changeLoading", true);

      let response = new Logging();
      // Если есть ИД записи, то обновляем
      if (id) {
        response = await Request.put(
          rootState.BASE_URL + "/m-to-m/nomenclature-characteristics/" + id,
          new MtoMNomenclatureCharacteristics(
            id,
            state.selectedFamily.id_family,
            id_characteristic,
            id_nomenclature,
            value,
            is_nomenclature,
            required_fill_in_nomenclature
          )
        );
      } else {
        response = await Request.post(
          rootState.BASE_URL + "/m-to-m/nomenclature-characteristics",
          new MtoMNomenclatureCharacteristics(
            null,
            state.selectedFamily.id_family,
            id_characteristic,
            id_nomenclature,
            value,
            is_nomenclature,
            required_fill_in_nomenclature
          )
        );
      }

      if (response.codeResponse >= 400) {
        commit("setResponseAddCharacteristic", response);
        commit("changeLoading", false);
        return response;
      }

      await dispatch(
        "getMToMNomenclatureCharacteristics",
        state.selectedFamily.id_family
      );
      commit("changeLoading", false);
      return response;
    },
    async addCharacteristicToFamily({ state, rootState, commit, dispatch }) {
      commit("changeLoading", true);

      const { data } = await Request.post(
        rootState.BASE_URL + "/entity/nomenclatures-tree",
        state.newFamily
      );
      console.log("Response data", data);

      // const curEntry = getters.findItem(state.idParentFamily);
      // console.log("curEntry", curEntry);
      // commit("addChild", curEntry);

      await dispatch("getTreeOnMount");
      commit("closeDialogFamily");
      commit("changeLoading", false);
    },
    async getListTypeCharacteristics({ rootState, commit }) {
      commit("changeLoading", true);

      const { data } = await Request.get(
        rootState.BASE_URL + "/dictionary/characteristic/type"
      );
      commit("setListTypeCharacteristics", data);
      commit("changeLoading", false);
    },
    async updateCharacteristicAction({ state, rootState, commit }) {
      commit("changeLoading", true);

      console.log("updateCharacteristicAction");
      const { data } = await Request.put(
        rootState.BASE_URL +
          "/dictionary/characteristic/nomenclature/" +
          state.newCharacteristics.id,
        state.newCharacteristics
      );
      commit("setNewCharacteristics", data);
      commit("changeLoading", false);
    },

    async deleteCharacteristicByMtoM(
      { state, rootState, commit, dispatch },
      idCharacteristic
    ) {
      commit("changeLoading", true);
      await Request.delete(
        rootState.BASE_URL +
          "/m-to-m/delete-entries-by-characteristic/" +
          idCharacteristic
      );
      await dispatch(
        "getMToMNomenclatureCharacteristics",
        state.selectedFamily.id_family
      );

      commit("closeDialogDeleteCharacteristic");
      commit("changeLoading", false);
    },

    //Номенклатура
    async getNomenclaturesBySearch({ state, rootState, commit }, string) {
      if (!string) return false;
      if (string.length <= 2) return false;

      const checkExist = state.listNomenclaturesBySearch.some(
        (elem) => elem.name === string
      );
      if (checkExist) return false;

      if (state.debounceTimeout) clearTimeout(state.debounceTimeout);
      state.debounceTimeout = setTimeout(async () => {
        commit("changeLoading", true);

        const { data } = await Request.get(
          `${rootState.BASE_URL}/entity/nomenclature/search/{q}?q=${string}`
        );
        commit("setListNomenclaturesBySearch", data);
        commit("changeLoading", false);
      }, 1000);
    },
    async getNomenclatureByFamily({ rootState, commit }, idFamily) {
      commit("changeLoading", true);

      const { data } = await Request.get(
        rootState.BASE_URL +
          "/entity/nomenclature" +
          Request.ConstructFilterQuery({
            id_family: idFamily,
          })
      );
      commit("setListNomenclatureByFamily", data);
      commit("changeLoading", false);
    },
    async setNomenclaturesByName({ state, rootState, commit }, name) {
      if (!name) return false;

      const entry = state.listNomenclaturesBySearch.find(
        (item) => item.name === name
      );
      if (entry) {
        commit("setNewNomenclature", entry);
        return entry;
      }

      commit("changeLoading", true);
      const response = await Request.post(
        rootState.BASE_URL + "/entity/nomenclature",
        {
          name: name,
          id_family: state.selectedFamily.id_family,
        }
      );
      if (response.codeResponse >= 400) {
        commit("setResponseAddNomenclature", response);
      }

      commit("setNewNomenclature", response.data);
      commit("changeLoading", false);

      return response.data;
    },
    async updateNomenclature({ state, rootState, commit }) {
      if (!state.newNomenclature.id) return false;

      commit("changeLoading", true);
      const { data } = await Request.put(
        `${rootState.BASE_URL}/entity/nomenclature/${state.newNomenclature.id}`,
        state.newNomenclature
      );
      commit("setNewNomenclature", data);
      commit("changeLoading", false);
    },
    async deleteNomenclatureByFamily(
      { state, rootState, commit, dispatch },
      idNomenclature
    ) {
      commit("changeLoading", true);
      await Request.delete(
        rootState.BASE_URL + "/entity/nomenclature/" + idNomenclature
      );
      await dispatch("getNomenclatureByFamily", state.selectedFamily.id_family);

      commit("closeDialogDeleteNomenclature");
      commit("changeLoading", false);
    },
  },
  getters: {
    // Рекурсивно ищем по id_family нужный объект
    findItem: (state, getters) => (id, items) => {
      if (!items) {
        items = state.tree;
      }

      return items.reduce((acc, item) => {
        if (acc) {
          return acc;
        }

        if (item.id_family === id) {
          return item;
        }

        if (item.children) {
          return getters.findItem(id, item.children);
        }

        return acc;
      }, null);
    },
    getStateSelectedFamily(state) {
      return !!state.selectedFamily.id_family;
    },
    getStateExistChildren(state) {
      if (!state.selectedFamily.children) return false;
      if (!state.selectedFamily.children.length) return false;

      return true;
    },
    lengthListNomenclatureByFamily(state) {
      return state.listNomenclatureByFamily.length;
    },
    listCharacteristicsFilteredByMToM(state) {
      return (
        state.listMtoMNomenclaturesCharacteristics
          //Формируем нужный массив
          .map((item) => {
            return new MtoMNomenclatureCharacteristics(
              item.id,
              item.id_family,
              item.id_characteristic,
              item.id_nomenclature,
              item.value,
              item.is_nomenclature,
              item.required_fill_in_nomenclature,
              item._characteristic_nomenclature
            );
          })
          // Оставляем уникальные записи
          .filter(function ({ id_characteristic }) {
            const key = `${id_characteristic}`;
            // console.log("key", key);
            return !this.has(key) && this.add(key);
          }, new Set())
      );

      // return Object.groupBy(
      //   state.listMtoMNomenclaturesCharacteristics,
      //   ({ _characteristic_nomenclature }) => _characteristic_nomenclature.name
      // );
    },
    getValueCharacteristicNomenclature: (state) => (obj, id_nomenclature) => {
      // Если не заполняется в номенклатуре значит берет value из MtoM
      if (!obj.required_fill_in_nomenclature) return obj.value;

      // Иначе ищем по сводным идшникам
      const res = state.listMtoMNomenclaturesCharacteristics.find((item) => {
        return (
          item.id_characteristic === obj.id_characteristic &&
          item.id_nomenclature === id_nomenclature
        );
      });
      return res ? res.value : obj.value;
    },

    getStateExistAddedCharacteristicInFamily:
      (state) => (id_characteristic) => {
        return state.listMtoMNomenclaturesCharacteristics.some(
          (item) => item.id_characteristic === id_characteristic
        );
      },
    getStateExistAddedNomenclatureInFamily: (state) => (id_nomenclature) => {
      return state.listNomenclatureByFamily.some(
        (item) => item.id === id_nomenclature
      );
    },
  },
};
