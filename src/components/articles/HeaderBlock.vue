<template>
  <div style="position: sticky;
    top: 47px;
    z-index: 1;">
    <div class="textRedactor__header" id="header" style="">
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
    <!-- MODALS -->
    <v-dialog
        v-model="$store.state.ArticleModule.selectComponent.questions"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important; text-align: center; width: 100%">Какой вопрос?</span>
        </v-card-title>
        <v-card-text id="questionSelector">
          <v-chip-group
              multiple
              show-arrows
              v-model="filters.tag"
          >
            <v-chip
                color="#f2f5f7"
                v-for="tag in $store.state.ArticleModule.listGeneralTags"
                :key="tag.id"
                :value="tag.code"
                small
            >
              <v-icon left color="grey darken-2" v-if="filters.tag.includes(tag.code)">
                mdi-check-bold
              </v-icon>
              <v-icon left color="grey darken-2" v-else>
                mdi-close-thick
              </v-icon>
              {{ tag.name }}
            </v-chip>
          </v-chip-group>
            <v-autocomplete
                style="position: sticky; top: 0;"
                :loading="$store.state.ArticleModule.loadingModalList"
                :disabled="$store.state.ArticleModule.loadingModalList"
                :items="listQuestions"
                item-text="name"
                :menu-props="{bottom: true, offsetY: true}"
                return-object
                clearable
                v-model="$store.state.ArticleModule.selectedComponent"
                @click:clear="$nextTick(() => {$store.state.ArticleModule.selectedComponent = {}})"
                placeholder="Наименование"
                ref="selector"
            >
            </v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-btn
              color="blue darken-1"
              text
              @click="closeModal('questions')"
          >
            Назад
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              color="green darken-1"
              :disabled="!check_selected_component"
              text
              @click="onSelectComponent()"
          >
            Выбрать
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
        v-model="$store.state.ArticleModule.selectComponent.image"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important;">Загрузите изображение</span>
        </v-card-title>
        <v-card-text class="dialog_dropzone">
          <div class="dialog_dropzone_wrapper">
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
          </div>
          <template v-if="dropzone_uploaded.length">
            <div class="dialog_dropzone_inputs" v-for="(item, index) in dropzone_uploaded" :key="index">
              <span class="dialog_dropzone_inputs__label"> [{{index+1}}] {{ item.filename }}</span>
              <v-text-field
                  dense
                  hide-details
                  placeholder="alt-наименование изображения"
                  v-model="item.alt"
              ></v-text-field>
              <v-text-field
                  dense
                  hide-details
                  placeholder="подпись изображения"
                  v-model="item.title"
              ></v-text-field>
            </div>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-btn
              color="blue darken-1"
              text
              @click="closeModal('image')"
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
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import PreviewTemplate from "../dropzone/PreviewTemplate";

import iconsModels from "../../models/iconsModels";
import Vue from "vue";

import titlesStore from '@/store/modules/article/index.js'

const _store = titlesStore.state

export default {
  name: "HeaderBlock",
  components: {
    vueDropzone: vue2Dropzone,
  },
  data: () => ({
    /* DROPZONE */
    index_uploaded: 1,
    dropzone_uploaded: [],
    loading_dropzone: true,
    previewHtml: null,

    /* EDITOR */
    array_align_content: iconsModels.array_align_content,
    array_edit_content: iconsModels.array_edit_content,
    icons_panel: iconsModels.icons_panel,

    /* MODAL */
    filters: {
      tag: [],
    },
    debounceTimeout: null,
    arrIds: [],
  }),
  created() {
    const ComponentClass = Vue.extend(PreviewTemplate);
    const instance = new ComponentClass();
    instance.$mount();
    this.previewHtml = instance.$el.outerHTML;
    this.loading_dropzone = false;
  },
  mounted() {
  },
  watch: {
    '$store.state.ArticleModule.selectComponent.questions': {
      handler(v) {
        if (v) {
          this.$nextTick(() => {
            window.addEventListener('scroll', this.disableInput, true)
          })
          this.$store.dispatch('getListQuestions', _store.name_component).then(() => {
            this.getArrID()
          })
          this.$store.dispatch('getGeneralTagsArticle')
        }
      }
    },
    'filters': {
      handler() {
        this.getFilteredQuestions()
      },
      deep: true
    },
  },
  computed: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    check_count_auth() {
      return _store.counters.auth >= 1
    },
    check_selected_component() {
      return !!Object.keys(_store.selectedComponent).length
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
    listQuestions() {
      if (!_store.list_questions.length) return []
      return _store.list_questions.filter(question => {
        return !this.arrIds.includes(question.id)
      })
    },
  },
  methods: {
    getArrID() {
      this.$nextTick(() => {
        console.log(_store.list_components)
        this.arrIds = _store.list_components.filter(component => {
          return component?.data?.component?.name === 'questions' || component?.data?.component?.name === 'question'
        }).map(elem => elem?.data?.component?.id)
      })
    },
    disableInput() {
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.selector.$refs.input.blur()
        })
      })
    },
    /* DROPZONE */
    sendingData(file, xhr, formData) {
      console.log(file.upload.uuid)
      formData.append('uuid', file.upload.uuid)
      formData.append('id_article', _store.newArticle.id)
    },
    successData(file, response) {
      console.log(response)
      const formatObj = Object.assign({}, response.data)
      Object.assign(formatObj, {index: this.index_uploaded, alt: '', title: ''})
      this.index_uploaded++
      this.dropzone_uploaded.push(formatObj)

      this.$nextTick(() => {
        const deletedElems = document.getElementsByClassName('dz_close')
        let count = 1;
        for (let item of deletedElems) {
          item.setAttribute('id', `close-${count}`);
          let index = count
          item.onclick = () => {
            this.removedFile(index)
          }
          count++
        }
      })
    },
    removedFile(id) {
      console.log(id)
      const index = this.dropzone_uploaded.findIndex(elem => {
        return elem.index === id
      })
      if (index !== -1) {
        this.$store.dispatch('deleteFile', this.dropzone_uploaded[index].id).then(() => {
          this.dropzone_uploaded.splice(index, 1)
          for (let i = 0; i < this.dropzone_uploaded.length; i++) {
            console.log(this.dropzone_uploaded[i].index)
            console.log(document.getElementById(`close-${this.dropzone_uploaded[i].index}`))
            const block = document.getElementById(`close-${this.dropzone_uploaded[i].index}`)
            block.id = `close-${i+1}`
            block.onclick = () => {
              this.removedFile(i+1)
            }
            this.dropzone_uploaded[i].index = i+1
          }
          this.index_uploaded = this.dropzone_uploaded.length+1
        })
      }
    },
    clearDropZoneTemplate() {
      for (let i = 1; i < this.dropzone_uploaded.length+1; i++) {
        this.$nextTick(() => {
          let template = document.getElementById(`close-${i}`)
          console.log(template)
          template.click()
        })
      }
    },
    triggerUpload() {
      document.getElementById('dropzone').click()
    },

    /* ICONS */
    onAction(action, icon) {
      document.execCommand(action, false, null);
      if (icon) {
        icon.active = true
      }
    },
    /* MODALS */
    getFilteredQuestions() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.$store.commit('change_loading_modal_list', true)
        this.$store.dispatch('setFilteredListQuestionsModal', this.filters).then(() => {
          this.$store.commit('change_loading_modal_list', false)
        })
      }, 500);
    },
    closeModal(name) {
      this.$store.commit('change_select_component', {name: name, value: false})
    },
    // if we want immediately insert component
    initialiseInserting(componentName) {
      this.$store.commit('get_range', true)
      this.$store.commit('change_name_component', componentName)
      this.$store.commit('changeInsertingComponents', true)
      this.$store.commit('change_select_component', {name: componentName, value: true})
      this.onSelectComponent()
    },
    // if we want add after modal window
    initializeSelection(componentName) {
      this.$store.commit('get_range', true)
      this.$store.commit('change_name_component', componentName)
      this.$store.commit('change_select_component', {name: componentName, value: true})
    },
    onSelectComponent() {
      let elem = {}
      if (_store.name_component === 'image') {
        if (this.dropzone_uploaded.length) {
          this.dropzone_uploaded.forEach(elem => {
            this.$store.commit('change_counter', {name: 'layout', count: _store.counters.layout+1})
            this.$store.commit('change_counter', {name: _store.name_component, count: _store.counters[_store.name_component]+1})
            this.$store.commit('changeSelectedObject', elem)
            this.$emit('callCheckout', elem)
          })
          this.clearDropZoneTemplate()
          this.dropzone_uploaded = []
          this.index_uploaded = 1
        }
      } else {
        this.$store.commit('change_counter', {name: 'layout', count: _store.counters.layout+1})
        this.$store.commit('change_counter', {name: _store.name_component, count: _store.counters[_store.name_component]+1})
        this.$emit('callCheckout', elem)
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.disableInput, true)
  },
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/textEditor";

::v-deep .v-text-field {
   //padding-top: 0 !important;
   //margin-top: 0 !important;
}

::v-deep .v-slide-group__next, ::v-deep .v-slide-group__prev {
  min-width: 15px !important;
  flex: 0 1 15px !important;
}

::v-deep .v-menu__content.theme--light.menuable__content__active.v-autocomplete__content {
  max-width: 280px !important;
}
</style>
