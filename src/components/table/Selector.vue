<template>
  <div class="table-container-wrapper-header__views">
    Показать
    <v-select
        dense
        solo
        hide-details
        height="20"
        :menu-props="{ bottom: true, offsetY: true }"
        :items="changeCount"
        v-model="selectedCount"
        :loading="$store.state.AnswersModule.loadingList"
        :disabled="$store.state.AnswersModule.loadingList"
    ></v-select>
    записей
  </div>
</template>

<script>
export default {
  name: "Selector",
  data: () => ({
    changeCount: [10, 25, 50],
    selectedCount: 10,
  }),
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/table";
</style>
