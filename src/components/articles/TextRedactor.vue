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
              <!-- initializeImage -->
              <v-list-item @click="initializeSelection('image')">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        size="20"
                    >
                      mdi-panorama
                    </v-icon>
                    <v-list-item-title class="v-menu-item"> Вставить изображение </v-list-item-title>
                  </template>
                  <span>Вставить изображение</span>
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
                  @click="onAction('undo')"
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
                  @click="onAction('redo')"
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
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  @click="onAction('bold')"
              >
                mdi-format-bold
              </v-icon>
            </template>
            <span>Жирный</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  @click="onAction('italic')"
              >
                mdi-format-italic
              </v-icon>
            </template>
            <span>Курсив</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  @click="onAction('underline')"
              >
                mdi-format-underline
              </v-icon>
            </template>
            <span>Подчеркнутый</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  @click="onAction('strikethrough')"
              >
                mdi-format-strikethrough
              </v-icon>
            </template>
            <span>Перечёркнутый</span>
          </v-tooltip>
        </div>
        <!-- Форматирование -->
        <div class="header__elBlock">
          <v-menu
              open-on-hover
              bottom
              offset-y
              transition="scale-transition"
              v-model="align_content.open_list"
          >
            <template v-slot:activator="{ on, attrs }">
              <div
                  class="header__elBlock__iconWrapper"
              >
                <v-icon
                    @click="onAction(align_content.value)"
                >
                  {{ align_content.icon }}
                </v-icon>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-if="align_content.open_list"
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
              <v-list-item v-for="(item, index) in array_align_content" :key="index" @click="select_align_content(item.value)">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        size="20"
                    >
                      {{ item.icon }}
                    </v-icon>
                    <v-list-item-title class="v-menu-item"> {{ item.text }} </v-list-item-title>
                  </template>
                  <span>{{ item.text }}</span>
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
              v-model="side_spaces.open_list"
          >
            <template v-slot:activator="{ on, attrs }">
              <div
                  class="header__elBlock__iconWrapper"
              >
                <v-icon
                    @click="onAction(side_spaces.value)"
                >
                  {{ side_spaces.icon }}
                </v-icon>
                <v-icon
                    v-bind="attrs"
                    v-on="on"
                    v-if="side_spaces.open_list"
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
              <v-list-item v-for="(item, index) in array_side_spaces" :key="index" @click="select_side_content(item.value)">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                        v-bind="attrs"
                        v-on="on"
                        size="20"
                    >
                      {{ item.icon }}
                    </v-icon>
                    <v-list-item-title class="v-menu-item"> {{ item.text }} </v-list-item-title>
                  </template>
                  <span>{{ item.text }}</span>
                </v-tooltip>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <!-- Заголовки -->
<!--        <div class="header__elBlock">
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
        </div>-->
        <!-- Шрифты -->
<!--        <div class="header__elBlock">
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
        </div>-->
        <!-- Цвет текста -->
<!--        <div class="header__elBlock">
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
        </div>-->
        <!-- Выделение текста -->
<!--        <div class="header__elBlock">
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
        </div>-->
        <!-- Очистка форматирования -->
        <div class="header__elBlock">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  @click="onAction('removeFormat')"
              >
                mdi-format-clear
              </v-icon>
            </template>
            <span>Очистить форматирование</span>
          </v-tooltip>
        </div>
      </div>
<!--      <div class="textRedactor__header__secondLine">-->

<!--      </div>-->
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
        v-model="selectComponent.questions"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important; text-align: center; width: 100%">Какой вопрос?</span>
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
              @click="selectComponent.questions = !selectComponent.questions"
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

    <v-dialog
        v-model="selectComponent.image"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important;">Загрузите изображение</span>
        </v-card-title>
        <v-card-text class="dialog_dropzone_wrapper">
          <vue-dropzone
              ref="myVueDropzone" id="dropzone" :options="options" :useCustomSlot=true v-if="!loading_dropzone" @vdropzone-success="successData"
          >
            <h3 class="dropzone-custom-title">
              <v-icon size="120" color="grey lighten-1" style="transform: rotate(45deg)">
                mdi-paperclip
              </v-icon>
            </h3>
            <div class="subtitle" style="color: darkgrey">Для вставки изображения перетащите файл в зону или нажмите на скрепку</div>
          </vue-dropzone>
          <div v-if="dropzone_uploaded.length" @click="triggerUpload()" class="dialog_dropzone_wrapper__upload">
            <v-icon color="grey lighten-1" size="60" style="transform: rotate(45deg)">mdi-paperclip</v-icon>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn
              color="blue darken-1"
              text
              @click="selectComponent.image = !selectComponent.image"
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

import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import PreviewTemplate from "../dropzone/PreviewTemplate";

import WebFontLoader from 'webfontloader';
import Question from "../frontLayouts/Question";
import ImageLayout from "../frontLayouts/ImageLayout";

export default {
  name: "TextRedactor",
  props: ['newArticle', 'deletedContent'],
  components: {
    vueDropzone: vue2Dropzone,
  },
  data: () => ({
    /* MODALS */
    selectComponent: {
      questions: false,
      image: false
    },
    params_of_component: {
      name: '',
    },
    range: null,
    htmlSelected: null,
    selection: null,

    /* DROPZONE */
    index_uploaded: 1,
    dropzone_uploaded: [],
    loading_dropzone: true,
    previewHtml: null,

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
    align_content: {
      value: 'justifyLeft',
      text: 'Выравнивание по левой стороне',
      icon: 'mdi-format-align-left',
      open_list: false,
    },
    array_align_content: [
      {
        value: 'justifyLeft',
        text: 'Выравнивание по левой стороне',
        icon: 'mdi-format-align-left',
        open_list: false,
      },
      {
        value: 'justifyRight',
        text: 'Выравнивание по правой стороне',
        icon: 'mdi-format-align-right',
        open_list: false,
      },
      {
        value: 'justifyCenter',
        text: 'Выравнивание по центру',
        icon: 'mdi-format-align-center',
        open_list: false,
      },
      {
        value: 'justifyFull',
        text: 'Выравнивание по ширине',
        icon: 'mdi-format-align-justify',
        open_list: false,
      },
    ],
    side_spaces: {
      value: 'indent',
      text: 'Сделать отступ',
      icon: 'mdi-format-indent-increase',
      open_list: false,
    },
    array_side_spaces: [
      {
        value: 'indent',
        text: 'Сделать отступ',
        icon: 'mdi-format-indent-increase',
        open_list: false,
      },
      {
        value: 'outdent',
        text: 'Убрать отступ',
        icon: 'mdi-format-indent-decrease',
        open_list: false,
      },
    ],

    /* INSERT COMPONENTS */
    saveDB: false,
    debounceTimeout: null,
    geting_from_server: false,
    data_of_components: [],
  }),
  created() {
    WebFontLoader.load({
      google: { families: ["Roboto", 'Hurricane', 'Palette Mosaic']}
    })
    const ComponentClass = Vue.extend(PreviewTemplate);
    const instance = new ComponentClass();
    instance.$mount();
    this.previewHtml = instance.$el.outerHTML;

    this.loading_dropzone = false;
  },
  mounted() {
    this.$store.dispatch('testFont')
    setTimeout(() => {
      this.initializeContent().then(() => {
        // this.onContentChange()
      })
    }, 500)
  },
  watch: {
    'saveDB': {
      handler(v) {
        if (!this.geting_from_server && v) {
          this.$store.state.TitlesModule.inserted_components = []
          const arr = []
          this.data_of_components.forEach(elem => {
            arr.push(elem.data)
          })
          this.$store.state.TitlesModule.inserted_components = arr
          this.$store.state.TitlesModule.content = this.content
        }
      },
    },
    /*'data_of_components': {
      handler() {
        if (!this.geting_from_server) {
          this.$store.state.TitlesModule.inserted_components = []
          const arr = []
          this.data_of_components.forEach(elem => {
            arr.push(elem.data)
          })
          this.$store.state.TitlesModule.inserted_components = arr
          this.$store.state.TitlesModule.content = this.content
        }
      },
    },*/
    'deletedContent': {
      handler(v) {
        if (v) {
          this.content = ''
          this.$store.state.TitlesModule.content = ''
          for (let key in this.data_of_components) {
            this.data_of_components[key] = []
          }
          this.params_of_component.name = ''
          this.clearStateAfterDestroy()
        }
      },
    },
    'params_of_component.name': {
      handler(v) {
        if (v && v !== 'image') {
          this.$store.dispatch('getListComponents', this.params_of_component.name)
        }
      }
    },
    '$store.state.TitlesModule.deletedComponent': {
      handler() {
        if (this.$store.state.TitlesModule.deletedComponent !== 0) {
          let index = this.instances.findIndex((elem) => {
            return elem.$data.index_component === this.$store.state.TitlesModule.deletedComponent
          })
          if (index !== -1) {
            for (let key in this.data_of_components) {
              this.data_of_components[key].splice(index, 1)
            }
            /* FIXME: need refactor */


            // const global_counter = {
            //   count_of_question: 1,
            //   count_of_images: 1,
            //   counter_instances: 1,
            //   counter_index: 1,
            // }




            // for (let i = 0; i < this.data_of_components.length; i++) {
            //   const instance = this.instances[i]
            //   const component_data = this.data_of_components[i]
            //
            //   // instances
            //   const block = document.getElementById(`component_wrapper-${instance.$data.index_component}`)
            //   block.id =  `component_wrapper-${global_counter.counter_instances}`
            //   instance.$data.index_component = global_counter.counter_instances
            //
            //   if (Object.keys(instance.$data).includes('count_of_question')) {
            //     instance.$data.count_of_question = global_counter.count_of_question
            //   } else if (Object.keys(instance.$data).includes('count_of_images')) {
            //     instance.$data.count_of_images = global_counter.count_of_images
            //   }
            //
            //   //  index_component
            //   component_data.index = global_counter.counter_index
            //   if (Object.keys(component_data.component).includes('count_of_question')) {
            //     component_data.component.count_of_question = global_counter.count_of_question
            //   } else if (Object.keys(component_data.component).includes('count_of_images')) {
            //     component_data.component.count_of_images = global_counter.count_of_images
            //   }
            // }
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
    },
    options() {
      return {
        url: `https://httpbin.org/post`,
        previewTemplate: this.previewHtml,
        destroyDropzone: false,
      };
    },
    componentLayout() {
      return this.params_of_component.name === 'questions' ? Vue.extend(Question) : Vue.extend(ImageLayout)
    }
  },
  methods: {
    /* MODALS */
    successData(file) {
      const formatObj = {}

      for (let key in file) {
        Object.assign(formatObj, {[key]: file[key]})
      }
      Object.assign(formatObj, {id: this.index_uploaded})
      this.index_uploaded++
      this.dropzone_uploaded.push(formatObj)

      this.$nextTick(() => {
        const deletedElems = document.getElementsByClassName('close')
        let count = 1;
        for (let item of deletedElems) {
          item.setAttribute('id', `close-${count}`);
          const id = count
          item.onclick = () => {
            this.removedFile(id)
          }
          count++
        }
      })
    },
    removedFile(id) {
      const index = this.dropzone_uploaded.findIndex(elem => {
        return elem.id === id
      })
      if (index !== -1) {
        this.dropzone_uploaded.splice(index, 1)
      }
    },
    triggerUpload() {
      document.getElementById('dropzone').click()
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
            if (elem.component.name === 'questions') {
              promises.push(this.$store.dispatch('getComponentsById', elem))
            } else if (elem.component.name === 'image') {
              promises.push(this.$store.dispatch('imageFromServer', elem))
            }
          })

          Promise.all(promises).finally(() => {
            // this.data_of_components = this.$store.state.TitlesModule.inserted_components.slice()
            this.$store.state.TitlesModule.components_after_request.sort((a,b) => {
              return a.index - b.index
            })

            console.log(this.$store.state.TitlesModule.components_after_request)

            const arr = this.$store.state.TitlesModule.components_after_request
            this.$nextTick(() => {
              arr.forEach((elem) => {
                setTimeout(() => {
                    // FIXME
                    this.checkTypeComponent(elem)
                    this.$store.state.TitlesModule.countLayout = elem.index
                    this.$store.state.TitlesModule.selectedComponent = elem.data
                    let range = document.createRange();
                    range.selectNode(document.getElementById(`component_wrapper-${elem.index}`));
                    range.deleteContents()
                    range.collapse(false);
                    console.log(elem)
                    console.log(this.getStructureForInstance(elem))
                    this.data_of_components.push(this.getStructureForInstance(elem))
                    console.log(this.$store.state.TitlesModule.countLayout)
                    this.data_of_components[this.$store.state.TitlesModule.countLayout - 1].instance.$mount() // pass nothing
                    range.insertNode(this.data_of_components[elem.index-1].instance.$el)
                    this.$store.state.TitlesModule.selectedComponent = {}
                  })
              })
            })
            this.geting_from_server = false
            resolve()
          })
        }
      })
    },
    checkTypeComponent(elem) {
      this.params_of_component.name = elem.component_data.name
      if (elem.component_data.name === 'questions') {
        this.$store.state.TitlesModule.count_of_questions = elem.component_data.index_question
      } else if (elem.component_data.name === 'questions') {
        this.$store.state.TitlesModule.count_of_images = elem.data.index_image
      }
    },

    /* FIXME: ДОБАВИТЬ ДЕБАУНС И СОХРАНЯЕМ ИЗМЕНЕНИЯ НА СЕРВЕР */
    onContentChange() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.$store.state.TitlesModule.content = this.content
      })
      /* IF WE DELETED COMPONENT BY KEYBOARD */
      this.data_of_components.forEach(elem => {
        const elem_content = document.getElementById(`component_wrapper-${elem.instance.$data.index_component}`)
        if (!elem_content) {
          console.log('a')
          this.$store.state.TitlesModule.deletedComponent = elem.instance.$data.index_component
        }
      })
    },
    select_side_content(value) {
      const index = this.array_side_spaces.findIndex(elem => {
        return elem.value === value
      })
      if (index !== -1) this.side_spaces = this.array_side_spaces[index]
    },
    select_align_content(value) {
      const index = this.array_align_content.findIndex(elem => {
        return elem.value === value
      })
      if (index !== -1) this.align_content = this.array_align_content[index]
    },
    onAction(action) {
      document.execCommand(action, false, null);
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

      this.selectComponent[componentName] = true
      this.params_of_component.name = componentName

    },
    onSelectComponent() {
      if (this.params_of_component.name === 'questions') {
        this.$store.state.TitlesModule.count_of_questions++
        this.callCheckout()
      } else if (this.params_of_component.name === 'image') {
        this.$store.state.TitlesModule.count_of_images++
        if (this.dropzone_uploaded.length) {
          this.dropzone_uploaded.forEach(elem => {
            this.$store.state.TitlesModule.selectedComponent = elem
            this.callCheckout(elem)
          })
        }
      }
    },
    callCheckout(elem) {
      this.$store.state.TitlesModule.countLayout++

      let data_component;
      if (this.params_of_component.name === 'questions') {
        data_component = new this.Element_question({
          name: this.params_of_component.name,
          id: this.$store.state.TitlesModule.selectedComponent.id,
          index_question: this.$store.state.TitlesModule.count_of_questions
        })
      } else if (this.params_of_component.name === 'image') {
        data_component = new this.Element_image({
          name: this.params_of_component.name,
          src: elem.dataURL,
          index_image: this.$store.state.TitlesModule.count_of_images
        })
      }

      this.insertingComponent(data_component).then(() => {
        this.saveDB = true
        this.clearStateAfterSelect()
        setTimeout(() => {
          this.saveDB = false
        })
      })
    },
    getStructureForInstance(data_component) {
      const instance = new this.componentLayout({
        store,
        vuetify,
      })
      const data = new this.Imported_component({index: this.$store.state.TitlesModule.countLayout, component: data_component})
      const params = Object.assign({}, {instance: instance}, {data: data})
      return new this.Constructor_instance(params)
    },
    insertingComponent(data_component) {
      return new Promise((resolve) => {
        const elem = this.getStructureForInstance(data_component)
        this.data_of_components.push(elem)
        this.data_of_components[this.$store.state.TitlesModule.countLayout - 1].instance.$mount() // pass nothing

        if (window.getSelection) {
          if (this.range && this.range.commonAncestorContainer.parentElement.className === 'textRedactor__content') {
            this.range.insertNode(this.data_of_components[this.$store.state.TitlesModule.countLayout - 1].instance.$el);
          } else {
            let range = document.createRange();
            range.setStart(document.getElementsByClassName("textRedactor__content").item(0), 0)
            range.collapse(false);
            range.insertNode(this.data_of_components[this.$store.state.TitlesModule.countLayout - 1].instance.$el);
          }
        } else if (document.selection && document.selection.createRange) {
          if (this.range && this.range.commonAncestorContainer.parentElement.className === 'textRedactor__content') {
            this.htmlSelected = (this.data_of_components[this.$store.state.TitlesModule.countLayout - 1].instance.$el.nodeType == 3) ?
                this.data_of_components[this.$store.state.TitlesModule.countLayout - 1].instance.$el.innerHTML.data :
                this.data_of_components[this.$store.state.TitlesModule.countLayout - 1].instance.$el.outerHTML;
            this.range.pasteHTML(this.htmlSelected);
          } else {
            let range = document.createRange();
            range.setStart(document.getElementsByClassName("textRedactor__content").item(0), 0)
            range.collapse(false);
            this.htmlSelected = (this.data_of_components[this.$store.state.TitlesModule.countLayout - 1].instance.$el.nodeType == 3) ?
                this.data_of_components[this.$store.state.TitlesModule.countLayout - 1].instance.$el.innerHTML.data :
                this.data_of_components[this.$store.state.TitlesModule.countLayout - 1].instance.$el.outerHTML;
            range.pasteHTML(this.htmlSelected);
          }
        }
        resolve()
      })
    },

    /* CLEANERS */
    clearStateAfterSelect() {
      this.selectComponent[this.params_of_component.name] = false
      this.$store.state.TitlesModule.selectedComponent = {}
      this.dropzone_uploaded = []
      this.index_uploaded = 1
    },
    clearStateAfterDestroy() {
      this.$store.state.TitlesModule.listComponents = []
      this.$store.state.TitlesModule.selectedComponent = {}
      this.$store.state.TitlesModule.countLayout = 0
      this.$store.state.TitlesModule.count_of_images = 0
      this.$store.state.TitlesModule.count_of_questions = 0
      this.$store.state.TitlesModule.content_from_server = ''
      this.$store.state.TitlesModule.content = ''
      this.$store.state.TitlesModule.inserted_components = []
    },

    /* CONSTRUCTORS */
    Constructor_instance(params) {
      const {data, instance} = params

      this.data = data
      this.instance = instance
    },
    Imported_component(data) {
      const {index, component} = data

      this.index = index
      this.component = component
    },
    Element_question(data) {
      const {name, id, index_question} = data

      this.name = name
      this.id = id
      this.index_question = index_question
    },
    Element_image(data) {
      const {name, src, index_image} = data

      this.name = name
      this.src = src
      this.index_image = index_image
    },
  },
  beforeDestroy() {
    this.clearStateAfterDestroy()
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
      //justify-content: space-between;
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

.dialog_dropzone_wrapper {
  position: relative;
  &__upload {
    position: absolute;
    border: 1px dashed darkgrey;
    width: 70px;
    height: 70px;
    bottom: 22px;
    right: 26px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
}

.overlay {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.15);
}

#dropzone {
  padding: 0 !important;
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
