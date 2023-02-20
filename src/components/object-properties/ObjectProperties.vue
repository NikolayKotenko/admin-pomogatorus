<template>
  <div class="detail_container">
    <v-container class="mt-5">
      <template v-if="$store.getters.stateEditCreate($route.query.action)">
        <InputStyled
            :current-rules="$store.state.nameRules"
            :data="$store.state.ObjectPropertiesModule.entry.name"
            :is-clearable="true"
            :is-disabled="$store.state.ObjectPropertiesModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            :is-outlined="true"
            :is-required="true"
            :item-text="'name'"
            :item-value="'name'"
            :placeholder="'Имя параметра'"
            class="mb-5"
            @update-input="setNameObjectProperty"
            @change-input="onSubmitLocal"
        />
      </template>
      <template v-else>
        <v-autocomplete
            v-model="$store.state.ObjectPropertiesModule.entry"
            :disabled="$store.state.ObjectPropertiesModule.loadingList"
            :items="$store.state.ObjectPropertiesModule.listEntries"
            :loading="$store.state.ObjectPropertiesModule.loadingList"
            class="mb-5"
            dense
            hide-details
            item-text="name"
            item-value="code"
            label="Выберите параметр"
            outlined
            return-object
        >
        </v-autocomplete>
      </template>

      <InputStyledSimple
          :data="$store.state.ObjectPropertiesModule.entry.sort"
          :is-disabled="$store.state.ObjectPropertiesModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
          :placeholder="'Сортировка'"
          :item-text="'name'"
          :item-value="'name'"
          :is-clearable="true"
          class="mb-5"
          @update-input="setSortObjectProperty"
      />
      <InputStyled
          :data="$store.state.ObjectPropertiesModule.entry.code"
          :is-disabled="true"
          :is-outlined="true"
          :placeholder="'Автоматически заполняемый псевдоним параметра'"
          class="mb-5"
      />
      <v-row>
        <v-col>
          <SelectStyled
              :data="$store.state.ObjectPropertiesModule.entry.id_type_property_object"
              :items="$store.state.ObjectPropertiesModule.listPropertyObject"
              :item-text="'name'"
              :item-value="'id'"
              :placeholder="'Тип параметра'"
              class="mb-5"
              :current-rules="$store.state.nameRules"
              :is-hide-details="false"
              :is-disabled="!$store.getters.stateEditCreate($route.query.action)"
              @update-input="setTypePropertyObject"
          />
        </v-col>
        <v-col cols="6"  v-if="$store.state.ObjectPropertiesModule.entry.d_property_objects.code === 'vybor-iz-spravocnika'">
          <ComboboxStyled
              :data="$store.state.ObjectPropertiesModule.entry.d_dictionaries.name"
              :is-items="$store.state.DictionariesModule.listEntries"
              :is-item-text="'name'"
              :is-item-value="'name'"
              :is-hide-details="false"
              :is-placeholder="'Справочник'"
              :is-disabled="!$store.getters.stateEditCreate($route.query.action)"
              @change-search="setDictionary"
          ></ComboboxStyled>
        </v-col>
      </v-row>
      <!-- Tags Component -->
      <UniversalTags
          :attached-tags="$store.state.ObjectPropertiesModule.entry.mtomtags"
          :list-tags="$store.state.ObjectPropertiesModule.listTags"
          :error-state="$store.state.responseTag.errorState"
          :error-messages="$store.state.responseTag.errorMessages"
          @createNewTag="createNewTag"
          @removeAttachedTag="removeAttachedTag"
          :disabled-new-tag="!$store.getters.stateEditCreate($route.query.action)"
      />
    </v-container>

    <footer class="detail_footer">
      <v-container>
        <v-btn
            v-if="$store.state.ObjectPropertiesModule.entry.code"
            :disabled="$store.state.ObjectPropertiesModule.loadingList"
            color="red darken-1"
            text
            @click="$store.dispatch('ObjectPropertiesModule/stateModalAction', true)"
        >
          Удалить
        </v-btn>
        <v-btn
            v-if="$route.query.action"
            :disabled="$store.state.ObjectPropertiesModule.loadingList"
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
        v-model="$store.state.ObjectPropertiesModule.deleteModal"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important;">Вы точно хотите удалить параметр объекта?</span>
        </v-card-title>
        <v-card-actions>
          <v-btn
              :disabled="$store.state.ObjectPropertiesModule.loadingList"
              :loading="$store.state.ObjectPropertiesModule.loadingList"
              color="blue darken-1"
              text
              @click="$store.dispatch('ObjectPropertiesModule/stateModalAction', false)"
          >
            Нет
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              :disabled="$store.state.ObjectPropertiesModule.loadingList"
              :loading="$store.state.ObjectPropertiesModule.loadingList"
              color="red darken-1"
              text
              @click="deleteLocal()"
          >
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-overlay :value="$store.state.ObjectPropertiesModule.loadingList">
      <v-progress-circular
          indeterminate
          size="64"
      ></v-progress-circular>
    </v-overlay>

  </div>
</template>

<script>
import InputStyled from "../common/InputStyled";
import InputStyledSimple from "../common/InputStyledSimple";
import SelectStyled from "@/components/common/SelectStyled";
import UniversalTags from "../UniversalTags";
import {Dictionary, DPropertyObject, MToMTags} from "@/helpers/constructors";
import ComboboxStyled from "@/components/common/ComboboxStyled";

export default {
  name: "ObjectProperties",
  components: {
    ComboboxStyled,
    SelectStyled,
    InputStyled,
    InputStyledSimple,
    UniversalTags,
  },
  data: () => ({}),
  async mounted() {
    await this.$store.dispatch('ObjectPropertiesModule/getListEntries', this.$route.params.code)
    await this.$store.dispatch('ObjectPropertiesModule/getInfoByEntry')
    await this.$store.dispatch('DictionariesModule/getListEntries')
  },
  methods:{
    setDictionary(value){
      if (! value){
        this.$store.state.ObjectPropertiesModule.entry.id_dictionary = null
        this.$store.state.ObjectPropertiesModule.entry.d_dictionaries = new Dictionary()
      }
      else{
        const objDictionary = this.$store.getters['DictionariesModule/getDictionaryByName'](value)
        this.$store.state.ObjectPropertiesModule.entry.id_dictionary = objDictionary.id
        this.$store.state.ObjectPropertiesModule.entry.d_dictionaries = objDictionary
      }
    },
    setTypePropertyObject(value){
      if (! value){
        this.$store.state.ObjectPropertiesModule.entry.id_type_property_object = null
        this.$store.state.ObjectPropertiesModule.entry.d_property_objects = new DPropertyObject()
      }

      if (this.$store.getters.checkValueIsAnObject(value)){
        this.$store.state.ObjectPropertiesModule.entry.id_type_property_object = value.id
        this.$store.state.ObjectPropertiesModule.entry.d_property_objects = value
      }
    },
    setNameObjectProperty(value) {
      this.$store.state.ObjectPropertiesModule.entry.name = value
    },
    setSortObjectProperty(value){
      this.$store.state.ObjectPropertiesModule.entry.sort = value
    },
    async deleteLocal() {
      for (const obj of this.$store.state.ObjectPropertiesModule.entry.mtomtags) {
        await this.$store.dispatch('removeAttachedTagMToMTable', obj.id);
      }

      await this.$store.dispatch('ObjectPropertiesModule/deleteEntry');
      await this.$router.push({path: this.$route.meta.returnLink.path}).catch(() => {});
    },
    async onSubmitLocal() {
      await this.$store.dispatch('ObjectPropertiesModule/onSubmit');
      if (this.$route.query.action === 'create') {
        await this.$router.replace({
          path: this.$route.path + '/' + this.$store.state.ObjectPropertiesModule.entry.code,
          query: {action: 'edit'},
        }).catch(() => {});
      } else {
        await this.$router.replace({
          path: this.$route.meta.returnLink.path,
        }).catch(() => {});
      }
    },
    async createNewTag(tagData){
      const objMToMTags = new MToMTags(
          tagData.id,
          null,
          null,
          null,
          this.$store.state.ObjectPropertiesModule.entry.id
      );

      const response = await this.$store.dispatch("addUniversalTagMToMTable", objMToMTags);
      if (response.codeResponse < 400) {
        await this.$store.dispatch('ObjectPropertiesModule/getListEntries', this.$route.params.code);
      }
    },
    async removeAttachedTag(MToMTagData){
      const response = await this.$store.dispatch('removeAttachedTagMToMTable', MToMTagData.id)
      if (response.codeResponse < 400) {
        await this.$store.dispatch('ObjectPropertiesModule/getListEntries', this.$route.params.code);
      }
    },
  },
  watch: {
    '$store.state.ObjectPropertiesModule.entry.code': {
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

        this.$store.dispatch('setTitle', this.$store.state.ObjectPropertiesModule.entry.name)
      }
    },
    '$route.query.action': {
      handler(newValue) {
        if (newValue === 'create') {
          this.$store.dispatch('ObjectPropertiesModule/clearEntry');
        }
      }
    },
    '$route.params.code': {
      handler(newValue) {
        if (!newValue) {
          this.$store.dispatch('ObjectPropertiesModule/clearEntry');
        }
      }
    },
    '$store.state.ObjectPropertiesModule.entry.d_property_objects.code':{
      handler(newValue) {
        if (newValue !== 'vybor-iz-spravocnika'){
          this.$store.state.ObjectPropertiesModule.entry.id_dictionary = null;
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/detail";

</style>