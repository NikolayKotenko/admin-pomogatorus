<template>
  <div class="detail_container">
    <div class="question">
      <v-form ref="form" class="form">
        <!--      @submit.prevent="onSubmit" -->
        <div class="question_content">
          <div class="question_title">
            <TextAreaStyled
              :class="{
                invalid:
                  !newQuestion.name.value &&
                  $v.newQuestion.name.$dirty &&
                  !$v.newQuestion.name.required,
              }"
              :data="newQuestion.name.value"
              :is-flat="true"
              :is-loading="$store.state.QuestionsModule.loadingQuestion"
              :is-solo="true"
              :placeholder="'Название вопроса'"
              :rows-count="'1'"
              class="question_title__name"
              @update-input="setName"
              @on-focus="
                () => {
                  onFocus(newQuestion.name);
                }
              "
              @out-focus="
                () => {
                  outFocus(newQuestion.name);
                }
              "
            >
              <template slot="append">
                <v-icon
                  :color="newQuestion.name.focused ? 'primary' : ''"
                  class="question_title__name__icon"
                  size="20"
                >
                  mdi-lead-pencil
                </v-icon>
              </template>
            </TextAreaStyled>
            <small
              v-if="
                !newQuestion.name.value &&
                $v.newQuestion.name.$dirty &&
                !$v.newQuestion.name.required
              "
              style="color: lightcoral"
            >
              Поле обязательно для заполнения
            </small>
            <div class="question_title_help">
              <span
                :class="{ focused: newQuestion.title.focused }"
                class="question_title_help__title"
              >
                Подсказка
              </span>
              <TextAreaStyled
                :class="{ inputFocused: newQuestion.title.focused }"
                :data="newQuestion.title.value"
                :is-flat="true"
                :is-loading="$store.state.QuestionsModule.loadingQuestion"
                :is-solo="true"
                :placeholder="'Подсказка для вопроса'"
                :rows-count="'1'"
                class="question_title_help__description"
                @update-input="setTitle"
                @on-focus="
                  () => {
                    onFocus(newQuestion.title);
                  }
                "
                @out-focus="
                  () => {
                    outFocus(newQuestion.title);
                  }
                "
              >
              </TextAreaStyled>
            </div>
            <div class="question_title_help">
              <span
                :class="{ focused: newQuestion.article.focused }"
                class="question_title_help__title"
              >
                Разъясняющий текст
              </span>
              <TextAreaStyled
                :class="{ inputFocused: newQuestion.article.focused }"
                :data="newQuestion.article.value"
                :is-flat="true"
                :is-loading="$store.state.QuestionsModule.loadingQuestion"
                :is-solo="true"
                :placeholder="'Разъясняющий текст'"
                :rows-count="'1'"
                class="question_title_help__description"
                @update-input="setArticle"
                @on-focus="
                  () => {
                    onFocus(newQuestion.article);
                  }
                "
                @out-focus="
                  () => {
                    outFocus(newQuestion.article);
                  }
                "
              >
              </TextAreaStyled>
            </div>
            <div class="question_title_help">
              <span
                :class="{ focused: newQuestion.purpose_of_question.focused }"
                class="question_title_help__title"
              >
                Цель вопроса
              </span>
              <TextAreaStyled
                :class="{
                  inputFocused: newQuestion.purpose_of_question.focused,
                }"
                :data="newQuestion.purpose_of_question.value"
                :is-flat="true"
                :is-loading="$store.state.QuestionsModule.loadingQuestion"
                :is-solo="true"
                :placeholder="'Цель вопроса'"
                :rows-count="'1'"
                class="question_title_help__description"
                @update-input="setPurpose"
                @on-focus="
                  () => {
                    onFocus(newQuestion.purpose_of_question);
                  }
                "
                @out-focus="
                  () => {
                    outFocus(newQuestion.purpose_of_question);
                  }
                "
              >
              </TextAreaStyled>
            </div>

            <!-- Поясняющая картинка -->
            <div class="mt-3">
              <v-btn
                :disabled="$store.state.QuestionsModule.loadingQuestion"
                @click="
                  stateDropzone = true;
                  insertDropzoneData();
                "
              >
                Поясняющее изображение
                <v-icon color="grey lighten-1" style="transform: rotate(45deg)"
                  >mdi-paperclip</v-icon
                >
                [{{ dropzone_uploaded.length }}]
              </v-btn>
              <v-checkbox
                v-model.number="stateAllowAttachments"
                :loading="$store.state.QuestionsModule.loadingQuestion"
                class="question_settings__checkbox mt-2"
                hide-details
                label="Возможность загружать файлы"
                @change="saveDBQuestion(newQuestion)"
              ></v-checkbox>
              <v-checkbox
                :disabled="!stateAllowAttachments"
                v-model="newQuestion.state_attachment_response"
                :loading="$store.state.QuestionsModule.loadingQuestion"
                class="question_settings__checkbox"
                hide-details
                label="Возможность загружать pdf документы"
                @change="saveDBQuestion(newQuestion)"
              ></v-checkbox>
            </div>
          </div>
          <div class="question_settings mt-5">
            <v-checkbox
              v-model.number="newQuestion.activity"
              :false-value="0"
              :true-value="1"
              hide-details
              label="Активность"
            ></v-checkbox>
            <v-checkbox
              v-model="newQuestion.state_detailed_response"
              :loading="$store.state.QuestionsModule.loadingQuestion"
              class="question_settings__checkbox"
              hide-details
              label="Допускается развернутый ответ"
              @change="saveDBQuestion(newQuestion)"
            ></v-checkbox>
          </div>

          <br />
          <!-- Tags Component -->
          <UniversalTags
            ref="universal-tags"
            :attached-tags="$store.state.QuestionsModule.newQuestion.mtomtags"
            :disable-deleting="!$route.query.question_id"
            :disabled-new-tag="
              !$store.state.QuestionsModule.listGeneralTags.length ||
              !$route.query.question_id
            "
            :error-messages="$store.state.responseTag.errorMessages"
            :error-state="$store.state.responseTag.errorState"
            :list-tags="$store.state.QuestionsModule.listGeneralTags"
            :loading="
              $store.state.loadingRequestGeneral ||
              $store.state.QuestionsModule.tagsLoaded
            "
            @createNewTag="createNewTag"
            @removeAttachedTag="removeAttachedTag"
          >
            <template v-slot:icon-tooltip>
              <IconTooltip
                text-tooltip=""
                @click-icon="
                  snackbar = true;
                  snackbarValue = 1;
                "
              />
            </template>
          </UniversalTags>
          <br />
          <!-- Раздел в ТЗ -->
          <UniversalTags
            ref="universal-tags-tech-task"
            :attached-tags="
              $store.state.QuestionsModule.newQuestion.m_to_m_tags_tech_task
            "
            :disable-deleting="!$route.query.question_id"
            :disabled-new-tag="
              !$store.state.QuestionsModule.listGeneralTags.length ||
              !$route.query.question_id ||
              $store.state.QuestionsModule.newQuestion.m_to_m_tags_tech_task
                .length >= 1
            "
            :error-messages="$store.state.responseTag.errorMessages"
            :error-state="$store.state.responseTag.errorState"
            :list-tags="$store.state.QuestionsModule.listGeneralTags"
            :loading="
              $store.state.loadingRequestGeneral ||
              $store.state.QuestionsModule.tagsLoaded
            "
            :name-heading="'Раздел в ТЗ'"
            @createNewTag="createNewTagTechTask"
            @removeAttachedTag="removeAttachedTagTechTask"
          >
            <template v-slot:icon-tooltip>
              <IconTooltip
                text-tooltip=""
                @click-icon="
                  snackbar = true;
                  snackbarValue = 0;
                "
              />
            </template>
          </UniversalTags>
          <br />

          <!-- SELECTOR & INPUT'S -->
          <div class="question_main">
            <!--      Блок с выбором типа вопроса      -->
            <div class="question_main_selector">
              <!--      Заголовок        -->
              <span
                :class="{ focused: newQuestion.id_type_answer.focused }"
                class="question_main_selector__title"
              >
                Тип ответа
              </span>
              <!--      Селектор типа вопроса        -->
              <v-select
                v-model="newQuestion.id_type_answer.value"
                :items="getListTypesOfQuestions"
                :loading="$store.state.QuestionsModule.loadingQuestion"
                :menu-props="{ bottom: true, offsetY: true }"
                dense
                hide-details
                item-text="name"
                item-value="id"
                outlined
                placeholder="Выберите тип"
                @change="
                  onSelect();
                  saveDBQuestion(newQuestion);
                "
                @focus="onFocus(newQuestion.id_type_answer)"
                @focusout="outFocus(newQuestion.id_type_answer)"
              ></v-select>
            </div>

            <!--      Заполняемые пользователем поля      -->
            <!-- Если у типа вопросов несколько вариантов ответов -->
            <template
              v-if="
                newQuestion.id_type_answer.value !== 1 &&
                newQuestion.id_type_answer.value !== 2 &&
                !!newQuestion.id_type_answer.value
              "
            >
              <!--      Блок с инпутами для радиобатанов, чекбоксов и селекторов        -->
              <div
                v-if="
                  newQuestion.id_type_answer.value !== 6 &&
                  newQuestion.id_type_answer.value !== 7
                "
                class="question_main_wrapper"
              >
                <!--        Блок с выбором справочника для автозаполнения        -->
                <div class="question_main_wrapper__item">
                  <v-autocomplete
                    v-model="selectedDictionary"
                    :class="{ focused: dictionaryFocused }"
                    :items="dictionariesList"
                    :loading="loadingDictionaries"
                    :outlined="false"
                    class="innerSelector"
                    clearable
                    dense
                    flat
                    hide-details
                    hide-no-data
                    item-text="name"
                    item-value="code"
                    placeholder="Выберете справочник для автозаполнения"
                    prepend-icon="mdi-database"
                    return-object
                    solo
                    @change="setDictionary"
                    @focus="dictionaryFocused = true"
                    @focusout="dictionaryFocused = false"
                  />
                </div>

                <!--        Список вариантов ответа        -->
                <transition-group name="list">
                  <div
                    v-for="(answer, index) in newQuestion.value_type_answer"
                    :key="index"
                    class="question_main_wrapper__item"
                  >
                    <TextAreaStyled
                      :append-icon="
                        answer.showComentary
                          ? 'mdi-menu-right'
                          : 'mdi-menu-down'
                      "
                      :class="{ inputFocused: answer.focused }"
                      :data="answer.answer"
                      :index-array="index"
                      :is-flat="true"
                      :is-solo="true"
                      :multi-line="true"
                      :placeholder="'Значение'"
                      :prepend-icon="'mdi-message-reply-outline'"
                      :rows-count="'1'"
                      class="question_main_wrapper__item__value"
                      @update-input="setSubAnswer"
                      @on-focus="
                        () => {
                          onFocus(newQuestion.id_type_answer, answer.id);
                        }
                      "
                      @out-focus="
                        () => {
                          outFocus(newQuestion.id_type_answer, answer.id);
                        }
                      "
                      @click:append="
                        answer.showComentary = !answer.showComentary
                      "
                    ></TextAreaStyled>
                    <template v-if="answer.showComentary">
                      <div class="divider"></div>
                      <TextAreaStyled
                        :class="{ inputFocused: answer.focused }"
                        :data="answer.commentary"
                        :index-array="index"
                        :is-flat="true"
                        :is-solo="true"
                        :multi-line="true"
                        :placeholder="'Примечание'"
                        :prepend-icon="'mdi-help-circle-outline'"
                        :rows-count="'1'"
                        class="question_main_wrapper__item__description"
                        @update-input="setSubCommentary"
                        @on-focus="
                          () => {
                            onFocus(newQuestion.id_type_answer, answer.id);
                          }
                        "
                        @out-focus="
                          () => {
                            outFocus(newQuestion.id_type_answer, answer.id);
                          }
                        "
                      ></TextAreaStyled>
                      <div class="divider"></div>
                      <!-- ENVIRONMENTS -->
                      <EnvironmentsSelector
                        :dataEnv.sync="answer.dataEnv"
                        :flat="true"
                        :flatFocused="answer.focused"
                        @onFocus="
                          onFocusFrom;
                          onFocus(newQuestion.id_type_answer, answer.id);
                        "
                        @outFocus="
                          outFocusFrom;
                          onFocus(newQuestion.id_type_answer, answer.id);
                        "
                        @selectedEnvironment="setEnvironment"
                      />
                    </template>
                  </div>
                </transition-group>
              </div>

              <!--      Блок с ренджами (диапозоны чисел)        -->
              <div
                v-else
                :class="{ rangeError: rangeError }"
                class="question_main_wrapper"
              >
                <transition-group name="list">
                  <div
                    v-for="(answer, index) in newQuestion.value_type_answer"
                    :key="index"
                    class="question_main_wrapper__item"
                  >
                    <InputStyled
                      :class="{ inputFocused: answer.focused }"
                      :data="answer.answer"
                      :index-array="index"
                      :is-flat="true"
                      :is-solo="true"
                      :placeholder="answer.placeholder"
                      :type-data="'number'"
                      class="question_main_wrapper__item__value"
                      @update-input="setAnswer"
                      @on-focus="
                        () => {
                          onFocus(newQuestion.id_type_answer, answer.id);
                        }
                      "
                      @out-focus="
                        () => {
                          outFocus(newQuestion.id_type_answer, answer.id);
                        }
                      "
                    >
                      <template slot="prepend-inner">
                        <v-icon
                          :color="answer.focused ? 'black' : ''"
                          small
                          @click="rangeEdit('minus', answer)"
                        >
                          mdi-minus
                        </v-icon>
                      </template>
                      <template slot="append">
                        <v-icon
                          :color="answer.focused ? 'black' : ''"
                          small
                          @click="rangeEdit('plus', answer)"
                        >
                          mdi-plus
                        </v-icon>
                      </template>
                    </InputStyled>
                  </div>
                </transition-group>
              </div>

              <small v-if="rangeError" style="color: lightcoral">
                Неккоректные значения
              </small>
            </template>
          </div>

          <!-- ENVIRONMENTS -->
          <div v-if="showEnv" class="question_main">
            <div class="question_main_selector">
              <span
                :class="{ focused: envFocused }"
                class="question_main_selector__title"
              >
                Переменные окружения
              </span>
              <EnvironmentsSelector
                :dataEnv.sync="newQuestion.value_type_answer[0].dataEnv"
                @onFocus="onFocusFrom"
                @outFocus="outFocusFrom"
                @selectedEnvironment="setEnvironment"
              />
            </div>
          </div>

          <!-- AGENTS -->
          <div class="question_main">
            <div class="question_main_selector">
              <span
                :class="{ focused: agentFocused }"
                class="question_main_selector__title"
              >
                Агенты
              </span>
              <AgentList @onFocus="onFocusFrom" @outFocus="outFocusFrom" />
            </div>
          </div>
        </div>

        <!-- LOADER -->
        <v-overlay
          :absolute="true"
          :value="$store.state.QuestionsModule.loadingQuestion"
          :z-index="2"
        >
          <v-progress-circular
            v-if="$store.state.QuestionsModule.loadingQuestion"
            :indeterminate="true"
            :size="70"
            color="blue"
            style="margin: auto"
            width="4"
          ></v-progress-circular>
        </v-overlay>
      </v-form>

      <!--  MODALS  -->
      <v-dialog v-model="deleteModal" max-width="600">
        <v-card>
          <v-card-title>
            <span class="text-h6" style="font-size: 0.8em !important"
              >Вы точно хотите удалить вопрос?</span
            >
          </v-card-title>
          <v-card-actions>
            <v-btn
              :disabled="$store.state.QuestionsModule.loadingRequest"
              :loading="$store.state.QuestionsModule.loadingRequest"
              color="blue darken-1"
              text
              @click="deleteModal = false"
            >
              Нет
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="$store.state.QuestionsModule.loadingRequest"
              :loading="$store.state.QuestionsModule.loadingRequest"
              color="red darken-1"
              text
              @click="deleteQuestion()"
            >
              Да
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-dialog v-model="stateDropzone" max-width="600">
        <v-card>
          <v-card-title>
            <span v-if="dropzone_uploaded.length === 0" class="text-h7"
              >Загрузите изображение</span
            >
            <span v-else class="text-h7">Изображение уже загружено</span>
          </v-card-title>
          <v-card-text class="dialog_dropzone">
            <div
              v-show="dropzone_uploaded.length === 0"
              class="dialog_dropzone_wrapper"
            >
              <vue-dropzone
                id="dropzone"
                ref="QuestionDropZone"
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
            </div>
            <template>
              <div
                v-for="(item, index) in dropzone_uploaded"
                :key="index"
                class="dialog_dropzone_inputs"
              >
                <v-img
                  :src="item.full_path"
                  class="main_img"
                  contain
                  max-width="300px"
                ></v-img>
                <span class="dialog_dropzone_inputs__label mb-5">
                  {{ item.filename }}</span
                >
                <TextAreaStyled
                  :data="item.alt_image"
                  :index-array="index"
                  :is-disabled="$store.state.loadingRequestGeneral"
                  :is-loading="$store.state.loadingRequestGeneral"
                  :placeholder="'alt-наименование изображения'"
                  @update-input="setAltImage"
                />
                <section class="mb-5" />
                <TextAreaStyled
                  :data="item.title_image"
                  :index-array="index"
                  :is-disabled="$store.state.loadingRequestGeneral"
                  :is-loading="$store.state.loadingRequestGeneral"
                  :placeholder="'подпись изображения'"
                  @update-input="setTitleImage"
                />
              </div>
            </template>
          </v-card-text>
          <v-card-actions>
            <v-btn
              v-if="dropzone_uploaded.length"
              :disabled="$store.state.loadingRequestGeneral"
              :loading="$store.state.loadingRequestGeneral"
              color="blue darken-1"
              text
              @click="removedFile()"
            >
              Очистить
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="$store.state.loadingRequestGeneral"
              :loading="$store.state.loadingRequestGeneral"
              color="green darken-1"
              text
              @click="
                stateDropzone = false;
                updateDropZoneImage();
              "
            >
              Готово
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!--  SNACKBAR -->
      <v-snackbar v-model="snackbar" :vertical="true" timeout="-1">
        <template v-if="snackbarValue === 0">
          <p>Выбор одиночного тэга, используется:</p>
          <ul>
            <li>pdf файл ТЗ - вопросы ответы</li>
            <li>страница объекта - “Предпочтения” и “Вложенные документы”</li>
          </ul>
        </template>
        <template v-if="snackbarValue === 1">
          <p>Используется везде</p>
        </template>
        <template v-slot:action="{ attrs }">
          <v-btn color="red" text v-bind="attrs" @click="snackbar = false">
            Закрыть
          </v-btn>
        </template>
      </v-snackbar>
    </div>
    <footer class="detail_footer">
      <template v-if="$route.params.action === 'create'">
        <v-btn color="red darken-1" text @click="resetFields"> Очистить</v-btn>
        <v-btn
          :disabled="computedValidations"
          color="blue darken-1"
          text
          @click.prevent="onSubmit"
        >
          Создать
        </v-btn>
      </template>
      <template v-else>
        <template
          v-if="
            Object.keys(this.$store.state.QuestionsModule.nonEditState).length
          "
        >
          <v-btn color="red darken-1" text @click="deleteModal = true">
            Удалить
          </v-btn>
          <v-btn color="blue darken-1" text @click.prevent="saveDifferences()">
            Сохранить изменения
          </v-btn>
        </template>
      </template>
    </footer>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";

import { mapGetters } from "vuex";

import QuestionTags from "./QuestionTags";
import AgentList from "./AgentList";
import EnvironmentsSelector from "../environments/environmentsSelector";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";

import {
  AnswerRangeMax,
  AnswerRangeMin,
  AnswerVariable,
  MToMTags,
  MToMTagsTechTask,
} from "../../helpers/constructors";
import InputStyled from "../common/InputStyled";
import TextAreaStyled from "../common/TextAreaStyled";
import Request from "../../services/request";
import UniversalTags from "../UniversalTags";
import IconTooltip from "@/components/common/IconTooltip.vue";

/* INDEXEDDB */
const DB_NAME = "questionDB";
const STORAGE_NAME = "question";
const DB_VERSION = 1;
let DB;

export default {
  name: "CreateQuestion",
  components: {
    IconTooltip,
    UniversalTags,
    TextAreaStyled,
    InputStyled,
    EnvironmentsSelector,
    AgentList,
    QuestionTags,
    vueDropzone: vue2Dropzone,
  },
  validations: {
    newQuestion: {
      name: {
        value: { required },
      },
      // purpose_of_question: {
      //   value: {required}
      // },
      // id_type_answer: {
      //   value: { required },
      // },
    },
    validationGroup: [
      "newQuestion.name.value",
      // "newQuestion.id_type_answer.value",
    ],
    // 'newQuestion.purpose_of_question.value'
  },
  data: () => ({
    /** Для селектора справочника **/
    /** @property {Null, Object} - выбранный справочник для автозаполнения **/
    selectedDictionary: null,
    /** @property {Boolean} - св-во для лоадера списка справочников **/
    loadingDictionaries: false,
    /** @property {Array} - список справочников **/
    dictionariesList: [],
    /** @property {Boolean} - св-во активности для селектора **/
    dictionaryFocused: false,

    lastIdAnswer: 1,
    debounceTimeout: null,
    rangeError: false,
    agentFocused: false,
    envFocused: false,

    newQuestion: {
      id: 1,
      name: {
        value: "",
        focused: false,
      },
      title: {
        value: "",
        focused: false,
      },
      article: {
        value: "",
        focused: false,
      },
      purpose_of_question: {
        value: "",
        focused: false,
      },
      id_type_answer: {
        value: null,
        focused: false,
      },
      agent: {
        value: null,
        focused: false,
      },
      state_detailed_response: 0,
      state_attachment_response: 0,
      state_allow_attachments: 1,
      value_type_answer: "",
      _all_tags: [],
      mtomtags: [],
      activity: 1,
      name_param_env: "",
      question_image_helper: null,
    },
    deleteModal: false,
    deleteStorage: false,
    snackbar: false,
    snackbarValue: 0,

    stateDropzone: false,
    dropzone_uploaded: [],
  }),
  mounted() {
    this.initializeQuery();
    this.initializeStorage();
    this.getTypes();
    this.getDb();
    if (!this.deleteStorage) {
      if (this.$route.params?.action === "create") {
        this.getDBQuestion();
      }
    }
    if (this.$route.params?.action === "create") {
      this.$store.commit("clear_new_question");
    }

    /** Получаем список справочников **/
    this.getDictionaries();
  },
  watch: {
    "newQuestion.value_type_answer": {
      handler(oldValue, newValue) {
        if (Array.isArray(this.newQuestion.value_type_answer)) {
          if (
            this.newQuestion.id_type_answer.value !== 6 &&
            this.newQuestion.id_type_answer.value !== 7
          ) {
            if (
              this.newQuestion.value_type_answer[
                this.newQuestion.value_type_answer.length - 1
              ]?.answer
            ) {
              this.addVariable();
            } else if (
              this.newQuestion.value_type_answer[
                this.newQuestion.value_type_answer.length - 2
              ]?.answer === "" &&
              this.newQuestion.value_type_answer[
                this.newQuestion.value_type_answer.length - 2
              ]?.commentary === ""
            ) {
              this.newQuestion.value_type_answer.splice(
                this.newQuestion.value_type_answer.length - 1,
                1
              );
            }
          } else {
            if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
              this.rangeError =
                parseInt(this.newQuestion.value_type_answer[0].answer) >
                parseInt(this.newQuestion.value_type_answer[1].answer);
            }, 500);
          }
        }

        this.$store.dispatch(
          "setTitle",
          this.$store.state.QuestionsModule.newQuestion.name.value
        );
      },
      deep: true,
    },
    "$store.state.QuestionsModule.newQuestion._all_tags": {
      handler() {
        this.newQuestion._all_tags =
          this.$store.state.QuestionsModule.newQuestion._all_tags;
        this.saveDBQuestion(this.newQuestion);
        // this.onChange()
      },
      deep: true,
    },
    "$store.state.QuestionsModule.newQuestion.question_image_helper": {
      handler(newValue) {
        this.dropzone_uploaded = [];
        if (this.$route.params.action !== "create") {
          this.dropzone_uploaded.push(newValue);
        }
      },
    },
  },
  computed: {
    ...mapGetters(["getListTypesOfQuestions"]),
    computedValidations() {
      return (
        (!this.newQuestion.name.value &&
          this.$v.newQuestion.name.$dirty &&
          !this.$v.newQuestion.name.required) ||
        // (!this.newQuestion.purpose_of_question.value && this.$v.newQuestion.purpose_of_question.$dirty && !this.$v.newQuestion.purpose_of_question.required) ||
        // (!this.newQuestion.id_type_answer.value &&
        //   this.$v.newQuestion.id_type_answer.$dirty &&
        //   !this.$v.newQuestion.id_type_answer.required) ||
        this.rangeError
      );
    },
    showEnv() {
      if (
        !this.newQuestion.value_type_answer ||
        !this.newQuestion.value_type_answer.length
      )
        return false;
      return (
        (this.newQuestion.id_type_answer.value === 1 ||
          this.newQuestion.id_type_answer.value === 2 ||
          this.newQuestion.id_type_answer.value === 6 ||
          this.newQuestion.id_type_answer.value === 7) &&
        !!this.newQuestion.id_type_answer.value
      );
    },
    stateAllowAttachments: {
      get() {
        return +this.newQuestion.state_allow_attachments;
      },
      set(val) {
        val = +val; // преобразуем в число
        this.newQuestion.state_allow_attachments = val;
        if (!val) {
          this.newQuestion.state_attachment_response = 0;
        }
      },
    },
    options() {
      return {
        url: this.$store.state.BASE_URL + "/entity/files",
        destroyDropzone: false,
        duplicateCheck: true,
        headers: {
          Authorization: this.$store.getters.getToken,
        },
      };
    },
  },
  methods: {
    /** Функции работы с тэгами **/
    /** @function - получаем с emit'a данные по новому тэгу и отправляем запрос на создание связки тэг-вопрос
     *  @param data {Object} - данные по выбранному тэгу **/
    async createNewTag(data) {
      /** Если id еще нет, то не записываем в БД **/
      if (!this.$route.query.question_id) {
        return;
      }

      /** Делаем структуру под нужную нам **/
      const objMToMTags = new MToMTags(
        data.id,
        null,
        parseInt(this.$route.query.question_id),
        null,
        null
      );

      /** Запрос на добавление связки тэга **/
      const response = await this.$store.dispatch(
        "addUniversalTagMToMTable",
        objMToMTags
      );

      /** Рефрешим информацию по вопросу, чтобы получить актуальные тэги **/
      if (response.codeResponse < 400) {
        await this.$store.dispatch(
          "getDetailQuestion",
          this.$route.query.question_id
        );
        this.$refs["universal-tags"].modal.state = false;
      }
    },
    /** @function - получаем с emit'a данные по удаляемому тэгу и отправляем запрос на удаление тэга из вопроса
     *  @param data {Object} - данные по удаляемому тэгу **/
    async removeAttachedTag(data) {
      /** Если id еще нет, то не записываем в БД **/
      if (!this.$route.query.question_id) {
        return;
      }

      /** Запрос на удаление связки тэга **/
      const response = await this.$store.dispatch(
        "removeAttachedTagMToMTable",
        data.id
      );

      /** Рефрешим информацию по вопросу, чтобы получить актуальные тэги **/
      if (response.codeResponse < 400) {
        await this.$store.dispatch(
          "getDetailQuestion",
          this.$route.query.question_id
        );
      }
    },
    /** @function - получаем с emit'a данные по новому тех-тэгу и отправляем запрос на создание связки тэг-вопрос
     *  @param data {Object} - данные по выбранному тех-тэгу **/
    async createNewTagTechTask(data) {
      /** Если id еще нет, то не записываем в БД **/
      if (!this.$route.query.question_id) {
        return;
      }

      /** Делаем структуру под нужную нам **/
      const objMToMTags = new MToMTagsTechTask(
        data.id,
        this.$route.query.question_id,
        null
      );

      /** Запрос на добавление связки тэга **/
      const response = await this.$store.dispatch(
        "addUniversalMToMTagsTechTaskTable",
        objMToMTags
      );

      /** Рефрешим информацию по вопросу, чтобы получить актуальные тэги **/
      if (response.codeResponse < 400) {
        await this.$store.dispatch(
          "getDetailQuestion",
          this.$route.query.question_id
        );
        this.$refs["universal-tags-tech-task"].modal.state = false;
      }
    },
    /** @function - получаем с emit'a данные по удаляемому тех-тэгу и отправляем запрос на удаление тэга из вопроса
     *  @param data {Object} - данные по удаляемому тех-тэгу **/
    async removeAttachedTagTechTask(data) {
      /** Если id еще нет, то не записываем в БД **/
      if (!this.$route.query.question_id) {
        return;
      }

      /** Запрос на удаление связки тэга **/
      const response = await this.$store.dispatch(
        "removeAttachedMToMTagsTechTaskTable",
        data.id
      );

      /** Рефрешим информацию по вопросу, чтобы получить актуальные тэги **/
      if (response.codeResponse < 400) {
        await this.$store.dispatch(
          "getDetailQuestion",
          this.$route.query.question_id
        );
      }
    },

    /** Блок выбора справочника для автозаполнения ответов **/
    /** @function - Проставляем варианты ответа в зависимости от выбранного справочника **/
    /** @param data {Object, null} - выбранный справочник в селекторе **/
    setDictionary(data) {
      if (!data) {
        this.$set(this.newQuestion, "value_type_answer", []);
        return;
      }

      if (
        !data?.d_dictionary_attributes ||
        !data?.d_dictionary_attributes?.length
      ) {
        this.$set(this.newQuestion, "value_type_answer", []);
        return;
      }

      const result = data.d_dictionary_attributes.map((elem, index) => {
        return {
          id: index,
          answer: elem.value,
          commentary: "",
          showComentary: true,
          focused: false,
          dataEnv: null,
        };
      });

      this.$set(this.newQuestion, "value_type_answer", result);
    },
    /** @function - Получаем список справочников **/
    async getDictionaries() {
      const selects = ["*", "d_dictionary_attributes"];
      const query = Request.modifyQuery([], selects);
      const { data } = await Request.get(
        this.$store.state.BASE_URL + "/dictionary/dictionaries" + query
      );
      /** Проставляем только те справочники у которых есть параметры для заполнения **/
      this.dictionariesList = data.filter(
        (dict) =>
          dict.d_dictionary_attributes && dict.d_dictionary_attributes.length
      );
    },

    setAnswer(data) {
      this.newQuestion.value_type_answer[data.index].answer = data.value;
      this.saveDBQuestion(this.newQuestion);
    },
    setName(value) {
      this.newQuestion.name.value = value;
      this.saveDBQuestion(this.newQuestion);
    },
    setTitle(value) {
      this.newQuestion.title.value = value;
      this.saveDBQuestion(this.newQuestion);
    },
    setArticle(value) {
      this.newQuestion.article.value = value;
      this.saveDBQuestion(this.newQuestion);
    },
    setPurpose(value) {
      this.newQuestion.purpose_of_question.value = value;
      this.saveDBQuestion(this.newQuestion);
    },
    setSubAnswer(data) {
      this.newQuestion.value_type_answer[data.index].answer = data.value;
      this.saveDBQuestion(this.newQuestion);
    },
    setSubCommentary(data) {
      this.newQuestion.value_type_answer[data.index].commentary = data.value;
      this.saveDBQuestion(this.newQuestion);
    },

    /* ENV */
    setEnvironment() {
      this.saveDBQuestion(this.newQuestion);
    },
    restoreDataEnv() {
      this.$nextTick(() => {
        if (
          this.newQuestion.value_type_answer &&
          this.newQuestion.value_type_answer.length
        ) {
          this.newQuestion.value_type_answer.forEach((elem) => {
            elem?.dataEnv ? "" : (elem.dataEnv = null);
          });
        } else {
          this.addVariable();
        }
      });
    },

    /* indexedDB */
    async getDb() {
      return new Promise((resolve, reject) => {
        if (DB) {
          return resolve(DB);
        }
        const request = window.indexedDB.open(DB_NAME, DB_VERSION);
        request.onerror = (e) => {
          console.log("Error opening db", e);
          reject("Error");
        };
        request.onsuccess = (e) => {
          DB = e.target.result;
          resolve(DB);
        };
        request.onupgradeneeded = (e) => {
          let db = e.target.result;
          db.createObjectStore(STORAGE_NAME, {
            autoIncrement: true,
            keyPath: "id",
          });
        };
      });
    },
    async deleteDBQuestion(value) {
      const db = await this.getDb();
      return new Promise((resolve) => {
        const trans = db.transaction([STORAGE_NAME], "readwrite");
        trans.oncomplete = () => {
          resolve();
        };
        const store = trans.objectStore(STORAGE_NAME);
        store.delete(value.id);
      });
    },
    async getDBQuestion() {
      if (!this.deleteStorage) {
        if (this.$route.params?.action === "create") {
          let db = await this.getDb();
          return new Promise((resolve) => {
            let trans = db.transaction([STORAGE_NAME], "readonly");
            trans.oncomplete = () => {
              resolve(question);
            };
            const store = trans.objectStore(STORAGE_NAME);
            const question = [];
            store.openCursor().onsuccess = (e) => {
              const cursor = e.target.result;
              if (cursor) {
                question.push(cursor.value);
                cursor.continue();
                this.newQuestion = question[0];
                this.lastIdAnswer = this.newQuestion.value_type_answer.length;
                this.$store.state.QuestionsModule.newQuestion._all_tags =
                  this.newQuestion._all_tags;
              }
            };
          });
        }
      }
    },
    async saveDBQuestion(value) {
      const refactored = {};
      for (let key in value) {
        if (typeof value[key] === "object" && value[key] !== null) {
          if (Array.isArray(value[key])) {
            refactored[key] = value[key];
          } else {
            refactored[key] = {};
            refactored[key].value = value[key].value;
            refactored[key].focused = false;
          }
        } else {
          if (key === "value_type_answer") {
            refactored[key] = value[key];
          } else if (key === "id") {
            refactored[key] = value[key];
          } else refactored[key] = value[key];
        }
      }
      if (!this.deleteStorage) {
        if (this.$route.params?.action === "create") {
          let db = await this.getDb();
          return new Promise((resolve) => {
            let trans = db.transaction([STORAGE_NAME], "readwrite");
            trans.oncomplete = () => {
              resolve();
            };
            let store = trans.objectStore(STORAGE_NAME);
            store.put(refactored);
          });
        }
      }
    },

    /* MAIN SCRIPT */
    initializeQuery() {
      if (
        Object.keys(this.$route.query).length &&
        Object.keys(this.$route.query).includes("question_id")
      ) {
        this.$store
          .dispatch("getDetailQuestion", this.$route.query.question_id)
          .then(() => {
            if (this.$store.state.QuestionsModule.newQuestion.name) {
              this.newQuestion = this.$store.state.QuestionsModule.newQuestion;
              this.restoreDataEnv();
              this.$store.commit("change_cur_num", this.newQuestion.id);
              if (
                Array.isArray(
                  this.$store.state.QuestionsModule.newQuestion
                    .value_type_answer
                )
              ) {
                this.lastIdAnswer =
                  this.$store.state.QuestionsModule.newQuestion.value_type_answer.length;
              }
            }
          });
      }
    },
    initializeStorage() {
      if (
        Object.keys(this.$route.params).length &&
        Object.keys(this.$route.params).includes("action")
      ) {
        if (this.$route.params.action === "create") {
          if (localStorage.getItem("question") !== null) {
            this.$store.dispatch("getFromLocalStorage").then(() => {
              this.newQuestion = this.$store.state.QuestionsModule.newQuestion;
              this.onChange();
            });
          }
        }
      }
    },
    getTypes() {
      this.$store.dispatch("setListTypesQuestions");
    },
    onSelect() {
      this.lastIdAnswer = 1;
      if (
        this.newQuestion.id_type_answer.value === 6 ||
        this.newQuestion.id_type_answer.value === 7
      ) {
        this.newQuestion.value_type_answer = [];
        this.newQuestion.value_type_answer.push(
          new AnswerRangeMin(this.lastIdAnswer)
        );
        this.lastIdAnswer++;
        this.newQuestion.value_type_answer.push(
          new AnswerRangeMax(this.lastIdAnswer)
        );
        //  if (this.newQuestion.id_type_answer.value !== 1 && this.newQuestion.id_type_answer.value !== 2)
      } else {
        this.newQuestion.value_type_answer = [];
        this.newQuestion.value_type_answer.push(
          new AnswerVariable(this.lastIdAnswer)
        );
      }

      /** Очищаем выбранный справочник **/
      this.selectedDictionary = null;
    },
    addVariable() {
      this.lastIdAnswer++;
      this.newQuestion.value_type_answer.push(
        new AnswerVariable(this.lastIdAnswer)
      );
    },
    onFocusFrom(value) {
      this[value] = true;
    },
    outFocusFrom(value) {
      this[value] = false;
    },
    onFocus(obj, id) {
      obj.focused = true;
      if (id) {
        let index = this.newQuestion.value_type_answer.findIndex((elem) => {
          return elem.id === id;
        });
        if (index !== -1) {
          this.newQuestion.value_type_answer[index].focused = true;
        }
      }
    },
    outFocus(obj, id) {
      obj.focused = false;
      if (id) {
        let index = this.newQuestion.value_type_answer.findIndex((elem) => {
          return elem.id === id;
        });
        if (index !== -1)
          this.newQuestion.value_type_answer[index].focused = false;
      }
    },
    resetFields() {
      this.deleteStorage = true;
      for (let key in this.newQuestion) {
        if (
          typeof this.newQuestion[key] === "object" &&
          this.newQuestion[key] !== null
        ) {
          if (Array.isArray(this.newQuestion[key])) {
            this.newQuestion[key] = [];
          } else this.newQuestion[key].value = "";
        } else {
          if (key === "value_type_answer") {
            this.newQuestion[key] = null;
          } else if (key === "id") {
            this.newQuestion[key] = 1;
          } else this.newQuestion[key] = 0;
        }
      }
      this.$store.state.QuestionsModule.newQuestion._all_tags = [];
      this.lastIdAnswer = 1;
      this.$store.dispatch("removeLocalStorage");
      this.deleteDBQuestion(this.newQuestion);
      setTimeout(() => {
        this.deleteStorage = false;
      }, 500);
    },
    async onSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }
      await this.deleteDBQuestion(this.newQuestion);
      const response = await this.$store.dispatch(
        "createQuestion",
        this.newQuestion
      );
      if (response.codeResponse >= 400) return;

      await this.$store.dispatch("removeLocalStorage");
      //устанавливаем нужные квери
      await this.$router.replace({
        params: { action: "edit" },
        query: { question_id: response.data.id },
      });
      //обновляем страницу с кверями
      await this.$router.go();
    },
    async saveDifferences() {
      await this.$store.dispatch("updateQuestion", this.newQuestion);
    },
    deleteQuestion() {
      this.$store.dispatch("deleteQuestion", this.newQuestion).then(() => {
        this.deleteModal = false;
        this.$router.push({
          path: "/questions",
        });
      });
    },
    onChange() {
      if (!this.deleteStorage) {
        if (this.$route.params?.action === "create") {
          this.$store.dispatch("setLocalStorage", this.newQuestion);
        }
      }
    },
    rangeEdit(action, answer) {
      if (action === "plus") {
        if (!answer.answer) {
          this.$nextTick(() => {
            answer.answer = 1;
          });
        } else {
          this.$nextTick(() => {
            answer.answer = parseInt(answer.answer) + 1;
          });
        }
      } else {
        if (!answer.answer) {
          this.$nextTick(() => {
            answer.answer = 0;
          });
        } else if (parseInt(answer.answer) > 0) {
          this.$nextTick(() => {
            answer.answer = parseInt(answer.answer) - 1;
          });
        } else
          this.$nextTick(() => {
            answer.answer = 0;
          });
      }
    },

    /* DROPZONE */
    insertDropzoneData() {
      if (!this.stateDropzone) return;
      if (!this.dropzone_uploaded.length) return;

      this.$nextTick(() => {
        this.$refs.QuestionDropZone.manuallyAddFile(
          this.dropzone_uploaded[0],
          this.dropzone_uploaded[0].full_path
        );
      });
    },
    sendingData(file, xhr, formData) {
      this.$store.state.loadingRequestGeneral = true;
      formData.append("uuid", file.upload.uuid);
      formData.append("id_question_image_helper", this.newQuestion.id);
    },
    successData(file, response) {
      const formatObj = Object.assign({}, response.data);
      this.dropzone_uploaded.push(formatObj);
      this.$store.state.loadingRequestGeneral = false;
    },
    async updateDropZoneImage() {
      if (!this.dropzone_uploaded.length) return;

      for (const item of this.dropzone_uploaded) {
        await Request.put(
          this.$store.state.BASE_URL + `/entity/files/${item.id}`,
          item
        );
      }
      await this.$store.dispatch("updateQuestion", this.newQuestion);
    },
    async removedFile() {
      for (const item of this.dropzone_uploaded) {
        await this.$store.dispatch("deleteFileGeneral", item.id);
      }
      this.dropzone_uploaded = [];
      this.$refs.QuestionDropZone.removeAllFiles();
    },
    setAltImage(data) {
      this.dropzone_uploaded[data.index].alt_image = data.value;
    },
    setTitleImage(data) {
      this.dropzone_uploaded[data.index].title_image = data.value;
    },
  },
  beforeDestroy() {
    this.$store.state.QuestionsModule.newQuestion._all_tags = [];
    this.$store.commit("reset_questions_tags");
    this.$store.commit("change_cur_num", 0);
  },
};
</script>

<style lang="scss" scoped>
@import "src/assets/styles/detail";
//@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400;600;700;900&display=swap');

.list-enter-active,
.list-leave-active {
  transition: all 0.8s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.question {
  padding: 10px;
  flex: 1;

  .form {
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    justify-content: space-between;
    height: 100%;

    .question_content {
      display: flex;
      flex-direction: column;
      row-gap: 5px;

      .question_title {
        &__name {
          margin-bottom: 7px !important;
          border-bottom: 2px solid #1976d2;
          border-radius: 0;
          color: #1976d2 !important;
          transition: all 0.6s ease-in-out;

          ::v-deep textarea {
            color: #1976d2 !important;
            font-size: 16px !important;
            font-weight: 600;
            letter-spacing: 0.6px;
          }

          ::v-deep textarea::placeholder {
            color: gray;
            font-size: 14px !important;
            font-weight: 400;
            letter-spacing: 0;
          }

          ::v-deep .v-input__append-inner {
            margin-top: 0 !important;
            align-self: unset;
          }

          ::v-deep textarea {
            min-height: 26px !important;
          }

          ::v-deep
            .v-text-field.v-text-field--solo.v-input--dense
            > .v-input__control {
            min-height: 26px !important;
          }
        }

        ::v-deep
          .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)
          > .v-input__control
          > .v-input__slot,
        .v-text-field.v-text-field--enclosed .v-text-field__details {
          padding: 0 !important;
        }

        ::v-deep .v-textarea textarea {
          color: gray;
          margin: 0 !important;
        }

        ::v-deep
          .v-text-field.v-text-field--solo.v-input--dense
          > .v-input__control {
          min-height: 26px;
        }

        ::v-deep .v-text-field input::placeholder {
          color: gray;
          font-size: 14px !important;
          font-weight: 400;
          letter-spacing: 0;
        }

        .question_title_help {
          display: flex;
          flex-direction: column;

          &__title {
            color: black;
            font-weight: 600;
            font-size: 15px;
            transition: color 0.25s ease-in-out;
          }

          &__description {
            color: lightgray;
            font-size: 13px;
            transition: color 0.6s ease-in-out;
          }

          ::v-deep .v-text-field__slot {
            min-height: 20px !important;
          }

          ::v-deep
            .v-text-field.v-text-field--solo.v-input--dense
            > .v-input__control {
            min-height: 20px !important;
          }

          ::v-deep textarea {
            line-height: 20px;
            font-weight: 500;
            min-height: 20px !important;
          }

          ::v-deep v-input {
            display: flex !important;
            align-items: center !important;
          }
        }
      }

      .question_main {
        padding-bottom: 7px;

        .question_main_selector {
          display: flex;
          flex-direction: column;
          row-gap: 5px;

          ::v-deep .v-input {
            font-size: 13px !important;
            font-weight: 500;
          }

          ::v-deep .v-text-field input {
            font-size: 14px !important;
          }

          &__title {
            color: #7e8d9a;
            font-weight: 600;
          }
        }

        .question_main_wrapper {
          border: 1px solid lightgray;
          border-radius: 5px;
          border-bottom: none;
          transition: all 0.8s ease-in-out;

          &__item {
            border-bottom: 1px solid lightgray;
            padding: 10px;

            &__value {
              font-size: 14px;

              ::v-deep textarea {
                color: #1976d2;
                transition: all 0.6s ease-in-out;
              }
            }

            ::v-deep .v-textarea.v-text-field--solo .v-input__control textarea {
              padding: 0 !important;
            }

            ::v-deep
              .v-text-field.v-text-field--enclosed:not(.v-text-field--rounded)
              > .v-input__control
              > .v-input__slot,
            .v-text-field.v-text-field--enclosed .v-text-field__details {
              padding: 0 6px !important;
            }

            &__description {
              font-size: 14px;

              ::v-deep textarea {
                color: darkgray;
                transition: color 0.6s ease-in-out;
              }

              &.inputFocused ::v-deep textarea {
                color: black !important;
              }
            }
          }
        }

        .rangeError {
          border: 1px solid lightcoral !important;

          .question_main_wrapper__item {
            border-bottom: unset;
          }

          ::v-deep input {
            color: lightcoral;
          }
        }
      }

      .question_settings {
        display: flex;
        flex-direction: column;
        row-gap: 10px;

        ::v-deep .v-input--selection-controls {
          padding: 0 !important;
          margin: 0 !important;
        }
      }
    }

    .question_footer {
      display: flex;
      justify-content: space-between;
    }
  }
}

.invalid {
  border-bottom: 2px solid lightcoral !important;
  border-radius: unset !important;
  color: lightcoral !important;

  ::v-deep .v-text-field input {
    color: lightcoral !important;
  }
}

.invalidSelector {
  ::v-deep fieldset {
    border-color: lightcoral !important;
  }
}

::v-deep .v-text-field {
  margin: 0 !important;
}

::v-deep
  .v-text-field
  > .v-input__control
  > .v-input__slot
  > .v-text-field__slot {
  margin-right: 0 !important;
}

.focused {
  color: #f7c325 !important;
}

.inputFocused {
  ::v-deep textarea {
    color: red !important;
  }

  ::v-deep input {
    color: black !important;
  }
}

::v-deep .v-dialog > .v-card > .v-card__title {
  justify-content: center;
}

/** Для селектора справочников **/
/** TODO: вынести в отдельный файл, используется в комп-те environmentsSelector.vue **/
.focused {
  ::v-deep textarea {
    color: black !important;
  }

  ::v-deep input {
    color: black !important;
  }
}

.innerSelector {
  font-size: 14px;

  ::v-deep textarea {
    color: darkgray;
    transition: color 0.6s ease-in-out;
  }

  ::v-deep input {
    color: darkgray;
    transition: color 0.6s ease-in-out;
  }
}
</style>
<style lang="scss">
.divider {
  border-bottom: 1px dashed;
  width: 30vw !important;
  //margin-left: 6px;
  margin: 5px 0 !important;
}
</style>
