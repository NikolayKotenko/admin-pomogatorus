<template>
  <div>
    <v-text-field
      solo
      dense
      hide-details
      placeholder="Type something"
      v-model="test"
    >
    </v-text-field>
  </div>
</template>

<script>
export default {
  name: "Question",
  data: () => ({
    test: '',
  }),
  methods: {
  }
}
</script>

<style scoped lang="scss">

</style>
