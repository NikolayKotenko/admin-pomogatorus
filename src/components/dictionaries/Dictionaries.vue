<template>
  <div class="detail_container">
    <v-container class="main_wrapper">
      <!-- Сам справочник  -->
      <SelectStyled
          :items="$store.state.DictionariesModule.listEntries"
          :data="$store.state.DictionariesModule.entry"
          :item-text="'name'"
          :item-value="'code'"
          :placeholder="'Список справочников'"
          @update-input="setDictionary"
      ></SelectStyled>

      <!-- Атрибуты справочника -->
      <v-data-table
          :calculate-widths="true"
          :headers="headers"
          :items="$store.state.DictionariesModule.listAttributesByDictionary"
          :loading="$store.state.DictionariesModule.loadingList"
          class="elevation-1 table_dictionary_attributes"
          loading-text="Loading... Please wait"
          hide-default-footer
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-toolbar-title class="table_dictionary_attributes__header">Таблица атрибутов</v-toolbar-title>
            <v-divider
                class="mx-4"
                inset
                vertical
            ></v-divider>
            <v-spacer></v-spacer>
            <v-dialog v-model="dialog">
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                    @click="addNewAttribute"
                >
                  Добавить
                </v-btn>
              </template>
              <v-card>
                <v-card-title class="text-h6 d-block text-center">{{ formTitle }}</v-card-title>
                <v-card-text class="table_dictionary_attributes__modal_item">
                  <v-text-field
                      v-model="editedItem.name"
                      label="Наименование"
                  ></v-text-field>
                  <v-text-field
                      v-model="editedItem.value"
                      label="Значение"
                  ></v-text-field>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="blue darken-1" text class="mr-auto" @click="dialog = false">
                    Отмена
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="postNewAttribute">
                    Сохранить
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete">
            <v-card>
              <v-card-title class="text-h6 d-block text-center">Вы действительно хотите удалить атрибут ?</v-card-title>
              <v-card-text class="table_dictionary_attributes__modal_item">
                <v-text-field
                    v-model="editedItem.name"
                    label="Наименование"
                    readonly
                ></v-text-field>
                <v-text-field
                    v-model="editedItem.value"
                    readonly
                    label="Значение"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn color="blue darken-1" text class="mr-auto" @click="dialogDelete = false">
                  Отмена
                </v-btn>
                <v-btn color="blue darken-1" text @click="deleteAttribute">
                  Удалить
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon
              small
              class="mr-2"
              @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
              small
              @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
        <template v-slot:no-data>
          Не найдено атрибутов у этого справочника
        </template>
      </v-data-table>

    </v-container>

    <footer class="detail_footer">
      <v-container>
        <v-btn
            v-if="$store.state.DictionariesModule.entry.code"
            :disabled="$store.state.DictionariesModule.loadingList"
            color="red darken-1"
            text
            @click="$store.dispatch('DictionariesModule/stateModalAction', true)"
        >
          Удалить
        </v-btn>
        <v-btn
            v-if="$route.query.action"
            :disabled="$store.state.DictionariesModule.loadingList"
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
        >
          Сохранить
        </v-btn>
      </v-container>
    </footer>

    <v-overlay :value="$store.state.DictionariesModule.loadingList">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import SelectStyled from "@/components/common/SelectStyled";
import {DictionaryAttribute} from "@/helpers/constructors";

export default {
  name: "Dictionaries",
  components:{
    SelectStyled,
  },
  data: () => ({
    headers: [
      {
        id: 0,
        text: "#",
        groupable: false,
        sortable: true,
        value: "id",
        width: '10%',
        groupByName: 'id'
      },
      {
        id: 1,
        text: "Наименование атрибута",
        groupable: false,
        sortable: false,
        value: "name",
        width: '40%',
        groupByName: 'name'
      },
      {
        id: 2,
        text: "Значение атрибута",
        groupable: false,
        sortable: false,
        value: "value",
        width: '40%',
        groupByName: 'value'
      },
      {
        id: 3,
        text: 'Actions',
        value: 'actions',
        sortable: false
      },
    ],
    dialog: false,
    dialogDelete: false,
    editedId: -1,
    editedItem: new DictionaryAttribute(),
    defaultItem: new DictionaryAttribute(),
  }),
  async mounted() {
    await this.$store.dispatch('DictionariesModule/getListEntries', this.$route.params.code)
    await this.$store.dispatch('DictionariesModule/getListDictionaryAttribute')
  },
  computed: {
    formTitle () {
      return this.editedId === -1 ? 'Создание атрибута' : 'Редактирование атрибута'
    },
  },
  watch: {
    '$store.state.DictionariesModule.entry.code': {
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

        this.$store.dispatch('setTitle', this.$store.state.DictionariesModule.entry.name)
      }
    },
    '$store.state.DictionariesModule.entry.id': {
      handler(id) {
        this.editedItem.id_dictionary = id;
      }
    },
    '$route.query.action': {
      handler(newValue) {
        if (newValue === 'create') {
          this.$store.dispatch('DictionariesModule/clearEntry');
        }
      }
    },
    // '$route.params.code': {
    //   handler(newValue) {
    //     if (!newValue) {
    //       this.$store.dispatch('DictionariesModule/clearEntry');
    //     }
    //   }
    // },
  },
  methods:{
    async setDictionary(obj){
      await this.$store.commit('DictionariesModule/setEntry', obj)
      await this.$store.dispatch('DictionariesModule/getListDictionaryAttribute')
    },
    async postNewAttribute(){
      await this.$store.dispatch(
          'DictionariesModule/createAttribute',
          new DictionaryAttribute(
              this.editedItem.id,
              this.editedItem.code,
              this.editedItem.name,
              this.editedItem.value,
              this.editedItem.id_dictionary
          )
      );
      this.dialog = false;
    },
    deleteItem(item){
      this.dialogDelete = true
      this.editedItem = item
    },
    editItem (item) {
      this.editedId = this.$store.state.DictionariesModule.listAttributesByDictionary
        .filter((obj) => { return item.id === obj.id })
        .map((obj) => { return obj.id; })[0]
      ;
      this.editedItem = item
      this.dialog = true
    },
    addNewAttribute(){
      this.editedItem = new DictionaryAttribute(
          null,
          '',
          '',
          '',
          this.$store.state.DictionariesModule.entry.id
      );
      this.editedId = -1;
      this.dialog = true;
    },
    async deleteAttribute(){
      await this.$store.dispatch('DictionariesModule/deleteAttribute', this.editedItem.code)
      this.dialogDelete = false
    }
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
    padding-top: 1em!important;
    padding-bottom: 1em!important;
    display: inline-flex;
    grid-column-gap: 1em;
  }
}

</style>