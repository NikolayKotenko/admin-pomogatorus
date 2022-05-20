<template>
  <div>
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
    dz_id: 0,

    /* EDITOR */
    array_align_content: iconsModels.array_align_content,
    array_edit_content: iconsModels.array_edit_content,
    icons_panel: iconsModels.icons_panel,
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
          this.$store.dispatch('getListComponents', _store.name_component)
        }
      }
    },
  },
  computed: {
    check_count_auth() {
      return _store.count_of_auth >= 1
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
  },
  methods: {
    /* DROPZONE */
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

    /* ICONS */
    onAction(action, icon) {
      document.execCommand(action, false, null);
      if (icon) {
        icon.active = true
      }
    },
    closeModal(name) {
      this.$store.commit('change_select_component', {name: name, value: false})
    },
    // if we want immediately insert component
    initialiseInserting() {
      //   this.getRange()
      //   this.params_of_component.name = componentName
      //   this.$store.commit('changeInsertingComponents', true)
      //   this.onSelectComponent()
    },
    // if we want add after modal window
    initializeSelection(componentName) {
      this.$store.commit('get_range')
      this.$store.commit('change_name_component', componentName)
      this.$store.commit('change_select_component', {name: componentName, value: true})
    },
    onSelectComponent() {
      this.$store.commit('change_counter', {name: 'layout', count: _store.count_of_layout+1})
      this.$store.commit('change_counter', {name: _store.name_component, count: _store.count_of_questions+1})
      let elem = {}
      if (_store.name_component === 'image') {
        if (this.dropzone_uploaded.length) {
          this.dropzone_uploaded.forEach(img => {
            this.$store.commit('changeSelectedObject', img)
            this.$emit('callCheckout', img)
          })
          this.clearDropZoneTemplate()
          this.dropzone_uploaded = []
          this.index_uploaded = 1
        }
      }
      this.$emit('callCheckout', elem)
    }
  },
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/textEditor";
</style>
