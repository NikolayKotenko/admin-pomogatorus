<template>
  <div class="detail_container">
    <v-container class="main_wrapper">
      <template v-if="$store.getters.stateEditCreate($route.query.action)">
        <v-text-field
            ref="nomenclature-name"
            v-model="$store.state.NomenclaturesModule.entry.name"
            :disabled="$store.state.NomenclaturesModule.loadingList"
            class="mb-0 mt-5"
            dense
            label="Название модели"
            outlined
            required
            type="text"
        ></v-text-field>
      </template>
      <template v-else>
        <v-autocomplete
            v-model="$store.state.NomenclaturesModule.entry"
            :disabled="$store.state.NomenclaturesModule.loadingList"
            :items="$store.state.NomenclaturesModule.listEntries"
            :loading="$store.state.NomenclaturesModule.loadingList"
            class="mb-5 mt-5"
            dense
            hide-details
            item-text="name"
            item-value="id"
            label="Поиск по номенклатурам"
            outlined
            return-object
        >
        </v-autocomplete>
      </template>
      <v-text-field
          ref="nomenclature-vendor-code"
          v-model="$store.state.NomenclaturesModule.entry.vendor_code"
          :disabled="$store.state.NomenclaturesModule.loadingList"
          class="mb-0 mt-5"
          dense
          label="Артикул"
          outlined
          required
          type="text"
      ></v-text-field>

      <v-list elevation="1" subheader>
        <v-subheader>Семейство</v-subheader>
        <v-combobox
            v-model="$store.state.NomenclaturesModule.entry.family"
            :disabled="$store.state.NomenclaturesModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            :items="$store.state.NomenclaturesModule.listFamily" :loading="$store.state.NomenclaturesModule.loadingList"
            chips
            class="role_user pa-2 pt-0 ma-0 "
            clearable
            hide-details
            item-text="name"
        >
        </v-combobox>
      </v-list>


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
      <!--                            :disabled="$store.state.NomenclaturesModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"-->
      <!--                            :items="$store.state.NomenclaturesModule.listCharacteristic" :loading="$store.state.NomenclaturesModule.loadingList"-->
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
            v-if="$store.state.NomenclaturesModule.entry.id"
            :disabled="$store.state.NomenclaturesModule.loadingList || !$store.state.NomenclaturesModule.entry.id"
            color="red darken-1"
            text
            @click="$store.dispatch('NomenclaturesModule/stateModalAction', true)"
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
            :disabled="! $store.getters.stateEditCreate($route.query.action) || $store.state.NomenclaturesModule.loadingList"
            class="detail_footer__save_btn"
            color="blue darken-1"
            text
            @click.prevent="onSubmitLocal()"
        >
          Сохранить
        </v-btn>
      </v-container>
    </footer>

  </div>
</template>

<script>
// import Request from "@/services/request";
// import nomenclatureStore from "@/store/modules/nomenclatures";

// const _store = nomenclatureStore.state

export default {
  name: "NomenclatureForm",
  data() {
    return {
      headers: [
        {text: 'Характеристика', value: 'characteristic'},
        {text: 'Значение', value: 'value'},
        {text: 'Постфикс', value: 'postfix'},
        {text: 'Действия', value: 'actions', sortable: false}
      ],
      // items: this.$store.state.NomenclaturesModule.entry.characteristics, // данные полученные с API
      // characteristics: [], // данные полученные с API для выпадающего списка
      dialog: false,
      formTitle: '',
      // editedItem: {},
      // dropzone_uploaded: [],
      // index_uploaded: 1,
      // stateDropzone: false,
    };
  },
  async mounted() {
    await this.$store.dispatch('NomenclaturesModule/getListEntries', this.$route.params.id)
    await this.$store.dispatch('NomenclaturesModule/getListFamily')
    // await this.$store.dispatch('NomenclaturesModule/getListCharacteristic')
  },
  methods: {
    setAlt(data) {
      this.dropzone_uploaded[data.index].alt_image = data.value
    },
    setTitle(data) {
      this.dropzone_uploaded[data.index].title_image = data.value
    },
    async deleteEntryLocal() {
      await this.$store.dispatch('NomenclaturesModule/deleteEntry');
      await this.$router.replace({query: null}).catch(() => {
      });
    },
    async onSubmitLocal() {
      await this.$store.dispatch('NomenclaturesModule/onSubmit', {}, {root: true});
      if (this.$route.query.action === 'create') {
        // await this.$router.replace({path: this.$route.path + '/' + this.$store.state.UsersModule.entry.id});
        await this.$router.replace({path: this.$route.meta.returnLink.path}).catch(() => {
        });
      } else {
        await this.$router.replace({path: this.$route.meta.returnLink.path}).catch(() => {
        });
      }
    },
    // editItem(item) {
    //   this.formTitle = 'Редактировать характеристику';
    //   // console.log(item);
    //   this.editedItem = {...item};
    //   this.dialog = true;
    // },
    // deleteItem() {
    //   // Отправка данных на API для удаления
    // },
    closeDialog() {
      this.dialog = false;
      this.editedItem = {};
    },
    // save() {
    //   let itemForEdit = this.$store.state.NomenclaturesModule.entry.characteristics.find(
    //       (element) => element.id === this.editedItem.id
    //   );
    //
    //   console.log(this.editedItem);
    //   console.log(itemForEdit);
    //   if (itemForEdit !== undefined) {
    //     itemForEdit.id = this.editedItem.characteristic.id || this.editedItem.id;
    //     itemForEdit.characteristic = this.editedItem.characteristic.name || this.editedItem.characteristic;
    //     itemForEdit.value = this.editedItem.value;
    //     itemForEdit.postfix = this.editedItem.postfix;
    //     this.closeDialog();
    //     return;
    //   }
    //
    //   this.$store.state.NomenclaturesModule.entry.characteristics.push({
    //     id: this.editedItem.characteristic.id || this.editedItem.id,
    //     characteristic: this.editedItem.characteristic.name || this.editedItem.characteristic,
    //     value: this.editedItem.value,
    //     postfix: this.editedItem.postfix
    //   });
    //
    //   // Отправка данных на API для сохранения или обновления
    //   this.closeDialog();
    // },
    // addNewCharacteristic(value) {
    //   if (!this.characteristics.includes(value)) {
    //     this.characteristics.push(value);
    //   }
    //
    //   // Добавляем новую строку в таблицу
    //   this.$store.state.NomenclaturesModule.entry.characteristics.push({
    //     id: this.editedItem.characteristic.id || this.editedItem.id,
    //     characteristic: this.editedItem.characteristic.name || this.editedItem.characteristic,
    //     value: this.editedItem.value,
    //     postfix: this.editedItem.postfix
    //   });
    //
    //
    //   // Сбрасываем значения в форме
    //   this.closeDialog();
    // },
    // /* DROPZONE */
    // sendingData(file, xhr, formData) {
    //   formData.append('uuid', file.upload.uuid)
    //   formData.append('id_nomenclature', _store.entry.id)
    // },
    // async successData(file, response) {
    //   console.log('successData')
    //   console.log(response)
    //   const formatObj = Object.assign({}, response.data)
    //   this.dropzone_uploaded.push(formatObj)
    //
    //   await this.$store.dispatch('onSubmit', {}, {root: true});
    //   await this.$router.replace({
    //     path: this.$route.path,
    //     query: this.$route.query
    //   }).catch(() => {
    //   });
    // },
    // async removedFile() {
    //   if (!this.dropzone_uploaded.length)
    //     return false;
    //
    //   await this.$store.dispatch('deleteFileGeneral', this.dropzone_uploaded[0].id);
    //   this.dropzone_uploaded = [];
    //   this.$refs.NomenclatureDropZone.removeAllFiles();
    // },
    // insertDropzoneData() {
    //   if (!this.stateDropzone) return;
    //   if (!this.dropzone_uploaded.length) return;
    //
    //   this.$nextTick(() => {
    //     this.$refs.NomenclatureDropZone.manuallyAddFile(this.dropzone_uploaded[0], this.dropzone_uploaded[0].full_path)
    //   })
    // },
    // async updateDropZoneImage() {
    //   if (!this.dropzone_uploaded.length) return;
    //
    //   await Request.put(
    //       this.$store.state.BASE_URL + '/entity/files/' + this.dropzone_uploaded[0].id,
    //       this.dropzone_uploaded[0])
    // },


  },
  computed: {
    // options() {
    //   return {
    //     url: this.$store.state.BASE_URL + '/entity/files',
    //     destroyDropzone: false,
    //     duplicateCheck: true,
    //     headers: {
    //       Authorization: this.$store.getters.getToken,
    //     },
    //   }
    // },
  },
  watch: {
    '$store.state.NomenclaturesModule.entry.id': {
      handler(newValue) {
        if (this.$route.query.action === 'create')
          return false;

        const currentQuery = this.$route.query;
        const idEntry = (newValue) ? newValue : '';
        this.$router.replace({
          path: '/nomenclatures/' + idEntry,
          query: currentQuery,
        }).catch(() => {
        });

        this.$store.dispatch('setTitle', this.$store.state.NomenclaturesModule.entry)
      }
    },
    '$route.query.action': {
      handler(newValue) {
        if (newValue === 'create') {
          this.$store.dispatch('NomenclaturesModule/clearEntry');
        }
      }
    },
    '$route.params.id': {
      handler(newValue) {
        if (!newValue) {
          this.$store.dispatch('NomenclaturesModule/clearEntry');
        }
      }
    },
    '$store.state.NomenclaturesModule.entry.e_client_files': {
      handler(newValue) {
        if (!newValue) return false;
        this.dropzone_uploaded = [];
        this.dropzone_uploaded = newValue;
      }
    },
  }
}
</script>

<style lang="scss" scoped>
//@import "src/assets/styles/detail";

</style>

<style lang="scss">
.role_user {
  .v-input__slot::before {
  }
}
</style>
