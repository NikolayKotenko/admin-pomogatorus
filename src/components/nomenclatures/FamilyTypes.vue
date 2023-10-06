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


      <!--      &lt;!&ndash; Атрибуты справочника &ndash;&gt;-->
      <!--      <v-data-table-->
      <!--          :calculate-widths="true"-->
      <!--          :headers="headers"-->
      <!--          :items="$store.state.DictionariesModule.listAttributesByDictionary"-->
      <!--          :loading="$store.state.DictionariesModule.loadingList"-->
      <!--          class="elevation-1 table_dictionary_attributes"-->
      <!--          loading-text="Loading... Please wait"-->
      <!--          hide-default-footer-->
      <!--      >-->
      <!--        <template v-slot:top>-->
      <!--          <v-toolbar flat>-->
      <!--            <v-toolbar-title class="table_dictionary_attributes__header">Таблица атрибутов</v-toolbar-title>-->
      <!--            <v-divider-->
      <!--                class="mx-4"-->
      <!--                inset-->
      <!--                vertical-->
      <!--            ></v-divider>-->
      <!--            <v-spacer></v-spacer>-->
      <!--            <v-dialog v-model="dialog">-->
      <!--              <template v-slot:activator="{ on, attrs }">-->
      <!--                <v-btn-->
      <!--                    color="primary"-->
      <!--                    dark-->
      <!--                    class="mb-2"-->
      <!--                    v-bind="attrs"-->
      <!--                    v-on="on"-->
      <!--                    @click="addNewAttribute"-->
      <!--                >-->
      <!--                  Добавить-->
      <!--                </v-btn>-->
      <!--              </template>-->
      <!--              <v-card>-->
      <!--                <v-card-title class="text-h6 d-block text-center">{{ formTitle }}</v-card-title>-->
      <!--                <v-card-text class="table_dictionary_attributes__modal_item">-->
      <!--                  <ComboboxStyled-->
      <!--                      v-if="dialog"-->
      <!--                      :data="editedItem.value"-->
      <!--                      :is-items="$store.state.DictionariesModule.listOccurrencesAttributes"-->
      <!--                      :is-item-text="'value'"-->
      <!--                      :is-item-value="'value'"-->
      <!--                      :is-hide-details="false"-->
      <!--                      :is-placeholder="'Значение'"-->
      <!--                      :is-loading="$store.state.DictionariesModule.loadingOccurrencesAttributes"-->
      <!--                      @update-search-input="findSearchAttribute"-->
      <!--                      @change-search="setSearchAttribute"-->
      <!--                  ></ComboboxStyled>-->
      <!--                  <InputStyledSimple-->
      <!--                      class="mb-5"-->
      <!--                      :data="editedItem.sort"-->
      <!--                      :placeholder="'Сортировка'"-->
      <!--                      @update-input="setSortProperty"-->
      <!--                  ></InputStyledSimple>-->
      <!--                </v-card-text>-->

      <!--                <v-card-actions>-->
      <!--                  <v-btn color="blue darken-1" text class="mr-auto" @click="dialog = false">-->
      <!--                    Отмена-->
      <!--                  </v-btn>-->
      <!--                  <v-btn color="blue" :disabled="! editedItem.value" text @click="postNewAttribute">-->
      <!--                    Сохранить-->
      <!--                  </v-btn>-->
      <!--                </v-card-actions>-->
      <!--              </v-card>-->
      <!--            </v-dialog>-->
      <!--            <v-dialog v-model="dialogDelete">-->
      <!--              <v-card>-->
      <!--                <v-card-title class="text-h6 d-block text-center">Вы действительно хотите удалить атрибут ?</v-card-title>-->
      <!--                <v-card-text class="table_dictionary_attributes__modal_item">-->
      <!--                  <InputStyledSimple-->
      <!--                      class="mb-5"-->
      <!--                      :is-readonly="true"-->
      <!--                      :data="editedItem.value"-->
      <!--                      :placeholder="'Значение'"-->
      <!--                  ></InputStyledSimple>-->
      <!--                  <InputStyledSimple-->
      <!--                      :is-readonly="true"-->
      <!--                      class="mb-5"-->
      <!--                      :data="editedItem.sort"-->
      <!--                      :placeholder="'Сортировка'"-->
      <!--                  ></InputStyledSimple>-->
      <!--                </v-card-text>-->
      <!--                <v-card-actions>-->
      <!--                  <v-btn color="blue darken-1" text class="mr-auto" @click="dialogDelete = false">-->
      <!--                    Отмена-->
      <!--                  </v-btn>-->
      <!--                  <v-btn color="blue darken-1" text @click="deleteAttribute">-->
      <!--                    Удалить-->
      <!--                  </v-btn>-->
      <!--                </v-card-actions>-->
      <!--              </v-card>-->
      <!--            </v-dialog>-->
      <!--          </v-toolbar>-->
      <!--        </template>-->
      <!--        <template v-slot:item.actions="{ item }">-->
      <!--          <v-icon-->
      <!--              small-->
      <!--              class="mr-2"-->
      <!--              @click="editItem(item)"-->
      <!--          >-->
      <!--            mdi-pencil-->
      <!--          </v-icon>-->
      <!--          <v-icon-->
      <!--              small-->
      <!--              @click="deleteItem(item)"-->
      <!--          >-->
      <!--            mdi-delete-->
      <!--          </v-icon>-->
      <!--        </template>-->
      <!--        <template v-slot:no-data>-->
      <!--          Не найдено атрибутов у этого справочника-->
      <!--        </template>-->
      <!--      </v-data-table>-->

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
// import {DictionaryAttribute} from "@/helpers/constructors";
// import ComboboxStyled from "@/components/common/ComboboxStyled";
// import InputStyledSimple from "@/components/common/InputStyledSimple";
import SearchStyled from "@/components/common/SearchStyled";
import vueDropzone from "vue2-dropzone";
import Request from "@/services/request";
import nomenclatureStore from "@/store/modules/nomenclatures";

const _store = nomenclatureStore.state

export default {
  name: "Family",
  components:{
    vueDropzone,
    SearchStyled,
    // InputStyledSimple,
    InputStyled,
    // ComboboxStyled,
  },
  data: () => ({
    dialog: false,
    dialogDelete: false,
    editedId: -1,
    dropzone_uploaded: [],
    index_uploaded: 1,
    stateDropzone: false,
  }),
  async mounted() {
    await this.$store.dispatch('FamilyTypesModule/getListEntries', this.$route.params.code)
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
    '$store.state.FamilyTypesModule.entry.e_client_files': {
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
      formData.append('id_family', _store.entry.id)
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
        // await this.$store.dispatch('FamilyTypesModule/getListDictionaryAttribute')
      }

      if (typeof value === 'string') {
        this.$store.state.FamilyTypesModule.entry.name = value
      }
    },
    // async postNewAttribute(){
    //   await this.$store.dispatch(
    //       'DictionariesModule/createAttribute',
    //       new DictionaryAttribute(
    //           this.editedItem.id,
    //           this.editedItem.sort,
    //           this.editedItem.code,
    //           this.editedItem.value,
    //           this.$store.state.DictionariesModule.entry.id
    //       )
    //   );
    //   this.dialog = false;
    // },
    deleteItem(item){
      this.dialogDelete = true
      this.editedItem = item
    },
    editItem (item) {
      this.editedId = this.$store.state.DictionariesModule.listAttributesByDictionary
          .filter((obj) => { return item.id === obj.id })
          .map((obj) => { return obj.id; })[0]
      ;
      this.editedItem = Object.assign({}, item);
      this.dialog = true
    },
    // addNewAttribute(){
    //   this.editedItem = new DictionaryAttribute();
    //   this.$store.commit('DictionariesModule/clearListOccurrencesAttributes');
    //   this.editedId = -1;
    //   this.dialog = true;
    // },
    // async deleteAttribute(){
    //   await this.$store.dispatch('DictionariesModule/deleteAttribute', this.editedItem.code)
    //   this.dialogDelete = false
    // },
    // async findSearchAttribute(string){
    //   await this.$store.dispatch('DictionariesModule/searchDictionaryAttributeByValue', string)
    // },
    // setSearchAttribute(value){
    //   if (! value) this.editedItem.value = ''
    //
    //   if (this.$store.getters.checkValueIsAnObject(value))
    //     this.editedItem = value;
    //
    //   if (typeof value === 'string')
    //     this.editedItem.value = value
    // },
    async deleteLocal() {
      // for (const obj of this.$store.state.DictionariesModule.listAttributesByDictionary) {
      //   await this.$store.dispatch('DictionariesModule/deleteAttribute', obj.code);
      // }

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