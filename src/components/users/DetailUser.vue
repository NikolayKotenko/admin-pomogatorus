<template>
  <div>
    <v-container class="mb-10">
      <template v-if="$store.getters.stateEditCreate($route.query.action)">
        <v-text-field
            ref="email_user"
            type="email"
            :rules="$store.state.emailRules"
            required
            class="mb-0 mt-5"
            outlined
            dense
            label="Email пользователя"
            v-model="$store.state.UsersModule.entry.email"
            :disabled="$store.state.UsersModule.loadingList"
        ></v-text-field>
      </template>
      <template v-else>
        <v-autocomplete
            outlined
            dense
            :loading="$store.state.UsersModule.loadingList"
            :disabled="$store.state.UsersModule.loadingList"
            label="Поиск по пользователю"
            :items="$store.state.UsersModule.listEntries"
            item-text="email"
            item-value="id"
            return-object
            v-model="$store.state.UsersModule.entry"
            class="mb-5 mt-5"
            hide-details
            :filter="customFilter"
        >
          <template v-slot:item="data">
            <v-list-item-content>
              <v-list-item-title>{{getFioUser(data.item)}}</v-list-item-title>
              <v-list-item-subtitle>{{ data.item.email }}</v-list-item-subtitle>
              <v-divider/>
            </v-list-item-content>
          </template>
        </v-autocomplete>
      </template>

      <!--Роли-->
      <v-combobox
          class=""
          outlined
          hide-details
          multiple chips
          v-model="$store.state.UsersModule.entry.groups"
          :items="$store.state.UsersModule.listGroups"
          item-text="name"
          :loading="$store.state.UsersModule.loadingList"
          :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
          clearable
          label="Роли пользователя"
      >
      </v-combobox>

      <v-checkbox
          class="pt-5"
          hide-details
          dense
          label="Собственник дома"
          v-model.number="$store.state.UsersModule.entry.home_owner"
          false-value="0"
          true-value="1"
          :loading="$store.state.UsersModule.loadingList"
          :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
      >
      </v-checkbox>
      <v-checkbox
          class="pt-5"
          hide-details
          dense
          label="Профессионально занимаюсь монтажом инженерных систем"
          v-model.number="$store.state.UsersModule.entry.installation_engineering_systems"
          false-value="0"
          true-value="1"
          :loading="$store.state.UsersModule.loadingList"
          :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
      >
      </v-checkbox>
      <v-checkbox
          class="pt-5 pb-5"
          hide-details
          dense
          label="Занимаюсь продажей инженерного оборудования"
          v-model.number="$store.state.UsersModule.entry.selling_engineering_equipment"
          false-value="0"
          true-value="1"
          :loading="$store.state.UsersModule.loadingList"
          :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
      >
      </v-checkbox>

      <!--Email phone -->
      <v-list outlined>
        <v-list-group :value="false" prepend-icon="mdi-card-account-phone">
          <template v-slot:activator>
            <v-list-item-title >Email / телефон</v-list-item-title>
          </template>
          <v-text-field
              type="email"
              ref="email_user"
              :rules="$store.state.emailRules"
              required
              class="pa-5 pb-0 pt-2"
              outlined
              dense
              label="Email пользователя"
              v-model="$store.state.UsersModule.entry.email"
              :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
          ></v-text-field>
          <v-checkbox
              class="pa-5 pt-0"
              hide-details
              dense
              label="Подтвержденный email"
              v-model.number="$store.state.UsersModule.entry.email_state"
              :loading="$store.state.UsersModule.loadingList"
              :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
          >
          </v-checkbox>
          <v-text-field
              class="pa-5 pb-0 pt-2"
              outlined
              dense
              label="Телефон пользователя"
              v-model="$store.state.UsersModule.entry.telephone"
              :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
          ></v-text-field>
          <v-checkbox
              class="pa-5 pt-0"
              hide-details
              dense
              label="Подтвержденный телефон"
              v-model.number="$store.state.UsersModule.entry.telephone_state"
              :loading="$store.state.UsersModule.loadingList"
              :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
          >
          </v-checkbox>
        </v-list-group>
      </v-list>

      <!--Основная информация-->
      <v-list outlined>
        <v-list-group :value="false" prepend-icon="mdi-email">
          <template v-slot:activator>
              <v-list-item-title >Основная информация</v-list-item-title>
          </template>
          <v-text-field
              class="pa-2"
              outlined
              dense
              hide-details
              label="Имя пользователя"
              v-model="$store.state.UsersModule.entry.first_name"
              :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
          ></v-text-field>
          <v-text-field
              class="pa-2"
              outlined
              dense
              hide-details
              label="Фамилия пользователя"
              v-model="$store.state.UsersModule.entry.last_name"
              :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
          ></v-text-field>
          <v-text-field
              class="pa-2"
              outlined
              dense
              hide-details
              label="Отчество пользователя"
              v-model="$store.state.UsersModule.entry.middle_name"
              :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
          ></v-text-field>
        </v-list-group>
      </v-list>

      <!-- Соц сети -->
      <v-list outlined>
        <v-list-group :value="false" prepend-icon="mdi-instagram">
          <template v-slot:activator>
            <v-list-item-title >Социальные сети</v-list-item-title>
          </template>
          <v-text-field
              class="pa-2"
              outlined
              dense
              hide-details
              label="vk"
              v-model="$store.state.UsersModule.entry.vk"
              :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
          ></v-text-field>
          <v-text-field
              class="pa-2"
              outlined
              dense
              hide-details
              label="tiktok"
              v-model="$store.state.UsersModule.entry.tiktok"
              :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
          ></v-text-field>
          <v-text-field
              class="pa-2"
              outlined
              dense
              hide-details
              label="instagram"
              v-model="$store.state.UsersModule.entry.instagram"
              :disabled="$store.state.UsersModule.loadingList || !$store.getters.stateEditCreate($route.query.action)"
          ></v-text-field>
        </v-list-group>
      </v-list>

    </v-container>

    <footer class="detail_footer">
      <v-btn
          color="red darken-1"
          :disabled="$store.state.UsersModule.loadingList || !$store.state.UsersModule.entry.id"
          text
          @click="$store.dispatch('UsersModule/stateModalAction', true)"
      >
        Удалить
      </v-btn>
      <v-btn
          :disabled="! $store.getters.stateEditCreate($route.query.action) || $store.state.UsersModule.loadingList"
          color="blue darken-1"
          text
          @click.prevent="onSubmitLocal()"
      >
        Сохранить
      </v-btn>
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
              color="blue darken-1"
              text
              @click="$store.dispatch('UsersModule/stateModalAction', false)"
              :disabled="$store.state.UsersModule.loadingList"
              :loading="$store.state.UsersModule.loadingList"
          >
            Нет
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              color="red darken-1"
              text
              :disabled="$store.state.UsersModule.loadingList"
              :loading="$store.state.UsersModule.loadingList"
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
  methods:{
    async deleteEntryLocal(){
      await this.$store.dispatch('UsersModule/deleteEntry');
      await this.$router.replace({query: null}).catch(()=>{});
    },
    async onSubmitLocal(){
      if (this.$refs.email_user.validate(true) === false)
        return false

      await this.$store.dispatch('UsersModule/onSubmit', {},{root:true});
      if (this.$route.query.action === 'create'){
        await this.$router.replace({path: this.$route.path+'/'+this.$store.state.UsersModule.entry.id});
      }
      else{
        await this.$router.replace({path: this.$route.path});
      }
    },
    customFilter (item, queryText) {
      const first_name = (item.first_name) ? item.first_name.toLowerCase() : null;
      const middle_name = (item.middle_name) ? item.middle_name.toLowerCase() : null;
      const last_name = (item.last_name) ? item.last_name.toLowerCase() : null;
      const email = (item.email) ? item.email.toLowerCase() : null;

      const data = email + first_name + middle_name + last_name
      const searchText = queryText.toLowerCase()

      return data.indexOf(searchText) > -1
    },
    getFioUser(entry){
      const first_name = (entry.first_name) ? entry.first_name : '';
      const middle_name = (entry.middle_name) ? entry.middle_name : '';
      const last_name = (entry.last_name) ? entry.last_name : '';
      return first_name+' '+ middle_name+' '+last_name
    }
  },
  computed:{},
  watch: {
    '$store.state.UsersModule.entry.id': {
      handler(newValue) {
        if (this.$route.query.action === 'create')
          return false;

        const currentQuery = this.$route.query;
        const idEntry = (newValue) ? newValue : '';
        this.$router.replace({
          path: '/users/'+idEntry,
          query: currentQuery,
        }).catch(()=>{});

        this.$store.dispatch('setTitle', this.$store.state.UsersModule.entry.email)
      }
    },
    '$route.query.action': {
      handler(newValue) {
        if (newValue === 'create'){
          this.$store.dispatch('UsersModule/clearEntry');
        }
      }
    },
    '$route.params.id': {
      handler(newValue) {
        if (!newValue){
          this.$store.dispatch('UsersModule/clearEntry');
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/detail";

</style>