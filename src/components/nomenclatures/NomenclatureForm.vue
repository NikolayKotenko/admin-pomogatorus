<template>
  <div class="detail_container">
    <v-container class="main_wrapper">
      <template v-if="$store.getters.stateEditCreate($route.query.action)">
        <InputStyledSimple
            class="mb-5 mt-5"
            :data="nomenclature.name"
            :placeholder="'Название модели'"
            :is-disabled="!$store.getters.stateEditCreate($route.query.action)"
            @update-input="setPropertyNomenclature({ key: 'name', payload: $event })"
        />
      </template>
      <template v-else>
        <ComboboxStyled
            :action="$route.query.action"
            :is-items="listAllNomenclature"
            :data="nomenclature.name"
            :key="nomenclature.id"
            :is-return-object="true"
            :is-item-text="'name'"
            :is-item-value="'name'"
            :is-hide-details="false"
            :is-label="'Выберите номенклатуру'"
            :is-error="responseAddNomenclature.isError"
            :is-error-messages="responseAddNomenclature.message"
            :is-loading="loading"
            @change-search="handleChangeSearch"
            @click-clear="clear_nomenclature(); clear_list_nomenclatures_by_search(); clear_response_add_nomenclature()"
        />
      </template>
    <EditNomenclatureCard/>

    </v-container>
    <!--  Всплывающие уведомления  -->
    <v-snackbar
        :style="{'margin-bottom':calcMargin(i)}"
        v-for="(value,i) in popupNotifications"
        :key="i"
        v-model="popupSettings.show"
        :timeout="popupSettings.timeout"
        absolute
        bottom
        style="bottom: 50px"
        dark
        color="#5c80b5"
        right
    >
      <div class="d-inline-flex" style="width: 100%; justify-content: space-between">
        <section style="align-content: center;">{{ value }}</section>
        <v-btn color="pink" small right @click="popupSettings.show = false" :icon="true"><v-icon>mdi-close</v-icon></v-btn>
      </div>
    </v-snackbar>
    <footer class="detail_footer">
      <v-container>
<!--        <v-btn-->
<!--            v-if="$store.state.NomenclaturesModule.entry.id"-->
<!--            :disabled="$store.state.NomenclaturesModule.loadingList || !$store.state.NomenclaturesModule.entry.id"-->
<!--            color="red darken-1"-->
<!--            text-->
<!--            @click="$store.dispatch('NomenclaturesModule/stateModalAction', true)"-->
<!--        >-->
<!--          Удалить-->
<!--        </v-btn>-->
        <v-btn
            v-if="$route.query.action"
            :disabled="$store.state.loadingRequestGeneral"
            color="white darken-1"
            text
            @click="$router.push({path: $route.meta.returnLink.path})"
        >
          Отменить
        </v-btn>
        <v-btn
            :disabled="! $store.getters.stateEditCreate($route.query.action) || $store.state.NomenclaturesModule.loadingList"
            class="detail_footer__save_btn"
            color="blue darken-1"
            text
            @click.prevent="$store.dispatch('NomenclaturesTreeModule/updateNomenclature') && $router.push({path: $route.meta.returnLink.path})"
        >
          Сохранить
        </v-btn>
      </v-container>
    </footer>

  </div>
</template>

<script>
// import Request from "@/services/request";
// import nomenclatureStore from "@/store/modules/nomenclatures";

// const _store = nomenclatureStore.state

import Characteristics from "@/components/nomenclatures/Characteristics";
import InputStyledSimple from "@/components/common/InputStyledSimple.vue";
import EditNomenclatureCard from "@/components/nomenclatures/EditNomenclatureCard.vue";
import ComboboxStyled from "@/components/common/ComboboxStyled.vue";
import {mapActions, mapGetters, mapMutations, mapState} from "vuex";
import {Nomenclature} from "@/helpers/constructors";
import Logging from "@/services/logging";
export default {
  name: "NomenclatureForm",
  components: {ComboboxStyled, EditNomenclatureCard, InputStyledSimple, Characteristics},
  data() {
    return {
      listNomenclaturesBySearch: [],
      headers: [
        {text: 'Характеристика', value: 'characteristic'},
        {text: 'Значение', value: 'value'},
        {text: 'Постфикс', value: 'postfix'},
        {text: 'Действия', value: 'actions', sortable: false}
      ],
      dialog: false,
      formTitle: '',
    };
  },

  async mounted() {
    await this.$store.dispatch('NomenclaturesTreeModule/getListAllNomenclature')
    await this.$store.dispatch('NomenclaturesModule/getListEntries', this.$route.params.id)
    await this.$store.dispatch('NomenclaturesModule/getListFamily')
  },
  computed: {
    ...mapState('NomenclaturesTreeModule', [
      'dialogFamily',
      'dialogCharacteristics',
      'dialogNomenclature',
      'family',
      'nomenclature',
      'characteristic',
      'listFamiliesBySearch',
      'listCharacteristicsBySearch',
      'listNomenclatureByFamily',
      'listCharacteristicsByFamily',
      'listAllNomenclature',
      'loading',
      'tree',
      'idParentFamily',
      'selectedLeafTree',
      'responseAddCharacteristics',
      'responseAddNomenclature',
      'responseByFamily',
      'dialogDeleteNomenclature',
      'listTypeCharacteristics',
      'dialogDeleteCharacteristic',
      'characteristic',
      'dictionaryUnits',
      'arrBreadcrumbsToCurrentLeaf',
      'openBreadcrumbsLeaf',
      'popupNotifications',
      'popupSettings',
    ]),
    ...mapGetters('NomenclaturesTreeModule', [
      'getStateSelectedFamily',
      'getStateExistChildren',
      'lengthListNomenclatureByFamily',
      'listCharacteristicsFilteredByMToM',
      'getValueCharacteristicNomenclature',
      'getStateExistAddedCharacteristicInFamily',
      'getStateExistAddedNomenclatureInFamily',
      'deniedAccessByDeleteCharacteristic',
      'getStateCheckedLeafByBreadcrumbs'
    ]),
    ...mapGetters(['stateEditCreate']),
  },
  methods: {
    ...mapActions('NomenclaturesTreeModule', [
      'getNomenclaturesBySearch',
      'setNomenclatureById',
      'setPropertyNomenclature'
    ]),
    ...mapMutations('NomenclaturesTreeModule', [
      'clear_list_nomenclatures_by_search',
      'clear_response_add_characteristic',
      'clear_response_add_nomenclature',
      'clear_nomenclature',
      'clear_characteristic',
      'clear_list_characteristics_by_search',
      'clear_family',
    ]),
    handleChangeSearch(selectedItem) {
      this.setNomenclatureById(selectedItem.id);
    },
    setAlt(data) {
      this.dropzone_uploaded[data.index].alt_image = data.value
    },
    setTitle(data) {
      this.dropzone_uploaded[data.index].title_image = data.value
    },
    async deleteEntryLocal() {
      await this.$store.dispatch('NomenclaturesModule/deleteEntry');
      await this.$router.replace({query: null}).catch(() => {
      });
    },
    async onSubmitLocal() {
      await this.$store.dispatch('NomenclaturesModule/onSubmit', {}, {root: true});
      if (this.$route.query.action === 'create') {
        await this.$router.replace({path: this.$route.meta.returnLink.path}).catch(() => {
        });
      } else {
        await this.$router.replace({path: this.$route.meta.returnLink.path}).catch(() => {
        });
      }
    },
    closeDialog() {
      this.dialog = false;
      this.editedItem = {};
    },
    calcMargin(i) {
      return (i*600) + 'px'
    },

  },

  watch: {
    '$store.state.NomenclaturesTreeModule.nomenclature.id': {
      handler(newValue) {
        if (this.$route.query.action === 'create')
          return false;

        const currentQuery = this.$route.query;
        const idEntry = (newValue) ? newValue : '';
        this.$router.replace({
          path: '/nomenclatures/' + idEntry,
          query: currentQuery,
        }).catch(() => {
        });

        this.$store.dispatch('setTitle', this.$store.state.NomenclaturesModule.entry)
      }
    },
    '$route.query.action': {
      handler(newValue) {
        if (newValue === 'create') {
          this.$store.commit('NomenclaturesTreeModule/clear_nomenclature');
        }
      }
    },
    '$route.params.id': {
      handler(newValue) {
        if (!newValue) {
          this.$store.commit('NomenclaturesTreeModule/clear_nomenclature');
        }
      }
    },
    '$store.state.NomenclaturesModule.entry.e_client_files': {
      handler(newValue) {
        if (!newValue) return false;
        this.dropzone_uploaded = [];
        this.dropzone_uploaded = newValue;
      }
    },
  }
}
</script>

<style lang="scss" scoped>
//@import "src/assets/styles/detail";

</style>

<style lang="scss">
.role_user {
  .v-input__slot::before {
  }
}
</style>
