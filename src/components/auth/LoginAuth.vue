<template>
  <v-app>
    <div class="auth_container" contenteditable="false" :id="`component_wrapper-${index_component}`" :class="{insert_component_wrapper: isComponent}">
      <div class="insert_component_wrapper-header" contenteditable="false" v-if="isComponent">
        <img class="insert_component_wrapper-header__img" :src="require(`/src/assets/svg/closeIcon.svg`)" alt="close" @click="deleteQuestion()">
      </div>
      <v-form v-model="valid" class="login" @submit.prevent="localLoginCreateUser()" contenteditable="false">
      <v-container>
        <v-row>
          <h1>Авторизация</h1>
        </v-row>
      </v-container>
      <v-container>
          <v-text-field
              type="text"
              name="email_user"
              v-model="email_user"
              label="Введите почту"
              :rules="emailRules"
              single-line
              required
          ></v-text-field>
        <v-alert
            v-if="alert.state"
            transition="scale-transition"
            dismissible
            :type="alert.type"
            :value="alert.state"
            @input="alert.state = false"
        >
          <span v-html="alert.message"></span>
        </v-alert>
      </v-container>
      <v-container>
        <v-row>
          <v-btn type="submit"
                 color="primary"
                 elevation="2"
                 large
                 rounded
                 block
          >
            Войти
          </v-btn>
        </v-row>
      </v-container>
    </v-form>
    </div>
  </v-app>
</template>

<script>
import Logging from "@/services/logging";

export default {
  name: "LoginAuth",
  data(){
    return {
      valid: false,
      emailRules: [
        v => !!v || 'Обязательное для заполнение поле',
        v => /.+@.+/.test(v) || 'E-mail должен быть валидным.',
      ],
      email_user: '',
      alert:{
        state: false,
        type: 'info',
        message: '',
      },

      // inserted_component
      width: 0,
      height: 0,
      index_component: null,
      index_auth: null,
      inserting_component: false,
    }
  },
  mounted() {
    this.inserting_component = this.$store.state.AuthModule.inserting_component
    if (this.isComponent){
      this.getData()
    }
  },
  computed : {
    isComponent() {
      return this.$store.getters.checkAdminPanel && this.inserting_component
    }
  },
  methods: {
    alertCall(response){
      this.alert.state = true
      this.alert.message = Logging.getMessage(response)
      this.alert.type = Logging.checkExistErr(response) ? 'error' : 'success'
    },
    async localLoginCreateUser(){
      if (this.valid === false)
        return false

      // Если это админка то авторизуем пользователя
      if (this.$store.getters.checkAdminPanel){
        const res = await this.$store.dispatch(
            'loginUser', {
              'email': this.email_user
            })
        if (Logging.checkExistErr(res))
          this.alertCall(res);
        else
          this.$router.go(-1);
      }
      // Иначе это компонент авторизации через почту
      else {
        const res = await this.$store.dispatch(
            'createUserByEmail', {
              'email': this.email_user
            })
        this.alertCall(res);
      }
    },

    // inserted_components
    getData() {
      this.index_component = this.$store.state.TitlesModule.countLayout
      this.index_auth = this.$store.state.TitlesModule.count_of_auth
      this.getHeightOfControls()
      this.getWidthOfControls()
    },
    deleteQuestion() {
      const elem = document.getElementById(`component_wrapper-${this.index_component}`)
      elem.remove()
      this.$store.dispatch('deleteComponent', this.index_component)
    },
    getWidthOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(`component_wrapper-${this.index_component}`)
        if (elem) {
          this.controls_width = elem.getBoundingClientRect().width + 6;
        } else {
          this.controls_width = 0
        }
      })
    },
    getHeightOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(`component_wrapper-${this.index_component}`)
        if (elem) {
          this.controls_height = elem.getBoundingClientRect().height + 22;
        } else {
          this.controls_height = 0
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/detail";

form.login{
  margin: 1em;
  h1{
    margin: auto;
  }
}
.showBorder {

}
</style>
