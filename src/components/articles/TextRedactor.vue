<template>
  <div class="textRedactor" :class="{disabled: !check_created_article}">
    <HeaderBlock
        @callCheckout="callCheckout"
    />

    <div
        class="textRedactor__content"
        :contenteditable="check_created_article"
        spellcheck="false"
        ref="content" @input="onContentChange"
        @click="onSelectionContent()"
    >
    </div>

    <!-- OVERLAYS -->
    <div class="overlay" v-if="!check_created_article"></div>
  </div>
</template>

<script>
import Vue from "vue";
import store from '@/store/index.js'
import vuetify from '@/plugins/vuetify'

import HeaderBlock from "./HeaderBlock";
import Question from "../frontLayouts/Question";
import ImageLayout from "../frontLayouts/ImageLayout";
import LoginAuth from "../auth/LoginAuth";

import titlesStore from '@/store/modules/article/index.js'
const _store = titlesStore.state

import Data_component from "../../services/article/data_component";
const factory = new Data_component()

import iconsModels from "../../models/iconsModels";

export default {
  name: "TextRedactor",
  props: ['newArticle', 'deletedContent'],
  components: {
    HeaderBlock,
  },
  data: () => ({
    /* MODALS */
    params_of_component: {
      name: '',
    },
    range: null,
    htmlSelected: null,
    selection: null,

    /* INSERT COMPONENTS */
    saveDB: false,
    debounceTimeout: null,
    geting_from_server: false,
    data_of_components: [],
  }),
  mounted() {
    setTimeout(() => {
      this.initializeContent()
    }, 500)
  },
  watch: {
    'saveDB': {
      handler(v) {
        if (!this.geting_from_server && v) {
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
    content: {
      cache: false,
      get: function () { return this.$refs.content.innerHTML ; },
      set: function (val) {
        this.$refs.content.innerHTML  = val;
      }
    },
    componentLayout() {
      return _store.name_component === 'questions' ? Vue.extend(Question) : _store.name_component === 'image' ? Vue.extend(ImageLayout) : Vue.extend(LoginAuth)
    }
  },
  methods: {
    /* INITIALIZE DATA FROM BACK OR INDEXEDDB */
    initializeContent() {
      return new Promise((resolve) => {
        console.log('initialize')
        if (_store.components_after_request.length) {
          console.log('YA RABOTAU')
          _store.loadingArticle = true
          this.geting_from_server = true

          this.content = _store.content_from_server

          const promises = []

          _store.components_after_request.forEach(elem => {
            promises.push(this.$store.dispatch(`get_${elem.component.name}`, elem))
          })

          Promise.all(promises).finally(() => {
            _store.list_components.sort((a,b) => {
              return a.index - b.index
            })

            this.$nextTick(() => {
              _store.list_components.forEach((elem, index) => {
                setTimeout(() => {
                    this.checkTypeComponent(elem)
                    let data = elem.data
                    if (elem.component.name === 'image') {
                      const full_url = document.getElementById(`component_wrapper-${elem.index}`).getElementsByClassName( 'inserted_image' )[0].src
                      let sub_url = full_url.split('.com')
                      const alt = document.getElementById(`component_wrapper-${elem.index}`).getElementsByClassName( 'inserted_image' )[0].alt
                      data = Object.assign({}, {name: alt}, {full_path: sub_url[1]})
                    }
                    this.$store.commit('change_counter', {name: 'layout', count: elem.index})
                    this.$store.commit('changeSelectedObject', data)
                    let range = document.createRange();
                    range.selectNode(document.getElementById(`component_wrapper-${elem.index}`));
                    range.deleteContents()
                    range.collapse(false);
                    _store.list_components[index] = this.getStructureForInstance(elem.component)
                    _store.list_components[index].instance.$mount()
                    range.insertNode(_store.list_components[index].instance.$el)
                  this.$store.commit('changeSelectedObject', {})
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
      this.$store.commit('change_name_component', elem.component.name)
      const name = Object.prototype.hasOwnProperty.call(elem.component, 'index_question') ? 'question' : elem.component.name
      this.$store.commit('change_counter', {name: elem.component.name, count: elem.component[`index_${name}`]})
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

    /* MANIPULATING WITH INSERTING COMPONENTS */
    callCheckout(elem) {
      // if (Array.isArray(data)) {
      //   for (const elem of data) {
          let data_component = factory.create(_store.name_component, {
            name: _store.name_component,
            id: _store.selectedComponent?.id,
            index_questions: _store.counters.questions,
            index_image: _store.counters.image,
            index_auth: _store.counters.auth,
            src: elem?.dataURL ? elem?.dataURL : '',
          })

          this.insertingComponent(data_component).then(() => {
            this.saveDB = true
            this.clearStateAfterSelect()
            setTimeout(() => {
              this.saveDB = false
            })
          })
      //   }
      // }
    },
    getStructureForInstance(data_component) {
      const instance = new this.componentLayout({
        store,
        vuetify,
      })
      const data = new this.Imported_component({index: _store.counters.layout, component: data_component})
      const params = Object.assign({}, {instance: instance}, {data: data})
      return new this.Constructor_instance(params)
    },
    insertingComponent(data_component) {
      return new Promise((resolve) => {
        console.log(data_component)
        const elem = this.getStructureForInstance(data_component)
        this.$store.commit('add_to_list_components', elem)
        const calledElem = _store.list_components[_store.counters.layout - 1]
        calledElem.instance.$mount()

        if (_store.range && (_store.range.commonAncestorContainer.parentElement.className === 'textRedactor__content' || _store.range.commonAncestorContainer?.offsetParent?._prevClass === "textRedactor")) {
          if (window.getSelection) {
            _store.range.insertNode(calledElem.instance.$el);
          } else if (document.selection && document.selection.createRange) {
            if (_store.range && (_store.range.commonAncestorContainer.parentElement.className === 'textRedactor__content' || _store.range.commonAncestorContainer.offsetParent._prevClass === "textRedactor")) {
              this.htmlSelected = (calledElem.instance.$el.nodeType == 3) ?
                  calledElem.instance.$el.innerHTML.data :
                  calledElem.instance.$el.outerHTML;
              _store.range.pasteHTML(this.htmlSelected);
            }
          }
        } else {
          if (window.getSelection) {
            let range = document.createRange();
            range.setStart(document.getElementsByClassName("textRedactor__content").item(0), 0)
            range.collapse(false);
            range.insertNode(calledElem.instance.$el);
          } else if (document.selection && document.selection.createRange) {
            let range = document.createRange();
            range.setStart(document.getElementsByClassName("textRedactor__content").item(0), 0)
            range.collapse(false);
            this.htmlSelected = (calledElem.instance.$el.nodeType == 3) ?
                calledElem.instance.$el.innerHTML.data :
                calledElem.instance.$el.outerHTML;
            range.pasteHTML(this.htmlSelected);
          }
        }
        resolve()
      })
    },
    deletingComponent() {
      if (_store.deletedComponent !== 0) {
        let index = _store.list_components.findIndex((elem) => {
          return elem.instance.$data.index_component === _store.deletedComponent
        })
        if (index !== -1) {
          _store.list_components.splice(index, 1)

          const global_counter = {
            index_questions: 1,
            index_image: 1,
            index_auth: 1,
            counter_index: 1,
          }

          _store.list_components.forEach(elem => {
            elem.data.index = global_counter.counter_index
            const key_data = `index_${elem.data.component.name}`
            elem.data.component[key_data] = global_counter[key_data]
            elem.instance.$data[key_data] = global_counter[key_data]
            const block = document.getElementById(`component_wrapper-${elem.instance.$data.index_component}`)
            block.id =  `component_wrapper-${global_counter.counter_index}`
            elem.instance.$data.index_component = global_counter.counter_index

            this.$store.commit('change_counter', {name: elem.data.component.name, count: global_counter[key_data]})
            global_counter[key_data]++
            global_counter.counter_index++
          })

          this.$store.commit('change_counter', {name: 'layout', count: global_counter.counter_index-1})
          this.$store.commit('delete_component_by_id', 0)

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
      this.$store.commit('get_range')
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

      Object.keys(iconsModels).forEach(icon => {
        if (!_store.range?.commonAncestorContainer?.parentElement) return

        let elem = _store.range.commonAncestorContainer.parentElement
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
          styleAlign = this.getStyleAlign(grandParent, iconsModels[icon])
        }
        iconsModels[icon].active = this.checkForStyles(parentHTML, iconsModels[icon]) ||
            this.checkByTag(parentHTML, iconsModels[icon]) ||
            this.checkForStyles(styleAlign, iconsModels[icon]) ||
            this.checkHTMLText(html, iconsModels[icon]) ||
            this.checkForStyles(html, iconsModels[icon])
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
      this.$store.commit('change_select_component', {name: _store.name_component, value: false})
      this.$store.commit('changeSelectedObject', {})
      this.$store.commit('changeInsertingComponents', true)
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
  },
  beforeDestroy() {
    this.$store.commit('clean_store')
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/textEditor";
</style>
