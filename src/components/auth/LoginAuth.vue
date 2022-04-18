<template>
  <v-app>
    <v-form v-model="valid" class="login" @submit.prevent="localLoginCreateUser()">
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
      }
    }
  },
  mounted() {
  },
  computed : {
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
    }
  }
}
</script>

<style lang="scss" scoped>
form.login{
  margin: 1em;
  h1{
    margin: auto;
  }
}
</style>