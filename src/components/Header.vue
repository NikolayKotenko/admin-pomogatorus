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
        <div class="header-logo" style="width: 256px; height: 100%; background: lightblue">

        </div>
        <v-icon color="#6d767f" style="cursor: pointer; padding: 0 10px" @click="drawer = false">
          mdi-arrow-left
        </v-icon>
      </template>
      <template v-else>
        <v-app-bar-nav-icon @click="drawer = true" style="margin-left: 5px" class="burger"></v-app-bar-nav-icon>
      </template>

        <v-chip
            color="white"
            text-color="primary"
            style="cursor: pointer"
        >
          <v-icon small left>
            mdi-briefcase
          </v-icon>
          Рабочий стол
        </v-chip>

      <v-spacer></v-spacer>

      <v-icon color="primary" large>mdi-menu-down</v-icon>
    </v-app-bar>

    <v-navigation-drawer
        v-model="drawer"
        app
        clipped
        color="#353e47"
    >
      <div style="background-image: url('https://www.gettyimages.pt/gi-resources/images/Homepage/Hero/PT/PT_hero_42_153645159.jpg'); width: 100%; height: 100px;">
        <v-list-item-avatar>
          <v-img src="https://randomuser.me/api/portraits/women/85.jpg"></v-img>
        </v-list-item-avatar>
      </div>
      <v-list
          nav
          dense
      >
        <v-list-item-group
            v-model="group"
            active-class="deep-purple--text text--accent-4"
        >
          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item>
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Account</v-list-item-title>
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
  }),
}
</script>

<style lang="scss">
.v-toolbar--dense .v-toolbar__content, .v-toolbar--dense .v-toolbar__extension {
  padding-left: 0 !important;
}
</style>
