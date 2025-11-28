<template>
  <div style="position: sticky; top: 50px; z-index: 10">
    <v-app-bar app clipped-left color="#353e47" dark dense>
      <template v-if="drawer">
        <div
          class="header-logo"
          style="
            width: 256px;
            height: 100%;
            background: lightblue;
            display: flex;
            align-items: center;
            justify-content: center;
          "
        >
          FUTURE LOGO
        </div>
        <v-icon
          color="#6d767f"
          style="cursor: pointer; padding: 0 10px"
          @click="drawer = false"
        >
          mdi-arrow-left
        </v-icon>
      </template>
      <template v-else>
        <v-app-bar-nav-icon
          style="margin-left: 5px"
          @click="drawer = true"
        ></v-app-bar-nav-icon>
      </template>

      <div v-if="!!Object.keys($route.meta).includes('ru_name')">
        <v-chip color="white" style="cursor: pointer" text-color="primary">
          <div style="overflow: hidden; text-overflow: ellipsis">
            <!-- Список -->
            <router-link
              v-if="$route.meta.returnLink && $route.meta.returnLink.ru_name"
              :to="$route.meta.returnLink.path"
            >
              {{ $route.meta.returnLink.ru_name }}
            </router-link>

            <div v-if="!$route.meta.singleComponent" style="display: contents">
              <!-- Черточка разделитель -->
              <span
                v-if="$route.meta.returnLink && $route.meta.returnLink.ru_name"
                >&nbsp; > &nbsp;</span
              >

              <!-- Детальная страница-->
              <span v-if="$route.path && $route.meta.ru_name">{{
                $route.meta.ru_name
              }}</span>

              <!-- Идшник -->
              <template v-if="$store.state.cur_num">
                # {{ $store.state.cur_num }}
              </template>
            </div>
          </div>
        </v-chip>
      </div>

      <v-spacer></v-spacer>

      <v-icon
        v-if="$route.meta.canView"
        :color="$route.query.action === 'view' ? 'red' : 'green'"
        large
        style="padding-left: 10px"
        @click="onView()"
      >
        mdi-home-search
      </v-icon>
      <v-icon
        v-if="$route.meta.canDelete"
        :color="'green'"
        :disabled="!this.$route.params.id && !this.$route.params.code"
        large
        style="padding-left: 10px"
        @click="onDelete()"
      >
        mdi-trash-can-outline
      </v-icon>
      <v-icon
        v-if="$route.meta.canEdit"
        :color="$route.query.action === 'edit' ? 'red' : 'green'"
        :disabled="!this.$route.params.id && !this.$route.params.code"
        large
        style="padding-left: 10px"
        @click="onEdit()"
      >
        mdi-lead-pencil
      </v-icon>
      <v-icon
        v-if="$route.meta.canCreate"
        :color="$route.query.action === 'create' ? 'red' : 'green'"
        style="padding-left: 10px"
        x-large
        @click="onCreate()"
      >
        mdi-plus-thick
      </v-icon>
      <v-icon v-else color="primary" large style="padding-left: 10px">
        mdi-menu-down
      </v-icon>
    </v-app-bar>

    <v-navigation-drawer
      v-if="$store.getters.checkAccessMenu"
      v-model="drawer"
      app
      clipped
      color="#353e47"
      style="z-index: 208 !important"
    >
      <div class="navigation_user">
        <v-list-item-avatar style="margin-left: 10px">
          <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
        </v-list-item-avatar>
        <!-- FIXME: Поменять после бэкенда -->
        <span class="navigation_user_name">{{ getNameUser }}</span>
      </div>
      <v-list dense nav>
        <v-list-item-group v-model="group" active-class="white--text">
          <v-list-item
            v-for="(item, index) in navigation"
            :key="index"
            :to="item.link"
          >
            <template v-slot:default="{ active }">
              <v-list-item-action v-if="!item.children">
                <template v-if="item.icon">
                  <v-icon v-if="!active" color="#7b858e">
                    {{ item.icon }}
                  </v-icon>

                  <v-icon v-else color="white">
                    {{ item.icon }}
                  </v-icon>
                </template>
                <template v-else>
                  <img
                    :alt="item.title"
                    :src="require(`../assets/svg/${item.nameIcon}`)"
                    class="navigation_section_icon"
                  />
                </template>
              </v-list-item-action>
              <v-list-item-content>
                <template v-if="item.children">
                  <v-card class="children_list" width="100%">
                    <v-list>
                      <v-list-group no-action sub-group>
                        <template v-slot:activator>
                          <v-list-item-content>
                            <v-list-item-title>{{
                              item.title
                            }}</v-list-item-title>
                          </v-list-item-content>
                        </template>

                        <v-list-item
                          v-for="(elem, i) in item.children"
                          :key="i"
                          :to="elem.link"
                          link
                        >
                          <v-list-item-title
                            v-text="elem.title"
                          ></v-list-item-title>

                          <v-list-item-icon>
                            <v-icon v-text="elem.icon"></v-icon>
                          </v-list-item-icon>
                        </v-list-item>
                      </v-list-group>
                    </v-list>
                  </v-card>
                </template>
                <template v-else>
                  <v-list-item-title v-text="item.title"></v-list-item-title>
                </template>
              </v-list-item-content>
            </template>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <div class="wrapper_logout">
        <v-btn block bottom small @click="logout()"> Выйти </v-btn>
      </div>
    </v-navigation-drawer>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Header",
  data: () => ({
    drawer: false,
    group: null,
    navigation: [
      {
        id: 1,
        icon: "mdi-home",
        title: "Рабочий стол",
        link: "/",
      },
      {
        id: 2,
        icon: "mdi-account-group",
        title: "Компании",
        link: "/companies",
      },
      {
        id: 2,
        icon: "mdi-currency-usd",
        title: "Акции",
        link: "/stocks",
      },
      {
        id: 3,
        icon: "mdi-message-question",
        title: "Вопросы",
        link: "/questions",
      },
      {
        id: 4,
        icon: "mdi-message-text",
        title: "Статьи",
        link: "/articles",
      },
      {
        id: 5,
        icon: "mdi-message-draw",
        title: "Ответы пользователей",
        link: "/answers",
        nameIcon: "answers.svg",
      },
      {
        id: 6,
        icon: "mdi-message-draw",
        title: "Тэги",
        link: "/tags",
        nameIcon: "answers.svg",
      },
      {
        id: 7,
        icon: "mdi-account-arrow-right",
        title: "Пользователи",
        link: "/users",
        nameIcon: "answers.svg",
      },
      {
        id: 7,
        icon: "mdi-home-edit",
        title: "Параметры объекта",
        link: "/object-properties",
        nameIcon: "answers.svg",
      },
      {
        id: 8,
        icon: "mdi-book-alphabet",
        title: "Справочники",
        link: "/dictionaries",
        nameIcon: "answers.svg",
      },
      {
        id: 12,
        icon: "mdi-format-list-text",
        title: "Бренды",
        link: "/brands",
      },
      {
        id: 8,
        icon: "mdi-home-alphabet",
        title: "Оборудование",
        link: "",
        nameIcon: "answers.svg",
        children: [
          {
            id: 9,
            icon: "mdi-book-alphabet",
            title: "Номенклатуры",
            link: "/nomenclatures",
            nameIcon: "answers.svg",
          },
          // {
          //   id: 10,
          //   icon: 'mdi-book-alphabet',
          //   title: 'Семейства',
          //   link: '/family',
          //   nameIcon: 'answers.svg',
          // },
          // {
          //   id: 11,
          //   icon: 'mdi-book-alphabet',
          //   title: 'Типы семейства',
          //   link: '/familyTypes',
          //   nameIcon: 'answers.svg',
          // },
          {
            id: 12,
            icon: "mdi-book-alphabet",
            title: "Дерево номенклатуры",
            link: "/nomenclaturesTree",
            nameIcon: "answers.svg",
          },
        ],
      },
    ],
  }),
  mounted() {
    this.setCreateEvent();
  },
  computed: {
    ...mapGetters(["stateAuth"]),
    ...mapGetters(["getNameUser"]),
    computedArrowBurger() {
      return (
        Object.keys(this.$route.params).length &&
        Object.keys(this.$route.params).includes("action")
      );
    },
  },
  methods: {
    /** Стартовые евенты **/
    /** При нажатии комбинации -> открываем страницу "Создание нового элемента" **/
    setCreateEvent() {
      const _this = this;

      window.addEventListener("keydown", function (e) {
        if (e.ctrlKey && e.altKey && e.keyCode === 78) {
          e.preventDefault();
          _this.onCreate();
        }
      });
    },

    /** Методы из хедера **/
    onDelete() {
      this.$store.dispatch(this.$route.meta.deleteLink.actionModalAsk, true);
    },
    onView() {
      this.$router
        .replace({
          path: this.$route.meta.returnLink.path,
        })
        .catch(() => {});
    },
    onEdit() {
      this.$router
        .replace({
          query: { action: "edit" },
        })
        .catch(() => {});
    },
    onCreate() {
      this.$router
        .push({
          name: this.$route.meta.createLink.name,
          params: this.$route.meta.createLink.params,
          query: this.$route.meta.createLink.query,
        })
        .catch(() => {});
    },
    returnToList() {
      this.$router.push({
        name: this.$route.meta.returnLink.name,
        path: this.$route.meta.returnLink.path,
      });
    },
    async logout() {
      const response = await this.$store.dispatch("logout");
      if (response.codeResponse === 202) {
        await this.$router.push({ path: "/login" });
      }
    },
  },
};
</script>

<style lang="scss">
.v-toolbar--dense .v-toolbar__content,
.v-toolbar--dense .v-toolbar__extension {
  padding-left: 0 !important;
}

.active_list .v-list-group .v-list-item--active {
  color: #ffffff !important;
}

.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  color: #7b858e !important;
}

.navigation_user {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("https://www.gettyimages.pt/gi-resources/images/Homepage/Hero/PT/PT_hero_42_153645159.jpg");
  background-size: cover;
  width: 100%;
  height: 100px;

  .navigation_user_name {
    color: white;
    font-weight: 400;
    font-size: 18px;
    letter-spacing: 1px;
  }
}

.navigation_section_icon {
  width: 24px;
  height: 24px;
}

.wrapper_logout {
  display: grid;
  padding: 10px;
  position: fixed;
  bottom: 0;
  width: 100%;
}

.children_list {
  background-color: rgb(53, 62, 71) !important;
  border-color: rgb(53, 62, 71) !important;
}
</style>
