<template>
  <div class="detail_container">
    <v-container>
        <v-autocomplete
            outlined
            dense
            :loading="$store.state.TagsModule.loadingList"
            :disabled="$store.state.TagsModule.loadingList"
            label="Выберите тэг"
            :items="$store.state.TagsModule.listTags"
            item-text="name"
            item-value="id"
            return-object
            v-model="$store.state.TagsModule.tag"
            class="mb-5"
            hide-details
        >
        </v-autocomplete>

      <general-tag></general-tag>
    </v-container>
  </div>
</template>

<script>
import GeneralTag from "@/components/tags/GeneralTag";

export default {
  components: { GeneralTag },
  name: "TagsList",
  data: () => ({}),
  mounted() {
    this.$store.dispatch('getListTags', this.$route.query.id)
  },
  watch:{
    '$store.state.TagsModule.tag.id':{
      handler(newValue) {
        this.$router.replace({
          path: '/tags'+'?id='+newValue
        }).catch(()=>{});
      }
    },
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
