<template>
  <v-alert
      outlined
      text
      type='warning'
  >
    Функционал в разработке
  </v-alert>
</template>

<script>
export default {
  name: 'UpcomingAlert'
}
</script>

<style lang='scss' scoped>
.v-alert {
  min-height: 150px !important;
  display: flex !important;
  align-items: center !important;
}

.v-alert__content {
  font-size: 1.3rem !important;
}
</style>
