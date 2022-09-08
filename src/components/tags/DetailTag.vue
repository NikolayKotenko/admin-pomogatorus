<template>
  <div class="detail_container">
    <v-container>
      <v-text-field
          outlined
          dense
          label="Введите имя тэга"
          item-text="name"
          item-value="id"
          return-object
          clearable
          v-model="$store.state.TagsModule.tag.name"
          class="mb-5"
          hide-details
          required
          :loading="$store.state.TagsModule.loadingList"
          :disabled="$store.state.TagsModule.loadingList"
          :rules="nameRules"
      >
      </v-text-field>
      <general-tag></general-tag>
    </v-container>
  </div>
</template>

<script>
import GeneralTag from "@/components/tags/GeneralTag";

export default {
  components: {GeneralTag },
  name: "DetailTag",
  data: () => ({
    nameRules: [
      v => !!v || 'Обязательное для заполнение поле',
    ]
  }),
  async mounted() {
    await this.$store.dispatch('getListTags', this.$route.query.id)

    console.log(this.$route.params.action);
    if (this.$route.params.action === 'create')
      await this.$store.dispatch('clearTag');
  },
  computed: {},
  watch:{},
  methods: {},
}
</script>

<style lang="scss" scoped></style>
