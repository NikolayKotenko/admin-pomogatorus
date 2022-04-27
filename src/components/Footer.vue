<template>
  <footer class="detail_footer">
    <template v-if="$route.params.action === 'create'">
      <v-btn
          color="red darken-1"
          text
      >
        Очистить
      </v-btn>
      <v-btn
          color="blue darken-1"
          text
      >
        Создать
      </v-btn>
    </template>
    <template v-else>
      <v-btn
          color="red darken-1"
          text
      >
        Удалить
      </v-btn>
      <v-btn
          color="blue darken-1"
          text
      >
        Сохранить изменения
      </v-btn>
    </template>
  </footer>
</template>

<script>
export default {
  name: "Footer"
}
</script>

<style scoped lang="scss">
@import "src/assets/styles/detail";
</style>
