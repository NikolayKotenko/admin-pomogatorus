<template>
  <div
    class="auth_container component_container"
    contenteditable="false"
    :id="`component_wrapper-${index_component}`"
    :class="{ componentArticle_wrapper: isComponent }"
    data-name="auth"
  >
    <div
      class="componentArticle_wrapper__admin_controls-header"
      contenteditable="false"
      v-if="isComponent"
    >
      <CloseSVG
          class="componentArticle_wrapper__admin_controls-header__img"
          alt="close"
          @click="deleteQuestion()"
      />
    </div>
    <v-container>
      <v-tabs v-model="tab" hide-slider centered>
        <v-tab :key="0" light>Авторизация</v-tab>
<!--        <v-tab :key="1">Регистрация</v-tab>-->
        <!--Авторизация-->
        <v-tab-item :key="0">
          <v-form
            v-model="valid"
            class="login"
            ref="form"
            @submit.prevent="
              localLoginUser(`component_wrapper-${index_component}`)
            "
            contenteditable="false"
          >
            <v-text-field
                type="email"
                ref="email_user"
                v-model="email_user"
                placeholder="Введите почту  *"
                :rules="$store.state.emailRules"
                single-line
                required
                :class="'required'"
                :disabled="isComponent"
            ></v-text-field>
            <v-text-field
                ref="password"
                v-model="password"
                :rules="passRules"
                maxlength="4"
                :type="passStateEye ? 'text' : 'password'"
                placeholder="Введите код доступа *"
                hint="4 символа"
                counter
                required
                :class="'required field_password'"
                :disabled="isComponent"
            >
              <template v-slot:append>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on" @click="passStateEye = !passStateEye">
                      {{ passStateEye ? "mdi-eye" : "mdi-eye-off" }}
                    </v-icon>
                  </template>
                  Показать/скрыть пароль
                </v-tooltip>
              </template>
              <template v-slot:append-outer>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-icon
                      v-on="on"
                      @click="
                        localResendUserPass(
                          `component_wrapper-${index_component}`
                        )
                      "
                    >
                      mdi-lock-reset
                    </v-icon>
                  </template>
                  Восстановить Код доступа
                </v-tooltip>
              </template>
            </v-text-field>
            <v-btn
              type="submit"
              :loading="loading"
              color="blue darken-1"
              elevation="2"
              large
              rounded
              block
              class="btn-auth"
            >
              Войти
            </v-btn>
          </v-form>
        </v-tab-item>
        <!--Регистрация-->
<!--        <v-tab-item :key="1">
          <v-form
            v-model="valid"
            class="login"
            @submit.prevent="
              localCreateUser(`component_wrapper-${index_component}`)
            "
            contenteditable="false"
          >
            <v-text-field
                type="email"
                ref="email_user"
                v-model="email_user"
                placeholder="Введите почту *"
                :rules="$store.state.emailRules"
                single-line
                required
                :class="'required'"
                :disabled="isComponent"
            ></v-text-field>
            <v-text-field
                type="text"
                v-model="name"
                placeholder="Как к вам обращаться ?"
                single-line
                :disabled="isComponent"
            ></v-text-field>
            <v-btn
              type="submit"
              :loading="loading"
              color="blue darken-0"
              elevation="2"
              large
              rounded
              block
              class="btn-auth"
            >
              Зарегестрироваться
            </v-btn>
          </v-form>
        </v-tab-item>-->
      </v-tabs>
      <v-alert
        v-if="alert.state && !loading"
        transition="scale-transition"
        dismissible
        :type="alert.type"
        :value="alert.state"
        @input="alert.state = false"
      >
        <span v-html="alert.message"></span>
      </v-alert>
    </v-container>
  </div>
</template>

<script>
import Logging from "@/services/logging";
import CloseSVG from "@/assets/svg/closeIcon.svg"

export default {
  name: "LoginAuth",
  components: {
    CloseSVG
  },
  data() {
    return {
      tab: 0,
      valid: false,
      loading: false,
      passRules: [
        (v) => !!v || "Обязательное для заполнение поле",
        (v) => v.length === 4 || "Необходимо 4 символа",
      ],
      email_user: "",
      password: "",
      name: "",
      passStateEye: false,
      alert: {
        state: false,
        type: "info",
        message: "",
      },

      // inserted_component
      width: 0,
      height: 0,
      index_component: null,
      index_auth: null,
      inserting_component: false,

      dataForRerender: {},
    };
  },
  mounted() {
    this.inserting_component = this.$store.state.AuthModule.inserting_component;
    this.$store.state.AuthModule.inserting_component = false;
    console.log("isComponent?", this.isComponent);
    if (this.isComponent) {
      this.getData();
    }
  },
  computed: {
    isComponent() {
      return this.$store.getters.checkAdminPanel && this.inserting_component;
    },
  },
  methods: {
    alertCall(response) {
      this.alert.state = true;
      this.alert.message = Logging.getMessage(response);
      this.alert.type = Logging.checkExistErr(response) ? "error" : "success";
      this.loading = false;
    },

    async localLoginUser(index_component){
      if (this.$refs.email_user.validate(true) === false) return false
      if (this.$refs.password.validate(true) === false) return false
      if (this.valid === false) return false

      this.loading = true;
      const res = await this.$store.dispatch("loginUser", {
        email: this.email_user,
        password: this.password,
        id_dom_elem: index_component,
        full_url: window.location.href,
      });
      if (res.codeResponse >= 400) {
        this.alertCall(res);
        return false;
      }

      if (res.codeResponse === 202 && this.$store.getters.isAdminGroup) {
        await this.$router.push({
          path: "/",
        });
      }
      else{
        const response = {
          message: 'Нет доступа',
          codeResponse: 403
        }
        this.alertCall(response);
      }
    },
    async localCreateUser(index_component){
      if (this.$refs.email_user.validate(true) === false) return false
      if (this.valid === false) return false

      this.loading = true;
      // Пытаемся создать пользователя
      const res = await this.$store.dispatch("createUserByEmail", {
        email: this.email_user,
        name: this.name,
        id_dom_elem: index_component,
        full_url: window.location.href,
      });
      if (res.codeResponse === 200 || res.codeResponse === 409) {
        this.tab = 0;
      }
      this.alertCall(res);
    },
    async localResendUserPass(index_component) {
      if (this.$refs.email_user.validate(true) === false) return false;

      this.loading = true;
      // Пытаемся создать пользователя
      const res = await this.$store.dispatch("resendUserPass", {
        email: this.email_user,
        name: this.name,
        id_dom_elem: index_component,
        full_url: window.location.href,
      });
      if (res.codeResponse === 404) {
        this.email_user = "";
        this.$refs.email_user.validate(true);
      }
      if (res.codeResponse === 200 || res.codeResponse === 409) {
        this.tab = 0;
      }
      this.alertCall(res);
    },

    // inserted_components
    getData() {
      this.index_component = this.$store.state.ArticleModule.counters.layout;
      this.index_auth = this.$store.state.ArticleModule.counters.auth;
      this.getHeightOfControls();
      this.getWidthOfControls();
    },
    deleteQuestion() {
      const elem = document.getElementById(
        `component_wrapper-${this.index_component}`
      );
      elem.remove();
      this.$store.dispatch("deleteComponent", this.index_component);
    },
    getWidthOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(
          `component_wrapper-${this.index_component}`
        );
        if (elem) {
          this.controls_width = elem.getBoundingClientRect().width + 6;
        } else {
          this.controls_width = 0;
        }
      });
    },
    getHeightOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(
          `component_wrapper-${this.index_component}`
        );
        if (elem) {
          this.controls_height = elem.getBoundingClientRect().height + 22;
        } else {
          this.controls_height = 0;
        }
      });
    },
  },
};
</script>

<style lang="scss">
@import "src/assets/styles/detail";
@import "src/assets/styles/componentArticle";

@media only screen and (max-width: 375px) {
  .v-slide-group__prev {
    display: none !important;
  }
}

form.login {
  margin: 1em;
  h1 {
    margin: auto;
  }
}

.auth_container {
  border-radius: 10px;
  border: 1px solid lightgrey;
  @media only screen and (min-width: 768px) {
    width: 50%;
    margin: auto;
  }
  .required .v-label::after {
    content: " *";
    color: red;
  }
  .field_password {
    .v-icon {
      margin-top: unset;
    }
  }
}
.showBorder {
}
</style>
