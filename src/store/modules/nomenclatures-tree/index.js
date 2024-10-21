import Request from "@/services/request";
import {
  CharacteristicNomenclature,
  NomenclaturesTreeLeaf,
  Nomenclature,
  MtoMNomenclatureCharacteristics,
  DTypeCharacteristics,
  Dictionary,
  PropertyEntity,
  Family,
  Breadcrumb,
} from "@/helpers/constructors";
import Logging from "@/services/logging";

export default {
  namespaced: true,
  state: {
    //Семейство
    family: new Family(),
    selectedLeafTree: new NomenclaturesTreeLeaf(),
    idParentFamily: null,
    dialogFamily: false,
    listFamiliesBySearch: [],
    responseByFamily: new Logging(),

    //Характеристики
    characteristic: new CharacteristicNomenclature(),
    listCharacteristicsBySearch: [],
    listMtoMNomenclaturesCharacteristics: [],
    listAllMtoMNomenclatureCharacteristics: [],
    listCharacteristicsByFamily: [],
    dialogCharacteristics: false,
    listTypeCharacteristics: [],
    dialogDeleteCharacteristic: false,
    responseAddCharacteristics: new Logging(),

    //Номенклатура
    nomenclature: new Nomenclature(),
    listNomenclaturesBySearch: [],
    listNomenclatureByFamily: [],
    dialogNomenclature: false,
    responseAddNomenclature: new Logging(),
    dialogDeleteNomenclature: false,
    listAllNomenclature: [],

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
    flat_tree: [],
    dictionaryUnits: new Dictionary(),
    arrBreadcrumbsToCurrentLeaf: [new Breadcrumb("Номенклатура")],
    openBreadcrumbsLeaf: [],
    popupNotifications: ["Test"],
    popupSettings: {
      show: false,
      timeout: 2000,
    },
  },
  mutations: {
    add_popup_notification(state, text) {
      state.popupSettings.show = true;

      state.popupNotifications = [];
      state.popupNotifications.push(text);

      // Очищаем по таймауту
      // if (state.debounceTimeout) clearTimeout(state.debounceTimeout);
      // state.debounceTimeout = setTimeout(() => {
      //   state.popupNotifications = [];
      // }, state.popupSettings.timeout);
    },
    change_loading(state, value) {
      state.loading = value;
    },
    set_dictionary_units(state, payload = Dictionary) {
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
    clear_arr_breadcrumbs_to_current_leaf(state) {
      state.arrBreadcrumbsToCurrentLeaf = [];
    },
    set_open_leaf_tree(state, value) {
      state.openBreadcrumbsLeaf = value;
    },
    set_open_leaf_tree_in_breadcrumb(state, nameBreadcrumb) {
      const listNameByArr = state.arrBreadcrumbsToCurrentLeaf.map(
        (item) => item.text
      );

      state.openBreadcrumbsLeaf = [];
      state.arrBreadcrumbsToCurrentLeaf = [];
      listNameByArr.some((item) => {
        state.openBreadcrumbsLeaf.push(item);
        state.arrBreadcrumbsToCurrentLeaf.push(new Breadcrumb(item));
        if (item === nameBreadcrumb) return true;
      });
    },

    // Семейства
    open_dialog_family(state, idCurObj) {
      state.idParentFamily = idCurObj;
      state.dialogFamily = true;
    },
    close_dialog_family(state) {
      state.dialogFamily = false;
      state.responseByFamily = new Logging();
      state.family = new Family();
      state.idParentFamily = null;
    },
    clear_list_families_by_search(state) {
      state.listFamiliesBySearch = [];
    },
    set_list_families_by_search(state, payload) {
      state.listFamiliesBySearch = payload;
    },
    set_family(state, payload = Family) {
      state.family = new Family(
        payload.id,
        payload.code,
        payload.name,
        payload.brand,
        payload.id_brand,
        payload.photos,
        payload.files,
        payload.seo_title,
        payload.seo_description,
        payload.seo_keywords
      );
    },
    set_property_family(state, obj = PropertyEntity) {
      // console.log("set_property_family", obj);
      if (!obj.key) return false;

      state.family[obj.key] = obj.payload;
    },
    clear_family(state) {
      state.family = new Family();
      state.responseByFamily = new Logging();
      state.listFamiliesBySearch = [];
    },
    set_response_by_family(state, payload = Logging) {
      state.responseByFamily = new Logging();
      state.responseByFamily = new Logging(payload);
    },

    // Характеристики
    set_list_all_characteristic(state, payload) {
      state.listAllMtoMNomenclatureCharacteristics = []
      state.listAllMtoMNomenclatureCharacteristics = payload.reduce((r, a) => {
        r[a.id_family] = r[a.id_family] || []
        r[a.id_family].push(a)
        return r
      }, {})
    },
    set_list_type_characteristics(state, payload) {
      state.listTypeCharacteristics = [];
      state.listTypeCharacteristics = payload;
    },
    close_dialog_characteristics(state) {
      state.dialogCharacteristics = false;
      state.characteristic = new CharacteristicNomenclature();
      state.responseAddCharacteristics = new Logging();
    },
    open_dialog_characteristics(state) {
      state.dialogCharacteristics = true;
    },
    set_list_characteristics_by_search(state, payload) {
      state.listCharacteristicsBySearch = [];
      state.listCharacteristicsBySearch = payload;
      // state.listCharacteristicsBySearch = payload.map((itemChar) => {
      //   const listFamilies = state.listMtoMNomenclaturesCharacteristics
      //     .map((itemMtoM) => {
      //       if (itemMtoM.id_characteristic !== itemChar.id) return null;
      //       return itemMtoM._family.name;
      //     })
      //     .filter((item) => Boolean(item));
      //   itemChar._listFamilies = [...new Set(listFamilies)];
      //   const stringListFamilies = itemChar._listFamilies.join(", ");
      //   if (stringListFamilies.length) {
      //     itemChar.name =
      //       itemChar.name + " (исп. в семействах: " + stringListFamilies + ")";
      //   }
      //   return itemChar;
      // });
    },
    set_list_characteristics_by_family(state, payload) {
      state.listCharacteristicsByFamily = [];
      state.listCharacteristicsByFamily = payload;
    },
    set_list_mtom_nomenclatures_characteristics(state, payload) {
      state.listMtoMNomenclaturesCharacteristics = [];
      state.listMtoMNomenclaturesCharacteristics = payload;
    },
    clear_list_mtom_nomenclatures_characteristics(state) {
      state.listMtoMNomenclaturesCharacteristics = [];
    },
    set_characteristic(state, payload = new CharacteristicNomenclature()) {
      state.characteristic = new CharacteristicNomenclature(
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
    set_property_characteristic(state, obj = PropertyEntity) {
      // console.log("set_property_characteristic", { key: key, payload: payload });
      if (!obj.key) return false;

      state.characteristic[obj.key] = obj.payload;
    },
    set_selected_family(state, payload = NomenclaturesTreeLeaf) {
      state.selectedLeafTree = new NomenclaturesTreeLeaf(
        payload.id_family,
        payload.id_parent,
        payload.name_leaf,
        payload.depth_level,
        payload.children,
        payload._family
      );
    },
    set_type_characteristic(state, payload = DTypeCharacteristics) {
      if (!payload) {
        state.characteristic.type_characteristic = new DTypeCharacteristics();
        state.characteristic.id_type_characteristic = null;

        //Также очищаем справочники
        state.characteristic.dictionary = new Dictionary();
        state.characteristic.id_dictionary = null;
        return false;
      }

      state.characteristic.id_type_characteristic = payload.id;
      state.characteristic.type_characteristic = new DTypeCharacteristics(
        payload.id,
        payload.name,
        payload.code
      );
    },
    set_dictionary_characteristic(state, payload = Dictionary) {
      if (!payload) {
        state.characteristic.dictionary = new Dictionary();
        state.characteristic.id_dictionary = null;
        return false;
      }

      state.characteristic.id_dictionary = payload.id;
      state.characteristic.dictionary = new Dictionary(
        payload.id,
        payload.name,
        payload.code,
        payload.flag_nomenclature,
        payload.flag_objects,
        payload.d_dictionary_attributes
      );
    },
    open_dialog_delete_characteristic(state) {
      state.dialogDeleteCharacteristic = true;
    },
    close_dialog_delete_characteristic(state) {
      state.dialogDeleteCharacteristic = false;
      state.characteristic = new MtoMNomenclatureCharacteristics();
    },
    clear_response_add_characteristic(state) {
      state.responseAddCharacteristics = new Logging();
    },
    clear_list_characteristics_by_search(state) {
      state.listCharacteristicsBySearch = [];
    },
    clear_characteristic(state) {
      state.characteristic = new CharacteristicNomenclature();
    },
    set_response_add_characteristic(state, payload = Logging) {
      state.responseAddCharacteristics = new Logging();
      state.responseAddCharacteristics = new Logging(payload);
    },

    // Дерево
    set_tree(state, payload) {
      const { tree, flat_tree } = payload;
      state.tree = [];
      state.flat_tree = [];
      state.tree = tree;
      state.flat_tree = flat_tree;
    },
    //старая реализация без бэкенда
    add_child(state, curEntry) {
      if (!curEntry.children) {
        this._vm.$set(curEntry, "children", []);
      }

      curEntry.children.push(state.family);

      state.dialogFamily = false;
    },

    // Номенклатура
    open_dialog_delete_nomenclature(state) {
      state.dialogDeleteNomenclature = true;
    },
    close_dialog_delete_nomenclature(state) {
      state.dialogDeleteNomenclature = false;
      state.nomenclature = new Nomenclature();
    },
    close_dialog_nomenclature(state) {
      state.dialogNomenclature = false;
      state.nomenclature = new Nomenclature();
      state.responseAddNomenclature = new Logging();
      state.listNomenclaturesBySearch = [];
    },
    open_dialog_nomenclature(state) {
      state.dialogNomenclature = true;
    },

    clear_nomenclature(state) {
      state.nomenclature = new Nomenclature();
    },
    clear_list_nomenclatures_by_search(state) {
      state.listNomenclaturesBySearch = [];
    },
    set_list_nomenclatures_by_search(state, payload) {
      state.listNomenclaturesBySearch = [];

      // Изменяем приходящий с бэка масив
      // payload.map((item) => {
      //   if (item.id_family) {
      //     item.name =
      //       item.name + " существует в семействе - '" + item._family.name + "'";
      //   }
      // });
      state.listNomenclaturesBySearch = payload;
    },
    set_list_nomenclature_by_family(state, payload) {
      state.listNomenclatureByFamily = [];
      state.listNomenclatureByFamily = payload;
    },
    set_nomenclature(state, payload = Nomenclature) {
      state.nomenclature = new Nomenclature(
        payload.id,
        payload.name,
        payload.code,
        payload.vendor_code,
        payload.id_family,
        payload.seo_title,
        payload.seo_description,
        payload.seo_keywords,
        payload.link_market,
        payload._photos,
        payload._files,
      );
    },
    set_property_nomenclature(state, obj = PropertyEntity) {
      // console.log("set_property_nomenclature", obj);
      if (!obj.key) return false;

      state.nomenclature[obj.key] = obj.payload;
    },
    set_response_add_nomenclature(state, payload = Logging) {
      state.responseAddNomenclature = new Logging();
      state.responseAddNomenclature = new Logging(payload);
    },
    clear_response_add_nomenclature(state) {
      state.responseAddNomenclature = new Logging();
    },
    set_list_all_nomenclature(state, payload) {
      state.listAllNomenclature = []
      state.listAllNomenclature = payload
    }
  },
  actions: {
    // Дерево
    async getDictionaryUnits({ commit, dispatch }) {
      const response = await dispatch(
        "DictionariesModule/getListDictionaries",
        {
          query: { codes: ["edenicy-izmereniya"] },
          code: "edenicy-izmereniya",
        },
        { root: true }
      );
      commit("set_dictionary_units", response);
    },
    async getTreeOnMount({ rootState, commit }) {
      commit("change_loading", true);

      const { data } = await Request.get(
        rootState.BASE_URL + "/entity/nomenclatures-tree"
      );
      commit("set_tree", data);
      commit("change_loading", false);
    },
    async deleteEntry({ commit, dispatch }, id_family) {
      //START
      commit("change_loading", true);

      const response = await Request.delete(
        this.state.BASE_URL + "/entity/nomenclatures-tree/" + id_family
      );
      await dispatch("getTreeOnMount");

      //END
      commit("change_loading", false);
      commit("add_popup_notification", response.message);
    },
    async addChildAction({ state, rootState, commit, dispatch }) {
      commit("change_loading", true);

      const response = await Request.post(
        rootState.BASE_URL + "/entity/nomenclatures-tree",
        new NomenclaturesTreeLeaf(
          state.family.id,
          state.idParentFamily,
          state.family.name
        )
      );
      if (response.isError) {
        commit("set_response_by_family", response);
      } else {
        await dispatch("getTreeOnMount");
        commit("close_dialog_family");
      }

      console.log('CHECK ADD CHILD', state.dialogFamily)

      commit("clear_list_families_by_search");
      commit("change_loading", false);
      commit("add_popup_notification", response.message);
    },
    async updateNameLeafTree({ state, rootState, commit, dispatch }) {
      commit("change_loading", true);

      const response = await Request.put(
        `${rootState.BASE_URL}/entity/nomenclatures-tree/${state.family.id}`,
        new NomenclaturesTreeLeaf(null, null, state.family.name)
      );
      console.log("updateNameLeafTree", response);

      await dispatch("getTreeOnMount");
      commit("change_loading", false);
      commit("add_popup_notification", response.message);

      return response;
    },
    updateBreadcrumbsToCurrentLeaf({ state, commit, getters }) {
      commit("clear_arr_breadcrumbs_to_current_leaf");
      getters.setBreadcrumbsToCurrentLeaf(state.selectedLeafTree.id_family);
      commit("set_open_leaf_tree_in_breadcrumb");
    },

    // Семейства
    async getFamilyBySearch({ state, rootState, commit }, string) {
      if (!string) return false;
      if (string.length <= 2) return false;

      const checkExist = state.listFamiliesBySearch.some(
        (elem) => elem.name === string
      );
      if (checkExist) return false;

      if (state.debounceTimeout) clearTimeout(state.debounceTimeout);
      state.debounceTimeout = setTimeout(async () => {
        commit("change_loading", true);

        const response = await Request.get(
          `${rootState.BASE_URL}/dictionary/nomenclature-family/search/{q}?q=${string}`
        );
        commit("set_list_families_by_search", response.data);
        commit("change_loading", false);

        return response;
      }, 500);
    },
    async setFamilyByName({ rootState, commit }, name) {
      if (!name) return false;

      commit("change_loading", true);
      const response = await Request.post(
        rootState.BASE_URL + "/dictionary/nomenclature-family",
        {
          name: name,
        }
      );
      commit(
        "set_family",
        new Family(
          response.data.id,
          response.data.code,
          response.data.name,
          response.data.brand,
          response.data.id_brand,
          response.data.photos,
          response.data.files,
          response.data.seo_title,
          response.data.seo_description,
          response.data.seo_keywords
        )
      );
      commit("change_loading", false);
      commit("add_popup_notification", response.message);
    },
    async saveFamilyAction({ commit, dispatch }) {
      commit("change_loading", true);
      commit("close_dialog_family");
      dispatch("updateBreadcrumbsToCurrentLeaf");
      await dispatch("getTreeOnMount");
      commit("change_loading", false);
    },
    async setSelectedFamilyAction(
      { state, commit, dispatch, getters },
      NomenclaturesTreeLeaf
    ) {
      commit("set_selected_family", NomenclaturesTreeLeaf);

      // Обновляем хлебные крошки до текущего выбранного selectedLeafTree.id_family
      dispatch("updateBreadcrumbsToCurrentLeaf");

      // Очищаем перед следующей загрузкой
      commit("clear_list_mtom_nomenclatures_characteristics");
      //Запрашиваем MToM используется на любом уровне лепестка дерева
      await dispatch(
        "getMToMNomenclatureCharacteristics",
        state.selectedLeafTree.id_family
      );

      if (getters.getStateExistChildren) return false;

      //Запрашиваем список номенклатуры у последней сущности
      await dispatch(
        "getNomenclatureByFamily",
        state.selectedLeafTree.id_family
      );
    },

    async setPropertyFamily(
      { state, commit, dispatch },
      obj = new PropertyEntity()
    ) {
      commit("set_property_family", new PropertyEntity(obj.key, obj.payload));

      if (state.debounceTimeout) clearTimeout(state.debounceTimeout);
      return (state.debounceTimeout = setTimeout(async () => {
        return await dispatch("updateFamily");
      }, 1000));
    },

    /**
     * @returns {Logging}
     */
    async updateFamily({ state, rootState, commit }) {
      commit("change_loading", true);

      const response = await Request.put(
        `${rootState.BASE_URL}/dictionary/nomenclature-family/${state.family.id}`,
        state.family
      );
      if (response.isError) {
        commit("set_response_by_family", response);
      }

      console.log('checkUpdate', response)

      commit("set_family", response.data);
      commit("change_loading", false);
      commit("add_popup_notification", response.message);

      return response;
    },

    // Характеристики
    async getListALlCharacteristics({ state, commit, rootState }){
      const response = await Request.get(
          rootState.BASE_URL +
          `/m-to-m/nomenclature-characteristics`
      )
      commit("set_list_all_characteristic", response.data)
    },
    setPropertyCharacteristic(
      { state, commit, dispatch },
      obj = new PropertyEntity()
    ) {
      commit(
        "set_property_characteristic",
        new PropertyEntity(obj.key, obj.payload)
      );

      if (state.debounceTimeout) clearTimeout(state.debounceTimeout);
      state.debounceTimeout = setTimeout(async () => {
        await dispatch("updateCharacteristic");
      }, 1000);
    },
    async openDialogCharacteristics({ commit, dispatch }) {
      commit("open_dialog_characteristics");
      //Запрашиваем список типов характеристик для выбора типа характеристики
      await dispatch("getListTypeCharacteristics");
    },
    async setCharacteristicOnFamily({ rootState, commit }, name) {
      if (!name) return false;

      console.log('CHECKK set character', name)

      commit("change_loading", true);
      const response = await Request.post(
        rootState.BASE_URL + "/dictionary/characteristic/nomenclature",
        { name: name }
      );

      console.log('CHECKK set character', response)

      const existCharacteristic = await Request.get(
        `${rootState.BASE_URL}/m-to-m/nomenclature-characteristics/check-exist-characteristics/${response.data.id}`
      );
      commit("clear_response_add_characteristic");
      if (existCharacteristic.isError) {
        commit("set_response_add_characteristic", existCharacteristic);
        commit("add_popup_notification", existCharacteristic.message);
        commit("change_loading", false);
        return existCharacteristic;
      }

      commit("set_characteristic", response.data);
      commit("change_loading", false);
      commit("add_popup_notification", response.message);
      return response;
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
        commit("change_loading", true);

        const { data } = await Request.get(
          `${rootState.BASE_URL}/dictionary/characteristic/nomenclature/search/{q}?q=${string}`
        );
        commit("set_list_characteristics_by_search", data);
        commit("change_loading", false);
      }, 1000);
    },
    async getCharacteristics({ rootState, commit }, idFamily) {
      commit("change_loading", true);

      const { data } = await Request.get(
        rootState.BASE_URL +
          "/dictionary/characteristic/nomenclature" +
          Request.ConstructFilterQuery({
            id_family: idFamily,
          })
      );
      commit("set_list_characteristics_by_family", data);
      commit("change_loading", false);
    },

    async getMToMNomenclatureCharacteristics({ rootState, commit }, idFamily) {
      commit("change_loading", true);

      const { data } = await Request.get(
        rootState.BASE_URL +
          "/m-to-m/nomenclature-characteristics" +
          Request.ConstructFilterQuery({ id_family: idFamily })
      );
      commit("set_list_mtom_nomenclatures_characteristics", data);
      commit("change_loading", false);
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
      commit("change_loading", true);



      let response = new Logging();
      // Если есть ИД записи, то обновляем
      if (id) {
        response = await Request.put(
          rootState.BASE_URL + "/m-to-m/nomenclature-characteristics/" + id,
          new MtoMNomenclatureCharacteristics(
            id,
            state.selectedLeafTree.id_family,
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
            state.selectedLeafTree.id_family,
            id_characteristic,
            id_nomenclature,
            value,
            is_nomenclature,
            required_fill_in_nomenclature
          )
        );
      }

      if (response.codeResponse >= 400) {
        commit("set_response_add_characteristic", response);
        commit("change_loading", false);
        commit("add_popup_notification", response.message);
        return response;
      }

      await dispatch(
        "getMToMNomenclatureCharacteristics",
        state.selectedLeafTree.id_family
      );
      commit("change_loading", false);
      commit("add_popup_notification", response.message);
      return response;
    },

    // async addCharacteristicToFamily({ state, rootState, commit, dispatch }) {
    //   commit("change_loading", true);
    //
    //   const { data } = await Request.post(
    //     rootState.BASE_URL + "/entity/nomenclatures-tree",
    //     state.family
    //   );
    //
    //   // const curEntry = getters.findItem(state.idParentFamily);
    //   // console.log("curEntry", curEntry);
    //   // commit("add_child", curEntry);
    //
    //   await dispatch("getTreeOnMount");
    //   commit("close_dialog_family");
    //   commit("change_loading", false);
    // },

    async getListTypeCharacteristics({ state, rootState, commit }) {
      // Если не пустой, то и не запрашиваем
      if (state.listTypeCharacteristics.length) return false;

      commit("change_loading", true);

      const { data } = await Request.get(
        rootState.BASE_URL + "/dictionary/characteristic/type"
      );
      commit("set_list_type_characteristics", data);
      commit("change_loading", false);
    },
    async updateCharacteristic({ state, rootState, commit }) {
      commit("change_loading", true);

      const response = await Request.put(
        rootState.BASE_URL +
          "/dictionary/characteristic/nomenclature/" +
          state.characteristic.id,
        state.characteristic
      );
      commit("set_characteristic", response.data);
      commit("change_loading", false);
      commit("add_popup_notification", response.message);
    },

    async deleteCharacteristicByMtoM(
      { state, rootState, commit, dispatch, getters },
      idCharacteristic
    ) {
      if (getters.deniedAccessByDeleteCharacteristic(idCharacteristic))
        return false;

      commit("change_loading", true);
      const response = await Request.delete(
        rootState.BASE_URL +
          "/m-to-m/delete-entries-by-characteristic/" +
          idCharacteristic
      );
      await dispatch(
        "getMToMNomenclatureCharacteristics",
        state.selectedLeafTree.id_family
      );

      commit("close_dialog_delete_characteristic");
      commit("change_loading", false);
      commit("add_popup_notification", response.message);
    },

    //Номенклатура
    async saveNomenclatureAction({ state, commit, dispatch }) {
      commit("change_loading", true);
      commit("close_dialog_nomenclature");
      await dispatch(
        "getNomenclatureByFamily",
        state.selectedLeafTree.id_family
      );
      commit("change_loading", false);
    },
    setPropertyNomenclature(
      { state, commit, dispatch },
      obj = new PropertyEntity()
    ) {
      commit(
        "set_property_nomenclature",
        new PropertyEntity(obj.key, obj.payload)
      );

      if (state.debounceTimeout) clearTimeout(state.debounceTimeout);
      state.debounceTimeout = setTimeout(async () => {
        await dispatch("updateNomenclature");
      }, 1000);
    },
    async getNomenclaturesBySearch({ state, rootState, commit }, string) {
      if (!string) return false;
      if (string.length <= 2) return false;

      const checkExist = state.listNomenclaturesBySearch.some(
        (elem) => elem.name === string
      );
      if (checkExist) return false;

      if (state.debounceTimeout) clearTimeout(state.debounceTimeout);
      state.debounceTimeout = setTimeout(async () => {
        commit("change_loading", true);

        const { data } = await Request.get(
          `${rootState.BASE_URL}/entity/nomenclature/search/{q}?q=${string}`
        );
        commit("set_list_nomenclatures_by_search", data);
        commit("change_loading", false);
      }, 1000);
    },
    async getNomenclatureByFamily({ rootState, commit }, idFamily) {
      commit("change_loading", true);

      const { data } = await Request.get(
        rootState.BASE_URL +
          "/entity/nomenclature" +
          Request.ConstructFilterQuery({
            id_family: idFamily,
          })
      );
      commit("set_list_nomenclature_by_family", data);
      commit("change_loading", false);
    },
    async setNomenclaturesByName({ state, rootState, commit }, name) {
      if (!name) return false;

      const entry = state.listNomenclaturesBySearch.find(
        (item) => item.name === name
      );
      if (entry) {
        commit("set_nomenclature", entry);
        return entry;
      }

      commit("change_loading", true);
      const response = await Request.post(
        rootState.BASE_URL + "/entity/nomenclature",
        {
          name: name,
          id_family: state.selectedLeafTree.id_family,
        }
      );
      if (response.codeResponse >= 400) {
        commit("set_response_add_nomenclature", response);
        commit("add_popup_notification", response.message);
      }

      commit("set_nomenclature", response.data);
      commit("change_loading", false);
      commit("add_popup_notification", response.message);

      return response.data;
    },
    async updateNomenclature({ state, rootState, commit,dispatch }) {
      if (!state.nomenclature.id) return false;

      commit("change_loading", true);
      const response = await Request.put(
        `${rootState.BASE_URL}/entity/nomenclature/${state.nomenclature.id}`,
        state.nomenclature
      );

      await dispatch(
          "getListAllNomenclature",
      )

      commit("set_nomenclature", response.data);
      commit("change_loading", false);
      commit("add_popup_notification", response.message);
    },
    async deleteNomenclatureByFamily(
      { state, rootState, commit, dispatch },
      idNomenclature
    ) {
      commit("change_loading", true);
      const response = await Request.delete(
        rootState.BASE_URL + "/entity/nomenclature/" + idNomenclature
      );
      await dispatch(
        "getNomenclatureByFamily",
        state.selectedLeafTree.id_family
      );

      commit("close_dialog_delete_nomenclature");
      commit("change_loading", false);
      commit("add_popup_notification", response.message);
    },
    async getListAllNomenclature({ commit, rootState }) {
      commit("change_loading", true);

      const response = await Request.get(
          rootState.BASE_URL + "/entity/nomenclature"
      )

      commit("set_list_all_nomenclature", response.data);
      commit("change_loading", false);
    },
    async setNomenclatureById({ commit, rootState }, idNomenclature) {
      commit("change_loading", true);

      const response = await Request.get(
          rootState.BASE_URL + "/entity/nomenclature/" + idNomenclature
      );

      commit("set_nomenclature", response.data);
      commit("change_loading", false);
    }
  },
  getters: {
    setBreadcrumbsToCurrentLeaf: (state, getters) => (idFamily) => {
      getters.setRecursiveBreadcrumbs(idFamily);

      const reverseArr = state.arrBreadcrumbsToCurrentLeaf.reverse();
      state.arrBreadcrumbsToCurrentLeaf = reverseArr.map(
        (item) => new Breadcrumb(item)
      );
    },
    // Снизу - вверх
    setRecursiveBreadcrumbs: (state, getters) => (idFamily) => {
      // ... условие выхода ...
      if (!idFamily) return;

      // ...обработка данных узла...
      const curLeaf = state.flat_tree.find(
        (item) => item.id_family === idFamily
      );
      state.arrBreadcrumbsToCurrentLeaf.push(curLeaf.name_leaf);

      // снизу вверх обходим ветви, ведущие из текущего узла
      getters.setRecursiveBreadcrumbs(curLeaf.id_parent);
    },
    getStateCheckedLeafByBreadcrumbs: (state) => (nameLeaf) => {
      return state.arrBreadcrumbsToCurrentLeaf.some(
        (item) => item.text === nameLeaf
      );
    },
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
      return !!state.selectedLeafTree.id_family;
    },
    getStateExistChildren(state) {
      if (!state.selectedLeafTree.children) return false;
      if (!state.selectedLeafTree.children.length) return false;

      return true;
    },
    lengthListNomenclatureByFamily(state) {
      return state.listNomenclatureByFamily.length;
    },
    // getGroupedArrCharacteristicsNomenclature(state) {
    //   return state.listAllMtoMNomenclatureCharacteristics.reduce((r, a) => {
    //     r[a.id_family] = r[a.id_family] || []
    //     r[a.id_family].push(a)
    //     return r
    //   }, {})
    // },
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
    deniedAccessByDeleteCharacteristic: (state) => (id_characteristic) => {
      return (
        state.listMtoMNomenclaturesCharacteristics
          .filter((item) => item.id_characteristic === id_characteristic)
          //Если хотябы одна запись из характеристики имеет другое семейство (задано в родителе) - то нельзя
          .some((item) => item.id_family !== state.selectedLeafTree.id_family)
      );
    },
  },
};
