<template>
  <div>
    <v-data-table
        v-if="
          !!$store.state.AnswersModule.listAnswers.length &&
          !$store.state.AnswersModule.loadingList
        "
        :headers="titles"
        :calculate-widths="true"
        hide-default-header
        show-group-by
        :sort-desc.sync="sortDesc"
        :items="$store.state.AnswersModule.listAnswers"
        :item-key="'id'"
        class="elevation-1 table-answers"
        :loading="$store.state.AnswersModule.loadingList"
        loading-text="Loading... Please wait"
        :footer-props="{
          itemsPerPageText: 'Кол-во записей на странице',
          itemsPerPageOptions:[
              30,50,100,300
          ]
        }"
    >
      <template v-slot:header="{ props: { headers, options }, on }">
        <thead class="v-data-table-header">
          <tr>
            <th v-for="item in titles" :key="item.id">
              <v-icon
                  v-if="item.groupable"
                  color="primary"
                  @click="changeStateGrouping(on, item)"
              >
                {{ (curGroupingColumn === item.value) ? 'mdi-arrow-expand' : 'mdi-arrow-collapse'}}
              </v-icon>
              <span>{{ item.text }}</span>
              <v-icon
                  v-if="item.sortable"
                  color="green"
                  @click="changeStateSorting(on, item, options)"
              >
                {{ (sortDesc && curSortingColumn === item.value) ? 'mdi-arrow-up-thin' : 'mdi-arrow-down-thin'}}
              </v-icon>
<!--              <span>'sortBy' - {{ options.sortBy }}</span><br>-->
<!--              <span>'sortDesc - {{ options.sortDesc}}</span><br>-->
<!--              <span>'on - {{ on }}</span><br>-->
            </th>
          </tr>
        </thead>
      </template>
      <template v-slot:group.header="{items, isOpen, toggle, remove, headers, groupBy}" >
        <th colspan="6" class="custom_group_header" v-if="curGroupingColumn">
          <v-icon @click="toggle" title="Свернуть группировку"
          >{{ isOpen ? 'mdi-minus' : 'mdi-plus' }}
          </v-icon>
<!--          <span>'headers' - {{ headers }}</span><br>-->
<!--          <span>'groupBy - {{ groupBy }}</span><br>-->
          {{ getCurrentGroupValueColumn(items, groupBy) }}
<!--          <v-icon prefix="&nbsp;&nbsp" @click="remove" title="Убрать группировку">mdi-close</v-icon>-->
        </th>
      </template>
      <template v-slot:item="{ item }">
        <tr class="row_items"
            :key="item.id"
        >
          <td v-if="!isMobile">{{ item.id }}</td>
          <td @click="showDetail(item)" style="cursor: pointer">{{ firstNameUser(item) }}</td>
          <td class="name_answer" @click="showDetail(item)" style="cursor: pointer">{{ nameAnswer(item) }}</td>
          <td v-html="answer(item)"></td>
          <td class="files">
            <div v-if="item.e_client_files.length" @click="runDialogFiles(item.e_client_files)">
              <v-icon small>mdi-file-multiple-outline</v-icon>
              [ {{ item.e_client_files.length }} ]
            </div>
          </td>
          <td class="updated_at_public">{{ item.updated_at_public }}</td>
        </tr>
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
        sortable: true,
        value: "id",
        width: '10%',
        groupByName: 'id'
      },
      {
        id: 1,
        text: "Пользователь",
        groupable: true,
        value: "user.email",
        width: '15%',
        groupByName: 'user.email'
      },
      {
        id: 2,
        text: "Заголовок вопроса",
        value: "e_question.name",
        groupable: false,
        sortable: true,
        width: '25%'
      },
      {
        id: 3,
        text: "Ответ",
        value: "detailed_response",
        groupable: false,
        sortable: true,
        width: '20%'
      },
      {
        id: 4,
        text: "Файлы",
        groupable: false,
        value: "e_client_files.id",
        sortable: true,
        width: '15%',
      },
      {
        id: 5,
        text: "Дата ответа",
        groupable: true,
        sortable: true,
        value: "created_at",
        width: '15%',
        groupByName: 'created_at'
      },
    ],
    curGroupingColumn: '',
    curSortingColumn: '',
    sortDesc: false,
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
    changeStateGrouping(on, item){
      if (this.curGroupingColumn !== item.value){
        on.group(item.value)
        this.curGroupingColumn = item.value
      }
      else{
        on.group('')
        this.curGroupingColumn = '';
      }
    },
    changeStateSorting(on, item){
      if (this.curSortingColumn !== item.value){
        on.sort(item.value)
        this.curSortingColumn = item.value
        this.sortDesc = true;
      }
      else{
        this.sortDesc = !this.sortDesc;
      }
    },
    getCurrentGroupRuColumnText(columnName){
      console.log('columnName', columnName[0])
      return this.titles.find((elem) => columnName[0].match(elem.groupByName));
    },
    getCurrentGroupValueColumn(items, columnName){
      const itemsL = (items) ? items[0] : null;
      const columnNameL = (columnName) ? columnName[0] : null;

      if (! itemsL) return 'массив itemsL пустой';
      if (! columnNameL) return 'массив columnNameL пустой';

      if (! itemsL.user) return 'Нет данных о пользователе';

      console.log('itemsL', itemsL)
      console.log('columnNameL', columnNameL)

      const nestedKey = columnNameL.split('.');
      if (nestedKey.length > 1){
        return itemsL[nestedKey[0]][nestedKey[1]]
      }
      else{
        return itemsL[columnNameL];
      }
    },
    runDialogFiles(e_client_files){
      this.dialogFiles = true;
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
      return row.user?.email
          ? row.user?.email
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
  .custom_group_header{
    position: relative;
    .mdi-close{
      right: 15px;
      position: absolute;
    }
  }
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

.v-data-table thead tr th{
  //display: inline-flex;
  align-items: center;
  grid-column-gap: 5px;
}
.v-data-table .row_items {
  .name_answer{
    max-width: 300px;
  }
  .updated_at_public{
    min-width: 150px;
  }
}
//table thead {
//  position: relative;
//  tr {
//    position: absolute;
//    width: 100%;
//    display: inline-table;
//    z-index: 999999;
//    background: white;
//    th {
//      position: sticky;
//      position: -webkit-sticky;
//      top: 0;
//      z-index: 999;
//      color: #fff;
//    }
//  }
//}

</style>
