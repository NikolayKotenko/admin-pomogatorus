<template>
  <div class="question_wrapper">
    <div class="question_wrapper__title">
      <h3>{{ $store.state.TitlesModule.countQuestion }}. {{ question_data.name }}</h3>
      <v-menu
          v-if="question_data.title"
          open-on-hover
          bottom
          offset-y
          transition="scale-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-icon
              v-bind="attrs"
              v-on="on"
              size="20"
          >
            mdi-help-circle
          </v-icon>
        </template>
        <span class="question_wrapper__help">
          {{ question_data.title }}
        </span>
      </v-menu>
    </div>

    <div class="question_wrapper__content">
      <template v-if="question_data.id_type_answer == '1'">
        <v-text-field
            dense
            hide-details
            solo
            placeholder="Введите ответ"
        >
        </v-text-field>
      </template>
    </div>

    <div class="question_wrapper__divider"></div>

<!--    <template slot="append">
      <v-menu
          open-on-hover
          bottom
          offset-y
          transition="scale-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-icon
              v-bind="attrs"
              v-on="on"
              size="20"
          >
            mdi-help-circle
          </v-icon>
        </template>
        <span class="question_wrapper__help">
                {{ question_data.title }}
              </span>
      </v-menu>
    </template>-->
  </div>
</template>

<script>
export default {
  name: "Question",
  data: () => ({
    /*question_data: {
      "id": 12,
      "name_param_env": null,
      "name": "tested",
      "purpose_of_question": "teast",
      "title": 'ЭТО ПОДСКАЗКА',
      "article": null,
      "id_type_answer": 1,
      "value_type_answer": "\"[]\"",
      "state_detailed_response": true,
      "state_attachment_response": true,
      "created_at": "20.02.2022",
      "updated_at": "25.02.2022",
      "_all_tags": [
        {
          "id": 63,
          "code": "test",
          "name": "test",
          "description": null,
          "created_at": "2022-02-20T17:25:46.000000Z",
          "updated_at": "2022-02-20T17:25:46.000000Z"
        }
      ],
      "typeanswer": {
        "id": 1,
        "code": "stroka",
        "name": "Строка ",
        "created_at": null,
        "updated_at": null
      },
      "mtomtags": [
        {
          "id": 73,
          "id_tag": 63,
          "id_question": 12,
          "id_answer": null,
          "created_at": "2022-02-26T10:06:01.000000Z",
          "updated_at": "2022-02-26T10:06:01.000000Z",
          "dtags": {
            "id": 63,
            "code": "test",
            "name": "test",
            "description": null,
            "created_at": "2022-02-20T17:25:46.000000Z",
            "updated_at": "2022-02-20T17:25:46.000000Z"
          }
        }
      ]
    },*/
    question_data: {},
  }),
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      if (Object.keys(this.$store.state.TitlesModule.selectedComponent).length) {
        this.question_data = Object.assign({}, this.$store.state.TitlesModule.selectedComponent)
      }
    },
    showHelp() {

    },
  }
}
</script>

<style scoped lang="scss">
.question_wrapper {
  max-width: 600px;
  padding: 10px 20px;

  &__title {
    display: flex;
    column-gap: 15px;
    padding-bottom: 5px;
  }
  &__divider {
    margin-top: 10px;
    height: 1px;
    width: 100%;
    background: darkgrey;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
  }
}

.v-menu__content {
  background: #FFFFFF;
  padding: 15px;
}
</style>
