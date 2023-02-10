<template>
  <v-container class="detail_container">
    <SelectStyled
        :items="$store.state.DictionariesModule.listEntries"
        :data="$store.state.DictionariesModule.entry.code"
        :item-text="'name'"
        :item-value="'code'"
        :placeholder="'Список справочников'"
    ></SelectStyled>


  </v-container>
</template>

<script>
import SelectStyled from "@/components/common/SelectStyled";

export default {
  name: "Dictionaries",
  components:{
    SelectStyled,
  },
  async mounted() {
    await this.$store.dispatch('DictionariesModule/getListEntries', this.$route.params.code)
  },
  watch: {
    '$store.state.DictionariesModule.entry.code': {
      handler(newValue) {
        if (this.$route.query.action === 'create')
          return false;

        const currentQuery = this.$route.query;
        const codeEntry = (newValue) ? newValue : '';
        this.$router.replace({
          path: this.$route.meta.returnLink.path +'/'+ codeEntry,
          query: currentQuery,
        }).catch(() => {
        });

        this.$store.dispatch('setTitle', this.$store.state.DictionariesModule.entry.name)
      }
    },
    '$route.query.action': {
      handler(newValue) {
        if (newValue === 'create') {
          this.$store.dispatch('DictionariesModule/clearEntry');
        }
      }
    },
    '$route.params.code': {
      handler(newValue) {
        if (!newValue) {
          this.$store.dispatch('DictionariesModule/clearEntry');
        }
      }
    },
  }
}
</script>

<style scoped>

</style>