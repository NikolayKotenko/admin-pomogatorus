<template>
  <div class="detail_container">
    <v-container class="main_wrapper">
      <template v-if="$store.getters.stateEditCreate($route.query.action)">
        <v-text-field
            ref="nomenclature-name"
            v-model="$store.state.NomenclaturesModule.entry.name"
            :disabled="$store.state.NomenclaturesModule.loadingList"
            class="mb-0 mt-5"
            dense
            label="Название модели"
            outlined
            required
            type="text"
        />
      </template>
      <template v-else>
        <v-autocomplete
            v-model="$store.state.NomenclaturesModule.entry"
            :disabled="$store.state.NomenclaturesModule.loadingList"
            :items="$store.state.NomenclaturesModule.listEntries"
            :loading="$store.state.NomenclaturesModule.loadingList"
            class="mb-5 mt-5"
            dense
            hide-details
            item-text="name"
            item-value="id"
            label="Поиск по номенклатурам"
            outlined
            return-object
        >
        </v-autocomplete>
      </template>

<!--      <ComboboxStyled-->
<!--          :action="$route.query.action"-->
<!--          :is-items="listNomenclaturesBySearch"-->
<!--          :data="nomenclature.name"-->
<!--          :key="nomenclature.id"-->
<!--          :is-return-object="true"-->
<!--          :is-item-text="'name'"-->
<!--          :is-item-value="'name'"-->
<!--          :is-hide-details="false"-->
<!--          :is-error="responseAddNomenclature.isError"-->
<!--          :is-error-messages="responseAddNomenclature.message"-->
<!--          :is-outlined="false"-->
<!--          :is-loading="loading"-->
<!--          @update-search-input="getNomenclaturesBySearch($event)"-->
<!--          @change-search="localSetSearchNomenclature"-->
<!--          @click-clear="clear_nomenclature(); clear_list_nomenclatures_by_search(); clear_response_add_nomenclature()"-->
<!--      ></ComboboxStyled>-->
    <EditNomenclatureCard
      :nomenclature-data="$store.state.NomenclaturesModule.entry"
    />

    </v-container>
    <footer class="detail_footer">
      <v-container>
        <v-btn
            v-if="$store.state.NomenclaturesModule.entry.id"
            :disabled="$store.state.NomenclaturesModule.loadingList || !$store.state.NomenclaturesModule.entry.id"
            color="red darken-1"
            text
            @click="$store.dispatch('NomenclaturesModule/stateModalAction', true)"
        >
          Удалить
        </v-btn>
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
            @click.prevent="onSubmitLocal() && $store.dispatch('NomenclaturesTreeModule/updateNomenclature')"
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
      nomenclature: new Nomenclature(),
      responseAddNomenclature: new Logging(),
      loading: false,
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
      'listNomenclaturesBySearch',
      'listNomenclatureByFamily',
      'listCharacteristicsByFamily',
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
      'popupSettings'
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
  async mounted() {
    await this.$store.dispatch('NomenclaturesModule/getListEntries', this.$route.params.id)
    await this.$store.dispatch('NomenclaturesModule/getListFamily')
  },
  methods: {
    ...mapActions('NomenclaturesTreeModule', [
      'getNomenclaturesBySearch',
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
    async localSetSearchNomenclature(obj){
      if (! obj) return false;

      const name = (obj.name) ? obj.name : obj;

      if (this.$route.query.action === 'add') {
        const entry = await this.setNomenclaturesByName(name);
        const existEntry = this.getStateExistAddedNomenclatureInFamily(entry.id)

        this.clear_response_add_nomenclature();
        if (existEntry) {
          const message = entry.name + ' такое наименование уже существует в текущем семействе, создайте другое';
          this.set_response_add_nomenclature({
            message: message,
            codeResponse: 409
          });
          this.add_popup_notification(message)
          return false;
        }
        await this.getNomenclatureByFamily(this.selectedLeafTree.id_family);
      }
      if (this.$route.query.action === 'edit') {
        this.setPropertyNomenclature({ key: 'name', payload: name })
      }
    },

  },
  computed: {
  },
  watch: {
    '$store.state.NomenclaturesModule.entry.id': {
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
          this.$store.dispatch('NomenclaturesModule/clearEntry');
        }
      }
    },
    '$route.params.id': {
      handler(newValue) {
        if (!newValue) {
          this.$store.dispatch('NomenclaturesModule/clearEntry');
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
