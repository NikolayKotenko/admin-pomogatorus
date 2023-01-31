<template>
  <div>
    <v-container class="wrap_detail_user mb-10">
      <template v-if="$store.getters.stateEditCreate($route.query.action)">
        <v-text-field
            ref="email_user"
            v-model="$store.state.UsersModule.entry.email"
            :disabled="$store.state.UsersModule.loadingList"
            :rules="$store.state.emailRules"
            class="mb-0 mt-5"
            dense
            label="Email пользователя"
            outlined
            required
            type="email"
        ></v-text-field>
      </template>
      <template v-else>
        <v-autocomplete
            v-model="$store.state.UsersModule.entry"
            :disabled="$store.state.UsersModule.loadingList"
            :filter="customFilter"
            :items="$store.state.UsersModule.listEntries"
            :loading="$store.state.UsersModule.loadingList"
            class="mb-5 mt-5"
            dense
            hide-details
            item-text="email"
            item-value="id"
            label="Поиск по пользователю"
            outlined
            return-object
        >
          <template v-slot:item="data">
            <v-list-item-content>
              <v-list-item-title>{{ getFioUser(data.item) }}</v-list-item-title>
              <v-list-item-subtitle>{{ data.item.email }}</v-list-item-subtitle>
              <v-divider/>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </template>

      <!--Роли-->
      <v-list elevation="1" subheader>
        <v-subheader>Роли пользователя</v-subheader>
        <v-combobox
            v-model="$store.state.UsersModule.entry.groups"
            :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            :items="$store.state.UsersModule.listGroups" :loading="$store.state.UsersModule.loadingList"
            chips
            class="role_user pa-2 pt-0 ma-0"
            clearable
            hide-details
            item-text="name"
            multiple
        >
        </v-combobox>
      </v-list>

      <!--Основная информация-->
      <v-list elevation="1" subheader>
        <v-subheader>Основная информация</v-subheader>
        <v-text-field
            v-model="$store.state.UsersModule.entry.last_name"
            :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            class="pa-2"
            dense
            hide-details
            label="Фамилия пользователя"
            outlined
        ></v-text-field>
        <v-text-field
            v-model="$store.state.UsersModule.entry.first_name"
            :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            class="pa-2"
            dense
            hide-details
            label="Имя пользователя"
            outlined
        ></v-text-field>
        <v-text-field
            v-model="$store.state.UsersModule.entry.middle_name"
            :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            class="pa-2"
            dense
            hide-details
            label="Отчество пользователя"
            outlined
        ></v-text-field>
      </v-list>

      <!-- Деятельность пользователей -->
      <v-list elevation="1" subheader>
        <v-subheader>Деятельность пользователей</v-subheader>
        <v-checkbox
            v-model="$store.state.UsersModule.entry.home_owner"
            :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            :false-value="0"
            :loading="$store.state.UsersModule.loadingList"
            :true-value="1"
            class="pl-2"
            dense
            hide-details
            label="Собственник дома"
        >
        </v-checkbox>
        <v-checkbox
            v-model="$store.state.UsersModule.entry.installation_engineering_systems"
            :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            :false-value="0"
            :loading="$store.state.UsersModule.loadingList"
            :true-value="1"
            class="pl-2 pt-2"
            dense
            hide-details
            label="Профессионально занимаюсь монтажом инженерных систем"
        >
        </v-checkbox>
        <v-checkbox
            v-model="$store.state.UsersModule.entry.selling_engineering_equipment"
            :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            :false-value="0"
            :loading="$store.state.UsersModule.loadingList"
            :true-value="1"
            class="pl-2 pt-2"
            dense
            hide-details
            label="Занимаюсь продажей инженерного оборудования"
        >
        </v-checkbox>
        <v-checkbox
            v-model="$store.state.UsersModule.entry.marketing_and_sales"
            :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            :false-value="0"
            :loading="$store.state.UsersModule.loadingList"
            :true-value="1"
            class="pl-2 pt-2"
            dense
            hide-details
            label="Маркетинг и продажи"
        >
        </v-checkbox>
      </v-list>

      <!--Контакты -->
      <v-list elevation="1" subheader>
        <v-subheader>Контакты</v-subheader>
        <v-checkbox
            v-model.number="$store.state.UsersModule.entry.email_state"
            :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            :loading="$store.state.UsersModule.loadingList"
            class="pl-2"
            dense
            hide-details
            label="Подтвержденный email"
        >
        </v-checkbox>
        <v-text-field
            ref="email_user"
            v-model="$store.state.UsersModule.entry.email"
            :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            :rules="$store.state.emailRules"
            class="pa-2 pt-3"
            dense
            label="Email пользователя"
            outlined
            required
            type="email"
        ></v-text-field>
        <v-checkbox
            v-model.number="$store.state.UsersModule.entry.telephone_state"
            :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            :loading="$store.state.UsersModule.loadingList"
            class="pl-2"
            dense
            hide-details
            label="Подтвержденный телефон"
        >
        </v-checkbox>
        <v-text-field
            v-model="$store.state.UsersModule.entry.telephone"
            :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            class="pa-2 pt-3"
            dense
            label="Телефон пользователя"
            outlined
        ></v-text-field>
      </v-list>

      <!-- Соц сети -->
      <v-list elevation="1" subheader>
        <v-subheader>Социальные сети</v-subheader>
        <v-text-field
            v-model="$store.state.UsersModule.entry.vk"
            :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            class="pa-2"
            dense
            hide-details
            label="vk"
            outlined
        ></v-text-field>
        <v-text-field
            v-model="$store.state.UsersModule.entry.tiktok"
            :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            class="pa-2"
            dense
            hide-details
            label="tiktok"
            outlined
        ></v-text-field>
        <v-text-field
            v-model="$store.state.UsersModule.entry.instagram"
            :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
            class="pa-2"
            dense
            hide-details
            label="instagram"
            outlined
        ></v-text-field>
      </v-list>

    </v-container>

    <footer class="detail_footer">
      <v-container>
        <v-btn
            v-if="$store.state.UsersModule.entry.id"
            :disabled="$store.state.UsersModule.loadingList || !$store.state.UsersModule.entry.id"
            color="red darken-1"
            text
            @click="$store.dispatch('UsersModule/stateModalAction', true)"
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
            :disabled="! $store.getters.stateEditCreate($route.query.action) || $store.state.UsersModule.loadingList"
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
        v-model="$store.state.UsersModule.deleteModal"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important;">Вы точно хотите удалить полльзователя ?</span>
        </v-card-title>
        <v-card-actions>
          <v-btn
              :disabled="$store.state.UsersModule.loadingList"
              :loading="$store.state.UsersModule.loadingList"
              color="blue darken-1"
              text
              @click="$store.dispatch('UsersModule/stateModalAction', false)"
          >
            Нет
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              :disabled="$store.state.UsersModule.loadingList"
              :loading="$store.state.UsersModule.loadingList"
              color="red darken-1"
              text
              @click="deleteEntryLocal()"
          >
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "DetailUser",
  data: () => ({}),
  async mounted() {
    await this.$store.dispatch('UsersModule/getListEntries', this.$route.params.id)
    await this.$store.dispatch('UsersModule/getListGroups')
    await this.$store.dispatch('setTitle', this.$store.state.UsersModule.entry.email)
  },
  methods: {
    async deleteEntryLocal() {
      await this.$store.dispatch('UsersModule/deleteEntry');
      await this.$router.replace({query: null}).catch(() => {
      });
    },
    async onSubmitLocal() {
      if (this.$refs.email_user.validate(true) === false)
        return false

      await this.$store.dispatch('UsersModule/onSubmit', {}, {root: true});
      if (this.$route.query.action === 'create') {
        await this.$router.replace({path: this.$route.path + '/' + this.$store.state.UsersModule.entry.id});
      } else {
        await this.$router.replace({path: this.$route.path});
      }
    },
    customFilter(item, queryText) {
      const first_name = (item.first_name) ? item.first_name.toLowerCase() : null;
      const middle_name = (item.middle_name) ? item.middle_name.toLowerCase() : null;
      const last_name = (item.last_name) ? item.last_name.toLowerCase() : null;
      const email = (item.email) ? item.email.toLowerCase() : null;

      const data = email + first_name + middle_name + last_name
      const searchText = queryText.toLowerCase()

      return data.indexOf(searchText) > -1
    },
    getFioUser(entry) {
      const first_name = (entry.first_name) ? entry.first_name : '';
      const middle_name = (entry.middle_name) ? entry.middle_name : '';
      const last_name = (entry.last_name) ? entry.last_name : '';
      return first_name + ' ' + middle_name + ' ' + last_name
    }
  },
  computed: {},
  watch: {
    '$store.state.UsersModule.entry.id': {
      handler(newValue) {
        if (this.$route.query.action === 'create')
          return false;

        const currentQuery = this.$route.query;
        const idEntry = (newValue) ? newValue : '';
        this.$router.replace({
          path: '/users/' + idEntry,
          query: currentQuery,
        }).catch(() => {
        });

        this.$store.dispatch('setTitle', this.$store.state.UsersModule.entry.email)
      }
    },
    '$route.query.action': {
      handler(newValue) {
        if (newValue === 'create') {
          this.$store.dispatch('UsersModule/clearEntry');
        }
      }
    },
    '$route.params.id': {
      handler(newValue) {
        if (!newValue) {
          this.$store.dispatch('UsersModule/clearEntry');
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
//@import "src/assets/styles/detail";

.wrap_detail_user {
  display: grid;
  grid-row-gap: 1em;
}
</style>

<style lang="scss">
.role_user {
  .v-input__slot::before {
  }
}
</style>
