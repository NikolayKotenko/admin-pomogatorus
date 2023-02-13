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
          @change-select="setDictionaryAttribute"
      ></SelectStyled>

      <!-- Атрибуты справочника -->
      <div v-if="$store.state.DictionariesModule.listAttributesByDictionary.length">
        <div class="wrapper_attached_attribute"
             v-for="(obj,key) in $store.state.DictionariesModule.listAttributesByDictionary"
             :key="key"
        >
          <InputStyled
              :data="obj.name"
              :item-text="obj.name"
              :item-value="obj.name"
              :placeholder="'Наименование атрибута'"
          ></InputStyled>
          <InputStyled
              :data="obj.value"
              :item-text="obj.value"
              :item-value="obj.value"
              :placeholder="'Значение атрибута'"
          ></InputStyled>
        </div>
      </div>
      <div class="wrapper_new_attribute">
        <InputStyled
            :data="newAttribute.name"
            :placeholder="'Новый атрибут справочника'"
            @update-input="setNameAttribute"
        ></InputStyled>
        <InputStyled
            :data="newAttribute.value"
            :placeholder="'Новое значение атрибута справочника'"
            @update-input="setValueAttribute"
        ></InputStyled>
        <v-btn @click="postNewAttribute">Добавить</v-btn>
      </div>

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

    <!--  MODALS  -->
    <v-dialog
        v-model="$store.state.DictionariesModule.deleteModal"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important;">Вы точно хотите удалить параметр объекта?</span>
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
import SelectStyled from "@/components/common/SelectStyled";
import InputStyled from "@/components/common/InputStyled";
import {DictionaryAttribute} from "@/helpers/constructors";

export default {
  name: "Dictionaries",
  components:{
    InputStyled,
    SelectStyled,
  },
  data: () => ({
    newAttribute: new DictionaryAttribute()
  }),
  async mounted() {
    await this.$store.dispatch('DictionariesModule/getListEntries', this.$route.params.code)
    await this.$store.dispatch('DictionariesModule/getInfoByEntry')
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
        console.log('SADAS', id)
        this.newAttribute.id_dictionary = id;
      }
    },
    '$route.query.action': {
      handler(newValue) {
        if (newValue === 'create') {
          this.$store.dispatch('DictionariesModule/clearEntry');
        }
      }
    },
    '$route.params.code': {
      handler(newValue) {
        if (!newValue) {
          this.$store.dispatch('DictionariesModule/clearEntry');
        }
      }
    },
  },
  methods:{
    setNameAttribute(value){
      this.newAttribute.name = value
    },
    setValueAttribute(value){
      this.newAttribute.value = value;
    },
    setDictionaryAttribute(obj){
      this.$store.commit('DictionariesModule/setEntry', obj)
    },
    async postNewAttribute(){
      const response = await this.$store.dispatch(
          'DictionariesModule/createAttribute',
          new DictionaryAttribute(
              this.newAttribute.name,
              this.newAttribute.value,
              this.newAttribute.id_dictionary
          )
      );
      console.log(response)
    }
  }
}
</script>

<style lang="scss" scoped>
.container.main_wrapper{
  grid-row-gap: 1em;
  display: grid;
}
.wrapper_attached_attribute{
  margin-top: 1em;
  display: grid;
  grid-row-gap: 1em;
  grid-column-gap: 1em;
  grid-template-columns: 1fr 1fr;
}
.wrapper_new_attribute{
  position: fixed;
  bottom: 50px;
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  width: 97%;
  grid-column-gap: 1em;
}

</style>