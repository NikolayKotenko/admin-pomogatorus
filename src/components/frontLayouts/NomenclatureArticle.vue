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

      <CloseSVG
          alt="close"
          class="componentArticle_wrapper__admin_controls-header__img"
          @click="deleteNomenclature()"
      />
    </div>

    <VueSlickCarousel v-if="nomenclatureList.length" v-bind="sliderOptions" @click.stop.prevent>
      <div class="c-slide" v-for="(slide, index) in nomenclatureList" :key="index" :data-id="slide.id">
        <div class="c-slider">
          <template v-if="slide.isLoading">
            <div class="c-slider__loader">
              <v-progress-circular
                  v-if="slide.isLoading"
                  :size="24"
                  color="#539ee0"
                  indeterminate
              ></v-progress-circular>
            </div>
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

              <template v-else>
                <img :src="require('/src/assets/img/noImage.webp')" :alt="slide.data.name">
              </template>
            </div>

            <div class="c-slider__info">
              <h4 class="c-slider__info__label">{{ slide.data.name }}</h4>

              <div class="c-slider__info__wrapper">
                <div class="c-slider__info__wrapper__left">
                  <div v-for="(option, index) in cardFields" :key="index" class="c-slider__info__wrapper__left__options">
                    <span class="c-slider-option">
                      <span class="c-slider-option__label">{{ option.label }}: </span>
                      <span class="c-slider-option__value">{{ slide.data[option.value] ? slide.data[option.value] : mockData[option.value]}}</span>
                    </span>
                  </div>
                </div>

                <div class="c-slider__info__wrapper__right">
                  <FavoriteSVG/>
                  <CartSVG/>
                  <ToolSVG/>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </VueSlickCarousel>
  </div>
</template>

<script>
import Request from "@/services/request";

import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
// optional style for arrows & dots
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

import FavoriteSVG from "@/assets/svg/favorite.svg"
import CartSVG from "@/assets/svg/cart.svg"
import ToolSVG from "@/assets/svg/tool.svg"
import CloseSVG from "@/assets/svg/closeIcon.svg"

export default {
  name: "NomenclatureArticle",
  components: {
    VueSlickCarousel,
    FavoriteSVG,
    CartSVG,
    ToolSVG,
    CloseSVG
  },
  data: () => ({
    index_component: null,
    index_nomenclature: null,
    nomenclature_data: {},
    nomenclatureList: [],

    mockData: {
      montage: "настенный",
      fuel: "газ",
      power: "10 кВт"
    },
    cardFields: [
      {
        label: "Монтаж",
        value: "montage"
      },
      {
        label: "Вид топлива",
        value: "fuel"
      },
      {
        label: "Мощность",
        value: "power"
      },
    ],
    sliderOptions: {
      "dots": false,
      "infinite": true,
      "speed": 500,
      "slidesToShow": 4,
      "slidesToScroll": 4,
      "initialSlide": 0,
      "responsive": [
        {
          "breakpoint": 1024,
          "settings": {
            "slidesToShow": 3,
            "slidesToScroll": 3,
            "infinite": true,
            "dots": true
          }
        },
        {
          "breakpoint": 600,
          "settings": {
            "slidesToShow": 2,
            "slidesToScroll": 2,
            "initialSlide": 2
          }
        },
        {
          "breakpoint": 480,
          "settings": {
            "slidesToShow": 1,
            "slidesToScroll": 1
          }
        }
      ]
    }
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
        return this.$store.state.BASE_URL + url?.full_path;
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
