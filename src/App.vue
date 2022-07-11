<template>
  <v-app>
    <v-main>
      <Header/>
      <router-view/>
      <v-dialog
          v-model="$store.state.notification_modal.show_notification"
          max-width="600"
      >
        <v-card>
          <v-card-title>
            <span class="text-h6" :style="`color: ${color_notification}; font-size: 0.8em !important; text-align: center; width: 100%`">{{ error_or_not }}</span>
          </v-card-title>
          <v-card-text>
            {{ $store.state.notification_modal.message }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="$store.state.notification_modal.show_notification = false"
            >
              Закрыть
            </v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<script>
import Header from "./components/Header";

export default {
  name: 'App',
  components: {Header},
  data: () => ({
    //
  }),
  computed: {
    error_or_not() {
      return this.$store.state.notification_modal.error ? 'Ошибка!' : 'Уведомление!'
    },
    color_notification() {
      return this.$store.state.notification_modal.error ? 'lightcoral' : '#1976d2'
    },
  },
};
</script>

<style lang="scss">
@media only screen and (max-width : 600px) {
  .v-menu__content.theme--light.menuable__content__active.v-autocomplete__content {
    max-height: 120px !important;
    max-width: 200px !important;
  }
}

.v-menu__content {
  max-width: 480px !important;
}

body {
  margin:0;
  height:100%;
  //padding: 12px;
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}
</style>
