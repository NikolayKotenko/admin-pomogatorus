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
            :placeholder="'Введите имя параметра'"
            class="mb-5"
            @update-input="setData"
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

      <InputStyled
          :data="$store.state.ObjectPropertiesModule.entry.code"
          :is-disabled="true"
          :is-outlined="true"
          :placeholder="'Автоматически заполняемый псевдоним параметра'"
          class="mb-5"
      />
      <SelectStyled
          :data="$store.state.ObjectPropertiesModule.entry.id_type_property_object"
          :items="$store.state.ObjectPropertiesModule.listPropertyObject"
          :item-text="'name'"
          :item-value="'id'"
          :is-disabled="true"
          :is-outlined="true"
          :placeholder="'Тип параметра'"
          class="mb-5"
      />

      <!-- Tags Component -->
      <UniversalTags
          :attached-tags="$store.state.ObjectPropertiesModule.entry._all_tags"
          :list-tags="$store.state.ObjectPropertiesModule.listTags"
          @createNewTag="createNewTag"
      />

    </v-container>

    <footer class="detail_footer">
      <v-container>
        <v-btn
            :disabled="$store.state.ObjectPropertiesModule.loadingList || !$store.state.ObjectPropertiesModule.entry.code"
            color="red darken-1"
            text
            @click="$store.dispatch('ObjectPropertiesModule/stateModalAction', true)"
        >
          Удалить
        </v-btn>
        <v-btn
            :disabled="!$store.getters.stateEditCreate($route.query.action)"
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
          <span class="text-h6" style="font-size: 0.8em !important;">Вы точно хотите удалить тэг?</span>
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
import SelectStyled from "@/components/common/SelectStyled";
import UniversalTags from "../UniversalTags";

export default {
  name: "ObjectProperties",
  components: {
    SelectStyled,
    InputStyled,
    UniversalTags,
  },
  data: () => ({}),
  async mounted() {
    await this.$store.dispatch('ObjectPropertiesModule/getListEntries', this.$route.params.code)
    await this.$store.dispatch('ObjectPropertiesModule/getInfoByEntry')
  },
  methods:{
    setData(value) {
      this.$store.state.ObjectPropertiesModule.entry.name = value
    },
    async onChangeLocal() {
      if (this.$route.query.action !== 'create')
        return false;

      await this.$store.dispatch('ObjectPropertiesModule/createEntry');
      await this.$router.replace({
        path: this.$route.path + '/' + this.$store.state.ObjectPropertiesModule.entry.code,
        query: {
          action: 'edit'
        }
      }).catch(() => {
      });
    },
    async deleteLocal() {
      await this.$store.dispatch('ObjectPropertiesModule/deleteEntry');
      await this.$router.push({path: this.$route.meta.returnLink.path}).catch(() => {
      });
    },
    async onSubmitLocal() {
      await this.$store.dispatch('ObjectPropertiesModule/onSubmit', {}, {root: true});
      if (this.$route.query.action === 'create') {
        await this.$router.replace({path: this.$route.path + '/' + this.$store.state.ObjectPropertiesModule.entry.code}).catch(() => {
        });
      } else {
        await this.$router.replace({path: this.$route.path}).catch(() => {
        });
      }
    },
    async createNewTag(object){
      const response = await this.$store.dispatch(
          'ObjectPropertiesModule/setTagObjectProperty',
          {'selectedTag': object, 'code': this.$route.params.code }
      )
      console.log('createNewTag response', response);
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
  }
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/detail";

</style>