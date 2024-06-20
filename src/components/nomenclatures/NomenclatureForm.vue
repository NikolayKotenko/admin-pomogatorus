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
            @change="$store.state.NomenclaturesModule.entry.id_family = ($event) ? $event.id : null"
            v-model="$store.state.NomenclaturesModule.entry._family"
            :disabled="$store.state.NomenclaturesModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            :items="$store.state.NomenclaturesModule.listFamily" :loading="$store.state.NomenclaturesModule.loadingList"
            chips
            class="role_user pa-2 pt-0 ma-0 "
            clearable
            hide-details
            item-text="name"
            item-value="id"
        >
        </v-combobox>
      </v-list>

    <!-- TODO
          Нужен компонент табличного вида на 2 колонки "ключ характеристики" - "значение"
          плюс снизу кнопка отрисовки новой характеристики
     -->
    <Characteristics/>

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

import Characteristics from "@/components/nomenclatures/Characteristics";
export default {
  name: "NomenclatureForm",
  components: {Characteristics},
  data() {
    return {
      headers: [
        {text: 'Характеристика', value: 'characteristic'},
        {text: 'Значение', value: 'value'},
        {text: 'Постфикс', value: 'postfix'},
        {text: 'Действия', value: 'actions', sortable: false}
      ],
      dialog: false,
      formTitle: '',
    };
  },
  async mounted() {
    await this.$store.dispatch('NomenclaturesModule/getListEntries', this.$route.params.id)
    await this.$store.dispatch('NomenclaturesModule/getListFamily')
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
        await this.$router.replace({path: this.$route.meta.returnLink.path}).catch(() => {
        });
      } else {
        await this.$router.replace({path: this.$route.meta.returnLink.path}).catch(() => {
        });
      }
    },
    closeDialog() {
      this.dialog = false;
      this.editedItem = {};
    }

  },
  computed: {
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
