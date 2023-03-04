<template>
  <div class="detail_container">
    <v-container>
      <template v-if="$store.getters.stateEditCreate($route.query.action)">
        <InputStyled
            :current-rules="$store.state.nameRules"
            :data="$store.state.TagsModule.tag.name"
            :is-clearable="true"
            :is-disabled="$store.state.loadingRequestGeneral || !$store.getters.stateEditCreate($route.query.action)"
            :is-outlined="true"
            :is-required="true"
            :item-text="'name'"
            :item-value="'id'"
            :placeholder="'Имя тэга'"
            class="mb-5"
            @update-input="setData"
            @change-input="onSubmitLocal"
        />
      </template>
      <template v-else>
        <v-autocomplete
            v-model="$store.state.TagsModule.tag"
            :disabled="$store.state.loadingRequestGeneral"
            :items="$store.state.TagsModule.listTags"
            :loading="$store.state.loadingRequestGeneral"
            class="mb-5"
            dense
            hide-details
            item-text="name"
            item-value="id"
            label="Выберите тэг"
            outlined
            return-object
        >
        </v-autocomplete>
      </template>

      <!-- DROPZONE -->
      <v-btn
          :disabled="$store.state.loadingRequestGeneral || $route.query.action !== 'edit'"
          @click="$refs.TagDropZone.removeAllFiles(); stateDropzone = true; insertDropzoneData()"
      >
        Изображение
        <v-icon color="grey lighten-1" style="transform: rotate(45deg)">mdi-paperclip</v-icon>
        [{{ dropzone_uploaded.length }}]
      </v-btn>
      <v-dialog
          v-model="stateDropzone"
          :eager="true"
          max-width="600"
      >
        <v-card>
          <v-card-title>
            <span v-if="! dropzone_uploaded.length" class="text-h7">Загрузите изображение</span>
            <span v-else class="text-h7">Изображение уже загружено</span>
          </v-card-title>
          <v-card-text class="dialog_dropzone">
            <div v-show="! dropzone_uploaded.length" class="dialog_dropzone_wrapper">
              <vue-dropzone
                  id="dropzone"
                  ref="TagDropZone"
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
              <div v-for="(item, index) in dropzone_uploaded" :key="index" class="dialog_dropzone_inputs">
                <v-img :src="$store.state.BASE_URL+item.full_path" contain></v-img>
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
            <v-btn
                v-if="dropzone_uploaded.length"
                :disabled="$store.state.loadingRequestGeneral || !$store.getters.stateEditCreate($route.query.action)"
                :loading="$store.state.loadingRequestGeneral"
                color="blue darken-1"
                text
                @click="removedFile();"
            >
              Очистить
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
                :disabled="$store.state.loadingRequestGeneral"
                :loading="$store.state.loadingRequestGeneral"
                color="green darken-1"
                text
                @click="stateDropzone = false; updateDropZoneImage()"
            >
              Готово
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <vue-editor
          v-model="$store.state.TagsModule.tag.description"
          :class="{'disabledMode': !$store.getters.stateEditCreate($route.query.action)}"
          :disabled="$store.state.loadingRequestGeneral || !$store.getters.stateEditCreate($route.query.action)"
          class="mt-5"
      />
      <v-checkbox
          v-model="$store.state.TagsModule.tag.public"
          :disabled="$store.state.loadingRequestGeneral || !$store.getters.stateEditCreate($route.query.action)"
          :loading="$store.state.loadingRequestGeneral"
          class="mb-5 mt-5"
          dense
          hide-details
          label="Публичный"
      >
      </v-checkbox>
      <v-checkbox
          v-model="$store.state.TagsModule.tag.flag_engineering_system"
          :disabled="$store.state.loadingRequestGeneral || !$store.getters.stateEditCreate($route.query.action)"
          :loading="$store.state.loadingRequestGeneral"
          class="mb-5 mt-5"
          dense
          hide-details
          label="Используется в инженерной системе ?"
      >
      </v-checkbox>
      <InputStyled
          :data="$store.state.TagsModule.tag.seo_title"
          :is-disabled="$store.state.loadingRequestGeneral || !$store.getters.stateEditCreate($route.query.action)"
          :is-outlined="true"
          persistent-placeholder
          :placeholder="'SEO-заголовок для тэга'"
          class="mt-5 mb-5"
          @update-input="setTagTitle"
      />
      <InputStyled
          :data="$store.state.TagsModule.tag.seo_description"
          :is-disabled="$store.state.loadingRequestGeneral || !$store.getters.stateEditCreate($route.query.action)"
          :is-outlined="true"
          persistent-placeholder
          :placeholder="'SEO-описание для тэга'"
          class="mb-5"
          @update-input="setTagDescription"
      />
      <InputStyled
          :data="$store.state.TagsModule.tag.code"
          :is-disabled="true"
          :is-outlined="true"
          :placeholder="'Псевдоним'"
          class="mb-5"
          @update-input="setCode"
      />
    </v-container>

    <footer class="detail_footer">
      <v-container>
        <v-btn
            v-if="$store.state.TagsModule.tag.id"
            :disabled="$store.state.loadingRequestGeneral || !$store.state.TagsModule.tag.id"
            color="red darken-1"
            text
            @click="$store.dispatch('stateModalAction', true)"
        >
          Удалить
        </v-btn>
        <v-btn
            v-if="$route.query.action"
            :disabled="$store.state.loadingRequestGeneral"
            color="white darken-1"
            text
            @click="$router.push({path: $route.meta.returnLink.path})"
        >
          Отменить
        </v-btn>

        <v-btn
            :disabled="!$store.getters.stateEditCreate($route.query.action)"
            class="detail_footer__save_btn"
            color="blue darken-1"
            text
            @click.prevent="onSubmitLocal()"
        >
          Сохранить
        </v-btn>
      </v-container>
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
              :disabled="$store.state.loadingRequestGeneral"
              :loading="$store.state.loadingRequestGeneral"
              color="blue darken-1"
              text
              @click="$store.dispatch('stateModalAction', false)"
          >
            Нет
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              :disabled="$store.state.loadingRequestGeneral"
              :loading="$store.state.loadingRequestGeneral"
              color="red darken-1"
              text
              @click="deleteLocal()"
          >
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay :value="$store.state.loadingRequestGeneral">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import {VueEditor} from "vue2-editor";
import tagsStore from "@/store/modules/tags";
import Request from "@/services/request";
import InputStyled from "../common/InputStyled";

const _store = tagsStore.state

export default {
  components: {
    InputStyled,
    VueEditor,
    vueDropzone: vue2Dropzone,
  },
  name: "DetailTag",
  data: () => ({
    debounceTimeout: null,
    index_uploaded: 1,
    stateDropzone: false,
    dropzone_uploaded: [],
  }),
  async mounted() {
    await this.$store.dispatch('getListTags', this.$route.params.id)
    await this.$store.dispatch('setTitle', this.$store.state.TagsModule.tag.name)
  },
  methods: {
    setAlt(data) {
      this.dropzone_uploaded[data.index].alt_image = data.value
    },
    setTitle(data) {
      this.dropzone_uploaded[data.index].title_image = data.value
    },
    setTagTitle(value) {
      this.$store.state.TagsModule.tag.seo_title = value
    },
    setTagDescription(value) {
      this.$store.state.TagsModule.tag.seo_description = value
    },
    setCode(value) {
      this.$store.state.TagsModule.tag.code = value
    },

    /* DROPZONE */
    sendingData(file, xhr, formData) {
      formData.append('uuid', file.upload.uuid)
      formData.append('id_tag', _store.tag.id)
    },
    async successData(file, response) {
      console.log('successData')
      console.log(response)
      const formatObj = Object.assign({}, response.data)
      this.dropzone_uploaded.push(formatObj)

      await this.$store.dispatch('onSubmit', {}, {root: true});
      await this.$router.replace({
        path: this.$route.path,
        query: this.$route.query
      }).catch(() => {
      });
    },
    async removedFile() {
      if (!this.dropzone_uploaded.length)
        return false;

      await this.$store.dispatch('deleteFileGeneral', this.dropzone_uploaded[0].id);
      this.dropzone_uploaded = [];
      this.$refs.TagDropZone.removeAllFiles();
    },
    insertDropzoneData() {
      if (!this.stateDropzone) return;
      if (!this.dropzone_uploaded.length) return;

      this.$nextTick(() => {
        this.$refs.TagDropZone.manuallyAddFile(this.dropzone_uploaded[0], this.dropzone_uploaded[0].full_path)
      })
    },
    async updateDropZoneImage() {
      if (!this.dropzone_uploaded.length) return;

      await Request.put(
          this.$store.state.BASE_URL + '/entity/files/' + this.dropzone_uploaded[0].id,
          this.dropzone_uploaded[0])
    },
    async onSubmitLocal() {
      await this.$store.dispatch('onSubmit', {}, {root: true});
      if (this.$route.query.action === 'create') {
        await this.$router.replace({
          path: this.$route.path + '/' + this.$store.state.TagsModule.tag.id,
          query: {action: 'edit'},
        }).catch(() => {});
      } else {
        await this.$router.replace({ path: this.$route.meta.returnLink.path }).catch(() => {});
      }
    },
    setData(value) {
      this.$store.state.TagsModule.tag.name = value
    },
    async deleteLocal() {
      await this.$store.dispatch('deleteTag');
      await this.$router.push({path: '/tags'}).catch(() => {
      });
    }
  },
  watch: {
    '$store.state.TagsModule.tag.id': {
      handler(newValue) {
        if (this.$route.query.action === 'create')
          return false;

        const currentQuery = this.$route.query;
        const idEntry = (newValue) ? newValue : '';
        this.$router.replace({
          path: '/tags/' + idEntry,
          query: currentQuery,
        }).catch(() => {
        });

        this.$store.dispatch('setTitle', this.$store.state.TagsModule.tag.name)
      }
    },
    '$route.query.action': {
      handler(newValue) {
        if (newValue === 'create') {
          this.$store.dispatch('clearTag');
        }
      }
    },
    '$route.params.id': {
      handler(newValue) {
        if (!newValue) {
          this.$store.dispatch('clearTag');
        }
      }
    },
    '$store.state.TagsModule.tag.e_client_files': {
      handler(newValue) {
        if (! newValue) return false;
        this.dropzone_uploaded = [];
        this.dropzone_uploaded = newValue;
      }
    },
    // 'dropzone_uploaded':{
    //   handler(newValue){
    //     if (this.dropzone_uploaded.length)
    //       return false;
    //
    //     console.log('watch dropzone_uploaded=[]')
    //     console.log(newValue)
    //
    //     this.dropzone_uploaded = [];
    //     this.$nextTick(() => {
    //       this.Dropzone.forElement("#TagDropZone").removeAllFiles(true);
    //       this.$refs.TagDropZone.removeAllFiles();
    //     })
    //   }
    // }
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
  computed: {
    options() {
      return {
        url: this.$store.state.BASE_URL + '/entity/files',
        // url: 'https://httpbin.org/post',
        destroyDropzone: false,
        duplicateCheck: true,
        headers: {
          Authorization: this.$store.getters.getToken,
        },
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/detail";

.disabledMode {
  opacity: 0.5;
}
</style>

