<template>
  <div :id="`component_wrapper-${index_component}`"
       :data-id="dataId"
       contenteditable="false"
       data-name="nomenclature"
       class="componentArticle_wrapper c-slider-wrapper component_container"
  >
    <div
        class="componentArticle_wrapper__admin_controls-header"
        contenteditable="false"
    >
      <img
          :src="require(`/src/assets/svg/closeIcon.svg`)"
          alt="close"
          class="componentArticle_wrapper__admin_controls-header__img"
          @click="deleteNomenclature()"
      />
    </div>

    <carousel>
      <slide class="c-slide" v-for="(slide, index) in nomenclatureList" :key="index" :data-id="slide.id" :paginationEnabled="false" :scrollPerPage="true" :perPageCustom="[[480, 1], [768, 3]]">
        <div class="c-slider">
          <template v-if="slide.isLoading">
              <v-progress-circular
                  v-if="slide.isLoading"
                  :size="24"
                  color="grey"
                  indeterminate
              ></v-progress-circular>
          </template>

          <template v-else-if="!slide.data">
            <span class="c-slider-error">Ошибка получения данных</span>

            <v-icon color="orange" class="mt-1">mdi-alert</v-icon>
          </template>

          <template v-else>
            <div class="c-slider__content">
              <template v-if="getPhoto(slide.data)">
                <img :src="getPhoto(slide.data)" :alt="slide.data.name">
              </template>

              <template>
                <img :src="require('/src/assets/img/noImage.webp')" :alt="slide.data.name">
              </template>
            </div>

            <div class="c-slider__info">
              <h5>{{ slide.data.name }}</h5>
            </div>
          </template>
        </div>
      </slide>
    </carousel>
  </div>
</template>

<script>
import Request from "@/services/request";
export default {
  name: "NomenclatureArticle",
  data: () => ({
    index_component: null,
    index_nomenclature: null,
    nomenclature_data: {},
    nomenclatureList: []
  }),
  computed: {
    dataId() {
      if (!this.nomenclature_data || !this.nomenclature_data?.id) return null;
      return this.nomenclature_data.id;
    },
  },
  mounted() {
    this.getData()

    this.getNomenclatureInfo()
  },
  methods: {
    getData() {
      if (
          Object.keys(this.$store.state.ArticleModule.selectedComponent).length
      ) {
        this.index_nomenclature =
            this.$store.state.ArticleModule.counters.nomenclature;
        this.index_component = this.$store.state.ArticleModule.counters.layout;
        this.nomenclature_data = Object.assign(
            {},
            this.$store.state.ArticleModule.selectedComponent
        );

        this.nomenclatureList = this.nomenclature_data.nomenclatures_id.map(elem => {
          return {id: elem, isLoading: true}
        })
      }
    },
    getNomenclatureInfo() {
      this.nomenclatureList.forEach(async (elem) => {
        const result = await Request.get(
            `${this.$store.state.BASE_URL}/entity/nomenclature/${elem.id}`
        )

        elem.data = result?.data ?? null
        elem.isLoading = false
      })
    },
    deleteNomenclature() {
      this.$store.dispatch("deleteComponent", this.index_component);
    },

    getPhoto(slide) {
      const url = (slide?._family?.photos && slide?._family?.photos[0]) ?? null

      if (url) {
        return this.$store.state.BASE_URL + url;
      } else {
        return null
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/slider";
</style>
