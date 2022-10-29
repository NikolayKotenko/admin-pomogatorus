<template>
  <div class="detail_container">
    <div class="detail-wrapper">
      <v-form class="form" ref="form">
        <div class="detail-wrapper__content">
          <div class="detail-wrapper__content__title">
            <v-textarea
              class="detail-wrapper__content__title__name"
              dense
              hide-details
              placeholder="Введите наименование"
              v-model="newArticle.name.value"
              solo
              flat
              auto-grow
              rows="1"
              @focus="onFocus(newArticle.name)"
              @focusout="outFocus(newArticle.name)"
              :loading="$store.state.ArticleModule.loadingArticle"
              :class="{
                invalid:
                  !newArticle.name.value &&
                  $v.newArticle.name.$dirty &&
                  !$v.newArticle.name.required,
              }"
              @input="saveArticle(newArticle)"
            >
              <template slot="append">
                <v-icon
                  size="20"
                  class="detail-wrapper__content__title__name__icon"
                  :color="newArticle.name.focused ? 'primary' : ''"
                >
                  mdi-lead-pencil
                </v-icon>
              </template>
            </v-textarea>
            <small
              v-if="
                !newArticle.name.value &&
                $v.newArticle.name.$dirty &&
                !$v.newArticle.name.required
              "
              style="color: lightcoral"
            >
              Поле обязательно для заполнения
            </small>
            <div class="detail-wrapper__content__title__help">
              <span
                class="detail-wrapper__content__title__help__title"
                :class="{ focused: newArticle.short_header.focused }"
              >
                Короткое наименование
              </span>
              <v-textarea
                class="detail-wrapper__content__title__help__description"
                :class="{
                  inputFocused: newArticle.short_header.focused,
                  invalid:
                    !newArticle.short_header.value &&
                    $v.newArticle.short_header.$dirty &&
                    !$v.newArticle.short_header.required,
                }"
                placeholder="Введите короткое наименование"
                auto-grow
                rows="1"
                dense
                hide-details
                flat
                solo
                v-model="newArticle.short_header.value"
                @focus="onFocus(newArticle.short_header)"
                @focusout="outFocus(newArticle.short_header)"
                :loading="$store.state.ArticleModule.loadingArticle"
                @input="saveArticle(newArticle)"
              ></v-textarea>
              <small
                v-if="
                  !newArticle.short_header.value &&
                  $v.newArticle.short_header.$dirty &&
                  !$v.newArticle.short_header.required
                "
                style="color: lightcoral"
              >
                Поле обязательно для заполнения
              </small>
            </div>
            <div class="detail-wrapper__content__title__help">
              <span
                class="detail-wrapper__content__title__help__title"
                :class="{ focused: newArticle.purpose_of_article.focused }"
              >
                Цель статьи
              </span>
              <v-textarea
                class="detail-wrapper__content__title__help__description"
                :class="{ inputFocused: newArticle.purpose_of_article.focused }"
                placeholder="Введите цель статьи"
                auto-grow
                rows="1"
                dense
                hide-details
                flat
                solo
                v-model="newArticle.purpose_of_article.value"
                @focus="onFocus(newArticle.purpose_of_article)"
                @focusout="outFocus(newArticle.purpose_of_article)"
                :loading="$store.state.ArticleModule.loadingArticle"
                @input="saveArticle(newArticle)"
              ></v-textarea>
            </div>
            <div class="detail-wrapper__content__title__help">
              <span
                class="detail-wrapper__content__title__help__title"
                :class="{ focused: newArticle.preview.focused }"
              >
                Анонс
              </span>
              <v-textarea
                class="detail-wrapper__content__title__help__description"
                :class="{ inputFocused: newArticle.preview.focused }"
                placeholder="Введите анонс"
                auto-grow
                rows="1"
                dense
                hide-details
                flat
                solo
                v-model="newArticle.preview.value"
                @focus="onFocus(newArticle.preview)"
                @focusout="outFocus(newArticle.preview)"
                :loading="$store.state.ArticleModule.loadingArticle"
                @input="saveArticle(newArticle)"
              ></v-textarea>
            </div>
            <div class="detail-wrapper__content__title__help">
              <span
                class="detail-wrapper__content__title__help__title"
                :class="{ focused: newArticle.seo_description.focused }"
              >
                SEO-description
              </span>
              <v-textarea
                class="detail-wrapper__content__title__help__description"
                :class="{ inputFocused: newArticle.seo_description.focused }"
                placeholder="Введите SEO-описание для статьи"
                auto-grow
                rows="1"
                dense
                hide-details
                flat
                solo
                v-model="newArticle.seo_description.value"
                @focus="onFocus(newArticle.seo_description)"
                @focusout="outFocus(newArticle.seo_description)"
                :loading="$store.state.ArticleModule.loadingArticle"
                @input="saveArticle(newArticle)"
              ></v-textarea>
            </div>
            <div class="detail-wrapper__content__title__help">
              <span
                class="detail-wrapper__content__title__help__title"
                :class="{ focused: newArticle.seo_keywords.focused }"
              >
                SEO-keywords
              </span>
              <v-textarea
                class="detail-wrapper__content__title__help__description"
                :class="{ inputFocused: newArticle.seo_keywords.focused }"
                placeholder="Введите SEO ключевые слова для статьи"
                auto-grow
                rows="1"
                dense
                hide-details
                flat
                solo
                v-model="newArticle.seo_keywords.value"
                @focus="onFocus(newArticle.seo_keywords)"
                @focusout="outFocus(newArticle.seo_keywords)"
                :loading="$store.state.ArticleModule.loadingArticle"
                @input="saveArticle(newArticle)"
              ></v-textarea>
            </div>
            <div class="detail-wrapper__content__title__help">
              <v-checkbox
                v-model="newArticle.activity"
                label="Активность"
                false-value="0"
                true-value="1"
              ></v-checkbox>
            </div>
            <!-- DROPZONE -->
            <v-btn
                class="mb-5"
                :disabled="$store.state.ArticleModule.loadingArticle"
                @click="stateDropzone = true; insertDropzoneData()"
            >
              Изображение
              <v-icon color="grey lighten-1"  style="transform: rotate(45deg)">mdi-paperclip</v-icon>
              [{{ dropzone_uploaded.length }}]
            </v-btn>
            <v-dialog
                v-model="stateDropzone"
                max-width="600"
            >
              <v-card>
                <v-card-title>
                  <span class="text-h7" v-if="dropzone_uploaded.length === 0">Загрузите изображение</span>
                  <span class="text-h7" v-else>Изображение уже загружено</span>
                </v-card-title>
                <v-card-text class="dialog_dropzone">
                  <div class="dialog_dropzone_wrapper" v-show="dropzone_uploaded.length === 0">
                    <vue-dropzone
                        ref="TagDropZone"
                        id="dropzone"
                        :options="options"
                        :useCustomSlot=true
                        @vdropzone-success="successData"
                        @vdropzone-sending="sendingData"
                    >
                      <h3 class="dropzone-custom-title">
                        <v-icon size="120" color="grey lighten-1" style="transform: rotate(45deg)">
                          mdi-paperclip
                        </v-icon>
                      </h3>
                      <div class="subtitle" style="color: darkgrey">Для вставки изображения перетащите файл в зону или нажмите на скрепку</div>
                    </vue-dropzone>
                  </div>
                  <template>
                    <div class="dialog_dropzone_inputs" v-for="(item, index) in dropzone_uploaded" :key="index">
                      <v-img  max-width="300px" :src="$store.state.BASE_URL+item.full_path" contain></v-img>
                      <span class="dialog_dropzone_inputs__label"> {{ item.filename }}</span>
                      <v-text-field
                          :loading="$store.state.loadingRequestGeneral"
                          :disabled="$store.state.loadingRequestGeneral"
                          dense
                          hide-details
                          placeholder="alt-наименование изображения"
                          v-model="item.alt_image"
                      ></v-text-field>
                      <v-text-field
                          :loading="$store.state.loadingRequestGeneral"
                          :disabled="$store.state.loadingRequestGeneral"
                          dense
                          hide-details
                          placeholder="подпись изображения"
                          v-model="item.title_image"
                      ></v-text-field>
                    </div>
                  </template>
                </v-card-text>
                <v-card-actions>
                  <v-btn
                      color="blue darken-1"
                      text
                      @click="removedFile();"
                      :loading="$store.state.loadingRequestGeneral"
                      :disabled="$store.state.loadingRequestGeneral"
                      v-if="dropzone_uploaded.length"
                  >
                    Очистить
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                      color="green darken-1"
                      text
                      :loading="$store.state.loadingRequestGeneral"
                      :disabled="$store.state.loadingRequestGeneral"
                      @click="stateDropzone = false; updateDropZoneImage()"
                  >
                    Готово
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>

          <!-- TEXTAREA -->
          <text-redactor
            :newArticle="newArticle"
            :deletedContent="deletedContent"
            @saveArticle="initialSaveArticle"
          />

          <!-- Tags Component -->
          <question-tags />
        </div>
        <!-- LOADER -->
        <v-overlay
          :z-index="2"
          :absolute="true"
          :value="$store.state.ArticleModule.loadingArticle"
        >
          <v-progress-circular
            style="margin: auto"
            width="4"
            :size="70"
            color="blue"
            :indeterminate="true"
            v-if="$store.state.ArticleModule.loadingArticle"
          ></v-progress-circular>
        </v-overlay>
      </v-form>

      <!--  MODALS  -->
      <v-dialog v-model="deleteModal" max-width="600">
        <v-card>
          <v-card-title>
            <span class="text-h6" style="font-size: 0.8em !important"
              >Вы точно хотите удалить статью?</span
            >
          </v-card-title>
          <v-card-actions>
            <v-btn
              color="blue darken-1"
              text
              @click="deleteModal = false"
              :disabled="$store.state.ArticleModule.loadingRequest"
              :loading="$store.state.ArticleModule.loadingRequest"
            >
              Нет
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              color="red darken-1"
              text
              :disabled="$store.state.ArticleModule.loadingRequest"
              :loading="$store.state.ArticleModule.loadingRequest"
              @click="deleteArticle"
            >
              Да
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <footer class="detail_footer">
      <template v-if="$route.params.action === 'create'">
        <v-btn color="red darken-1" text @click="resetFields"> Очистить </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click.prevent="onSubmit('next')"
          :disabled="computedValidations"
        >
          Закончить работу
        </v-btn>
      </template>
      <template v-else>
        <template
          v-if="
            Object.keys(this.$store.state.ArticleModule.nonEditState).length
          "
        >
          <v-btn color="red darken-1" text @click="deleteModal = true">
            Удалить
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            @click.prevent="saveDifferences('next')"
          >
            Закончить работу
          </v-btn>
        </template>
      </template>
    </footer>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import TextRedactor from "./TextRedactor";
import QuestionTags from "../questions/QuestionTags";
import Request from "@/services/request";
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

/* INDEXEDDB */
const DB_NAME = "articlesDB";
const STORAGE_NAME = "article";
const DB_VERSION = 1;
let DB;

export default {
  name: "DetailArticles",
  components: {QuestionTags, TextRedactor, vueDropzone: vue2Dropzone},
  validations: {
    newArticle: {
      name: {
        value: { required },
      },
      short_header: {
        value: { required },
      },
    },
    validationGroup: ["newArticle.name.value", "newArticle.short_header.value"],
  },
  data: () => ({
    newArticle: {
      id: null,
      name: {
        value: "",
        focused: false,
      },
      short_header: {
        value: "",
        focused: false,
      },
      purpose_of_article: {
        value: "",
        focused: false,
      },
      preview: {
        value: "",
        focused: false,
      },
      seo_description: {
        value: "",
        focused: false,
      },
      seo_keywords: {
        value: "",
        focused: false,
      },
      activity: "0",
      _all_tags: [],
      mtomtags: [],
    },
    deleteModal: false,
    deleteStorage: false,
    deletedContent: false,
    debounceTimeout: null,
    getFromServer: false,

    stateDropzone: false,
    dropzone_uploaded: [],
  }),
  mounted() {
    // this.getDb()
    this.deletingDBArticle();
    this.initializeQuery();
    if (!this.deleteStorage) {
      if (this.$route.params?.action === "create") {
        // this.getDBQuestion()
      }
    }
  },
  watch: {
    "$store.state.ArticleModule.newArticle.id": {
      handler(v) {
        this.newArticle.id = v;
      },
    },
    "$store.state.ArticleModule.content": {
      handler() {
        this.$store.dispatch('setTitle', this.$store.state.ArticleModule.newArticle.name.value)
        this.saveArticle(this.newArticle)
      }
    },
    "$store.state.ArticleModule.newArticle._all_tags": {
      handler() {
        this.newArticle._all_tags =
          this.$store.state.ArticleModule.newArticle._all_tags;
        this.saveArticle(this.newArticle);
      },
    },
    '$store.state.ArticleModule.newArticle.e_client_files':{
      handler(newValue) {
        this.dropzone_uploaded = [];
        if (this.$route.params.action !== 'create') {
          this.dropzone_uploaded = newValue;
        }
      }
    }
  },
  computed: {
    computedValidations() {
      return (
        (!this.newArticle.name.value &&
          this.$v.newArticle.name.$dirty &&
          !this.$v.newArticle.name.required) ||
        (!this.newArticle.short_header.value &&
          this.$v.newArticle.short_header.$dirty &&
          !this.$v.newArticle.short_header.required)
      );
    },
    check_short_name() {
      return (
        this.newArticle.name.value !== "" &&
        this.newArticle.short_header.value !== "" &&
        this.newArticle.id === null
      );
    },
    options() {
      return {
        url: this.$store.state.BASE_URL+'/entity/files',
        // url: 'https://httpbin.org/post',
        destroyDropzone: false,
        duplicateCheck: true,
        headers: {
          "My-Awesome-Header": "header value",
          Authorization: '666777',
        },
      }
    },
  },
  methods: {
    /* MAIN */
    initializeQuery() {
      if (
        Object.keys(this.$route.query).length &&
        Object.keys(this.$route.query).includes("article_id")
      ) {
        this.getFromServer = true;
        this.$store
          .dispatch("getDetailArticle", this.$route.query.article_id)
          .then(() => {
            if (this.$store.state.ArticleModule.newArticle.name) {
              this.newArticle = this.$store.state.ArticleModule.newArticle;
              this.$store.commit("change_cur_num", this.newArticle.id);
              setTimeout(() => {
                this.getFromServer = false;
              }, 2000);
            }
          });
      }
    },
    resetFields() {
      this.deleteStorage = true;
      for (let key in this.newArticle) {
        if (
          typeof this.newArticle[key] === "object" &&
          this.newArticle[key] !== null
        ) {
          if (Array.isArray(this.newArticle[key])) {
            this.newArticle[key] = [];
          } else this.newArticle[key].value = "";
        } else {
          if (key === "value_type_answer") {
            this.newArticle[key] = null;
          } else if (key === "id") {
            this.newArticle[key] = 1;
          } else this.newArticle[key] = 0;
        }
      }
      this.deletedContent = true;

      this.$store.state.ArticleModule.inserted_components = [];
      this.$store.commit("change_counter", { name: "layout", count: 0 });
      this.$store.state.ArticleModule.newArticle._all_tags = [];
      this.$store.dispatch("removeLocalStorageArticle");
      this.deleteDBQuestion(this.newArticle);
      setTimeout(() => {
        this.deleteStorage = false;
        this.deletedContent = false;
      }, 500);
    },
    saveDifferences(action) {
      this.$store.dispatch("updateArticle", this.newArticle).then(() => {
        if (action === "next") {
          this.$router.push({
            path: "/articles",
          });
        }
      });
    },
    deleteArticle() {
      this.$store.dispatch("deleteArticle", this.newArticle).then(() => {
        this.deleteModal = false;
        this.$router.push({
          path: "/articles",
        });
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
          // eslint-disable-next-line prefer-promise-reject-errors
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
    deletingDBArticle() {
      let req = indexedDB.deleteDatabase(DB_NAME);
      req.onsuccess = function () {
        console.log("Deleted database successfully");
      };
      req.onerror = function () {
        console.log("Couldn't delete database");
      };
      req.onblocked = function () {
        console.log(
          "Couldn't delete database due to the operation being blocked"
        );
      };
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
                this.$nextTick(() => {
                  this.newArticle = question[0];
                  this.$store.state.ArticleModule.content_from_server =
                    question[0].content;
                  this.$store.state.ArticleModule.inserted_components =
                    question[0].inserted_components;
                  this.$store.state.ArticleModule.newArticle._all_tags =
                    this.newArticle._all_tags;
                });
              }
            };
          });
        }
      }
    },
    initialSaveArticle() {
      this.saveArticle(this.newArticle);
    },
    async saveArticle() {
      if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
      this.debounceTimeout = setTimeout(() => {
        if (this.check_short_name) {
          this.onSubmit();
        } else if (this.newArticle.id !== null && !this.getFromServer) {
          this.saveDifferences();
        }
      }, 600);
    },

    /* FOCUS */
    onFocus(obj, id) {
      obj.focused = true;
      if (id) {
        let index = this.newArticle.value_type_answer.findIndex((elem) => {
          return elem.id === id;
        });
        if (index !== -1) {
          this.newArticle.value_type_answer[index].focused = true;
        }
      }
    },
    outFocus(obj, id) {
      obj.focused = false;
      if (id) {
        let index = this.newArticle.value_type_answer.findIndex((elem) => {
          return elem.id === id;
        });
        if (index !== -1)
          this.newArticle.value_type_answer[index].focused = false;
      }
    },

    /* CRUD */
    onSubmit(action) {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return;
      }

      if (action === "next") {
        this.$router.push({
          path: "/articles",
        });
      } else {
        this.$store.dispatch("createArticle", this.newArticle).then(() => {
          this.$store.commit("change_cur_num", this.newArticle.id);
          this.$store.dispatch("removeLocalStorageArticle");
        });
      }
    },

    /* DROPZONE */
    sendingData(file, xhr, formData) {
      this.$store.state.loadingRequestGeneral = true;
      formData.append('uuid', file.upload.uuid)
      formData.append('id_article', this.$store.state.ArticleModule.newArticle.id)
    },
    successData(file, response) {
      console.log('successData')
      console.log(response)
      const formatObj = Object.assign({}, response.data)
      this.dropzone_uploaded.push(formatObj)
      this.$store.state.loadingRequestGeneral = false;
    },
    async removedFile() {
      for (const item of this.dropzone_uploaded) {
        await this.$store.dispatch('deleteFileGeneral', item.id);
      }
      this.dropzone_uploaded = [];
      this.$refs.TagDropZone.removeAllFiles();
    },
    insertDropzoneData(){
      if (! this.stateDropzone) return;
      if (! this.dropzone_uploaded.length) return;

      this.$nextTick(() => {
        this.$refs.TagDropZone.manuallyAddFile(this.dropzone_uploaded[0], this.dropzone_uploaded[0].full_path)
      })
    },
    async updateDropZoneImage(){
      if (! this.dropzone_uploaded.length) return;

      for (const item of this.dropzone_uploaded) {
        await Request.put(this.$store.state.BASE_URL+'/entity/files/'+item.id, item)
      }
    }
  },
  beforeDestroy() {
    this.$store.state.ArticleModule.newArticle._all_tags = [];
    this.$store.commit("change_cur_num", 0);
  },
};
</script>
<style scoped lang="scss">
@import "src/assets/styles/detail";

.list-enter-active,
.list-leave-active {
  transition: all 0.8s;
}

.list-enter,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}

.detail-wrapper {
  padding: 10px;
  flex: 1;

  .form {
    display: flex;
    flex-direction: column;
    row-gap: 5px;
    justify-content: space-between;
    height: 100%;

    .detail-wrapper__content {
      display: flex;
      flex-direction: column;
      row-gap: 5px;

      &__title {
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

        &__help {
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
    color: black !important;
  }
  ::v-deep input {
    color: black !important;
  }
}

::v-deep .v-dialog > .v-card > .v-card__title {
  justify-content: center;
}

.dialog_dropzone{
  display: grid;
  grid-row-gap: 1em;
}
</style>
