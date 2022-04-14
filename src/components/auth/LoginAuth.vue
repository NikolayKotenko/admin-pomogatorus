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
              :error-messages="emailErrors"
              required
          ></v-text-field>
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
      emailErrors: '',
    }
  },
  computed : {
  },
  methods: {
    async localLoginCreateUser(){
      const res = await this.$store.dispatch('loginCreateUser', this.email_user)
      const checkErr = Logging.checkExistErr(res)
      console.log(checkErr);
      if (checkErr) {
        this.emailErrors = '';
        this.emailErrors = Logging.getMessage(res)
      }

      this.$router.go(-1);
      // await this.$router.push({path: '/'})
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