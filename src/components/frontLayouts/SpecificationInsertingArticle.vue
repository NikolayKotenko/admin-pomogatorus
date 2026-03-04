<template>
  <v-autocomplete
    :value="value"
    :disabled="$store.state.loadingRequestGeneral"
    :items="$store.state.PrimeryRabot.listEntries"
    :loading="$store.state.loadingRequestGeneral"
    :item-text="specificationDisplayName"
    return-object
    class="mb-5"
    dense
    hide-details
    placeholder="Выберите спецификацию"
    outlined
    :menu-props="{ maxHeight: '30vh' }"
    @change="onSelect"
  >
  </v-autocomplete>
</template>

<script>
export default {
  name: "SpecificationInsertingArticle",
  components: {},
  props: {
    initialData: { type: Object, default: () => ({}) },
    products: { type: Array, default: () => [] },
    value: { type: [Object, null], default: null },
  },
  data() {
    return {};
  },
  computed: {
    specificationDisplayName() {
      return (item) => item?.name || item?.code || `ID ${item?.id}`;
    },
  },
  mounted() {
    this.$store.dispatch("PrimeryRabot/getListEntries");
  },
  methods: {
    onSelect(value) {
      this.$emit("input", value || null);
    },
  },
};
</script>
