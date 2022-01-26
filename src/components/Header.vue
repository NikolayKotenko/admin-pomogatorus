<template>
  <div>
    <v-app-bar
        dense
        dark
        clipped-left
        app
        color="#353e47"
    >
      <template v-if="drawer">
        <div class="header-logo" style="width: 256px; height: 100%; background: lightblue; display: flex; align-items: center; justify-content: center">
          FUTURE LOGO
        </div>
        <v-icon color="#6d767f" style="cursor: pointer; padding: 0 10px" @click="drawer = false">
          mdi-arrow-left
        </v-icon>
      </template>
      <template v-else>
        <v-app-bar-nav-icon @click="drawer = true" style="margin-left: 5px"></v-app-bar-nav-icon>
      </template>

        <v-chip
            color="white"
            text-color="primary"
            style="cursor: pointer"
        >
          <router-link to="/" style="text-decoration: none">
            <v-icon small left>
              mdi-briefcase
            </v-icon>
            Рабочий стол
          </router-link>
          <div v-if="!!Object.keys($route.meta).includes('ru_name')" style="padding-left: 10px">
            <v-icon small left>
              mdi-chevron-right
            </v-icon>
            <span>{{ $route.meta.ru_name }}</span>
          </div>
        </v-chip>

      <v-spacer></v-spacer>

      <v-icon
          v-if="$route.path === '/questions'"
          color="green"
          x-large
          style="padding-left: 10px"
          @click="onCreate()"
      >
        mdi-plus-thick
      </v-icon>
      <v-icon
          v-else
          color="primary"
          large
          style="padding-left: 10px"
      >
        mdi-menu-down
      </v-icon>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        app
        clipped
        color="#353e47"
    >
      <div class="navigation-user">
        <v-list-item-avatar style="margin-left: 10px">
          <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
        </v-list-item-avatar>
        <!-- FIXME: Поменять после бэкенда -->
        <span class="navigation-user-name">Admin</span>
      </div>
      <v-list
          nav
          dense
      >
        <v-list-item-group
            v-model="group"
            active-class="white--text"
        >
          <v-list-item
              v-for="(item, index) in navigation"
              :key="index"
              :to="item.link"
          >
            <template v-slot:default="{ active }">
              <v-list-item-action>
                <v-icon
                    v-if="!active"
                    color="#7b858e"
                >
                  {{ item.icon }}
                </v-icon>

                <v-icon
                    v-else
                    color="white"
                >
                  {{ item.icon }}
                </v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title v-text="item.title"></v-list-item-title>
              </v-list-item-content>
            </template>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
export default {
  name: "Header",
  data: () => ({
    drawer: false,
    group: null,
    navigation: [
      {
        id: 1,
        icon: 'mdi-home',
        title: 'Рабочий стол',
        link: '/'
      },
      {
        id: 2,
        icon: 'mdi-account-group',
        title: 'Компании',
        link: '/companies'
      },
      {
        id: 3,
        icon: 'mdi-message-question',
        title: 'Вопросы',
        link: '/questions'
      }
    ]
  }),
  methods: {
    onCreate() {
      this.$router.push({
        path: 'questions/detail',
      })
    }
  },
}
</script>

<style lang="scss">
.v-toolbar--dense .v-toolbar__content, .v-toolbar--dense .v-toolbar__extension {
  padding-left: 0 !important;
}

.active_list .v-list-group .v-list-item--active {
  color: #FFFFFF !important;
}

.theme--light.v-list-item:not(.v-list-item--active):not(.v-list-item--disabled) {
  color: #7b858e !important;
}

.navigation-user {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  background:linear-gradient(
          rgba(0, 0, 0, 0.5),
          rgba(0, 0, 0, 0.5)
  ),
  url('https://www.gettyimages.pt/gi-resources/images/Homepage/Hero/PT/PT_hero_42_153645159.jpg');
  background-size: cover;

  width: 100%;
  height: 100px;
  .navigation-user-name {
    color: white;
    font-weight: 400;
    font-size: 18px;
    letter-spacing: 1px;
  }
}
</style>
