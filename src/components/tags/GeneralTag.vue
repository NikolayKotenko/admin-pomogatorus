<template>
  <div>
    <!-- DROPZONE -->
    <v-btn
        :disabled="$store.state.TagsModule.loadingList || stateEditCreate"
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
              <v-img :src="$store.state.BASE_URL+item.full_path" contain></v-img>
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
              @click="removedFile(0);"
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

    <vue-editor
        class="mt-5"
        v-model="$store.state.TagsModule.tag.description"
        :disabled="$store.state.TagsModule.loadingList || stateEditCreate"
        :class="{'disabledMode': stateEditCreate}"
    />
    <v-checkbox
        class="mb-5 mt-5"
        hide-details
        dense
        label="Публичный"
        v-model="$store.state.TagsModule.tag.public"
        :loading="$store.state.TagsModule.loadingList"
        :disabled="$store.state.TagsModule.loadingList || stateEditCreate"
    >
    </v-checkbox>
    <v-text-field
        class="mt-5"
        outlined
        dense
        label="Seo заголовок (seo title)"
        v-model="$store.state.TagsModule.tag.seo_title"
        :disabled="$store.state.TagsModule.loadingList || stateEditCreate"
    ></v-text-field>
    <v-text-field
        class=""
        outlined
        dense
        label="Seo описание (seo description)"
        v-model="$store.state.TagsModule.tag.seo_description"
        :disabled="$store.state.TagsModule.loadingList || stateEditCreate"
    ></v-text-field>
    <v-text-field
        class="mb-5"
        outlined
        dense
        label="Псевдоним"
        v-model="$store.state.TagsModule.tag.code"
        disabled
    ></v-text-field>

    <footer class="detail_footer">
      <v-btn
          color="red darken-1"
          text
          @click="$store.dispatch('stateModalAction', true)"
      >
        Удалить
      </v-btn>
      <v-btn
          v-if="$route.params.action === 'edit' || $route.params.action === 'create'"
          color="blue darken-1"
          text
          @click.prevent="$store.dispatch('onSubmit'); $router.push({path: '/tags'+'?id='+$store.state.TagsModule.tag.id}); "
      >
        Закончить работу
      </v-btn>
    </footer>

    <!--  MODALS  -->
    <v-dialog
        v-model="$store.state.TagsModule.deleteModal"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important;">Вы точно хотите удалить тэг?</span>
        </v-card-title>
        <v-card-actions>
          <v-btn
              color="blue darken-1"
              text
              @click="$store.dispatch('stateModalAction', false)"
              :disabled="$store.state.TagsModule.loadingRequest"
              :loading="$store.state.TagsModule.loadingRequest"
          >
            Нет
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              color="red darken-1"
              text
              :disabled="$store.state.TagsModule.loadingRequest"
              :loading="$store.state.TagsModule.loadingRequest"
              @click="$store.dispatch('deleteTag'); $router.push({path: '/tags'});"
          >
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import { VueEditor } from "vue2-editor";
import tagsStore from "@/store/modules/tags";
import Request from "@/services/request";

const _store = tagsStore.state

export default {
  components: {
    VueEditor,
    vueDropzone: vue2Dropzone,
  },
  name: "GeneralTag",
  data: () => ({
    debounceTimeout: null,
    index_uploaded: 1,
    stateDropzone: false,
    dropzone_uploaded: [],
  }),
  mounted() {
  },
  created() {
  },
  methods:{
    /* DROPZONE */
    sendingData(file, xhr, formData) {
      this.$store.state.loadingRequestGeneral = true;
      formData.append('uuid', file.upload.uuid)
      formData.append('id_tag', _store.tag.id)
    },
    successData(file, response) {
      console.log('successData')
      console.log(response)
      const formatObj = Object.assign({}, response.data)
      this.dropzone_uploaded.push(formatObj)
      this.$store.state.loadingRequestGeneral = false;
    },
    async removedFile(index) {
      await this.$store.dispatch('deleteFileGeneral', this.dropzone_uploaded[index].id);
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

      await Request.put(
          this.$store.state.BASE_URL+'/entity/files/'+this.dropzone_uploaded[0].id,
          this.dropzone_uploaded[0])
    }
  },
  watch:{
    '$store.state.TagsModule.tag.e_client_files':{
      handler(newValue) {
        this.dropzone_uploaded = [];
        if (this.$route.params.action !== 'create') {
          this.dropzone_uploaded = newValue;
        }
      }
    }
    // '$store.state.TagsModule.tag.seo_description': {
    //   handler(newValue, oldValue) {
    //     //TODO
    //     console.log('oldValue', String(oldValue))
    //     console.log('newValue', String(newValue))
    //     if (String(newValue) == String(oldValue))
    //       return false;
    //
    //     if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
    //     this.debounceTimeout = setTimeout(() => {
    //       this.$store.dispatch('onSubmit')
    //     }, 2000)
    //   },
    // },
  },
  computed:{
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
    stateEditCreate(){
      const aaa = this.$route.params.action === 'edit' || this.$route.params.action === 'create'
      return !aaa;
    }
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/detail";

.disabledMode{
  opacity: 0.5;
}
.detail_footer{
  position: fixed;
  left: 0;
}
</style>