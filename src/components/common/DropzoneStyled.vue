<template>
  <div>
    <v-btn
        @click="$store.dispatch('openDropzoneModal');
        insertDropzoneData();"
    >
      Изображение
      [{{ currentData.length }}]
      <v-icon color="grey lighten-1" style="transform: rotate(45deg)">mdi-paperclip</v-icon>
    </v-btn>

    <v-dialog
        v-model="$store.state.stateDropzoneModal"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span v-if="! currentData.length" class="text-h7">Загрузите изображение</span>
          <span v-else class="text-h7">Изображение уже загружено</span>
        </v-card-title>
        <v-card-text class="dialog_dropzone">
          <div class="dialog_dropzone_wrapper">
            <vue-dropzone
                id="dropzone"
                ref="dropzone"
                :options="options"
                :useCustomSlot=true
                @vdropzone-success="successData"
                @vdropzone-sending="sendingData"
            >
              <h3 class="dropzone-custom-title">
                <v-icon color="grey lighten-1" size="120" style="transform: rotate(45deg)">
                  mdi-paperclip
                </v-icon>
              </h3>
              <div class="subtitle" style="color: darkgrey">Для вставки изображения перетащите файл в зону или нажмите
                на скрепку
              </div>
            </vue-dropzone>
          </div>
          <template>
            <div v-for="(item, index) in currentData" :key="index" class="dialog_dropzone_inputs">
              <v-img :src="$store.state.BASE_URL+item.full_path" contain></v-img>
              <v-btn
                @click="removeFile(item.id)"
              >Удалить</v-btn>
              <span class="dialog_dropzone_inputs__label"> {{ item.filename }}</span>
              <InputStyled
                  :data="item.alt_image"
                  :index-array="index"
                  :is-disabled="$store.state.loadingRequestGeneral"
                  :is-loading="$store.state.loadingRequestGeneral"
                  :placeholder="'alt-наименование изображения'"
                  @update-input="setAlt"
              />
              <InputStyled
                  :data="item.title_image"
                  :index-array="index"
                  :is-disabled="$store.state.loadingRequestGeneral"
                  :is-loading="$store.state.loadingRequestGeneral"
                  :placeholder="'подпись изображения'"
                  @update-input="setTitle"
              />
            </div>
          </template>
        </v-card-text>
        <v-card-actions>
<!--          <v-btn-->
<!--              v-if="currentData.length"-->
<!--              :disabled="$store.state.loadingRequestGeneral || !$store.getters.stateEditCreate($route.query.action)"-->
<!--              :loading="$store.state.loadingRequestGeneral"-->
<!--              color="blue darken-1"-->
<!--              text-->
<!--              @click="removedFile();"-->
<!--          >-->
<!--            Очистить-->
<!--          </v-btn>-->
          <v-spacer></v-spacer>
          <v-btn
              :disabled="$store.state.loadingRequestGeneral"
              :loading="$store.state.loadingRequestGeneral"
              color="green darken-1"
              text
              @click="$store.dispatch('closeDropzoneModal'); updateDropZoneImage()"
          >
            Готово
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>

import InputStyled from "@/components/common/InputStyled.vue";
import vueDropzone from "vue2-dropzone";
import {VueEditor} from "vue2-editor";
import vue2Dropzone from "vue2-dropzone";
import Request from "@/services/request";

export default ({
  components: {vueDropzone, InputStyled},
  name: "DropzoneStyled",
  props: {
    // ref: {
    //   type: String,
    //   default: ''
    // }
    idObject: {
      type: [Number, String],
      default: null,
    },
    photosArray: {
      type: Array,
      default: () => ([]),
    },
    isNomenclature: {
      type: Boolean,
      default: false
    },
    isFamily: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    dropzone_uploaded: [],
  }),
  mounted() {
    this.dropzone_uploaded = this.photosArray
  },
  computed: {
    options() {
      return {
        url: this.$store.state.BASE_URL + '/entity/files',
        // url: 'https://httpbin.org/post',
        destroyDropzone: true,
        duplicateCheck: true,
        disablePreviews: true,
        headers: {
          Authorization: this.$store.getters.getToken,
        },
      }
    },
    // currentData() {
    //   if (this.photosArray) {
    //     return this.photosArray
    //   }
    //   return this.dropzone_uploaded
    // },
    currentData: {
      get() {
        if (this.photosArray) {
          return this.photosArray
        }
        return this.dropzone_uploaded
      },
      set(value) {
        this.dropzone_uploaded = value
      }
    },
  },
  methods: {
    setAlt(data) {
      this.currentData[data.index].alt_image = data.value
    },
    setTitle(data) {
      this.currentData[data.index].title_image = data.value
    },
    sendingData(file, xhr, formData) {
      formData.append('uuid', file.upload.uuid)

      if (this.isNomenclature) {
        formData.append('id_nomenclature', parseInt(this.idObject))
      }
      if (this.isFamily) {
        formData.append('id_family', parseInt(this.idObject))
      }
    },
    async successData(file, response) {
      const formatObj = Object.assign({}, response.data)
      this.currentData.push(formatObj)

      await this.$store.dispatch('onSubmit', {}, {root: true});
      await this.$router.replace({
        path: this.$route.path,
        query: this.$route.query
      }).catch(() => {
      });
    },
    async removedFile() {
      if (!this.currentData.length)
        return false;

      await this.$store.dispatch('deleteFileGeneral', this.currentData[0].id);
      this.currentData = [];
      this.$refs.dropzone.removeAllFiles();
    },
    async removeFile(fileId) {
      if (!this.currentData.length)
        return false;

      await this.$store.dispatch('deleteFileGeneral', fileId);

      this.$refs.dropzone.removeAllFiles();
      const index = this.currentData.findIndex(item => item.id === fileId)

      if (index !== -1) {
        this.currentData.splice(index, 1);
      }

    },
    insertDropzoneData() {
      if (!this.$store.state.stateDropzoneModal) return;
      if (!this.currentData.length) return;

      this.$nextTick(() => {
        this.$refs.dropzone.manuallyAddFile(this.currentData[0], this.currentData[0].full_path)
      })
    },
    async updateDropZoneImage() {
      if (!this.currentData.length) return;

      await Request.put(
          this.$store.state.BASE_URL + '/entity/files/' + this.currentData[0].id,
          this.currentData[0])
    },
  },
})
</script>

<style lang="scss">
.dialog_dropzone_wrapper {
  .dropzone .dz-preview.dz-image-preview {
    display: none !important;
  }
  .dropzone.dz-started .dz-message {
    display: block !important;
  }
}

</style>