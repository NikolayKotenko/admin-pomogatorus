<template>
  <div class="detail_container">
    <v-container class="main_wrapper">
      <template v-if="$store.getters.stateEditCreate($route.query.action)">
        <InputStyled
            :current-rules="$store.state.nameRules"
            :data="$store.state.FamilyTypesModule.entry.name"
            :is-clearable="true"
            :is-disabled="$store.state.FamilyTypesModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            :is-outlined="true"
            :is-required="true"
            :item-text="'name'"
            :item-value="'name'"
            :placeholder="'Название типа'"
            class="mb-5"
            @update-input="setType"
            @change-input="onSubmitLocal"
        />
      </template>
      <template v-else>
        <SearchStyled
            :is-items="$store.state.FamilyTypesModule.listEntries"
            :is-item-text="'name'"
            :is-item-value="'code'"
            :is-placeholder="'Список типов'"
            @change-search="setType"
        ></SearchStyled>
      </template>


      <!-- DROPZONE -->
      <v-btn

          @click="$refs.NomenclatureDropZone.removeAllFiles(); stateDropzone = true; insertDropzoneData()"
      >
        Изображение
        <v-icon color="grey mb-0 mt-5 lighten-1" style="transform: rotate(45deg)">mdi-paperclip</v-icon>
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
                  ref="NomenclatureDropZone"
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
                    :placeholder="'alt-наименован' +
                     'ие изображения'"
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

    </v-container>

    <footer class="detail_footer">
      <v-container>
        <v-btn
            v-if="$store.state.FamilyTypesModule.entry.code"
            :disabled="$store.state.FamilyTypesModule.loadingList"
            color="red darken-1"
            text
            @click="$store.dispatch('FamilyTypesModule/stateModalAction', true)"
        >
          Удалить
        </v-btn>
        <v-btn
            v-if="$route.query.action"
            :disabled="$store.state.FamilyTypesModule.loadingList"
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

    <v-dialog
        v-model="$store.state.FamilyTypesModule.deleteModal"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important;">Вы точно хотите удалить семейство со всеми характеристиками ?</span>
        </v-card-title>
        <v-card-actions>
          <v-btn
              :disabled="$store.state.FamilyTypesModule.loadingList"
              :loading="$store.state.FamilyTypesModule.loadingList"
              color="blue darken-1"
              text
              @click="$store.dispatch('FamilyTypesModule/stateModalAction', false)"
          >
            Нет
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              :disabled="$store.state.FamilyTypesModule.loadingList"
              :loading="$store.state.FamilyTypesModule.loadingList"
              color="red darken-1"
              text
              @click="deleteLocal()"
          >
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="$store.state.FamilyTypesModule.loadingList">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>

</template>

<script>
import InputStyled from "@/components/common/InputStyled";
import SearchStyled from "@/components/common/SearchStyled";
import vueDropzone from "vue2-dropzone";
import Request from "@/services/request";


export default {
  name: "FamilyTypes",
  components:{
    vueDropzone,
    SearchStyled,
    InputStyled,
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    dropzone_uploaded: [],
    index_uploaded: 1,
    stateDropzone: false,
  }),
  async mounted() {
    await this.$store.dispatch('FamilyTypesModule/getListEntries', this.$route.params.id)
    await this.$store.dispatch('setTitle', this.$store.state.FamilyTypesModule.entry.name)
  },
  computed: {
    options() {
      return {
        url: this.$store.state.BASE_URL + '/entity/files',
        destroyDropzone: false,
        duplicateCheck: true,
        headers: {
          Authorization: this.$store.getters.getToken,
        },
      }
    },
  },
  watch: {
    '$store.state.FamilyTypesModule.entry.id': {
      handler(newValue) {
        if (this.$route.query.action === 'create')
          return false;

        const currentQuery = this.$route.query;
        const codeEntry = (newValue) ? newValue : '';
        this.$router.replace({
          path: this.$route.meta.returnLink.path +'/'+ codeEntry,
          query: currentQuery,
        }).catch(() => {
        });

        this.$store.dispatch('setTitle', this.$store.state.FamilyTypesModule.entry.name)
      }
    },
    '$route.query.action': {
      handler(newValue) {
        if (newValue === 'create') {
          this.$store.commit('FamilyTypesModule/clearEntry');
        }
      }
    },
    '$route.params.id': {
      handler(newValue) {
        if (!newValue) {
          this.$store.commit('FamilyTypesModule/clearEntry');
          this.$store.commit('FamilyTypesModule/clearListAttributesByDictionary')
        }
      }
    },
    '$store.state.FamilyTypesModule.entry.icon': {
      handler(newValue) {
        if (!newValue) return false;
        this.dropzone_uploaded = [];
        this.dropzone_uploaded = newValue;
      }
    },
  },
  methods:{
    setAlt(data) {
      this.dropzone_uploaded[data.index].alt_image = data.value
    },
    setTitle(data) {
      this.dropzone_uploaded[data.index].title_image = data.value
    },
    // /* DROPZONE */
    sendingData(file, xhr, formData) {
      formData.append('uuid', file.upload.uuid)
      formData.append('id_family_type', this.$store.state.FamilyTypesModule.entry.id)
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
      this.$refs.NomenclatureDropZone.removeAllFiles();
    },
    insertDropzoneData() {
      if (!this.stateDropzone) return;
      if (!this.dropzone_uploaded.length) return;

      this.$nextTick(() => {
        this.$refs.NomenclatureDropZone.manuallyAddFile(this.dropzone_uploaded[0], this.dropzone_uploaded[0].full_path)
      })
    },
    async updateDropZoneImage() {
      if (!this.dropzone_uploaded.length) return;

      await Request.put(
          this.$store.state.BASE_URL + '/entity/files/' + this.dropzone_uploaded[0].id,
          this.dropzone_uploaded[0])
    },
    async onSubmitLocal() {
      await this.$store.dispatch('FamilyTypesModule/onSubmit');
      if (this.$route.query.action === 'create') {
        await this.$router.replace({
          path: this.$route.path + '/' + this.$store.state.FamilyTypesModule.entry.id,
          query: {action: 'edit'},
        }).catch(() => {});
      } else {
        await this.$router.replace({
          path: this.$route.meta.returnLink.path,
        }).catch(() => {});
      }
    },
    async setType(value){
      if (! value) {
        this.$store.commit('FamilyModule/clearEntry');
        return false;
      }

      if (this.$store.getters.checkValueIsAnObject(value)){
        await this.$store.commit('FamilyTypesModule/setEntry', value)
      }

      if (typeof value === 'string') {
        this.$store.state.FamilyTypesModule.entry.name = value
      }
    },
    async deleteLocal() {
      await this.$store.dispatch('FamilyTypesModule/deleteEntry');
      await this.$router.push({path: this.$route.meta.returnLink.path}).catch(() => {});
    },
    setSortProperty(value){
      this.editedItem.sort = value
    },
  }
}
</script>

<style lang="scss" scoped>
.container.main_wrapper{
  grid-row-gap: 1em;
  display: grid;
}
.table_dictionary_attributes{
  &__header{
    font-size: 1em;
  }
  &__modal_item{
    display: grid;
    padding-top: 1em!important;
    padding-bottom: 1em!important;
    grid-column-gap: 1em;
  }
}

</style>