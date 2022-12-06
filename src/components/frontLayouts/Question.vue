<template>
  <div
      :id="`component_wrapper-${index_component}`"
      :data-id="dataId"
      class="componentArticle_wrapper question_wrapper component_container"
      contenteditable="false"
      data-name="questions"
  >
    <div
        class="componentArticle_wrapper__admin_controls-header"
        contenteditable="false"
    >
      <img
          :src="require(`/src/assets/svg/closeIcon.svg`)"
          alt="close"
          class="componentArticle_wrapper__admin_controls-header__img"
          @click="deleteQuestion()"
      />
    </div>
    <div class="componentArticle_wrapper__title">
      <h3>
        <template v-if="index_questions"> {{ index_questions }}.</template>
        {{ question_data.name }}
      </h3>
      <div v-if="question_data.title" class="helper_wrapper">
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <img
                :src="require(`/src/assets/svg/help-circle.svg`)"
                alt="help"
                class="help_img"
                v-bind="attrs"
                v-on="on"
            />
          </template>
          <span>{{ question_data.title }}</span>
        </v-tooltip>
      </div>
    </div>

    <div class="componentArticle_wrapper__content">
      <template v-if="question_data.id_type_answer == '1'">
        <v-text-field
            v-model="answer"
            dense
            disabled
            hide-details
            placeholder="Введите ответ"
            solo
            @change="changeAnswer"
        >
        </v-text-field>
      </template>
      <template v-else-if="question_data.id_type_answer == '2'">
        <v-textarea
            v-model="answer"
            auto-grow
            clearable
            dense
            disabled
            hide-details
            placeholder="Введите ответ"
            row-height="25"
            rows="3"
            solo
            @change="changeAnswer"
        >
        </v-textarea>
      </template>
      <template v-else-if="question_data.id_type_answer == '3'">
        <v-radio-group v-model="answer" dense hide-details>
          <v-radio
              v-for="(item, index) in value_type_answer"
              :key="index"
              :value="item.answer"
              disabled
              @change="changeAnswer"
          >
            <template slot="label">
              <div
                  style="display: flex; column-gap: 20px; align-items: flex-start"
              >
                <span v-html="item.answer" @click.stop></span>
                <div v-if="item.commentary">
                  <v-tooltip bottom>
                    <template v-slot:activator="{ on, attrs }">
                      <img
                          :src="require(`/src/assets/svg/help-circle.svg`)"
                          alt="help"
                          class="help_img"
                          v-bind="attrs"
                          v-on="on"
                      />
                    </template>
                    <span>{{ item.commentary }}</span>
                  </v-tooltip>
                </div>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </template>
      <template v-else-if="question_data.id_type_answer == '4'">
        <v-checkbox
            v-for="(item, index) in value_type_answer"
            :key="index"
            v-model="answer"
            :value="item.answer"
            dense
            disabled
            hide-details
            multiple
            @change="changeAnswer"
        >
          <template slot="label">
            <div
                style="display: flex; column-gap: 20px; align-items: flex-start"
            >
              <span v-html="item.answer" @click.stop></span>
              <div v-if="item.commentary">
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <img
                        :src="require(`/src/assets/svg/help-circle.svg`)"
                        alt="help"
                        class="help_img"
                        v-bind="attrs"
                        v-on="on"
                    />
                  </template>
                  <span>{{ item.commentary }}</span>
                </v-tooltip>
              </div>
            </div>
          </template>
        </v-checkbox>
      </template>
      <template v-else-if="question_data.id_type_answer == '5'">
        <v-select
            v-model="answer"
            :items="value_type_answer"
            :menu-props="{
            closeOnContentClick: true,
            bottom: true,
            offsetY: true,
          }"
            clearable
            dense
            disabled
            hide-details
            item-text="answer"
            placeholder="Введите ответ"
            return-object
            solo
            @change="changeAnswer"
        >
          <template v-slot:selection="data">
            <span v-bind="data.attrs" v-html="data.item.answer"></span>
          </template>
          <template v-slot:item="{ active, item, attrs, on }">
            <v-list-item v-bind="attrs" v-on="on">
              <v-list-item-content>
                <v-list-item-title>
                  <v-row no-gutters style="align-items: flex-start">
                    <span v-html="item.answer" @click.stop></span>
                    <v-spacer></v-spacer>
                    <div v-if="item.commentary">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <img
                              :src="require(`/src/assets/svg/help-circle.svg`)"
                              alt="help"
                              class="help_img"
                              v-bind="attrs"
                              v-on="on"
                          />
                        </template>
                        <span>{{ item.commentary }}</span>
                      </v-tooltip>
                    </div>
                  </v-row>
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-select>
      </template>
      <template v-else-if="question_data.id_type_answer == '6'">
        <span
        >Укажите число в диапозоне от {{ value_type_answer[0].answer }} и до
          {{ value_type_answer[1].answer }}</span
        >
        <v-text-field
            v-model="range_one"
            :class="{ rangeError: rangeError }"
            dense
            disabled
            hide-details
            placeholder="Введите ответ"
            solo
            type="number"
            @change="changeAnswer"
        >
          <template slot="prepend-inner">
            <v-icon color="primary" @click="rangeEdit('minus')">
              mdi-minus
            </v-icon>
          </template>
          <template slot="append">
            <v-icon color="primary" @click="rangeEdit('plus')">
              mdi-plus
            </v-icon>
          </template>
        </v-text-field>
        <small v-if="rangeError" style="color: lightcoral">
          Неккоректные значения
        </small>
      </template>
      <template v-else-if="question_data.id_type_answer == '7'">
        <span
        >Укажите число в диапозоне от {{ value_type_answer[0].answer }} и до
          {{ value_type_answer[1].answer }}</span
        >
        <v-range-slider
            v-model="range_two"
            :max="max"
            :min="min"
            class="align-center"
            disabled
            hide-details
            type="number"
        >
          <template v-slot:prepend>
            <v-text-field
                :value="range_two[0]"
                class="mt-0 pt-0"
                disabled
                hide-details
                single-line
                style="width: 60px"
                type="number"
                @change="$set(range_two, 0, $event)"
            ></v-text-field>
          </template>
          <template v-slot:append>
            <v-text-field
                :value="range_two[1]"
                class="mt-0 pt-0"
                disabled
                hide-details
                single-line
                style="width: 60px"
                type="number"
                @change="$set(range_two, 1, $event)"
            ></v-text-field>
          </template>
        </v-range-slider>
        <small v-if="rangeError" style="color: lightcoral">
          Неккоректные значения
        </small>
      </template>
      <v-text-field
          v-if="question_data.state_detailed_response"
          v-model="detailed_response"
          class="py-2"
          dense
          disabled
          hide-details
          placeholder="Место для развернутого ответа"
          solo
      ></v-text-field>
    </div>

    <div v-if="question_data.state_attachment_response" class="py-3 file_input">
      <template>
        <v-btn color="primary" dark rounded>
          <v-icon>mdi-upload</v-icon>
          Загрузить файл
        </v-btn>
      </template>
    </div>

    <transition name="list">
      <div
          v-if="status_question.type !== 'sending' && check_status"
          class="componentArticle_wrapper__content__alert pt-3"
      >
        <v-alert :icon="status_question.icon" :type="status_question.type">
          <span v-html="status_question.text"></span>
        </v-alert>
      </div>
    </transition>
  </div>
</template>

<script>
import AnswerController from "../../services/article/AnswerController";

export default {
  name: "Question",
  components: {},
  data: () => ({
    question_data: {},
    index_component: null,
    index_questions: null,
    controls_height: 0,
    controls_width: 0,
    value_type_answer: [],
    debounceTimeout: null,
    status_name: "sending",
    check_status: false,
    dataForRerender: {},

    /* DATA_BY_TYPES */
    rangeError: false,
    range_one: null,
    min: 0,
    max: 0,
    range_two: [],
    answer: null,
    detailed_response: "",
  }),
  created() {
  },
  mounted() {
    this.getData();
  },
  watch: {
    range_one: {
      handler() {
        if (this.debounceTimeout) clearTimeout(this.debounceTimeout);
        this.debounceTimeout = setTimeout(() => {
          this.rangeError =
              parseInt(this.range_one) <
              parseInt(this.value_type_answer[0].answer) ||
              parseInt(this.range_one) >
              parseInt(this.value_type_answer[1].answer);
        });
      },
    },
    detailed_response: {
      handler(v) {
        if (v) {
          this.answer = null;
        }
      },
    },
  },
  computed: {
    status_question() {
      let auth_block;
      let index =
          this.$store.state.ArticleModule.components_after_request.findIndex(
              (i) => {
                return i.component.name === "auth";
              }
          );
      if (index !== -1)
        auth_block =
            this.$store.state.ArticleModule.components_after_request[index].index;

      return new AnswerController().create_status(this.status_name, auth_block);
    },
    dataId() {
      if (!this.question_data || !this.question_data?.id) return null;
      return this.question_data.id;
    },
  },
  methods: {
    changeAnswer() {
      this.check_status = true;
      setTimeout(() => {
        this.status_name = "warning";
      }, 1000);
    },
    deleteQuestion() {
      this.$store.dispatch("deleteComponent", this.index_component);
    },
    rangeEdit(action) {
      if (action === "plus") {
        if (!this.range_one) {
          this.$nextTick(() => {
            this.range_one = 1;
          });
        } else {
          this.$nextTick(() => {
            this.range_one = parseInt(this.range_one) + 1;
          });
        }
      } else {
        if (!this.range_one) {
          this.$nextTick(() => {
            this.range_one = 0;
          });
        } else if (parseInt(this.range_one) > 0) {
          this.$nextTick(() => {
            this.range_one = parseInt(this.range_one) - 1;
          });
        } else
          this.$nextTick(() => {
            this.range_one = 0;
          });
      }
      this.changeAnswer();
    },
    getData() {
      if (
          Object.keys(this.$store.state.ArticleModule.selectedComponent).length
      ) {
        this.index_questions =
            this.$store.state.ArticleModule.counters.questions;
        this.index_component = this.$store.state.ArticleModule.counters.layout;
        this.question_data = Object.assign(
            {},
            this.$store.state.ArticleModule.selectedComponent
        );
        this.dataForRerender = Object.assign(
            {},
            this.$store.state.ArticleModule.selectedComponent
        );
        this.getValue_type_answer();
        this.getHeightOfControls();
        this.getWidthOfControls();
      }
    },
    getValue_type_answer() {
      if (this.question_data["id_type_answer"] == "7") {
        let parsed = null;
        parsed = JSON.parse(
            JSON.parse(this.question_data["value_type_answer"])
        );
        if (Array.isArray(parsed)) {
          this.value_type_answer = parsed;
        } else {
          this.value_type_answer = [];
        }
        if (this.value_type_answer.length) {
          this.min = this.value_type_answer[0].answer;
          this.max = this.value_type_answer[1].answer;
          this.range_two = [];
          this.range_two.push(this.min);
          this.range_two.push(this.max);
        }
      } else if (
          this.question_data["id_type_answer"] !== 1 &&
          this.question_data["id_type_answer"] !== 2
      ) {
        let parsed = null;
        parsed = JSON.parse(
            JSON.parse(this.question_data["value_type_answer"])
        );
        if (Array.isArray(parsed)) {
          this.value_type_answer = parsed;
        } else {
          this.value_type_answer = [];
        }
      } else {
        this.value_type_answer = JSON.parse(
            this.question_data["value_type_answer"]
        );
      }
    },
    getWidthOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(
            `component_wrapper-${this.index_component}`
        );
        if (elem) {
          this.controls_width = elem.getBoundingClientRect().width + 6;
        } else {
          this.controls_width = 0;
        }
      });
    },
    getHeightOfControls() {
      this.$nextTick(() => {
        const elem = document.getElementById(
            `component_wrapper-${this.index_component}`
        );
        if (elem) {
          this.controls_height = elem.getBoundingClientRect().height + 22;
        } else {
          this.controls_height = 0;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/assets/styles/componentArticle";
</style>
