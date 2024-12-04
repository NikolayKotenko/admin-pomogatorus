<template>
  <div style="position: sticky; top: 47px; z-index: 1">
    <div id="header" class="textRedactor__header" style="">
      <!-- Вставить элемент в текст -->
      <div
          class="header__elBlock right"
          style="display: flex; align-items: center; column-gap: 10px !important"
      >
        <!-- Auth -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                :disabled="check_count_auth"
                size="28"
                v-bind="attrs"
                @click="initialiseInserting('auth')"
                v-on="on"
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
                size="28"
                style="padding-top: 2px"
                v-bind="attrs"
                @click="initializeSelection('questions')"
                v-on="on"
            >
              mdi-message-question
            </v-icon>
          </template>
          <span>Вставить вопрос</span>
        </v-tooltip>
        <!-- Nomenclature -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                size="28"
                style="padding-top: 2px"
                v-bind="attrs"
                @click="initializeSelection('nomenclature')"
                v-on="on"
            >
              mdi-hammer-wrench
            </v-icon>
          </template>
          <span>Вставить номенклатуру</span>
        </v-tooltip>
        <!-- Image -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                size="28"
                v-bind="attrs"
                @click="initializeSelection('image')"
                v-on="on"
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
                :disabled="
                $store.state.ArticleModule.txtDisplay.length <= 1 ||
                $store.state.ArticleModule.startRender
              "
                size="28"
                v-bind="attrs"
                @click="onUndo()"
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
                :disabled="
                $store.state.ArticleModule.txtDisplay.length ===
                  $store.state.ArticleModule.txtSave.length ||
                $store.state.ArticleModule.startRender
              "
                size="28"
                v-bind="attrs"
                @click="onRedo()"
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
        <v-tooltip
            v-for="(item, index) in array_edit_content"
            :key="index"
            bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                :color="icons_panel[item.value].active ? 'blue darken-4' : ''"
                size="28"
                v-bind="attrs"
                @click="onAction(item.value, icons_panel[item.value])"
                v-on="on"
            >
              {{ item.icon }}
            </v-icon>
          </template>
          <span>{{ item.text }}</span>
        </v-tooltip>
      </div>
      <!-- Форматирование -->
      <div class="header__elBlock right">
        <v-tooltip
            v-for="(item, index) in array_align_content"
            :key="index"
            bottom
        >
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                :color="icons_panel[item.value].active ? 'blue darken-4' : ''"
                size="28"
                v-bind="attrs"
                @click="onAction(item.value, icons_panel[item.value])"
                v-on="on"
            >
              {{ item.icon }}
            </v-icon>
          </template>
          <span>{{ item.text }}</span>
        </v-tooltip>
      </div>
      <!-- Вставить заголовок -->
      <div class="header__elBlock right">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                :color="icons_panel.formatBlock.active ? 'blue darken-4' : ''"
                size="28"
                v-bind="attrs"
                @click="setH2()"
                v-on="on"
            >
              mdi-format-header-2
            </v-icon>
          </template>
          <span>Вставить заголовок</span>
        </v-tooltip>
      </div>
      <!-- Вставить список -->
      <div class="header__elBlock right">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                :color="icons_panel.insertUnorderedList.active ? 'blue darken-4' : ''"
                size="28"
                v-bind="attrs"
                @click="setBulletedList()"
                v-on="on"
            >
              mdi-format-list-bulleted
            </v-icon>
          </template>
          <span>Вставить маркированный список</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                :color="icons_panel.insertOrderedList.active ? 'blue darken-4' : ''"
                size="28"
                v-bind="attrs"
                @click="setNumberedList()"
                v-on="on"
            >
              mdi-format-list-numbered
            </v-icon>
          </template>
          <span>Вставить нумерованный список</span>
        </v-tooltip>
      </div>
      <!-- Вставить ссылку -->
      <div class="header__elBlock right">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                size="28"
                v-bind="attrs"
                @click="showLinkSettings"
                v-on="on"
            >
              mdi-link-variant
            </v-icon>
          </template>
          <span>Вставить ссылку</span>
        </v-tooltip>
      </div>
      <!-- Отступы -->
      <div class="header__elBlock right">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                size="28"
                v-bind="attrs"
                @click="onAction('indent')"
                v-on="on"
            >
              mdi-format-indent-increase
            </v-icon>
          </template>
          <span>Убрать отступ</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                size="28"
                v-bind="attrs"
                @click="onAction('outdent')"
                v-on="on"
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
                size="28"
                v-bind="attrs"
                @click="onAction('removeFormat')"
                v-on="on"
            >
              mdi-format-clear
            </v-icon>
          </template>
          <span>Очистить форматирование</span>
        </v-tooltip>
      </div>
    </div>

    <!-------- MODALS -------->
    <!--  Question  -->
    <v-dialog
        v-model="$store.state.ArticleModule.selectComponent.questions"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span
              class="text-h6"
              style="font-size: 0.8em !important; text-align: center; width: 100%"
          >Какой вопрос?</span
          >
        </v-card-title>
        <v-card-text id="questionSelector">
          <v-chip-group v-model="filters.tag" multiple show-arrows>
            <v-chip
                v-for="tag in $store.state.ArticleModule.listGeneralTags"
                :key="tag.id"
                :value="tag.code"
                color="#f2f5f7"
                small
            >
              <v-icon
                  v-if="filters.tag.includes(tag.code)"
                  color="grey darken-2"
                  left
              >
                mdi-check-bold
              </v-icon>
              <v-icon v-else color="grey darken-2" left>
                mdi-close-thick
              </v-icon>
              {{ tag.name }}
            </v-chip>
          </v-chip-group>
          <v-autocomplete
              ref="selector"
              v-model="$store.state.ArticleModule.selectedComponent"
              :disabled="$store.state.ArticleModule.loadingModalList"
              :items="listQuestions"
              :loading="$store.state.ArticleModule.loadingModalList"
              :menu-props="{ bottom: true, offsetY: true }"
              clearable
              item-text="name"
              placeholder="Наименование"
              return-object
              style="position: sticky; top: 0"
              @click:clear="
              $nextTick(() => {
                $store.state.ArticleModule.selectedComponent = {};
              })
            "
          >
          </v-autocomplete>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="closeModal('questions')">
            Назад
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              :disabled="!check_selected_component"
              color="green darken-1"
              text
              @click="onSelectComponent()"
          >
            Выбрать
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--  Nomenclature  -->
    <v-dialog
        v-if="$store.state.ArticleModule.selectComponent.nomenclature"
        v-model="$store.state.ArticleModule.selectComponent.nomenclature"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span
              class="text-h6"
              style="font-size: 0.8em !important; text-align: center; width: 100%"
          >
            Номенклатура
          </span>
        </v-card-title>
        <v-card-text id="nomenclatureSelector">
          <v-autocomplete
              ref="nomenclature"
              v-model="currentNomenclature"
              :disabled="$store.state.ArticleModule.loadingModalList"
              :items="listNomenclature"
              :loading="$store.state.ArticleModule.loadingModalList"
              :menu-props="{ bottom: true, offsetY: true }"
              clearable
              item-text="name"
              placeholder="Наименование"
              return-object
              style="position: sticky; top: 0"
              @change="setNomenclatureList($event)"
          >
            <template v-slot:item="{ item }">
              <div>
                <span>{{ item?.name }}</span>
                <span v-if="item?._family?.name">
                  -
                  {{
                    item?._family?.name
                  }}
                </span>
              </div>
            </template>
          </v-autocomplete>

          <div class="mt-1">
            <v-chip-group
                column
            >
              <v-chip
                  v-for="(item, index) in selectedNomenclature"
                  :key="index"
                  close
                  @click:close="removeNomenclature(item.id)"
              >
                <div class="nomenclature-chip">
                  <span>{{ item?.name }}</span>
                  <span v-if="item?._family?.name">
                  -
                  {{
                      item?._family?.name
                    }}
                </span>
                </div>
              </v-chip>
            </v-chip-group>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="closeModal('nomenclature')">
            Назад
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              :disabled="!selectedNomenclature.length"
              color="green darken-1"
              text
              @click="onSelectComponent()"
          >
            Выбрать
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--  Url  -->
    <v-dialog
        v-if="$store.state.ArticleModule.selectComponent.url"
        v-model="$store.state.ArticleModule.selectComponent.url"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span
              class="text-h6"
              style="font-size: 0.8em !important; text-align: center; width: 100%"
          >
            Ссылка
          </span>
        </v-card-title>
        <v-card-text>
          <v-form v-model="valid">
            <InputStyled
                :data="$store.state.ArticleModule.urlText"
                :is-clearable="true"
                :is-solo="true"
                :placeholder="'Текст ссылки'"
                class="mb-4"
                @update-input="setUrlText"
            />
            <TextAreaStyled
                :current-rules="emailRules"
                :data="$store.state.ArticleModule.urlValue"
                :is-clearable="true"
                :is-required="true"
                :is-solo="true"
                :placeholder="'Адрес ссылки'"
                @update-input="setUrlValue"
            />
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="closeModal('url')">
            Назад
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              :disabled="!check_can_create_url"
              color="green darken-1"
              text
              @click="createLink()"
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--  Image  -->
    <v-dialog
        v-model="$store.state.ArticleModule.selectComponent.image"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important"
          >Загрузите изображение</span
          >
        </v-card-title>
        <v-card-text class="dialog_dropzone">
          <div class="dialog_dropzone_wrapper">
            <vue-dropzone
                v-if="!loading_dropzone"
                id="dropzone"
                ref="myVueDropzone"
                :options="options"
                :useCustomSlot="true"
                @vdropzone-success="successData"
                @vdropzone-sending="sendingData"
            >
              <h3 class="dropzone-custom-title">
                <v-icon
                    color="grey lighten-1"
                    size="120"
                    style="transform: rotate(45deg)"
                >
                  mdi-paperclip
                </v-icon>
              </h3>
              <div class="subtitle" style="color: darkgrey">
                Для вставки изображения перетащите файл в зону или нажмите на
                скрепку
              </div>
            </vue-dropzone>
            <div
                v-if="dropzone_uploaded.length"
                class="dialog_dropzone_wrapper__upload"
                @click="triggerUpload()"
            >
              <v-icon
                  color="grey lighten-1"
                  size="60"
                  style="transform: rotate(45deg)"
              >mdi-paperclip
              </v-icon
              >
            </div>
          </div>
          <template v-if="dropzone_uploaded.length">
            <div
                v-for="(item, index) in dropzone_uploaded"
                :key="index"
                class="dialog_dropzone_inputs"
            >
              <span class="dialog_dropzone_inputs__label">
                [{{ index + 1 }}] {{ item.filename }}</span
              >
              <InputStyled
                  :data="item.alt_image"
                  :index-array="index"
                  :placeholder="'alt-наименование изображения'"
                  @update-input="setAlt"
              ></InputStyled>
              <InputStyled
                  :data="item.title_image"
                  :index-array="index"
                  :placeholder="'подпись изображения'"
                  @update-input="setTitle"
              ></InputStyled>
            </div>
          </template>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="closeModal('image')">
            Назад
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="updateDropZoneImage(); onSelectComponent();">
            Выбрать
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import PreviewTemplate from "../dropzone/PreviewTemplate";

import iconsModels from "../../models/iconsModels";
import Vue from "vue";

import titlesStore from "@/store/modules/article/index.js";
import Request from "@/services/request";
import InputStyled from "../common/InputStyled";
import TextAreaStyled from "../common/TextAreaStyled";

import _clone from "@/helpers/deepClone";

const _store = titlesStore.state;

export default {
  name: "HeaderBlock",
  components: {
    TextAreaStyled,
    InputStyled,
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
    selectedNomenclature: [],
    currentNomenclature: {},
    emailRules: [
      value => !!value || 'Поле обязательно для заполнения.',
      value => {
        const pattern = /^(ftp|http|https):\/\/[^ "]+$/
        return pattern.test(value) || 'Некорректная ссылка'
      },
    ],
    valid: false,
  }),
  created() {
    const ComponentClass = Vue.extend(PreviewTemplate);
    const instance = new ComponentClass();
    instance.$mount();
    this.previewHtml = instance.$el.outerHTML;
    this.loading_dropzone = false;
  },
  watch: {
    "$store.state.ArticleModule.selectComponent.questions": {
      handler(v) {
        if (v) {
          this.$nextTick(() => {
            window.addEventListener("scroll", this.disableInput, true);
          });
          this.$store
              .dispatch("getListQuestions", _store.name_component)
              .then(() => {
                this.getArrID();
              });
          this.$store.dispatch("getGeneralTagsArticle");
        }
      },
    },
    "$store.state.ArticleModule.selectComponent.nomenclature": {
      handler(v) {
        if (v) {
          this.$nextTick(() => {
            window.addEventListener("scroll", this.disableInput, true);
          });
          this.$store.dispatch("getListNomenclature", _store.name_component)
          // TODO: Тэги у номенклатуры
          // this.$store.dispatch("getGeneralTagsArticle");
        }
      },
    },
    filters: {
      handler() {
        this.getFilteredQuestions();
      },
      deep: true,
    },
  },
  computed: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
      );
    },
    check_count_auth() {
      return _store.counters.auth >= 1;
    },
    check_selected_component() {
      return !!Object.keys(_store.selectedComponent).length;
    },
    check_can_create_url() {
      return this.valid && _store.urlText
    },
    options() {
      return {
        url: `${this.$store.state.BASE_URL}/entity/files`,
        previewTemplate: this.previewHtml,
        destroyDropzone: false,
        headers: {
          Authorization: `666777`,
        },
        duplicateCheck: true,
      };
    },
    listQuestions() {
      if (!_store.list_questions.length) return [];
      return _store.list_questions.filter((question) => {
        return !this.arrIds.includes(question.id) && question.activity === 1;
      });
    },
    listNomenclature() {
      if (!_store.list_nomenclature.length) return [];
      return _store.list_nomenclature.filter((nomenclature) => {
        return !this.selectedNomenclature.map(elem => elem.id).includes(nomenclature.id);
      });
    },
  },
  methods: {
    setNomenclatureList(data) {
      this.selectedNomenclature.push(_clone(data))
      this.currentNomenclature = {}
    },
    removeNomenclature(id) {
      const index = this.selectedNomenclature.findIndex(elem => elem.id === id)
      if (index !== -1) {
        this.selectedNomenclature.splice(index, 1)
      }
    },

    showLinkSettings() {
      if (window.getSelection().toString()) {
        this.$store.commit('set_url_text', window.getSelection().toString())
        this.$store.commit('change_link_selection', window.getSelection().getRangeAt(0))
      }

      this.$store.commit("change_select_component", {
        name: 'url',
        value: true,
      });
    },
    createLink() {
      this.$emit("add-link");
      this.closeModal('url')
    },
    setUrlText(value) {
      this.$store.commit('set_url_text', value)
    },
    setUrlValue(value) {
      this.$store.commit('set_url_value', value)
    },

    setAlt(data) {
      this.dropzone_uploaded[data.index].alt_image = data.value
    },
    setTitle(data) {
      this.dropzone_uploaded[data.index].title_image = data.value
    },

    getArrID() {
      this.$nextTick(() => {
        this.arrIds = _store.questions_data.map(elem => elem.id)
      });
    },
    disableInput() {
      this.$nextTick(() => {
        setTimeout(() => {
          if (this.$refs?.selector?.$refs?.input) {
            this.$refs.selector.$refs.input.blur();
          }
          if (this.$refs?.nomenclature?.$refs?.input) {
            this.$refs.nomenclature.$refs.input.blur();
          }
        });
      });
    },

    /* DROPZONE */
    sendingData(file, xhr, formData) {
      formData.append("uuid", file.upload.uuid);
      formData.append("id_article", _store.newArticle.id);
      formData.append("preview_image", 0);
    },
    successData(file, response) {
      const formatObj = Object.assign({}, response.data);
      Object.assign(formatObj, {
        index: this.index_uploaded,
      });
      this.index_uploaded++;
      this.dropzone_uploaded.push(formatObj);

      this.$nextTick(() => {
        const deletedElems = document.getElementsByClassName("dz_close");
        let count = 1;
        for (let item of deletedElems) {
          item.setAttribute("id", `close-${count}`);
          let index = count;
          item.onclick = () => {
            this.removedFile(index);
          };
          count++;
        }
      });
    },
    removedFile(id) {
      const index = this.dropzone_uploaded.findIndex((elem) => {
        return elem.index === id;
      });
      if (index !== -1) {
        this.$store
            .dispatch("deleteFile", this.dropzone_uploaded[index].id)
            .then(() => {
              this.dropzone_uploaded.splice(index, 1);
              for (let i = 0; i < this.dropzone_uploaded.length; i++) {
                const block = document.getElementById(
                    `close-${this.dropzone_uploaded[i].index}`
                );
                block.id = `close-${i + 1}`;
                block.onclick = () => {
                  this.removedFile(i + 1);
                };
                this.dropzone_uploaded[i].index = i + 1;
              }
              this.index_uploaded = this.dropzone_uploaded.length + 1;
            });
      }
    },
    clearDropZoneTemplate() {
      for (let i = 1; i < this.dropzone_uploaded.length + 1; i++) {
        this.$nextTick(() => {
          let template = document.getElementById(`close-${i}`);
          template.click();
        });
      }
    },
    triggerUpload() {
      document.getElementById("dropzone").click();
    },
    async updateDropZoneImage() {
      if (!this.dropzone_uploaded.length) return;

      await Request.put(
          this.$store.state.BASE_URL + '/entity/files/' + this.dropzone_uploaded[0].id,
          this.dropzone_uploaded[0])
    },

    /* ICONS */
    onUndo() {
      this.$store.dispatch("getUndo");
    },
    onRedo() {
      this.$store.dispatch("getRedo");
    },
    onAction(action, icon) {
      document.execCommand(action, false, null);
      if (icon) {
        icon.active = true;
      }
    },
    setH2() {
      this.onAction('removeFormat')
      if (_store.range.commonAncestorContainer.parentElement.tagName === "H2") {
        document.execCommand("formatBlock", false, "p");
        _store.range.collapse(false)
        iconsModels.icons_panel.formatBlock.active = false;
      } else if (
          _store.range.commonAncestorContainer.parentElement.tagName === "DIV"
      ) {
        document.execCommand("formatBlock", false, "p");
        _store.range.collapse(false)
        iconsModels.icons_panel.formatBlock.active = false;
      } else {
        document.execCommand("formatBlock", false, "h2");
        _store.range.collapse(false)
        iconsModels.icons_panel.formatBlock.active = true;
      }
      this.$store.commit('get_range')
    },

    /* LIST */
    setBulletedList() {
      this.onAction('insertUnorderedList')
    },
    setNumberedList() {
      this.onAction('insertOrderedList')
    },

    /* MODALS */
    getFilteredQuestions() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        this.$store.commit("change_loading_modal_list", true);
        this.$store
            .dispatch("setFilteredListQuestionsModal", this.filters)
            .then(() => {
              this.$store.commit("change_loading_modal_list", false);
            });
      }, 500);
    },
    closeModal(name) {
      if (name === 'url') {
        this.$store.commit('clear_url')
      }

      this.$store.commit("change_select_component", {
        name: name,
        value: false,
      });
    },
    // if we want immediately insert component
    initialiseInserting(componentName) {
      this.$store.commit("get_range", true);
      this.$store.commit("change_name_component", componentName);
      this.$store.commit("changeInsertingComponents", true);
      this.$store.commit("change_select_component", {
        name: componentName,
        value: true,
      });
      this.onSelectComponent();
    },
    // if we want add after modal window
    initializeSelection(componentName) {
      this.$store.commit("get_range", true);
      this.$store.commit("change_name_component", componentName);
      this.$store.commit("change_select_component", {
        name: componentName,
        value: true,
      });
    },

    onSelectComponent() {
      let elem = {};
      if (_store.name_component === "image") {
        /** IMAGE **/
        if (this.dropzone_uploaded.length) {
          this.dropzone_uploaded.forEach((elem) => {
            this.$store.commit("change_counter", {
              name: "layout",
              count: _store.counters.layout + 1,
            });
            this.$store.commit("change_counter", {
              name: _store.name_component,
              count: _store.counters[_store.name_component] + 1,
            });
            this.$store.commit("changeSelectedObject", elem);
            this.$emit("callCheckout", elem);
          });
          this.clearDropZoneTemplate();
          this.dropzone_uploaded = [];
          this.index_uploaded = 1;
        }
      } else if (_store.name_component === "nomenclature") {
        /** NOMENCLATURE **/
        this.$store.commit("change_counter", {
          name: "layout",
          count: _store.counters.layout + 1,
        });
        this.$store.commit("change_counter", {
          name: _store.name_component,
          count: _store.counters[_store.name_component] + 1,
        });
        elem.nomenclatures_id = this.selectedNomenclature.slice().map(elem => elem.id)
        elem.id = new Date().valueOf();
        this.$store.commit("changeSelectedObject", elem)
        this.selectedNomenclature = []

        this.$emit("callCheckout", elem);
      } else {
        /** ALL **/
        this.$store.commit("change_counter", {
          name: "layout",
          count: _store.counters.layout + 1,
        });
        this.$store.commit("change_counter", {
          name: _store.name_component,
          count: _store.counters[_store.name_component] + 1,
        });
        this.$emit("callCheckout", elem);
      }
    },
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.disableInput, true);
  },
};
</script>

<style lang="scss" scoped>
@import "src/assets/styles/textEditor";

::v-deep .v-text-field {
  //padding-top: 0 !important;
  //margin-top: 0 !important;
}

::v-deep .v-slide-group__next,
::v-deep .v-slide-group__prev {
  min-width: 15px !important;
  flex: 0 1 15px !important;
}

::v-deep
.v-menu__content.theme--light.menuable__content__active.v-autocomplete__content {
  max-width: 552px !important;
}

.v-list {
  max-width: 500px !important;
}
</style>
