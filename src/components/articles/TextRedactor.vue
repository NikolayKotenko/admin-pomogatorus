<template>
  <div class="textRedactor" :class="{disabled: !newArticle.name.value}">
    <div class="textRedactor__header">
      <div class="textRedactor__header__firstLine">
        <!-- Вставить элемент в текст -->
        <div class="header__elBlock right">
          <v-menu
              open-on-hover
              bottom
              offset-y
              transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
              >
                mdi-plus
              </v-icon>
            </template>
            <v-list>
              <v-list-item @click="initializeSelection('questions')">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        size="20"
                    >
                      mdi-message-question
                    </v-icon>
                    <v-list-item-title class="v-menu-item"> Вставить вопрос </v-list-item-title>
                  </template>
                  <span>Вставить вопрос</span>
                </v-tooltip>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <!-- Undo/Redo -->
        <div class="header__elBlock right">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
              >
                mdi-undo
              </v-icon>
            </template>
            <span>Отменить</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
              >
                mdi-redo
              </v-icon>
            </template>
            <span>Вернуть</span>
          </v-tooltip>
        </div>
        <!-- Жирный/курсив и т.д. -->
        <div class="header__elBlock">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div
                  v-bind="attrs"
                  v-on="on"
                  class="header__elBlock__iconWrapper"
              >
                <v-icon>
                  mdi-format-title
                </v-icon>
                <v-icon
                    v-if="true"
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-down
                </v-icon>
                <v-icon
                    v-else
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-up
                </v-icon>
              </div>

            </template>
            <span>Настройка текста</span>
          </v-tooltip>
        </div>
        <!-- Заголовки -->
        <div class="header__elBlock">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div
                  v-bind="attrs"
                  v-on="on"
                  class="header__elBlock__iconWrapper"
              >
                <v-icon>
                  mdi-format-header-pound
                </v-icon>
                <v-icon
                    v-if="true"
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-down
                </v-icon>
                <v-icon
                    v-else
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-up
                </v-icon>
              </div>

            </template>
            <span>Настройка заголовка</span>
          </v-tooltip>
        </div>
        <!-- Шрифты -->
        <div class="header__elBlock">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div
                  v-bind="attrs"
                  v-on="on"
                  class="header__elBlock__iconWrapper"
              >
                <v-icon>
                  mdi-format-font
                </v-icon>
                <v-icon
                    v-if="true"
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-down
                </v-icon>
                <v-icon
                    v-else
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-up
                </v-icon>
              </div>

            </template>
            <span>Настройка шрифта</span>
          </v-tooltip>
        </div>
        <!-- Цвет текста -->
        <div class="header__elBlock">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <div
                  v-bind="attrs"
                  v-on="on"
                  class="header__elBlock__iconWrapper"
              >
                <div style="display: flex; flex-direction: column; align-items: center; position: relative">
                  <v-icon>
                    mdi-format-color-text
                  </v-icon>
                  <div style="width: 60%; height: 2px; background: black; position: absolute; top: 20px"></div>
                </div>
                <v-icon
                    v-if="true"
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-down
                </v-icon>
                <v-icon
                    v-else
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-up
                </v-icon>
              </div>

            </template>
            <span>Выбрать цвет текста</span>
          </v-tooltip>
        </div>
        <!-- Выделение текста -->
        <div class="header__elBlock">
          <v-menu
              bottom
              offset-y
              transition="scale-transition"
              :close-on-click="false"
              :close-on-content-click="false"
              v-model="text_underline"
          >
            <template v-slot:activator="{ on, attrs }">
              <div
                  class="header__elBlock__iconWrapper"
              >
                <div style="display: flex; flex-direction: column; align-items: center; position: relative">
                  <v-icon>
                    mdi-format-color-highlight
                  </v-icon>
                  <div style="width: 60%; height: 2px; background: black; position: absolute; top: 20px"></div>
                </div>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-if="true"
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-down
                </v-icon>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-else
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-up
                </v-icon>
              </div>
            </template>
            <v-list>
              <v-list-item>
                <div style="display: grid">
                  <div style="justify-self: end">
                    <v-icon @click="text_underline = false">mdi-close</v-icon>
                  </div>
                  <v-color-picker
                      :swatches="swatches"
                      show-swatches
                  ></v-color-picker>
                  <v-btn
                      color="primary"
                      @click="text_underline = false"
                  >
                    Применить
                  </v-btn>
                </div>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <!-- Очистка форматирования -->
        <div class="header__elBlock">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  @click="test2()"
              >
                mdi-format-clear
              </v-icon>
            </template>
            <span>Очистить форматирование</span>
          </v-tooltip>
        </div>
      </div>
      <div class="textRedactor__header__secondLine">
        <!-- Форматирование -->
        <div class="header__elBlock">
          <v-menu
              open-on-hover
              bottom
              offset-y
              transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <div
                  class="header__elBlock__iconWrapper"
              >
                <v-icon>
                  mdi-format-align-left
                </v-icon>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-if="true"
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-down
                </v-icon>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-else
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-up
                </v-icon>
              </div>
            </template>
            <v-list>
              <v-list-item>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        size="20"
                    >
                      mdi-format-align-left
                    </v-icon>
                    <v-list-item-title class="v-menu-item"> Выравнивание по левой стороне </v-list-item-title>
                  </template>
                  <span>Выравнивание по левой стороне</span>
                </v-tooltip>
              </v-list-item>
              <v-list-item>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        size="20"
                    >
                      mdi-format-align-right
                    </v-icon>
                    <v-list-item-title class="v-menu-item"> Выравнивание по правой стороне </v-list-item-title>
                  </template>
                  <span>Выравнивание по правой стороне</span>
                </v-tooltip>
              </v-list-item>
              <v-list-item>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        size="20"
                    >
                      mdi-format-align-center
                    </v-icon>
                    <v-list-item-title class="v-menu-item"> Выравнивание по центру </v-list-item-title>
                  </template>
                  <span>Выравнивание по центру</span>
                </v-tooltip>
              </v-list-item>
              <v-list-item>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        size="20"
                    >
                      mdi-format-align-justify
                    </v-icon>
                    <v-list-item-title class="v-menu-item"> Выравнивание по ширине </v-list-item-title>
                  </template>
                  <span>Выравнивание по ширине</span>
                </v-tooltip>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <!-- Отступы -->
        <div class="header__elBlock">
          <v-menu
              open-on-hover
              bottom
              offset-y
              transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <div
                  class="header__elBlock__iconWrapper"
              >
                <v-icon>
                  mdi-format-indent-decrease
                </v-icon>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-if="true"
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-down
                </v-icon>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-else
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-up
                </v-icon>
              </div>
            </template>
            <v-list>
              <v-list-item>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        size="20"
                    >
                      mdi-format-indent-increase
                    </v-icon>
                    <v-list-item-title class="v-menu-item"> Сделать отступ </v-list-item-title>
                  </template>
                  <span>Сделать отступ</span>
                </v-tooltip>
              </v-list-item>
              <v-list-item>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        size="20"
                    >
                      mdi-format-indent-decrease
                    </v-icon>
                    <v-list-item-title class="v-menu-item"> Убрать отступ </v-list-item-title>
                  </template>
                  <span>Убрать отступ</span>
                </v-tooltip>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
        <!-- Высота строки -->
        <div class="header__elBlock right">
          <v-menu
              open-on-hover
              bottom
              offset-y
              transition="scale-transition"
          >
            <template v-slot:activator="{ on, attrs }">
              <div
                  class="header__elBlock__iconWrapper"
              >
                <v-icon>
                  mdi-format-line-spacing
                </v-icon>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-if="true"
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-down
                </v-icon>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-else
                    class="header__elBlock__iconWrapper__arrow"
                >
                  mdi-menu-up
                </v-icon>
              </div>
            </template>
            <v-list>
              <v-list-item
                  v-for="(value_spacing, index) in line_spacing"
                  :key="index"
              >
                <v-list-item-title> {{ value_spacing.value }} </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </div>
    </div>

    <div
        class="textRedactor__content"
        :contenteditable="!!newArticle.name.value"
        spellcheck="false"
        ref="content" @input="onContentChange"
    >
    </div>

    <!-- MODALS -->
    <v-dialog
        v-model="selectComponent"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important;">Какой вопрос?</span>
        </v-card-title>
        <v-card-text>
          <v-autocomplete
              :loading="$store.state.TitlesModule.loadingModalList"
              :disabled="$store.state.TitlesModule.loadingModalList"
              :items="$store.state.TitlesModule.listComponents"
              item-text="name"
              return-object
              v-model="$store.state.TitlesModule.selectedComponent"
              placeholder="Наименование"
          >
          </v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-btn
              color="blue darken-1"
              text
              @click="selectComponent = !selectComponent"
          >
            Назад
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              text
              @click="onSelectComponent()"
          >
            Выбрать
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- OVERLAYS -->
    <div class="overlay" v-if="!newArticle.name.value"></div>

<!--    <v-autocomplete-->
<!--      :items="$store.state.TitlesModule.fonts"-->
<!--      item-text="family"-->
<!--    />-->
  </div>
</template>

<script>
import Vue from "vue";
import store from '@/store/index.js'
import vuetify from '@/plugins/vuetify'

import WebFontLoader from 'webfontloader';
import Question from "../frontLayouts/Question";

export default {
  name: "TextRedactor",
  props: ['newArticle', 'deletedContent'],
  data: () => ({
    /* MODALS */
    selectComponent: false,
    params_of_component: {
      name: '',
    },
    range: null,
    htmlSelected: null,
    selection: null,

    /* EDITOR */
    line_spacing: [
      {
        value: 1,
      },
      {
        value: 1.15,
      },
      {
        value: 1.5,
      },
      {
        value: 2,
      },
      {
        value: 2.5,
      },
      {
        value: 3,
      },
    ],
    text_underline: false,
    swatches: [
      ['#000000', '#2196F3', '#A9A9A9'],
      ['#FF0000', '#FFFFFF', '#AA0000'],
      ['#FFFF00', '#0000FF', '#8E24AA'],
      ['#00FF00', '#00AA00', '#005500'],
      ['#00FFFF', '#00AAAA', '#005555'],
    ],
    debounceTimeout: null,

    /* INSERT COMPONENTS */
    geting_from_server: false,
    test_from_server: [
      {
        id_component: 1,
        index: 1,
        type_component: 'questions'
      },
      {
        id_component: 1,
        index: 2,
        type_component: 'questions'
      },
      {
        id_component: 1,
        index: 3,
        type_component: 'questions'
      },
    ],
    test_content_from_server: 'lorem<div><div data-v-98078a96="" contenteditable="false" id="question_wrapper-1" class="question_wrapper"><div data-v-98078a96="" class="question_wrapper__admin_controls" style="width: 321px; height: 101.078px;"><div data-v-98078a96="" contenteditable="false" class="question_wrapper__admin_controls__wrapper"><img data-v-98078a96="" src="/img/closeIcon.9f67941f.svg" alt="close" class="question_wrapper__admin_controls__wrapper__img"></div></div><div data-v-98078a96="" class="question_wrapper__title"><h3 data-v-98078a96="">1. tested</h3><!----></div><div data-v-98078a96="" class="question_wrapper__content"><div data-v-98078a96="" class="v-input v-input--hide-details v-input--dense theme--light v-text-field v-text-field--single-line v-text-field--solo v-text-field--is-booted v-text-field--enclosed v-text-field--placeholder"><div class="v-input__control"><div class="v-input__slot"><div class="v-text-field__slot"><input id="input-211" placeholder="Введите ответ" type="text"></div></div></div></div></div></div><br></div><div><div data-v-98078a96="" contenteditable="false" id="question_wrapper-2" class="question_wrapper"><div data-v-98078a96="" class="question_wrapper__admin_controls" style="width: 321px; height: 101.078px;"><div data-v-98078a96="" contenteditable="false" class="question_wrapper__admin_controls__wrapper"><img data-v-98078a96="" src="/img/closeIcon.9f67941f.svg" alt="close" class="question_wrapper__admin_controls__wrapper__img"></div></div><div data-v-98078a96="" class="question_wrapper__title"><h3 data-v-98078a96="">2. tested</h3><!----></div><div data-v-98078a96="" class="question_wrapper__content"><div data-v-98078a96="" class="v-input v-input--hide-details v-input--dense theme--light v-text-field v-text-field--single-line v-text-field--solo v-text-field--is-booted v-text-field--enclosed v-text-field--placeholder"><div class="v-input__control"><div class="v-input__slot"><div class="v-text-field__slot"><input id="input-218" placeholder="Введите ответ" type="text"></div></div></div></div></div></div><br></div><div><div data-v-98078a96="" contenteditable="false" id="question_wrapper-3" class="question_wrapper"><div data-v-98078a96="" class="question_wrapper__admin_controls" style="width: 321px; height: 101.078px;"><div data-v-98078a96="" contenteditable="false" class="question_wrapper__admin_controls__wrapper"><img data-v-98078a96="" src="/img/closeIcon.9f67941f.svg" alt="close" class="question_wrapper__admin_controls__wrapper__img"></div></div><div data-v-98078a96="" class="question_wrapper__title"><h3 data-v-98078a96="">3. tested</h3><!----></div><div data-v-98078a96="" class="question_wrapper__content"><div data-v-98078a96="" class="v-input v-input--hide-details v-input--dense theme--light v-text-field v-text-field--single-line v-text-field--solo v-text-field--is-booted v-text-field--enclosed v-text-field--placeholder"><div class="v-input__control"><div class="v-input__slot"><div class="v-text-field__slot"><input id="input-225" placeholder="Введите ответ" type="text"></div></div></div></div></div></div><br></div><div>&nbsp;loremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremloremlorem lorem loremloremlorem lorem </div>',
    instances: [],
    data_of_components: [],
  }),
  created() {
    WebFontLoader.load({
      google: { families: ["Roboto", 'Hurricane', 'Palette Mosaic']}
    })
  },
  mounted() {
    // if (this.$route.params?.action === 'edit') {
    //   this.$store.state.TitlesModule.inserted_components = this.test_from_server
    //   this.$store.state.TitlesModule.content_from_server = this.test_content_from_server
    // }
    this.$store.dispatch('testFont')
    setTimeout(() => {
      this.initializeContent().then(() => {
        this.onContentChange()
      })
    }, 500)
  },
  watch: {
    'data_of_components': {
      handler() {
        if (!this.geting_from_server) {
          this.$store.state.TitlesModule.inserted_components = []
          this.$store.state.TitlesModule.inserted_components = this.data_of_components
          this.$store.state.TitlesModule.content = this.content
        }
      },
      deep: true
    },
    'deletedContent': {
      handler(v) {
        if (v) {
          this.content = ''
          this.$store.state.TitlesModule.content = ''
        }
      },
    },
    'params_of_component.name': {
      handler(v) {
        if (v) {
          this.$store.dispatch('getListComponents', this.params_of_component.name)
        }
      }
    },
    '$store.state.TitlesModule.deletedComponent': {
      handler() {
        if (this.$store.state.TitlesModule.deletedComponent !== 0) {
          let index = this.instances.findIndex((elem) => {
            return elem.$data.count_of_question === this.$store.state.TitlesModule.deletedComponent
          })
          if (index !== -1) {
            this.instances.splice(index, 1)
            this.data_of_components.splice(index, 1)
            let counter_instances = 1
            this.instances.forEach(elem => {
              elem.$data.count_of_question = counter_instances
              counter_instances++
            })
            let counter_index = 1
            this.data_of_components.forEach(elem => {
              elem.index = counter_index
              counter_index++
            })
            this.$store.state.TitlesModule.countQuestion = counter_instances-1
            this.$store.state.TitlesModule.deletedComponent = 0
          }
        }
      },
    },
    '$store.state.TitlesModule.content_from_server': {
      handler() {
        this.content = this.$store.state.TitlesModule.content_from_server
        this.$store.state.TitlesModule.content = this.content
      }
    },
  },
  computed: {
    content: {
      cache: false,
      get: function () { return this.$refs.content.innerHTML ; },
      set: function (val) {
        this.$refs.content.innerHTML  = val;
      }
    }
  },
  methods: {
    getELEM() {
      console.log(this.content)
    },
    /* INITIALIZE DATA FROM BACK OR INDEXEDDB */
    initializeContent() {
      return new Promise((resolve) => {
        console.log('initialize')
        if (this.$store.state.TitlesModule.inserted_components && this.$store.state.TitlesModule.inserted_components.length) {
          console.log('YA RABOTAU')
          this.geting_from_server = true

          this.content = this.$store.state.TitlesModule.content_from_server

          const promises = []

          this.$store.state.TitlesModule.inserted_components.forEach(elem => {
            promises.push(this.$store.dispatch('getComponentsById', elem))
          })

          Promise.all(promises).finally(() => {
            this.data_of_components = this.$store.state.TitlesModule.inserted_components.slice()
            this.$store.state.TitlesModule.components_after_request.sort((a,b) => {
              return a.index - b.index
            })
            const arr = this.$store.state.TitlesModule.components_after_request
            arr.forEach((elem) => {
              this.$store.state.TitlesModule.countQuestion = elem.index
              this.$store.state.TitlesModule.selectedComponent = elem.data
              let range = document.createRange();
              range.selectNode(document.getElementById(`question_wrapper-${elem.index}`));
              range.deleteContents()
              range.collapse(false);
              let ComponentClass = Vue.extend(Question)
              this.instances.push(new ComponentClass({
                store,
                vuetify,
              }))
              this.instances[elem.index-1].$mount() // pass nothing
              range.insertNode(this.instances[elem.index-1].$el)
              this.$store.state.TitlesModule.selectedComponent = {}
            })
            this.geting_from_server = false
            resolve()
          })
        }
      })
    },

    /* FIXME: ДОБАВИТЬ ДЕБАУНС И СОХРАНЯЕМ ИЗМЕНЕНИЯ НА СЕРВЕР */
    onContentChange() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.$store.state.TitlesModule.content = this.content
      })
      /* IF WE DELETED COMPONENT BY KEYBOARD */
      this.instances.forEach(elem => {
        const elem_content = document.getElementById(`question_wrapper-${elem.$data.count_of_question}`)
        if (!elem_content) {
          this.$store.state.TitlesModule.deletedComponent = elem.$data.count_of_question
        }
      })
    },

    /* FIXME: FONTNAME */
    test2() {
      document.execCommand("fontName", false, 'Palette Mosaic')
    },

    /* MANIPULATING WITH INSERTING COMPONENTS */
    initializeSelection(componentName) {
      if (window.getSelection) {
        this.selection = null
        this.selection = window.getSelection();
        if (this.selection.getRangeAt && this.selection.rangeCount) {
          this.range = null
          this.range = this.selection.getRangeAt(0);
          this.range.collapse(false);
        }
      } else if (document.selection && document.selection.createRange) {
        this.range = null
        this.range = document.selection.createRange();
        this.range.collapse(false);
      }

      this.selectComponent = true
      this.params_of_component.name = componentName

    },
    onSelectComponent() {
      this.$store.state.TitlesModule.countQuestion++
      this.insertingComponent().then(() => {
        this.data_of_components.push(new this.imported_component(this.$store.state.TitlesModule.selectedComponent.id, this.$store.state.TitlesModule.countQuestion, this.params_of_component.name))
        this.selectComponent = false
        this.$store.state.TitlesModule.selectedComponent = {}
      })
    },
    insertingComponent() {
      return new Promise((resolve) => {
        let ComponentClass = Vue.extend(Question)
        this.instances.push(new ComponentClass({
          store,
          vuetify,
        }))
        this.instances[this.$store.state.TitlesModule.countQuestion - 1].$mount() // pass nothing

        if (window.getSelection) {
          if (this.range && this.range.commonAncestorContainer.parentElement.className === 'textRedactor__content') {
            this.range.insertNode(this.instances[this.$store.state.TitlesModule.countQuestion - 1].$el);
          } else {
            let range = document.createRange();
            range.setStart(document.getElementsByClassName("textRedactor__content").item(0), 0)
            range.collapse(false);
            range.insertNode(this.instances[this.$store.state.TitlesModule.countQuestion - 1].$el);
          }
        } else if (document.selection && document.selection.createRange) {
          if (this.range && this.range.commonAncestorContainer.parentElement.className === 'textRedactor__content') {
            this.htmlSelected = (this.instances[this.$store.state.TitlesModule.countQuestion - 1].$el.nodeType == 3) ? this.instances[this.$store.state.TitlesModule.countQuestion - 1].$el.innerHTML.data : this.instances[this.$store.state.TitlesModule.countQuestion - 1].$el.outerHTML;
            this.range.pasteHTML(this.htmlSelected);
          } else {
            let range = document.createRange();
            range.setStart(document.getElementsByClassName("textRedactor__content").item(0), 0)
            range.collapse(false);
            this.htmlSelected = (this.instances[this.$store.state.TitlesModule.countQuestion - 1].$el.nodeType == 3) ? this.instances[this.$store.state.TitlesModule.countQuestion - 1].$el.innerHTML.data : this.instances[this.$store.state.TitlesModule.countQuestion - 1].$el.outerHTML;
            range.pasteHTML(this.htmlSelected);
          }
        }
        resolve()
      })
    },

    /* CONSTRUCTORS */
    imported_component(id_component, index, type_component) {
      this.id_component = id_component
      this.index = index
      this.type_component = type_component
    },
  },
  beforeDestroy() {
    this.$store.state.TitlesModule.listComponents = []
    this.$store.state.TitlesModule.selectedComponent = {}
    this.$store.state.TitlesModule.countQuestion = 0
    this.$store.state.TitlesModule.content_from_server = ''
    this.$store.state.TitlesModule.content = ''
    this.$store.state.TitlesModule.inserted_components = []
  }
}
</script>

<style scoped lang="scss">
.disabled {
  pointer-events: none;
}

.textRedactor {
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  border-radius: 5px;
  position: relative;

  &__header {
    background: #e9ecf4;
    width: 100%;
    display: grid;
    grid-template-areas:
              'firstLine'
              'secondLine';
    box-shadow: 0px -3px 5px -5px rgba(0, 0, 0, 0.6) inset;

    &__firstLine {
      display: flex;
      justify-content: space-between;
      grid-area: firstLine;
    }

    &__secondLine {
      display: flex;
      grid-area: secondLine;
    }

    .header__elBlock {
      padding: 2px 4px;

      &:last-child {
        border-right: unset;
      }

      &__iconWrapper {
        position: relative;
        padding-right: 10px;

        &__arrow {
          position: absolute !important;
          right: -8px !important;
          top: 0;
        }
      }
    }
    .right {
      border-right: 1px solid #c3cfd9;
    }
  }

  &__content {
    padding: 20px;
    outline: none;
    min-height: 300px;
    margin: 10px 0;
    word-break: break-all;
  }
}

.overlay {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.15);
}

.v-menu__content {
  max-width: 90% !important;
}
.v-menu-item {
  font-size: 1em;
  padding-left: 10px
}
::v-deep .v-color-picker__color {
  border: 1px solid lightgrey !important;
}
</style>
