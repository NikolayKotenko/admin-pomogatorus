<template>
  <div>
    <v-data-table
        v-if="
          !!$store.state.AnswersModule.listAnswers.length &&
          !$store.state.AnswersModule.loadingList
        "
        :headers="titles"
        :items="$store.state.AnswersModule.listAnswers"
        :item-key="'id'"
        class="elevation-1 table-answers"
        :loading="$store.state.AnswersModule.loadingList"
        loading-text="Loading... Please wait"
    >
<!--      <template
          v-slot:header="{ props: { headers } }"
      >
        {{ headers }}
      </template>-->
      <template
          v-slot:body="{ items }"
      >
        <tbody>
        <tr
            v-for="(item) in items"
            :key="item.id"
        >
          <td v-if="!isMobile">{{ item.id }}</td>
          <td @click="showDetail(item)" style="cursor: pointer">{{ firstNameUser(item) }}</td>
          <td @click="showDetail(item)" style="cursor: pointer">{{ nameAnswer(item) }}</td>
          <td v-html="answer(item)"></td>
          <td class="files">
            <div v-if="item.e_client_files.length" @click="runDialogFiles(item.e_client_files)">
              <v-icon small>mdi-file-multiple-outline</v-icon>
              [ {{ item.e_client_files.length }} ]
            </div>
          </td>
          <td>{{ item.updated_at_public }}</td>
        </tr>
        </tbody>
      </template>
    </v-data-table>
    <v-alert
      text
      prominent
      type="error"
      v-if="
        !$store.state.AnswersModule.listAnswers.length &&
        !$store.state.AnswersModule.loadingList
      "
      >Список пуст</v-alert
    >
    <div class="loaderList" v-else-if="$store.state.AnswersModule.loadingList">
      <v-progress-circular
        :size="50"
        color="primary"
        indeterminate
      ></v-progress-circular>
    </div>

    <!-- MODALS -->
    <v-dialog
        v-model="dialogFiles"
        content-class="dialogLocalFiles"
        scrollable
        @keydown.esc="files = []"
    >
      <v-card>
        <v-card-title style="display: inline-flex; flex-wrap: nowrap">
          <span class="text-h6" style="margin: auto">Файлы пользователя</span>
          <v-icon @click="dialogFiles = false;">mdi-close-thick</v-icon>
        </v-card-title>
        <v-card-text>
          <card-list-files :files="files" v-if="files.length"></card-list-files>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogFiles = false;">
            Закрыть
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </div>
</template>

<script>
import CardListFiles from "../CardListFiles";

export default {
  name: "AnswersList",
  components:{
    CardListFiles
  },
  data: () => ({
    titles: [
      {
        id: 0,
        text: "#",
        groupable: false,
        value: "id",
        width: '10%'
      },
      {
        id: 1,
        text: "Пользователь",
        value: "user.first_name",
        width: '15%'
      },
      {
        id: 2,
        text: "Заголовок вопроса",
        value: "e_question.name",
        groupable: false,
        sortable: false,
        width: '30%'
      },
      {
        id: 3,
        text: "Ответ",
        value: "detailed_response",
        groupable: false,
        width: '25%'
      },
      {
        id: 4,
        text: "Файлы",
        width: '12%',
      },
      {
        id: 5,
        text: "Дата ответа",
        value: "created_at",
        width: '10%',
      },
    ],
    dialogFiles: false,
    files: [],
  }),
  computed: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );
    },
  },
  methods: {
    runDialogFiles(e_client_files){
      this.dialogFiles = true;

      e_client_files.map((elem) => {
        return elem.url = this.$store.state.BASE_URL + elem.full_path
      })
      this.files = [];
      this.files = e_client_files
    },
    isEnabled (slot) {
      return this.enabled === slot
    },
    showDetail(object) {
      if (object.e_question?.name) this.$emit("showModalAnswer", object);
    },
    firstNameUser(row) {
      return row.user?.first_name
          ? row.user?.first_name
          : "Не зарегестрированный пользователь";
    },
    nameAnswer(row) {
      return row.e_question?.name
        ? row.e_question?.name
        : "Ошибка в записи ответа";
    },
    isJson(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },
    answer(row) {
      if (!row) return "";
      if (!row.value_answer) {
        return row.detailed_response
          ? row.detailed_response
          : "Ничего не найдено";
      }
      if (this.isJson(row.value_answer)) {
        let parsed = JSON.parse(row.value_answer);
        if (this.isJson(parsed)) parsed = JSON.parse(parsed);
        if (Array.isArray(parsed)) {
          return parsed.join(" ");
        } else {
          return parsed
            ? parsed
            : row.detailed_response
            ? row.detailed_response
            : "Ничего не найдено";
        }
      }
    },
    startSort(title) {
      this.$emit("sortItems", title);
      const index = this.titles.findIndex((elem) => {
        return elem.VALUE === title.VALUE;
      });
      if (index !== -1) {
        let value = title.SORT === "asc" ? "desc" : "asc";
        this.titles[index].SORT = value;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "src/assets/styles/answers";
@import "src/assets/styles/table";

.table-answers{
  .files{
    &.empty{
      color: grey;
    }
    &.exist{
      color: green;
    }
  }
}
</style>

<style lang="scss">
.dialogLocalFiles{
  margin-top: 80px;
  .v-card__text{
    display: flex;
    flex-wrap: wrap;
    grid-row-gap: 1em;
    grid-column-gap: 1em;
  }
}
</style>
