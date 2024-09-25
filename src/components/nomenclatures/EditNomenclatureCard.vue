<template>
  <v-container class="main_wrapper">
    <v-expansion-panels
        v-model="panel"
        multiple
        class="mb-5"
        accordion
        focusable
        :disabled="!$store.getters.stateEditCreate($route.query.action)"
    >
      <v-expansion-panel>
        <v-expansion-panel-header>
          Основные
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <InputStyledSimple
              class="mb-5 mt-5"
              :data="nomenclatureData.vendor_code"
              :placeholder="'Артикул'"
              :is-disabled="!$store.getters.stateEditCreate($route.query.action)"
              @update-input="setPropertyNomenclature({ key: 'vendor_code', payload: $event });"
          />
          <InputStyledSimple
              class="mb-5"
              :data="nomenclatureData.link_market"
              :placeholder="'Ссылка на Я-маркет'"
              :is-disabled="!$store.getters.stateEditCreate($route.query.action)"
              @update-input="setPropertyNomenclature({ key: 'link_market', payload: $event });"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <v-expansion-panel>
        <v-expansion-panel-header>Seo</v-expansion-panel-header>
        <v-expansion-panel-content>
          <InputStyledSimple
              class="mb-5 mt-5"
              :data="nomenclatureData.seo_title"
              :placeholder="'Seo title'"
              @update-input="setPropertyNomenclature({ key: 'seo_title', payload: $event });"
          />
          <InputStyledSimple
              class="mb-5"
              :data="nomenclatureData.seo_keywords"
              :placeholder="'Seo keywords'"
              @update-input="setPropertyNomenclature({ key: 'seo_keywords', payload: $event });"
          />
          <VueEditor
              v-model="nomenclatureData.seo_descriptionEditor"
              placeholder="Seo description"
              class="mt-3"
              :editorToolbar="customToolbar"
              ref="characteristicEditor"
              @text-change="localSetDescriptionNomenclature"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
<!--    <v-list elevation="1" subheader>-->
<!--      <v-subheader>Семейство</v-subheader>-->
<!--      <v-combobox-->
<!--          @change="$store.state.NomenclaturesModule.entry.id_family = ($event) ? $event.id : null"-->
<!--          v-model="$store.state.NomenclaturesModule.entry._family"-->
<!--          :disabled="$store.state.NomenclaturesModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"-->
<!--          :items="$store.state.NomenclaturesModule.listFamily" :loading="$store.state.NomenclaturesModule.loadingList"-->
<!--          chips-->
<!--          class="role_user pa-2 pt-0 ma-0 "-->
<!--          clearable-->
<!--          hide-details-->
<!--          item-text="name"-->
<!--          item-value="id"-->
<!--      >-->
<!--      </v-combobox>-->
<!--    </v-list>-->

  </v-container>
</template>

<script>
import InputStyledSimple from "@/components/common/InputStyledSimple.vue";
import Characteristics from "@/components/nomenclatures/Characteristics.vue";
import {mapActions, mapGetters, mapState} from "vuex";
import {VueEditor} from "vue2-editor"

export default {
  name: "EditNomenclatureCard",
  components: {InputStyledSimple, Characteristics, VueEditor},
  props: {
    nomenclatureData: {
      type: Object,
      default: () => {
      }
    }
  },
  data() {
    return {
      panel: [0],
      customToolbar:[
        [{ font: [] }],
        [{ header: [false, 1, 2, 3, 4, 5, 6] }],
        [{ size: ["small", false, "large", "huge"] }],
        ["bold", "italic", "underline", "strike"],
        [
          { align: "" },
          { align: "center" },
          { align: "right" },
          { align: "justify" }
        ],
        [{ header: 1 }, { header: 2 }],
        ["blockquote", "code-block"],
        [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ color: [] }, { background: [] }],
        // ["link", "image", "video", "formula"],
        ["link",  "formula"],
        [{ direction: "rtl" }],
        ["clean"]
      ],
    }
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
    ...mapGetters('NomenclaturesTreeModule',[
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
      'setPropertyNomenclature'
    ]),
    async localSetDescriptionNomenclature(){
      if (this.nomenclature.seo_descriptionEditor === this.nomenclature.seo_description)  return false;

      await this.setPropertyNomenclature({
        key: 'seo_description',
        payload: this.nomenclature.seo_descriptionEditor
      })
    },
  }
}
</script>

<style scoped lang="scss">

</style>