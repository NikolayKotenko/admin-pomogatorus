<template>
  <div
      :id="`component_wrapper-${index_component}`"
      :data-id="getIdImage"
      :data-src="shortPath"
      class="componentArticle_wrapper image_wrapper component_container no-padding"
      contenteditable="false"
      data-name="image"
  >
    <div
        class="componentArticle_wrapper__admin_controls-header"
        contenteditable="false"
    >
      <v-icon class="mr-1" color="yellow" small @click="openModal">mdi-pencil</v-icon>

      <CloseSVG
          alt="close"
          class="componentArticle_wrapper__admin_controls-header__img"
          @click="deleteImage"
      />
    </div>
    <img
        :alt="altName"
        :height="getHeight"
        :src="srcPath"
        :style="getStyle"
        :title="title"
        :width="getWidth"
        class="main_img inserted_image"
    />

    <!--  Модалка для изменения alt и title  -->
    <v-dialog
        v-model="isOpenModal"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important"
          >Изменение данных изображения</span
          >
        </v-card-title>
        <v-card-text class="dialog_dropzone">
          <v-form
              ref="form"
              v-model="isValid"
              class="dialog_dropzone_inputs"
          >
            <div class="dialog_dropzone_wrapper">
              <vue-dropzone
                  v-if="isDropzoneReady && isOpenModal"
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
            <div
                class="dialog_dropzone_inputs"
            >
              <InputStyled
                  :data="modalAlt"
                  :placeholder="'alt-наименование изображения'"
                  @update-input="setAlt"
              ></InputStyled>

              <InputStyled
                  :data="modalTitle"
                  :placeholder="'подпись изображения'"
                  @update-input="setTitle"
              ></InputStyled>

              <InputStyled
                  :current-rules="srcRule"
                  :data="modalSrc"
                  :placeholder="'src изображения'"
                  @update-input="setSrc"
              ></InputStyled>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-btn color="blue darken-1" text @click="closeModal">
            Назад
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              :disabled="!isValid"
              color="green darken-1"
              text
              @click="saveChanges
            "
          >
            Сохранить
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--  Уведомлялка об ошибке  -->
    <v-snackbar
        v-model="snackbar"
    >
      {{ snackbarText }}

      <template v-slot:action="{ attrs }">
        <v-btn
            color="red"
            text
            v-bind="attrs"
            @click="snackbar = false"
        >
          Закрыть
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import CloseSVG from "@/assets/svg/closeIcon.svg";
import InputStyled from "../common/InputStyled";
import Request from "@/services/request";
import Vue from "vue";
import PreviewTemplate from "../dropzone/PreviewTemplate";

export default {
  name: "ImageLayout",
  components: {
    InputStyled,
    CloseSVG,
    vueDropzone: vue2Dropzone,
  },
  data: () => ({
    /* DROPZONE */
    local_dropzone_data: null,
    isDropzoneReady: false,
    previewHtml: null,

    /* SNACKBAR */
    snackbarText: "",
    snackbar: false,

    width: 0,
    height: 0,
    x: 0,
    y: 0,
    index_component: null,
    index_image: null,
    data_image: null,
    dataForRerender: {},

    isOpenModal: false,
    modalAlt: "",
    modalTitle: "",
    modalSrc: "",
    srcRule: [
      v => !!v || 'Обязательно к заполнению',
      v => /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(v) || 'Ссылка на изображение должна быть валидной',
    ],
    isValid: true
  }),
  mounted() {
    this.getData();

    /** Прогружаем компонент с превью-изображением для дропзона **/
    const ComponentClass = Vue.extend(PreviewTemplate);
    const instance = new ComponentClass({
      props: {
        isShowDelete: false
      }
    });
    instance.$mount();
    this.previewHtml = instance.$el.outerHTML;
    this.isDropzoneReady = true;
  },
  computed: {
    shortPath() {
      if (!this.data_image || !this.data_image?.orig_path) return null;
      return this.data_image.orig_path;
    },
    srcPath() {
      return this.data_image?.orig_path;
    },
    altName: {
      get() {
        return this.data_image?.alt_image;
      },
      set(value) {
        this.data_image.alt_image = value
      },
    },
    title: {
      get() {
        return this.data_image?.title_image;
      },
      set(value) {
        this.data_image.title_image = value
      }
    },
    getIdImage() {
      return this.data_image?.id;
    },
    getWidth() {
      return this.data_image?.width ? `${this.data_image?.width}px` : "";
    },
    getHeight() {
      return this.data_image?.height ? `${this.data_image?.height}` : "";
    },
    getStyle() {
      return `width: ${this.getWidth}; height: ${this.getHeight}`
    },
    options() {
      return {
        url: this.$store.state.BASE_URL + "/entity/files",
        destroyDropzone: false,
        duplicateCheck: true,
        previewTemplate: this.previewHtml,
        headers: {
          Authorization: this.$store.getters.getToken,
        },
        uploadMultiple: false,
      };
    },
  },
  methods: {
    getData() {
      this.data_image = this.$store.state.ArticleModule.selectedComponent;
      this.dataForRerender = this.$store.state.ArticleModule.selectedComponent;
      this.index_image = this.$store.state.ArticleModule.counters.image;
      this.index_component = this.$store.state.ArticleModule.counters.layout;
      this.getHeightOfControls();
      this.getWidthOfControls();

      if (!this.data_image?.idArticle) {
        console.warn("Отсутствует id статьи!")
      }

      if (!this.data_image?.id && this.data_image?.idArticle) {
        this.uploadImageToServer()
      }
    },
    async deleteImage() {
      if (this.data_image.id) {
        await this.$store.dispatch('deleteFileGeneral', this.data_image.id); // Удаляем саму фотографию из хранилища
      }
      await this.$store.dispatch("deleteComponent", this.index_component);
    },
    async uploadImageToServer() {
      const ourHostUrls = [
        process.env.VUE_APP_BASEURL_DEV,
        process.env.VUE_APP_BASEURL_PROD
      ]

      if (ourHostUrls.some((url) => this.srcPath.includes(url))) {
        console.warn("Изображение уже загружено на наш сервер", this.srcPath)
        return
      }

      let blob = null
      try {
        const response = await fetch(this.srcPath);
        blob = await response.blob(); // Get the file data as a Blob
      } catch (e) {
        console.warn("Произошла ошибка при загрузке файла на сервер!", e.message)
        this.snackbarText = `Произошла ошибка при загрузке файла на сервер!: ${e.message}`
        this.snackbar = true
      }

      if (!blob) {
        return
      }

      const {data} = await this.$store.dispatch('uploadFileGeneral', {
        uuid: crypto.randomUUID(),
        id_article: this.data_image.idArticle,
        preview_image: 0,
        file: blob
      });

      this.data_image.orig_path = data.orig_path
      this.data_image.id = data.id
    },
    onResize: function (x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    },
    getWidthOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(
            `component_wrapper-${this.index_component}`
        );
        if (elem) {
          this.controls_width = elem.getBoundingClientRect().width + 6;
        } else {
          this.controls_width = 0;
        }
      });
    },
    getHeightOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(
            `component_wrapper-${this.index_component}`
        );
        if (elem) {
          this.controls_height = elem.getBoundingClientRect().height + 22;
        } else {
          this.controls_height = 0;
        }
      });
    },

    successData(file, response) {
      const formatObj = Object.assign({}, response.data);
      this.local_dropzone_data = formatObj
      this.modalSrc = formatObj.full_path
      this.modalTitle = formatObj.filename
      this.modalAlt = formatObj.filename
    },
    sendingData(file, xhr, formData) {
      formData.append("uuid", file.upload.uuid);
      formData.append("id_article", this.$store.state.ArticleModule.newArticle.id);
      formData.append("preview_image", 0);

      /**
       * Удаляем из HTML старый компонент с предыдущей фотографией
       * **/
      const previewImages = document.getElementsByClassName('preview-image-dropzone')
      if (previewImages.length) {
        previewImages[0].remove()
      }
    },
    triggerUpload() {
      document.getElementById("dropzone").click();
    },
    async updateDropZoneImage() {
      if (this.data_image.id) {
        await Request.put(
            this.$store.state.BASE_URL +
            "/entity/files/" +
            this.data_image.id,
            this.local_dropzone_data
        );
      }
    },
    /**
     * Отображаем в дропзоне нашу фотографию
     * **/
    insertDropzoneData() {
      this.$nextTick(() => {
        let file = {size: null, name: this.title, type: "image/png"};
        let url = this.modalSrc;

        this.$refs.myVueDropzone.manuallyAddFile(
            file,
            url
        );
      });
    },

    /**
     * Проставляем alt для фотки
     * **/
    setAlt(value) {
      this.modalAlt = value
    },
    /**
     * Проставляем title для фотки
     * **/
    setTitle(value) {
      this.modalTitle = value
    },
    /**
     * Проставляем src для фотки
     * **/
    setSrc(value) {
      this.modalSrc = value
    },
    /**
     * Открываем модалку и прокидываем в локальные переменные для модалки данные из статьи
     * **/
    openModal() {
      this.isOpenModal = true

      this.modalTitle = this.title
      this.modalAlt = this.altName
      this.modalSrc = this.srcPath

      /** Заставляем отобразиться фотку в дропзоне **/
      this.insertDropzoneData()
    },
    /**
     * Закрываем модалку
     * **/
    closeModal() {
      this.isOpenModal = false
    },
    /**
     * Сохраняем alt, src и title в переменную связанную с версткой картинки, и прокидываем мутацию в стор, чтобы сработал вотчер в текстовом редакторе
     * **/
    saveChanges() {
      this.altName = this.modalAlt
      this.title = this.modalTitle
      this.data_image.orig_path = this.modalSrc

      /** Обновляем данные по фотке в БД, и после этого сохраняем в текстовом редакторе **/
      this.updateDropZoneImage().then(() => {
        this.isOpenModal = false

        this.$store.commit("toggleSaveArticle")
      })
    }
  },
};
</script>

<style lang="scss" scoped>
@import "src/assets/styles/componentArticle";

.image_wrapper {
  min-height: 150px;
  min-width: 50px;
  max-width: 600px;
  position: relative;
  padding: 16px 10px 8px 10px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom: 1px solid rgba(83, 158, 224, 0);
  border-right: 1px solid rgba(83, 158, 224, 0);
  border-left: 1px solid rgba(83, 158, 224, 0);
  transition: all 0.4s ease-in-out;

  &:hover {
    //border: 1px solid rgba(83, 158, 224, 0.7);
    border-bottom: 1px solid rgba(83, 158, 224, 0.7);
    border-right: 1px solid rgba(83, 158, 224, 0.7);
    border-left: 1px solid rgba(83, 158, 224, 0.7);

    .componentArticle_wrapper__admin_controls-header {
      opacity: 1;
    }

    ::v-deep .vdr {
      border: 1px dashed rgba(0, 0, 0, 1);
    }

    ::v-deep .handle {
      opacity: 1;
    }
  }

  &__admin_controls-header {
    background: rgba(83, 158, 224, 0.7);
    position: absolute;
    top: 0;
    opacity: 0;
    transition: all 0.4s ease-in-out;
    border-radius: 2px;
    right: 0;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding: 4px;
    height: 16px;
    width: 100%;

    &__img {
      width: 14px;
      height: 14px;
    }
  }
}

.inserted_image {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  object-fit: contain;
  -o-object-fit: contain;
}

::v-deep .vdr {
  position: relative !important;
  border: 1px dashed rgba(0, 0, 0, 0);
  transition: border 0.5s ease-in-out;
}

::v-deep .handle {
  position: absolute !important;
  opacity: 0;
  transition: opacity 0.5s ease-in-out;
}
</style>
