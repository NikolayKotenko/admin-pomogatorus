<template>
  <div class="textRedactor" :class="{disabled: !check_created_article}">
    <div class="textRedactor__header" id="header" style="position: sticky; top: 47px;">
      <div class="textRedactor__header__firstLine">
        <!-- Вставить элемент в текст -->
        <div class="header__elBlock right" style="display: flex; align-items: center; column-gap: 10px !important;">
          <!-- Auth -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  size="28"
                  @click="initialiseInserting('auth')"
                  :disabled="check_count_auth"
              >
                mdi-account-key
              </v-icon>
            </template>
            <span>Вставить авторизацию</span>
          </v-tooltip>
          <!-- Question -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  size="28"
                  @click="initializeSelection('questions')"
                  style="padding-top: 2px"
              >
                mdi-message-question
              </v-icon>
            </template>
            <span>Вставить вопрос</span>
          </v-tooltip>
          <!-- Image -->
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  size="28"
                  @click="initializeSelection('image')"
              >
                mdi-panorama
              </v-icon>
            </template>
            <span>Вставить изображение</span>
          </v-tooltip>
        </div>
        <!-- Undo/Redo -->
        <div class="header__elBlock right">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  @click="onAction('undo')"
                  size="28"
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
                  size="28"
              >
                mdi-redo
              </v-icon>
            </template>
            <span>Вернуть</span>
          </v-tooltip>
        </div>
        <!-- Жирный/курсив и т.д. -->
        <div class="header__elBlock right">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  @click="onAction('bold', icons_panel.bold)"
                  :color="icons_panel.bold.active ? 'blue darken-4' : ''"
                  size="28"
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
                  @click="onAction('italic', icons_panel.italic)"
                  :color="icons_panel.italic.active ? 'blue darken-4' : ''"
                  size="28"
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
                  @click="onAction('underline', icons_panel.underline)"
                  :color="icons_panel.underline.active ? 'blue darken-4' : ''"
                  size="28"
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
                  @click="onAction('strikethrough', icons_panel.strike)"
                  :color="icons_panel.strike.active ? 'blue darken-4' : ''"
                  size="28"
              >
                mdi-format-strikethrough
              </v-icon>
            </template>
            <span>Перечёркнутый</span>
          </v-tooltip>
        </div>
      </div>
      <div class="textRedactor__header__secondLine">
        <!-- Форматирование -->
        <div class="header__elBlock right">
          <v-tooltip bottom v-for="(item, index) in array_align_content" :key="index">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  @click="onAction(item.value, icons_panel[item.value])"
                  :color="icons_panel[item.value].active ? 'blue darken-4' : ''"
                  size="28"
              >
                {{ item.icon }}
              </v-icon>
            </template>
            <span>{{ item.text }}</span>
          </v-tooltip>
        </div>
        <!-- Отступы -->
        <div class="header__elBlock right">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  @click="onAction('indent')"
                  size="28"
              >
                mdi-format-indent-increase
              </v-icon>
            </template>
            <span>Убрать отступ</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  @click="onAction('outdent')"
                  size="28"
              >
                mdi-format-indent-decrease
              </v-icon>
            </template>
            <span>Сделать отступ</span>
          </v-tooltip>
        </div>
        <!-- Очистка форматирования -->
        <div class="header__elBlock">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                  v-bind="attrs"
                  v-on="on"
                  @click="onAction('removeFormat')"
                  size="28"
              >
                mdi-format-clear
              </v-icon>
            </template>
            <span>Очистить форматирование</span>
          </v-tooltip>
        </div>
      </div>
    </div>

    <div
        class="textRedactor__content"
        :contenteditable="check_created_article"
        spellcheck="false"
        ref="content" @input="onContentChange"
        @click="onSelectionContent()"
    >
    </div>

    <!-- MODALS -->
    <!-- FIXME: can unified all modals to one -->
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
              ref="myVueDropzone" id="dropzone" :options="options" :useCustomSlot=true v-if="!loading_dropzone" @vdropzone-success="successData" @vdropzone-sending="sendingData"
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
    <div class="overlay" v-if="!check_created_article"></div>
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
import LoginAuth from "../auth/LoginAuth";

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
      image: false,
      auth: false,
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
    dz_id: 0,

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
    icons_panel: {
      bold: {
        active: false,
        tag: "<b>",
        parentElem: 'b',
      },
      italic: {
        active: false,
        tag: "<i>",
        parentElem: 'i',
      },
      underline: {
        active: false,
        tag: "<u>",
        parentElem: 'u',
      },
      strike: {
        active: false,
        tag: "<s>",
        parentElem: 'strike',
      },
      justifyLeft: {
        active: false,
        tag: "text-align: left",
        parentElem: '',
      },
      justifyRight: {
        active: false,
        tag: "text-align: right",
        parentElem: '',
      },
      justifyCenter: {
        active: false,
        tag: "text-align: center",
        parentElem: '',
      },
      justifyFull: {
        active: false,
        tag: "text-align: justify",
        parentElem: '',
      },
    },

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
    'deletedContent': {
      handler(v) {
        if (v) {
          this.content = ''
          this.$store.state.TitlesModule.content = ''
          this.data_of_components = []
          this.params_of_component.name = ''
          this.clearStateAfterDestroy()
        }
      },
    },
    'params_of_component.name': {
      handler(v) {
        if (v && v === 'questions') {
          this.$store.dispatch('getListComponents', this.params_of_component.name)
        }
      }
    },
    '$store.state.TitlesModule.deletedComponent': {
      handler() {
        if (this.$store.state.TitlesModule.deletedComponent !== 0) {
          let index = this.data_of_components.findIndex((elem) => {
            return elem.instance.$data.index_component === this.$store.state.TitlesModule.deletedComponent
          })
          if (index !== -1) {
            this.data_of_components.splice(index, 1)

            const global_counter = {
              index_question: 1,
              index_image: 1,
              index_auth: 1,
              counter_index: 1,
            }

            this.data_of_components.forEach(elem => {
              elem.data.index = global_counter.counter_index
              const key_data = Object.keys(elem.data.component).includes('index_question') ? 'index_question' : Object.keys(elem.data.component).includes('index_image') ? 'index_image' : 'index_auth'
              elem.data.component[key_data] = global_counter[key_data]

              const key_instance = Object.keys( elem.instance.$data).includes('index_question') ? 'index_question' : Object.keys(elem.data.component).includes('index_image') ? 'index_image' : 'index_auth'
              elem.instance.$data[key_instance] = global_counter[key_instance]
              const block = document.getElementById(`component_wrapper-${elem.instance.$data.index_component}`)
              block.id =  `component_wrapper-${global_counter.counter_index}`
              elem.instance.$data.index_component = global_counter.counter_index

              global_counter[key_data]++
              global_counter.counter_index++
            })

            this.$store.state.TitlesModule.countLayout = global_counter.counter_index-1
            this.$store.state.TitlesModule.count_of_auth = global_counter.index_auth-1
            this.$store.state.TitlesModule.count_of_images = global_counter.index_image-1
            this.$store.state.TitlesModule.count_of_questions = global_counter.index_question-1
            this.$store.state.TitlesModule.deletedComponent = 0

            this.saveDB = true
            setTimeout(() => {
              this.saveDB = false
            })
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
    check_created_article() {
      return ((this.newArticle.name.value !== '') && (this.newArticle.short_header.value !== ''))
    },
    check_count_auth() {
      return this.$store.state.TitlesModule.count_of_auth >= 1
    },
    content: {
      cache: false,
      get: function () { return this.$refs.content.innerHTML ; },
      set: function (val) {
        this.$refs.content.innerHTML  = val;
      }
    },
    options() {
      return {
        url: `${this.$store.state.BASE_URL}/entity/files`,
        // url: 'https://httpbin.org/post',
        previewTemplate: this.previewHtml,
        destroyDropzone: false,
        headers: {
          "My-Awesome-Header": "header value",
          Authorization: '666777',
        },
        duplicateCheck: true,
      }
    },
    componentLayout() {
      return this.params_of_component.name === 'questions' ? Vue.extend(Question) : this.params_of_component.name === 'image' ? Vue.extend(ImageLayout) : Vue.extend(LoginAuth)
    }
  },
  methods: {
    /* MODALS */
    sendingData(file, xhr, formData) {
      console.log(file.upload.uuid)
      formData.append('uuid', file.upload.uuid)
      formData.append('id_article', this.$store.state.TitlesModule.newArticle.id)
    },
    successData(file, response) {
      console.log(response)
      const formatObj = {}

      for (let key in response.data) {
        Object.assign(formatObj, {[key]: response.data[key]})
      }
      Object.assign(formatObj, {index: this.index_uploaded})
      this.index_uploaded++
      this.dropzone_uploaded.push(formatObj)

      this.$nextTick(() => {
        const deletedElems = document.getElementsByClassName('dz_close')
        let count = 1;
        for (let item of deletedElems) {
          item.setAttribute('id', `close-${count}`);
          this.dz_id = count
          item.onclick = () => {
            this.removedFile(this.dz_id)
          }
          count++
        }
      })
    },
    removedFile(id) {
      const index = this.dropzone_uploaded.findIndex(elem => {
        return elem.index === id
      })
      if (index !== -1) {
        this.$store.dispatch('deleteFile', this.dropzone_uploaded[index].id).then(() => {
          this.dropzone_uploaded.splice(index, 1)
        })
      }
    },
    clearDropZoneTemplate() {
      for (let i = 1; i < this.dropzone_uploaded.length+1; i++) {
        this.$nextTick(() => {
          let template = document.getElementById(`close-${i}`)
          this.dz_id = i
          template.click()
        })
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
            } else if (elem.component.name === 'auth') {
              this.$store.state.AuthModule.inserting_component = true
              promises.push(this.$store.dispatch('getAuth', elem))
            }
          })

          Promise.all(promises).finally(() => {
            this.$store.state.TitlesModule.components_after_request.sort((a,b) => {
              return a.index - b.index
            })

            const arr = this.$store.state.TitlesModule.components_after_request
            this.$nextTick(() => {
              arr.forEach((elem) => {
                setTimeout(() => {
                    this.checkTypeComponent(elem)
                    let data = {}
                    if (elem.component.name === 'image') {
                      const full_url = document.getElementById(`component_wrapper-${elem.index}`).getElementsByClassName( 'inserted_image' )[0].src
                      let sub_url = full_url.split('.com')
                      const alt = document.getElementById(`component_wrapper-${elem.index}`).getElementsByClassName( 'inserted_image' )[0].alt
                      data = Object.assign({}, {name: alt}, {full_path: sub_url[1]})
                    } else data = elem.data

                    this.$store.state.TitlesModule.countLayout = elem.index
                    this.$store.state.TitlesModule.selectedComponent = data
                    let range = document.createRange();
                    range.selectNode(document.getElementById(`component_wrapper-${elem.index}`));
                    range.deleteContents()
                    range.collapse(false);
                    this.data_of_components.push(this.getStructureForInstance(elem.component))
                    this.data_of_components[this.$store.state.TitlesModule.countLayout - 1].instance.$mount() // pass nothing
                    range.insertNode(this.data_of_components[elem.index-1].instance.$el)
                    this.$store.state.TitlesModule.selectedComponent = {}
                    this.$store.state.AuthModule.inserting_component = false
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
      this.params_of_component.name = elem.component.name
      if (elem.component.name === 'questions') {
        this.$store.state.TitlesModule.count_of_questions = elem.component.index_question
      } else if (elem.component.name === 'image') {
        this.$store.state.TitlesModule.count_of_images = elem.component.index_image
      } else if (elem.component.name === 'auth') {
        this.$store.state.TitlesModule.count_of_auth = elem.component.index_auth
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
          this.$store.state.TitlesModule.deletedComponent = elem.instance.$data.index_component
        }
      })
    },
    select_align_content(value) {
      const index = this.array_align_content.findIndex(elem => {
        return elem.value === value
      })
      if (index !== -1) this.align_content = this.array_align_content[index]
    },
    onAction(action, icon) {
      document.execCommand(action, false, null);
      if (icon) {
        icon.active = true
      }
    },

    /* MANIPULATING WITH INSERTING COMPONENTS */
    // if we want add after modal window
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
    // if we want immediately insert component
    initialiseInserting(componentName) {
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
      this.params_of_component.name = componentName
      this.onSelectComponent()
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
          this.clearDropZoneTemplate()
          this.dropzone_uploaded = []
          this.index_uploaded = 1
        }
      } else if (this.params_of_component.name === 'auth') {
        this.$store.state.AuthModule.inserting_component = true
        this.$store.state.TitlesModule.count_of_auth++
        this.callCheckout()
      }
    },
    callCheckout(elem) {
      this.$store.state.TitlesModule.countLayout++

      let data_component;
      // FIXME: все проверки вынести в компутед
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
      } else if (this.params_of_component.name === 'auth') {
        data_component = new this.Element_auth({
          name: this.params_of_component.name,
          index_auth: this.$store.state.TitlesModule.count_of_auth
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
          if (this.range && (this.range.commonAncestorContainer.parentElement.className === 'textRedactor__content' ||(this.range.commonAncestorContainer?.offsetParent?._prevClass === "textRedactor"))) {
            this.range.insertNode(this.data_of_components[this.$store.state.TitlesModule.countLayout - 1].instance.$el);
          } else {
            let range = document.createRange();
            range.setStart(document.getElementsByClassName("textRedactor__content").item(0), 0)
            range.collapse(false);
            range.insertNode(this.data_of_components[this.$store.state.TitlesModule.countLayout - 1].instance.$el);
          }
        } else if (document.selection && document.selection.createRange) {
          if (this.range && (this.range.commonAncestorContainer.parentElement.className === 'textRedactor__content' || this.range.commonAncestorContainer.offsetParent._prevClass === "textRedactor")) {
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
    checkRangeByTag(tagName, icon) {
      return tagName === icon.parentElem
    },
    checkHTMLText(html, icon) {
      return html.includes(icon.tag)
    },
    checkForAligns(html, icon) {
      return html.includes(icon.tag)
    },
    onSelectionContent() {
      if (window.getSelection) {
        this.selection = null
        this.selection = window.getSelection();
        if (this.selection.getRangeAt && this.selection.rangeCount) {
          this.range = null
          this.range = this.selection.getRangeAt(0);
        }
      } else if (document.selection && document.selection.createRange) {
        this.range = null
        this.range = document.selection.createRange();
      }

      let html = "";
      if (typeof window.getSelection != "undefined") {
        let sel = window.getSelection();
        if (sel.rangeCount) {
          let container = document.createElement("div");
          for (let i = 0, len = sel.rangeCount; i < len; ++i) {
            container.appendChild(sel.getRangeAt(i).cloneContents());
          }
          html = container.innerHTML;
        }
      } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
          html = document.selection.createRange().htmlText;
        }
      }
      Object.keys(this.icons_panel).forEach(icon => {
        let parentElem = this.range.commonAncestorContainer.parentElement.className === 'textRedactor__content' ? '' : this.range.commonAncestorContainer.parentElement.outerHTML
        if (this.range.commonAncestorContainer.parentElement.localName === 'b') {
          parentElem = this.range.commonAncestorContainer.parentElement.parentElement.className === 'textRedactor__content' ? '' : this.range.commonAncestorContainer.parentElement.parentElement.outerHTML
        }
        this.icons_panel[icon].active = this.checkRangeByTag(this.range.commonAncestorContainer.parentElement.localName, this.icons_panel[icon]) || this.checkHTMLText(html, this.icons_panel[icon]) || this.checkForAligns(parentElem, this.icons_panel[icon])
      })
    },

    /* CLEANERS */
    clearStateAfterSelect() {
      this.selectComponent[this.params_of_component.name] = false
      this.$store.state.TitlesModule.selectedComponent = {}
      this.$store.state.AuthModule.inserting_component = false
    },
    clearStateAfterDestroy() {
      this.$store.state.TitlesModule.listComponents = []
      this.$store.state.TitlesModule.selectedComponent = {}
      this.$store.state.TitlesModule.countLayout = 0
      this.$store.state.TitlesModule.count_of_images = 0
      this.$store.state.TitlesModule.count_of_questions = 0
      this.$store.state.TitlesModule.count_of_auth = 0
      this.$store.state.TitlesModule.content_from_server = ''
      this.$store.state.TitlesModule.content = ''
      this.$store.state.TitlesModule.inserted_components = []
      this.$store.state.TitlesModule.components_after_request = []
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
    Element_auth(data) {
      const {name, index_auth} = data

      this.name = name
      this.index_auth = index_auth
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
@media only screen and (max-width : 375px) and (orientation: portrait) {
  //.header__elBlock {
  //  padding: 2px 4px !important;
  //  display: flex;
  //  column-gap: 0 !important;
  //}
  //.textRedactor__header__firstLine {
  //  justify-content: space-between !important;
  //}
}

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
      padding: 2px 8px;
      display: flex;
      column-gap: 5px;

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
    white-space: pre-wrap;
    overflow:hidden;
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
