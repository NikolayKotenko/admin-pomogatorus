<template>
  <div>
    <vue-editor v-model="$store.state.TagsModule.tag.seo_description"/>
    <v-checkbox
        class="mb-5 mt-5"
        hide-details
        dense
        label="Публичный"
        @change="$store.dispatch('onSubmit')"
        v-model="$store.state.TagsModule.tag.public"
        :loading="$store.state.TagsModule.loadingList"
        :disabled="$store.state.TagsModule.loadingList"
    >
    </v-checkbox>
    <v-text-field
        class="mt-5"
        outlined
        dense
        label="Псевдоним"
        v-model="$store.state.TagsModule.tag.code"
        disabled
    ></v-text-field>

    <!--  MODALS  -->
    <v-dialog
        v-model="$store.state.TagsModule.deleteModal"
        max-width="600"
    >
      <v-card>
        <v-card-title>
          <span class="text-h6" style="font-size: 0.8em !important;">Вы точно хотите удалить тэг?</span>
        </v-card-title>
        <v-card-actions>
          <v-btn
              color="blue darken-1"
              text
              @click="$store.state.TagsModule.deleteModal = false"
              :disabled="$store.state.TagsModule.loadingRequest"
              :loading="$store.state.TagsModule.loadingRequest"
          >
            Нет
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn
              color="red darken-1"
              text
              :disabled="$store.state.TagsModule.loadingRequest"
              :loading="$store.state.TagsModule.loadingRequest"
              @click="$store.dispatch('deleteTag')"
          >
            Да
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { VueEditor } from "vue2-editor";

export default {
  components: {VueEditor },
  name: "GeneralTag",
  data: () => ({
    debounceTimeout: null,
  }),
  methods:{},
  watch:{
    '$store.state.TagsModule.tag.seo_description': {
      handler(newValue, oldValue) {
        //TODO
        console.log('oldValue', String(oldValue))
        console.log('newValue', String(newValue))
        if (String(newValue) == String(oldValue))
          return false;

        if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
          this.$store.dispatch('onSubmit')
        }, 2000)
      },
    },
  },
}
</script>

<style scoped>

</style>