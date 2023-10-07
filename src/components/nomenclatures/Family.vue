<template>
  <div class="detail_container">
    <v-container class="main_wrapper">
      <template v-if="$store.getters.stateEditCreate($route.query.action)">
        <InputStyled
            :current-rules="$store.state.nameRules"
            :data="$store.state.FamiliesModule.entry.name"
            :is-clearable="true"
            :is-disabled="$store.state.FamiliesModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            :is-outlined="true"
            :is-required="true"
            :item-text="'name'"
            :item-value="'name'"
            :placeholder="'Имя семейства'"
            class="mb-5"
            @update-input="setFamily"
            @change-input="onSubmitLocal"
        />
      </template>
      <template v-else>
        <SearchStyled
            :is-items="$store.state.FamiliesModule.listEntries"
            :is-item-text="'name'"
            :is-item-value="'code'"
            :is-placeholder="'Список семейств'"
            @change-search="setFamily"
        ></SearchStyled>
      </template>

      <v-text-field
          ref="nomenclature-vendor-code"
          v-model="$store.state.FamiliesModule.entry.description"
          :disabled="$store.state.FamiliesModule.loadingList"
          class="mb-0 mt-5"
          dense
          label="Описание"
          outlined
          required
          type="text"
      ></v-text-field>

      <v-list elevation="1" subheader>
        <v-subheader>Тип</v-subheader>
        <v-combobox
            v-model="$store.state.FamiliesModule.entry.type"
            :disabled="$store.state.FamiliesModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            :items="$store.state.FamiliesModule.listTypes" :loading="$store.state.FamiliesModule.loadingList"
            chips
            class="role_user pa-2 pt-0 ma-0 "
            clearable
            hide-details
            item-text="name"
        >
        </v-combobox>
      </v-list>

      <!-- DROPZONE -->
      <v-btn

          @click="$refs.FamilyDropZone.removeAllFiles(); stateDropzone = true; insertDropzoneData()"
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
                  ref="FamilyDropZone"
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


<!--      <v-data-table :headers="headers" :items="items" item-key="id" class="elevation-1 mb-0 mt-5">-->
<!--        <template v-slot:top>-->
<!--          <v-toolbar flat>-->
<!--            <v-dialog v-model="dialog" max-width="500px">-->
<!--              <template v-slot:activator="{ on }">-->
<!--                <v-btn color="primary" dark class="mb-2" v-on="on">Добавить характеристику</v-btn>-->
<!--              </template>-->
<!--              <v-card>-->
<!--                <v-card-title>-->
<!--                  <span class="headline">{{ formTitle }}</span>-->
<!--                </v-card-title>-->
<!--                <v-card-text>-->
<!--                  <v-container>-->
<!--                    <v-row>-->
<!--                      <v-col cols="12">-->
<!--                        <v-combobox-->
<!--                            v-model="editedItem.characteristic"-->
<!--                            :disabled="$store.state.FamiliesModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"-->
<!--                            :items="$store.state.FamiliesModule.listCharacteristic" :loading="$store.state.NomenclaturesModule.loadingList"-->
<!--                            chips-->
<!--                            class="role_user pa-2 pt-0 ma-0"-->
<!--                            clearable-->
<!--                            hide-details-->
<!--                            item-text="name"-->
<!--                        >-->
<!--                        </v-combobox>-->
<!--                      </v-col>-->
<!--                      <v-col cols="6">-->
<!--                        <v-text-field v-model.number="editedItem.value"   type="number" label="Значение"></v-text-field>-->
<!--                      </v-col>-->
<!--                      <v-col cols="6">-->
<!--                        <v-text-field v-model="editedItem.postfix" label="Постфикс"></v-text-field>-->
<!--                      </v-col>-->
<!--                    </v-row>-->
<!--                  </v-container>-->
<!--                </v-card-text>-->
<!--                <v-card-actions>-->
<!--                  <v-spacer></v-spacer>-->
<!--                  <v-btn color="blue darken-1" text @click="closeDialog">Отмена</v-btn>-->
<!--                  <v-btn color="blue darken-1" text @click="save">Сохранить</v-btn>-->
<!--                </v-card-actions>-->
<!--              </v-card>-->
<!--            </v-dialog>-->
<!--          </v-toolbar>-->
<!--        </template>-->
<!--        <template v-slot:item.actions="{ item }">-->
<!--          <v-icon small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>-->
<!--          <v-icon small @click="deleteItem(item)">mdi-delete</v-icon>-->
<!--        </template>-->
<!--      </v-data-table>-->

    </v-container>

    <footer class="detail_footer">
      <v-container>
        <v-btn
            v-if="$store.state.FamiliesModule.entry.code"
            :disabled="$store.state.FamiliesModule.loadingList"
            color="red darken-1"
            text
            @click="$store.dispatch('FamiliesModule/stateModalAction', true)"
        >
          Удалить
        </v-btn>
        <v-btn
            v-if="$route.query.action"
            :disabled="$store.state.FamiliesModule.loadingList"
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
        v-model="$store.state.FamiliesModule.deleteModal"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important;">Вы точно хотите удалить семейство со всеми характеристиками ?</span>
        </v-card-title>
        <v-card-actions>
          <v-btn
              :disabled="$store.state.FamiliesModule.loadingList"
              :loading="$store.state.FamiliesModule.loadingList"
              color="blue darken-1"
              text
              @click="$store.dispatch('FamiliesModule/stateModalAction', false)"
          >
            Нет
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              :disabled="$store.state.FamiliesModule.loadingList"
              :loading="$store.state.FamiliesModule.loadingList"
              color="red darken-1"
              text
              @click="deleteLocal()"
          >
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="$store.state.FamiliesModule.loadingList">
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
    await this.$store.dispatch('FamiliesModule/getListEntries', this.$route.params.code)
    await this.$store.dispatch('FamiliesModule/getListTypes', this.$route.params.code)
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
    '$store.state.FamiliesModule.entry.id': {
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

        this.$store.dispatch('setTitle', this.$store.state.FamiliesModule.entry.name)
      }
    },
    '$route.query.action': {
      handler(newValue) {
        if (newValue === 'create') {
          this.$store.commit('FamiliesModule/clearEntry');
        }
      }
    },
    '$route.params.id': {
      handler(newValue) {
        if (!newValue) {
          this.$store.commit('FamiliesModule/clearEntry');
        }
      }
    },
    '$store.state.FamiliesModule.entry.e_client_files': {
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
      formData.append('id_nomenclature_family', _store.entry.id)
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
      this.$refs.FamilyDropZone.removeAllFiles();
    },
    insertDropzoneData() {
      if (!this.stateDropzone) return;
      if (!this.dropzone_uploaded.length) return;

      this.$nextTick(() => {
        this.$refs.FamilyDropZone.manuallyAddFile(this.dropzone_uploaded[0], this.dropzone_uploaded[0].full_path)
      })
    },
    async updateDropZoneImage() {
      if (!this.dropzone_uploaded.length) return;

      await Request.put(
          this.$store.state.BASE_URL + '/entity/files/' + this.dropzone_uploaded[0].id,
          this.dropzone_uploaded[0])
    },
    async onSubmitLocal() {
      await this.$store.dispatch('FamiliesModule/onSubmit');
      if (this.$route.query.action === 'create') {
        await this.$router.replace({
          path: this.$route.path + '/' + this.$store.state.FamiliesModule.entry.id,
          query: {action: 'edit'},
        }).catch(() => {});
      } else {
        await this.$router.replace({
          path: this.$route.meta.returnLink.path,
        }).catch(() => {});
      }
    },
    async setFamily(value){
      if (! value) {
        this.$store.commit('FamilyModule/clearEntry');
        return false;
      }

      if (this.$store.getters.checkValueIsAnObject(value)){
        await this.$store.commit('FamiliesModule/setEntry', value)
        // await this.$store.dispatch('FamiliesModule/getListDictionaryAttribute')
      }

      if (typeof value === 'string') {
        this.$store.state.FamiliesModule.entry.name = value
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

      await this.$store.dispatch('FamiliesModule/deleteEntry');
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