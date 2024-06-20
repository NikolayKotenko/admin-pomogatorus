<template>
  <v-container class="mt-5">
    <h4 class="mb-5">Выберите или добавьте параметры оборудования</h4>
    <div class="list-characteristics">
      <SearchStyled
          :is-items="$store.state.FamiliesModule.listEntries"
          :is-item-text="'name'"
          :is-item-value="'code'"
          :is-placeholder="'Выберите характеристику'"
      ></SearchStyled>
      <SearchStyled
          :is-items="$store.state.FamiliesModule.listEntries"
          :is-item-text="'name'"
          :is-item-value="'code'"
          :is-placeholder="'Выберите значение характеристики'"
      ></SearchStyled>
    </div>
  </v-container>
</template>

<script>
import SearchStyled from "@/components/common/SearchStyled";

export default {
  name: "Characteristics",
  components:{ SearchStyled }
}
</script>

<style lang="scss" scoped>
.list-characteristics{
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 1em;
}
</style>