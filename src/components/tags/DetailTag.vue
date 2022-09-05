<template>
  <div class="detail_container">
    <v-container>
      <v-text-field
          outlined
          dense
          label="Введите новое имя тэга"
          item-text="name"
          item-value="id"
          return-object
          clearable
          v-model="$store.state.TagsModule.tag.name"
          class="mb-5"
          hide-details
          @change="$store.dispatch('onSubmit')"
          :loading="$store.state.TagsModule.loadingList"
          :disabled="$store.state.TagsModule.loadingList"
      >
      </v-text-field>
      <general-tag></general-tag>
    </v-container>
    <footer class="detail_footer">
        <v-btn
            color="red darken-1"
            text
            @click="$store.state.TagsModule.deleteModal = true"
        >
          Удалить
        </v-btn>
        <v-btn
            color="blue darken-1"
            text
            @click.prevent="$store.dispatch('onSubmit'); goBack()"
        >
          Закончить работу
        </v-btn>
    </footer>
  </div>
</template>

<script>
import GeneralTag from "@/components/tags/GeneralTag";

export default {
  components: {GeneralTag },
  name: "DetailTag",
  data: () => ({}),
  mounted() {
  },
  computed: {
  },
  watch:{},
  methods: {
    goBack(){
      this.$router.push({
        path: '/tags'
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import "src/assets/styles/detail";

</style>
