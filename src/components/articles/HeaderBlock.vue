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
        <!-- Specifications -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                size="28"
                v-bind="attrs"
                @click="initializeSelection('specification')"
                v-on="on"
            >
              mdi-image-filter-center-focus
            </v-icon>
          </template>
          <span>Вставить спецификацию</span>
        </v-tooltip>  
        <!-- Citatuon -->
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                size="28"
                v-bind="attrs"
                @click="initializeSelection('citation')"
                v-on="on"
            >
              mdi-comment-quote
            </v-icon>
          </template>
          <span>Вставить цитату</span>
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
      <!-- Вставить заголовок H2 -->
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

      <!-- Вставить заголовок H3 -->
      <div class="header__elBlock right">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                :color="icons_panel.formatBlockH3.active ? 'blue darken-4' : ''"
                size="28"
                v-bind="attrs"
                @click="setH3()"
                v-on="on"
            >
              mdi-format-header-3
            </v-icon>
          </template>
          <span>Вставить подзаголовок</span>
        </v-tooltip>
      </div>
      
      <!-- Вставить список -->
      <div class="header__elBlock right">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
                :color="
                icons_panel.insertUnorderedList.active ? 'blue darken-4' : ''
              "
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
                :color="
                icons_panel.insertOrderedList.active ? 'blue darken-4' : ''
              "
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
        content-class="textRedactor__questionsModals"
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
          <v-autocomplete
              v-model="filters.tag"
              :item-text="'name'"
              :item-value="'code'"
              :items="$store.state.ArticleModule.listGeneralTags"
              :label="'#Отфильтровать по тегу или нескольким тегам'"
              class="autocomplete_tags"
              clearable
              deletable-chips
              dense
              multiple
              outlined
              small-chips
          ></v-autocomplete>
          <v-autocomplete
              ref="selector"
              v-model="$store.state.ArticleModule.selectedComponent"
              :disabled="$store.state.ArticleModule.loadingModalList"
              :items="listQuestions"
              :loading="$store.state.ArticleModule.loadingModalList"
              :menu-props="{ bottom: true, offsetY: true }"
              clearable
              item-text="name"
              label="Выберите вопрос"
              outlined
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
                  {{ item?._family?.name }}
                </span>
              </div>
            </template>
          </v-autocomplete>

          <div class="mt-1">
            <v-chip-group column>
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
                    {{ item?._family?.name }}
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
              </v-icon>
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
          <v-btn
              color="green darken-1"
              text
              @click="
              updateDropZoneImage();
              onSelectComponent();
            "
          >
            Выбрать
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--  Specifications  -->
    <v-dialog
      v-if="$store.state.ArticleModule.selectComponent.specification"
      v-model="$store.state.ArticleModule.selectComponent.specification"
      width="900"
      persistent
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important;">
            {{ isEditingCitation ? 'Редактировать спецификацию' : 'Создать спецификацию' }}
          </span>
          <v-spacer />
          <v-btn icon @click="clearSpecification()">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text>
          <SpecificationEditor
            ref="specEditor"
            :initial-data="specificationData"
            :products="listNomenclature"
            @specification-save="saveSpecification"
          />
        </v-card-text>

        <v-card-actions>
          <v-btn text @click="clearSpecification()">
            Отмена
          </v-btn>
          <v-spacer />
                                                                                                                            <v-tooltip top>
            <template v-slot:activator="{ on, attrs }">
              <div v-bind="attrs" v-on="on" class="d-inline-block">
                <v-btn 
                  v-if="!isEditingSpecification"
                  color="success" 
                  :disabled="!canInsertSpecification"
                  @click="insertSpecification"
                >
                  Вставить спецификацию
                </v-btn>
              </div>
            </template>
            <span>Сначала добавьте метку</span>
          </v-tooltip>
          
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--  Citatuon  -->
    <v-dialog
      v-if="$store.state.ArticleModule.selectComponent.citation"
      v-model="$store.state.ArticleModule.selectComponent.citation"
      max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important; text-align: center; width: 100%">
            {{ isEditingCitation ? 'Редактировать цитату' : 'Создать цитату' }}
          </span>
        </v-card-title>
        
        <v-card-text>
          <!-- Заголовок -->
          <v-text-field
            v-model="citationForm.title"
            label="Заголовок цитаты"
            outlined
            dense
            placeholder="Например: О важности обучения"
          />

          <!-- Основной текст -->
          <v-textarea
            v-model="citationForm.text"
            label="Текст цитаты"
            outlined
            rows="5"
            placeholder="Введите текст цитаты..."
          />

          <!-- Селектор пользователей -->
          <v-autocomplete
            v-model="citationForm.id_user"
            :disabled="$store.state.ArticleModule.loadingModalList"
            :items="listUsers"
            :loading="$store.state.ArticleModule.loadingModalList"
            :menu-props="{ bottom: true, offsetY: true }"
            clearable
            item-text="user_fio"
            item-value="id"
            label="Автор цитаты"
            outlined
            dense
            placeholder="Выберите автора"
          >
            <template v-slot:item="{ item }">
              <div>
                <span>{{ item.user_fio }}</span>
                <span v-if="item.email" style="color: #999; font-size: 12px;">
                  ({{ item.email }})
                </span>
              </div>
            </template>
          </v-autocomplete>
        </v-card-text>

        <v-card-actions>
          <v-btn color="blue darken-1" text @click="closeModal('citation')">
            Назад
          </v-btn>
          <v-spacer />
          <v-btn
            :disabled="!citationForm.text || !citationForm.id_user"
            :loading="savingCitation"
            color="green darken-1"
            text
            @click="onSelectComponent()"
          >
            {{ isEditingCitation ? 'Сохранить' : 'Создать' }}
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
import SearchStyled from "@/components/common/SearchStyled.vue";
import ComboboxStyled from "@/components/common/ComboboxStyled.vue";
import SpecificationEditor from "../frontLayouts/SpecificationEditor.vue";

const _store = titlesStore.state;

export default {
  name: "HeaderBlock",
  components: {
    ComboboxStyled,
    SearchStyled,
    TextAreaStyled,
    InputStyled,
    vueDropzone: vue2Dropzone,
    SpecificationEditor
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
      (value) => !!value || "Поле обязательно для заполнения.",
      (value) => {
        const pattern = /^(ftp|http|https):\/\/[^ "]+$/;
        return pattern.test(value) || "Некорректная ссылка";
      },
    ],
    valid: false,

    /* Citaion */
    citationForm: {
      title: '',
      text: '',
      id_user: null,
      _uuid_user: null,
      
    },
    isEditingCitation: false,
    editingCitationIndex: null,
    savingCitation: false,

    /* Specification */
    isEditingSpecification: false,
    editingSpecificationIndex: null,
    specificationData: {}
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
        this.$store.commit("clear_list_questions");
        this.$store.commit("clear_list_general_tags_article");
        this.filters.tag = [];

        if (!v) return;

        this.$nextTick(() => {
          window.addEventListener("scroll", this.disableInput, true);
        });
        this.$store
            .dispatch("getListQuestions", _store.name_component)
            .then(() => {
              this.getArrID();
            });
        this.$store.dispatch("getGeneralTagsArticle");
      },
    },
    "$store.state.ArticleModule.selectComponent.nomenclature": {
      handler(v) {
        if (v) {
          this.$nextTick(() => {
            window.addEventListener("scroll", this.disableInput, true);
          });
          this.$store.dispatch("getListNomenclature", _store.name_component);
          // TODO: Тэги у номенклатуры
          // this.$store.dispatch("getGeneralTagsArticle");
        }
      },
    },
    "$store.state.ArticleModule.selectComponent.specification": {
      async handler(isOpen) {
        if (isOpen) {
          this.$nextTick(() => {
            window.addEventListener("scroll", this.disableInput, true);
          });
          
          // Загружаем номенклатуру
          if (!this.$store.state.ArticleModule.nomenclatures?.length) {
            this.$store.dispatch("getListNomenclature", "nomenclature");
          }
          
          // Чекаем режим редактирования
          const editData = this.$store.state.ArticleModule.editingSpecification;
          
          if (editData?.imageId) {
            // Ждём пока компонент точно отрендерится
            await this.$nextTick();
                        
            if (this.$refs.specEditor) {
              await this.loadSpecificationForEdit(editData);
            }
          }
        } else {
          window.removeEventListener("scroll", this.disableInput, true);
        }
      },
    },
    "$store.state.ArticleModule.selectComponent.citation": {
      handler(v) {
        if (v) {
          const editingData = this.$store.state.ArticleModule.editingCitation;
          
          if (editingData) {
            this.isEditingCitation = true;
            this.editingCitationIndex = editingData.index_component;
            this.citationForm = {
              id: editingData.id,
              title: editingData.title,
              text: editingData.text,
              id_user: editingData.id_user,
              _uuid_user: editingData._uuid_user,
            };
          }
        } else {
          this.resetCitationForm();
          this.$store.commit("clearEditingCitation");
        }
      },
    },
    'citationForm.id_user'(newUserId) {
      if (newUserId) {
        const user = this.listUsers.find(u => u.id === newUserId)
        this.citationForm._uuid_user = user?.uuid || null
      } else {
        this.citationForm._uuid_user = null
      }
    },
    "filters.tag": {
      handler(v) {
        if (!v.length) return;
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
      return this.valid && _store.urlText;
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
        return !this.selectedNomenclature
            .map((elem) => elem.id)
            .includes(nomenclature.id);
      });
    },
    listUsers() {
      return this.$store.state.ArticleModule.listUsersByFilterExpert || [];
    },
    canInsertSpecification() {
      const editor = this.$refs.specEditor
      
      if (!editor || !editor.dropzone_uploaded?.length || !editor.hotspots?.length) {
        return false
      }
      
      // Режим добавления активен
      if (editor.isAddingHotspot) {
        return false
      }
      
      // Есть несохранённые метки
      const hasUnsavedHotspot = editor.hotspots.some(h => !h.saved)
      if (hasUnsavedHotspot) {
        return false
      }
      
      return true
    }
  },
  methods: {
    setNomenclatureList(data) {
      this.selectedNomenclature.push(_clone(data));
      this.currentNomenclature = {};
    },
    removeNomenclature(id) {
      const index = this.selectedNomenclature.findIndex(
          (elem) => elem.id === id
      );
      if (index !== -1) {
        this.selectedNomenclature.splice(index, 1);
      }
    },

    showLinkSettings() {
      const selection = window.getSelection();
      
      if (selection.toString()) {
        this.$store.commit("set_url_text", selection.toString());
        this.$store.commit("change_link_selection", selection.getRangeAt(0));
      } else {
        this.$store.commit("change_link_selection", null);
        
        if (selection.rangeCount > 0) {
          this.$store.commit("change_range", selection.getRangeAt(0));
        }
      }

      this.$store.commit("change_select_component", {
        name: "url",
        value: true,
      });
    },

    createLink() {
      this.$emit("add-link");
      this.closeModal("url");
    },
    setUrlText(value) {
      this.$store.commit("set_url_text", value);
    },
    setUrlValue(value) {
      this.$store.commit("set_url_value", value);
    },

    setAlt(data) {
      this.dropzone_uploaded[data.index].alt_image = data.value;
    },
    setTitle(data) {
      this.dropzone_uploaded[data.index].title_image = data.value;
    },

    getArrID() {
      this.$nextTick(() => {
        this.arrIds = _store.questions_data.map((elem) => elem.id);
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
          if (template?.click) {
            template.click();
          }
        });
      }
    },
    triggerUpload() {
      document.getElementById("dropzone")?.click();
    },
    async updateDropZoneImage() {
      if (!this.dropzone_uploaded.length) return;

      await Request.put(
          this.$store.state.BASE_URL +
          "/entity/files/" +
          this.dropzone_uploaded[0].id,
          this.dropzone_uploaded[0]
      );
    },

    /* SPECIFICATION */
    saveSpecification (data) {
      this.specificationData = data
    },
    
    insertSpecification () {
      const imageId = this.$refs.specEditor.dropzone_uploaded[0]?.id;
      const imageUrl = this.$refs.specEditor.dropzone_uploaded[0]?.url;
      const imageUuid = this.$refs.specEditor.dropzone_uploaded[0]?.uuid;
      
      if (!imageId) {
        this.$toast?.error('Сначала загрузите изображение')
        return
      }
      
      const elem = {
        imageId: imageId,
        imageUrl: imageUrl,
        imageUuid: imageUuid
      };
      
      this.$store.commit("change_counter", {
        name: "layout",
        count: _store.counters.layout + 1,
      });
      this.$store.commit("change_counter", {
        name: "specification",
        count: _store.counters.specification + 1,
      });
      
      this.$store.commit("changeSelectedObject", elem);
      
      this.$emit("callCheckout", elem);
      
      this.closeModal('specification');
    },

    async loadSpecificationForEdit(editData) {
      this.isEditingSpecification = true;
      this.editingSpecificationIndex = editData.index_component;
      
      try {
        const selectQuery = Request.ConstructSelectQuery(['*']);
        
        const response = await Request.get(
          `${this.$store.state.BASE_URL}/entity/specifications?${selectQuery}&filter[id_image]=${editData.imageId}`
        );
        
        this.specificationData = {
          imageId: editData.imageId,
          imageUrl: editData.imageUrl,
          imageUuid: editData.imageUuid,
          hotspots: response.data.map(spec => ({
            id: spec.id,
            x: spec.hotspot_x,
            y: spec.hotspot_y,
            idsNomenclatures: spec.ids_nomenclatures || [],
            idsFamilies: spec.ids_families || [],
            saved: true,
            specificationId: spec.id
          }))
        };
        
        this.$refs.specEditor.loadExistingSpecification(this.specificationData);
        
      } catch (error) {
        console.error('❌ Ошибка:', error);
      }
    },

    
    clearSpecification() {
      this.$refs.specEditor?.clearAllData?.()
      this.specificationData = {}
      this.closeModal('specification')
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
      this.onAction("removeFormat");
      if (_store.range.commonAncestorContainer.parentElement.tagName === "H2") {
        document.execCommand("formatBlock", false, "p");
        _store.range.collapse(false);
        iconsModels.icons_panel.formatBlock.active = false;
      } else if (
          _store.range.commonAncestorContainer.parentElement.tagName === "DIV"
      ) {
        document.execCommand("formatBlock", false, "p");
        _store.range.collapse(false);
        iconsModels.icons_panel.formatBlock.active = false;
      } else {
        document.execCommand("formatBlock", false, "h2");
        _store.range.collapse(false);
        iconsModels.icons_panel.formatBlock.active = true;
      }
      this.$store.commit("get_range");
    },
    setH3() {
      this.onAction("removeFormat");
      if (_store.range.commonAncestorContainer.parentElement.tagName === "H3") {
        document.execCommand("formatBlock", false, "p");
        _store.range.collapse(false);
        iconsModels.icons_panel.formatBlockH3.active = false;
      } else if (
          _store.range.commonAncestorContainer.parentElement.tagName === "DIV"
      ) {
        document.execCommand("formatBlock", false, "p");
        _store.range.collapse(false);
        iconsModels.icons_panel.formatBlockH3.active = false;
      } else {
        document.execCommand("formatBlock", false, "h3");
        _store.range.collapse(false);
        iconsModels.icons_panel.formatBlockH3.active = true;
      }
      this.$store.commit("get_range");
    },

    /* LIST */
    setBulletedList() {
      this.onAction("insertUnorderedList");
    },
    setNumberedList() {
      this.onAction("insertOrderedList");
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
      if (name === "url") {
        this.$store.commit("clear_url");
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
      if (componentName === "image") {
        this.loading_dropzone = false
      }

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
          this.loading_dropzone = true
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
        elem.nomenclatures_id = this.selectedNomenclature
            .slice()
            .map((elem) => elem.id);
        elem.id = new Date().valueOf();
        this.$store.commit("changeSelectedObject", elem);
        this.selectedNomenclature = [];

        this.$emit("callCheckout", elem);
      } else if (_store.name_component === "citation") {
        /** CITATION **/

        // Проверяем режим: редактирование или создание
        if (this.isEditingCitation) {
          this.updateCitation();
        } else {
          this.createCitation();
        }

        return;
      } else if (_store.name_component === "specification") {
        /** SPECIFICATION **/
        
        const imageId = this.$refs.specEditor.dropzone_uploaded[0]?.id;
        const imageUrl = this.$refs.specEditor.dropzone_uploaded[0]?.url;
        const imageUuid = this.$refs.specEditor.dropzone_uploaded[0]?.uuid;
        
        if (!imageId) {
          this.$toast?.error('Загрузите изображение');
          return;
        }
        
        elem = {
          imageId: imageId,
          imageUrl: imageUrl,
          imageUuid: imageUuid
        };
        
        console.log('🔥 elem для callCheckout:', elem); 
        
        // Увеличиваем счётчики
        this.$store.commit("change_counter", {
          name: "layout",
          count: _store.counters.layout + 1,
        });
        this.$store.commit("change_counter", {
          name: "specification",
          count: _store.counters.specification + 1,
        });
        
        // Передаём данные в стор
        this.$store.commit("changeSelectedObject", elem);
        
        // Вызываем вставку
        this.$emit("callCheckout", elem);
        
        // Закрываем модалку
        this.closeModal('specification');
        
        return;
      }

      else {
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

    /** CITATION METHODS **/
    async createCitation() {
      this.savingCitation = true;
      
      try {
        const response = await Request.post(
          `${this.$store.state.BASE_URL}/entity/quotes`,
          {
            title: this.citationForm.title,
            text: this.citationForm.text,
            id_user: this.citationForm.id_user,
          }
        );
        
        const citationId = response.data.id;
        
        // Формируем объект для вставки
        const elem = {
          id: citationId,
          title: this.citationForm.title,
          text: this.citationForm.text,
          id_user: this.citationForm.id_user,
          _uuid_user: this.citationForm._uuid_user,
        };
        
        // Увеличиваем счётчики
        this.$store.commit("change_counter", {
          name: "layout",
          count: _store.counters.layout + 1,
        });
        this.$store.commit("change_counter", {
          name: "citation",
          count: _store.counters.citation + 1,
        });
        
        // Передаём данные в стор для компонента
        this.$store.commit("changeSelectedObject", elem);
        
        // Вызываем вставку компонента в редактор
        this.$emit("callCheckout", elem);
        
        // Очищаем форму и закрываем модалку
        this.resetCitationForm();
        this.closeModal('citation');
        
      } catch (error) {
        console.error('Ошибка создания цитаты:', error);
      } finally {
        this.savingCitation = false;
      }
    },
    async updateCitation() {
      this.savingCitation = true;
      
      try {
        await Request.put(
          `${this.$store.state.BASE_URL}/entity/quotes/${this.citationForm.id}`,
          {
            title: this.citationForm.title,
            text: this.citationForm.text,
            id_user: this.citationForm.id_user,
          }
        );
        
        // Находим компонент в списке по индексу
        const component = _store.list_components.find(
          comp => comp.instance.$data.index_component === this.editingCitationIndex
        );
        
        if (component) {
          // Обновляем данные прямо в компоненте (реактивность сработает)
          component.instance.$data.citation_data = {
            id: this.citationForm.id,
            title: this.citationForm.title,
            text: this.citationForm.text,
            id_user: this.citationForm.id_user,
            _uuid_user: this.citationForm._uuid_user,
          };
          
          // Обновляем имя автора (вызываем метод для загрузки с бэка)
          component.instance.getUserName();
        }
        
        // Очищаем форму и закрываем модалку
        this.resetCitationForm();
        this.closeModal('citation');
        
      } catch (error) {
        console.error('Ошибка обновления цитаты:', error);
      } finally {
        this.savingCitation = false;
      }
    },
    resetCitationForm() {
      this.citationForm = {
        id: null,
        title: '',
        text: '',
        id_user: null,
        _uuid_user: null,
      };
      this.isEditingCitation = false;
      this.editingCitationIndex = null;
    }

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
