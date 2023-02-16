<template>
  <div class="detail_container">
    <v-container class="main_wrapper">
      <!-- Сам справочник  -->
      <template v-if="$store.getters.stateEditCreate($route.query.action)">
        <InputStyled
            :current-rules="$store.state.nameRules"
            :data="$store.state.DictionariesModule.entry.name"
            :is-clearable="true"
            :is-disabled="$store.state.DictionariesModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            :is-outlined="true"
            :is-required="true"
            :item-text="'name'"
            :item-value="'name'"
            :placeholder="'Имя справочника'"
            class="mb-5"
            @update-input="setDictionary"
            @change-input="onSubmitLocal"
        />
      </template>
      <template v-else>
        <SelectStyled
            :items="$store.state.DictionariesModule.listEntries"
            :data="$store.state.DictionariesModule.entry"
            :item-text="'name'"
            :item-value="'code'"
            :placeholder="'Список справочников'"
            @update-input="setDictionary"
        ></SelectStyled>
      </template>

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
                      v-model="editedItem.sort"
                      label="Сортировка"
                  ></v-text-field>
                  <ComboboxStyled
                      v-if="dialog"
                      :data="editedItem.value"
                      :is-items="$store.state.DictionariesModule.listOccurrencesAttributes"
                      :is-item-text="'value'"
                      :is-item-value="'code'"
                      :is-outlined="false"
                      :is-hide-details="false"
                      :is-placeholder="'Значение'"
                      :is-loading="$store.state.DictionariesModule.loadingOccurrencesAttributes"
                      @update-search-input="findSearchAttribute"
                      @change-search="setSearchAttribute"
                  ></ComboboxStyled>
                </v-card-text>

                <v-card-actions>
                  <v-btn color="blue darken-1" text class="mr-auto" @click="dialog = false">
                    Отмена
                  </v-btn>
                  <v-btn color="blue" :disabled="! editedItem.value" text @click="postNewAttribute">
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
                    v-model="editedItem.sort"
                    label="Сортировка"
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
            @click.prevent="onSubmitLocal()"
        >
          Сохранить
        </v-btn>
      </v-container>
    </footer>

    <v-dialog
        v-model="$store.state.DictionariesModule.deleteModal"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important;">Вы точно хотите удалить справочник со всеми параметрами ?</span>
        </v-card-title>
        <v-card-actions>
          <v-btn
              :disabled="$store.state.DictionariesModule.loadingList"
              :loading="$store.state.DictionariesModule.loadingList"
              color="blue darken-1"
              text
              @click="$store.dispatch('DictionariesModule/stateModalAction', false)"
          >
            Нет
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              :disabled="$store.state.DictionariesModule.loadingList"
              :loading="$store.state.DictionariesModule.loadingList"
              color="red darken-1"
              text
              @click="deleteLocal()"
          >
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="$store.state.DictionariesModule.loadingList">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import InputStyled from "@/components/common/InputStyled";
import SelectStyled from "@/components/common/SelectStyled";
import {DictionaryAttribute} from "@/helpers/constructors";
import ComboboxStyled from "@/components/common/ComboboxStyled";

export default {
  name: "Dictionaries",
  components:{
    InputStyled,
    ComboboxStyled,
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
        text: "Сортировка",
        groupable: false,
        sortable: false,
        value: "sort",
        width: '20%',
        groupByName: 'sort'
      },
      {
        id: 2,
        text: "Значение атрибута",
        groupable: false,
        sortable: false,
        value: "value",
        width: '50%',
        groupByName: 'value'
      },
      {
        id: 3,
        text: 'Actions',
        value: 'actions',
        sortable: false,
        width: '20%',
      },
    ],
    dialog: false,
    dialogDelete: false,
    editedId: -1,
    editedItem: new DictionaryAttribute(),
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
    '$route.query.action': {
      handler(newValue) {
        if (newValue === 'create') {
          this.$store.commit('DictionariesModule/clearEntry');
        }
      }
    },
    '$route.params.code': {
      handler(newValue) {
        if (!newValue) {
          this.$store.commit('DictionariesModule/clearEntry');
          this.$store.commit('DictionariesModule/clearListAttributesByDictionary')
        }
      }
    },
  },
  methods:{
    async onSubmitLocal() {
      await this.$store.dispatch('DictionariesModule/onSubmit');
      if (this.$route.query.action === 'create') {
        await this.$router.replace({
          path: this.$route.path + '/' + this.$store.state.DictionariesModule.entry.code,
          query: {action: 'edit'},
        }).catch(() => {});
      } else {
        await this.$router.replace({
          path: this.$route.meta.returnLink.path,
        }).catch(() => {});
      }
    },
    async setDictionary(value){
      console.log('setDictionary', value)
      if (! value) return false;

      if (this.$store.getters.checkValueIsAnObject(value)){
        console.log('setDictionary OBJ')
        await this.$store.commit('DictionariesModule/setEntry', value)
        await this.$store.dispatch('DictionariesModule/getListDictionaryAttribute')
      }

      if (typeof value === 'string') {
        console.log('setDictionary STRING')
        this.$store.state.DictionariesModule.entry.name = value
      }
    },
    async postNewAttribute(){
      await this.$store.dispatch(
          'DictionariesModule/createAttribute',
          new DictionaryAttribute(
              this.editedItem.id,
              this.editedItem.sort,
              this.editedItem.code,
              this.editedItem.value,
              this.$store.state.DictionariesModule.entry.id
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
      this.editedItem = Object.assign({}, item);
      this.dialog = true
    },
    addNewAttribute(){
      this.editedItem = new DictionaryAttribute();
      this.$store.commit('DictionariesModule/clearListOccurrencesAttributes');
      this.editedId = -1;
      this.dialog = true;
    },
    async deleteAttribute(){
      await this.$store.dispatch('DictionariesModule/deleteAttribute', this.editedItem.code)
      this.dialogDelete = false
    },
    async findSearchAttribute(string){
      await this.$store.dispatch('DictionariesModule/searchDictionaryAttributeByValue', string)
    },
    setSearchAttribute(value){
      if (! value) this.editedItem.value = ''

      if (this.$store.getters.checkValueIsAnObject(value))
        this.editedItem = value;

      if (typeof value === 'string')
        this.editedItem.value = value
    },
    async deleteLocal() {
      for (const obj of this.$store.state.DictionariesModule.listAttributesByDictionary) {
        await this.$store.dispatch('DictionariesModule/deleteAttribute', obj.code);
      }

      await this.$store.dispatch('DictionariesModule/deleteEntry');
      await this.$router.push({path: this.$route.meta.returnLink.path}).catch(() => {});
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