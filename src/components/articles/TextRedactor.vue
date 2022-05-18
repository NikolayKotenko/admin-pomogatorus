<template>
  <div class="textRedactor" :class="{disabled: !check_created_article}">
    <div class="textRedactor__header" id="header" style="">
<!--      <div class="textRedactor__header__firstLine">-->
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
        <div class="header__elBlock">
          <v-tooltip bottom v-for="(item, index) in array_edit_content" :key="index">
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
<!--      </div>-->
<!--      <div class="textRedactor__header__secondLine">-->
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
<!--      </div>-->
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
              :loading="$store.state.ArticleModule.loadingModalList"
              :disabled="$store.state.ArticleModule.loadingModalList"
              :items="$store.state.ArticleModule.listComponents"
              item-text="name"
              return-object
              v-model="$store.state.ArticleModule.selectedComponent"
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

import titlesStore from '@/store/modules/article/index.js'
const _store = titlesStore.state

import iconsModels from "../../models/iconsModels";

import Data_component from "../../services/article/data_component";
const factory = new Data_component()

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
    array_align_content: iconsModels.array_align_content,
    array_edit_content: iconsModels.array_edit_content,
    icons_panel: iconsModels.icons_panel,

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
      this.initializeContent()
    }, 500)
  },
  watch: {
    'saveDB': {
      handler(v) {
        if (!this.geting_from_server && v) {
          this.$store.commit('changeInsertedComponents', [])
          const arr = []
          this.data_of_components.forEach(elem => {
            arr.push(elem.data)
          })
          this.$store.commit('changeInsertedComponents', arr)
          this.$store.commit('changeContent', this.content)
        }
      },
    },
    'deletedContent': {
      handler(v) {
        if (v) {
          this.content = ''
          this.data_of_components = []
          this.params_of_component.name = ''
          this.$store.commit('clean_store')
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
    '$store.state.ArticleModule.deletedComponent': {
      handler() {
        this.deletingComponent()
      },
    },
    '$store.state.ArticleModule.content_from_server': {
      handler() {
        this.content = _store.content_from_server
        this.$store.commit('changeContent', this.content)
      }
    },
  },
  computed: {
    check_created_article() {
      return ((this.newArticle.name.value !== '') && (this.newArticle.short_header.value !== ''))
    },
    check_count_auth() {
      return _store.count_of_auth >= 1
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
      formData.append('id_article', _store.newArticle.id)
    },
    successData(file, response) {
      console.log(response)
      const formatObj = Object.assign({}, response.data)
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
        if (_store.inserted_components && _store.inserted_components.length) {
          console.log('YA RABOTAU')
          _store.loadingArticle = true
          this.geting_from_server = true

          this.content = _store.content_from_server

          const promises = []

          _store.inserted_components.forEach(elem => {
            promises.push(this.$store.dispatch(`get_${elem.component.name}`, elem))
          })

          Promise.all(promises).finally(() => {
            _store.components_after_request.sort((a,b) => {
              return a.index - b.index
            })

            // const arr =
            this.$nextTick(() => {
              _store.components_after_request.forEach((elem) => {
                setTimeout(() => {
                    this.checkTypeComponent(elem)
                    let data = elem.data
                    if (elem.component.name === 'image') {
                      const full_url = document.getElementById(`component_wrapper-${elem.index}`).getElementsByClassName( 'inserted_image' )[0].src
                      let sub_url = full_url.split('.com')
                      const alt = document.getElementById(`component_wrapper-${elem.index}`).getElementsByClassName( 'inserted_image' )[0].alt
                      data = Object.assign({}, {name: alt}, {full_path: sub_url[1]})
                    }
                    _store.countLayout = elem.index
                    _store.selectedComponent = data
                    let range = document.createRange();
                    range.selectNode(document.getElementById(`component_wrapper-${elem.index}`));
                    range.deleteContents()
                    range.collapse(false);
                    this.data_of_components.push(this.getStructureForInstance(elem.component))
                    this.data_of_components[_store.countLayout - 1].instance.$mount() // pass nothing
                    range.insertNode(this.data_of_components[elem.index-1].instance.$el)
                    _store.selectedComponent = {}
                  })
              })
            })
            _store.loadingArticle = false
            this.geting_from_server = false
            resolve()
          })
        }
      })
    },
    checkTypeComponent(elem) {
      this.params_of_component.name = elem.component.name
      if (elem.component.name === 'questions') {
        _store.count_of_questions = elem.component.index_question
      } else if (elem.component.name === 'image') {
        _store.count_of_images = elem.component.index_image
      } else if (elem.component.name === 'auth') {
        _store.count_of_auth = elem.component.index_auth
      }
    },

    onContentChange() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        _store.content = this.content
      })
      /* IF WE DELETED COMPONENT BY KEYBOARD */
      this.data_of_components.forEach(elem => {
        const elem_content = document.getElementById(`component_wrapper-${elem.instance.$data.index_component}`)
        if (!elem_content) {
          _store.deletedComponent = elem.instance.$data.index_component
        }
      })
    },
    onAction(action, icon) {
      document.execCommand(action, false, null);
      if (icon) {
        icon.active = true
      }
    },

    /* MANIPULATING WITH INSERTING COMPONENTS */
    getRange() {
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
    },
    // if we want add after modal window
    initializeSelection(componentName) {
      this.getRange()
      this.selectComponent[componentName] = true
      this.params_of_component.name = componentName

    },
    // if we want immediately insert component
    initialiseInserting(componentName) {
      this.getRange()
      this.params_of_component.name = componentName
      this.onSelectComponent()
    },
    onSelectComponent() {
      if (this.params_of_component.name === 'questions') {
        _store.count_of_questions++
        this.callCheckout()
      } else if (this.params_of_component.name === 'image') {
        _store.count_of_images++
        if (this.dropzone_uploaded.length) {
          this.dropzone_uploaded.forEach(elem => {
            _store.selectedComponent = elem
            this.callCheckout(elem)
          })
          this.clearDropZoneTemplate()
          this.dropzone_uploaded = []
          this.index_uploaded = 1
        }
      } else if (this.params_of_component.name === 'auth') {
        this.$store.state.AuthModule.inserting_component = true
        _store.count_of_auth++
        this.callCheckout()
      }
    },
    callCheckout(elem) {
      _store.countLayout++

      let data_component;

      data_component = factory.create(this.params_of_component.name, {
        name: this.params_of_component.name,
        id: _store.selectedComponent.id,
        index_question: _store.count_of_questions,
        index_image: _store.count_of_images,
        index_auth: _store.count_of_auth,
        src: elem?.dataURL ? elem?.dataURL : '',
      })

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
      const data = new this.Imported_component({index: _store.countLayout, component: data_component})
      const params = Object.assign({}, {instance: instance}, {data: data})
      return new this.Constructor_instance(params)
    },
    insertingComponent(data_component) {
      return new Promise((resolve) => {
        const elem = this.getStructureForInstance(data_component)
        this.data_of_components.push(elem)
        this.data_of_components[_store.countLayout - 1].instance.$mount() // pass nothing

        if (window.getSelection) {
          if (this.range && (this.range.commonAncestorContainer.parentElement.className === 'textRedactor__content' ||(this.range.commonAncestorContainer?.offsetParent?._prevClass === "textRedactor"))) {
            this.range.insertNode(this.data_of_components[_store.countLayout - 1].instance.$el);
          } else {
            let range = document.createRange();
            range.setStart(document.getElementsByClassName("textRedactor__content").item(0), 0)
            range.collapse(false);
            range.insertNode(this.data_of_components[_store.countLayout - 1].instance.$el);
          }
        } else if (document.selection && document.selection.createRange) {
          if (this.range && (this.range.commonAncestorContainer.parentElement.className === 'textRedactor__content' || this.range.commonAncestorContainer.offsetParent._prevClass === "textRedactor")) {
            this.htmlSelected = (this.data_of_components[_store.countLayout - 1].instance.$el.nodeType == 3) ?
                this.data_of_components[_store.countLayout - 1].instance.$el.innerHTML.data :
                this.data_of_components[_store.countLayout - 1].instance.$el.outerHTML;
            this.range.pasteHTML(this.htmlSelected);
          } else {
            let range = document.createRange();
            range.setStart(document.getElementsByClassName("textRedactor__content").item(0), 0)
            range.collapse(false);
            this.htmlSelected = (this.data_of_components[_store.countLayout - 1].instance.$el.nodeType == 3) ?
                this.data_of_components[_store.countLayout - 1].instance.$el.innerHTML.data :
                this.data_of_components[_store.countLayout - 1].instance.$el.outerHTML;
            range.pasteHTML(this.htmlSelected);
          }
        }
        resolve()
      })
    },
    deletingComponent() {
      if (_store.deletedComponent !== 0) {
        let index = this.data_of_components.findIndex((elem) => {
          return elem.instance.$data.index_component === _store.deletedComponent
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

          _store.countLayout = global_counter.counter_index-1
          _store.count_of_auth = global_counter.index_auth-1
          _store.count_of_images = global_counter.index_image-1
          _store.count_of_questions = global_counter.index_question-1
          _store.deletedComponent = 0

          this.saveDB = true
          setTimeout(() => {
            this.saveDB = false
          })
        }
      }
    },

    /* BLOCK FOR CHECK ICONS FORMAT TEXT */
    checkHTMLText(html, icon) {
      return html.includes(icon.tag)
    },
    checkByTag(html, icon) {
      return html.includes(icon.tag)
    },
    checkForStyles(html, icon) {
      if (icon.tag === '<u' || icon.tag === '<strike') {
        return html.includes('text-decoration-line') && html.includes(icon.styleName)
      } else return html.includes(icon.styleName)
    },
    onSelectionContent() {
      // if we select by one tap
      this.getRange()

      // if we ranged select
      let html = "";
      if (typeof window.getSelection != "undefined") {
        let sel = window.getSelection();
        if (sel.rangeCount) {
          let container = document.createElement("div");
          for (let i = 0, len = sel.rangeCount; i < len; ++i) {
            container.appendChild(sel.getRangeAt(i).cloneContents());
          }
          html = container.innerHTML.replace(/<br>/g,'');
        }
      } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
          html = document.selection.createRange().htmlText.replace(/<br>/g,'');
        }
      }
      // html for range select return outerHtml
      // range for single selection return tag/outerHTML

      Object.keys(this.icons_panel).forEach(icon => {
        let elem = this.range.commonAncestorContainer.parentElement
        // Global object
        let parentElem
        // outerHTML
        let parentHTML = ''
        // outerHMTL for aligns
        let styleAlign = ''

        if (elem.localName !== 'div') {
          parentElem = this.recursiveGetIconValue(elem)
          parentHTML = parentElem.outerHTML
        }
        if (elem.className !== 'textRedactor__content' && elem.className !== 'textRedactor') {
          let grandParent = parentHTML ? parentElem.parentElement.outerHTML : elem.outerHTML
          styleAlign = this.getStyleAlign(grandParent, this.icons_panel[icon])
        }
        this.icons_panel[icon].active = this.checkForStyles(parentHTML, this.icons_panel[icon]) ||
            this.checkByTag(parentHTML, this.icons_panel[icon]) ||
            this.checkForStyles(styleAlign, this.icons_panel[icon]) ||
            this.checkHTMLText(html, this.icons_panel[icon]) ||
            this.checkForStyles(html, this.icons_panel[icon])
      })
    },
    /* Get style name for aligners values */
    getStyleAlign(outerHTML, icon) {
      if (icon.tag !== '<b' && icon.tag !== '<i' && icon.tag !== '<u' && icon.tag !== '<strike') {
        return outerHTML.includes(icon.styleName) ? icon.styleName : ''
      } else return ''
    },
    /* Recursive Function for get parent elem, if we get nesting elems */
    recursiveGetIconValue(elem) {
      if (elem.parentElement.localName !== 'div') {
        return this.recursiveGetIconValue(elem.parentElement)
      } else {
        return elem
      }
    },

    /* CLEANERS */
    clearStateAfterSelect() {
      this.selectComponent[this.params_of_component.name] = false
      _store.selectedComponent = {}
      this.$store.state.AuthModule.inserting_component = false
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
    this.$store.commit('clean_store')
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/textEditor";
</style>
