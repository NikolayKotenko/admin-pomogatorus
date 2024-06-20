<template>
    <v-container class="nomenclatures-tree">

      <v-card id="tree" class="pb-10">
        <v-card-title>
            Дерево
        </v-card-title>
        <v-treeview v-model="localTree"
                    :open="open"
                    :items="tree"
                    item-key="name_leaf"
        >
          <template v-slot:prepend="{open, item}">
            <v-icon>{{ getIconRow(open, item) }}</v-icon>
          </template>
          <template v-slot:label="{item}">
            <v-btn class="rollback-vuetify-text-style justify-start" block text
                   @click="setSelectedFamilyAction(item)">{{ item.name_leaf }}</v-btn>
            <hr>
          </template>
          <template v-slot:append="{item}">
            <div class="d-flex">
              <TooltipStyled :title="'Добавить подсемейство в '+`'${item.name_leaf}'`">
                <v-icon
                    color="primary" class="ma-2"
                    @click="openDialogFamily(item.id_family)"
                >mdi-plus-thick
                </v-icon>
              </TooltipStyled>
              <TooltipStyled :title="getDeleteMessage(item)">
                <v-icon
                    :disabled="stateExistChildren(item)"
                    color="red" class="ma-2"
                    @click="deleteEntry(item.id_family)"
                >mdi-delete-outline
                </v-icon>
              </TooltipStyled>
            </div>
          </template>
        </v-treeview>
      </v-card>


      <v-card class="table_container">
        <v-card-title v-if="!selectedFamily.id_family">Не выбрано семейство</v-card-title>

        <!-- Таблица характеристик для семейств  -->
        <v-data-table
            v-if="getStateSelectedFamily && getStateExistChildren"
            :key="selectedFamily.id_family"
            ref=familyTable
            :headers="headersFamilyTable"
            :items="listCharacteristicsFilteredByMToM"
        >
          <template v-slot:top>
              <v-card-title>{{ 'Характеристики семейства - "' + selectedFamily.name_leaf }}</v-card-title>
          </template>
          <template v-slot:item="{ item }">
            <tr v-if="item.id_family === selectedFamily.id_family">
              <td>
                <DropDownMenuStyled :is-class="'reverseIconContent'" :is-top="true" :open-on-hover="true">
                  <template #icon>
                    <section>{{ item.name_char }}</section>
                  </template>
                  <template #content>
                    <IconTooltip
                        :icon-text="'mdi-delete-outline'"
                        :text-tooltip="'Удалить Характеристику'"
                        @click-icon="localSetSelectedByDeleteCharacteristic(item)"
                    />
                  </template>
                </DropDownMenuStyled>
              </td>

              <td>
                <SelectStyled
                    v-if="item._characteristic_nomenclature.type_characteristic.code === 'vybor-iz-spravocnika'"
                    :items="item._characteristic_nomenclature.dictionary.d_dictionary_attributes"
                    :data="item.value"
                    :item-text="'value'"
                    :item-value="'value'"
                    :placeholder="item._characteristic_nomenclature.dictionary.name"
                    :current-rules="$store.state.nameRules"
                    :is-hide-details="true"
                    :is-loading="loading"
                    :is-disabled="loading || item.id_family !== selectedFamily.id_family"
                    :is-return-object="false"
                    @update-input="item.value = $event; setMToMCharacteristicsNomenclature(item)"
                />
                <InputStyledSimple
                    v-if="['stroka', 'cislo'].includes(item._characteristic_nomenclature.type_characteristic.code)"
                    :id="item.id_characteristic"
                    :data="item.value"
                    :is-disabled="loading || item.id_family !== selectedFamily.id_family"
                    @change-input="item.value = $event; setMToMCharacteristicsNomenclature(item)"
                />
              </td>

              <td>
                <CheckboxStyled
                  :is-hide-details="true"
                  :state="item.required_fill_in_nomenclature"
                  :is-disabled="loading || item.id_family !== selectedFamily.id_family"
                  @change-event="item.required_fill_in_nomenclature = $event; setMToMCharacteristicsNomenclature(item)"
                />
              </td>
            </tr>
          </template>
          <template v-slot:foot>
            <tfoot class="footer_static">
              <tr>
                <td colspan="4" >
                  <IconTooltip
                      :icon-text="'mdi-plus-thick'"
                      :color-icon="'green'"
                      :class="'justify-start'"
                      :text-tooltip="'Добавить Характеристику'"
                      @click-icon="openDialogCharacteristics"
                  />
                </td>
              </tr>
            </tfoot>
          </template>
        </v-data-table>

        <!-- Таблица номенклатуры для последних записей семейств -->
        <v-data-table
            v-if="getStateSelectedFamily && !getStateExistChildren"
            :key="selectedFamily.id_family"
            ref=nomenclatureTable
            :headers="listNomenclatureByFamily"
            hide-default-header
            :items="listCharacteristicsFilteredByMToM"
        >
          <template v-slot:top>
            <v-card-title>{{ 'Номенклатура семейства' }}</v-card-title>
          </template>
          <template v-slot:header="{ props: { headers } }">
            <thead class="v-data-table-header">
              <tr>
                <th class="black--text">{{selectedFamily.name_leaf}}</th>

                <th v-for="item in headers" :key="item.id" class="text-center">

                  <DropDownMenuStyled :is-class="'reverseIconContent'" :is-top="true" :open-on-hover="true">
                    <template #icon>
                      <section >{{ item.name }}</section>
                    </template>
                    <template #content>
                      <IconTooltip
                          :icon-text="'mdi-delete-outline'"
                          :text-tooltip="'Удалить номенклатуру'"
                          @click-icon="localSetSelectedByDeleteNomenclature(item)"
                      />
                    </template>
                  </DropDownMenuStyled>
                </th>

                <th>
                  <TooltipStyled :title="'Добавить Номенклатуру'">
                    <v-btn text block class="justify-center align-center"
                           @click="openDialogNomenclature"
                    >
                      <v-icon color="green">mdi-plus-thick</v-icon>
                    </v-btn>
                  </TooltipStyled>
                </th>
            </tr>
            </thead>
          </template>
          <!--
            item.id_characteristic <-> ид_харки
            headers[index].id <-> ид_номенклатуры
          -->
          <template v-slot:item="{ item, index, headers }">
            <tr v-if="item.required_fill_in_nomenclature" :class="{parentPropertyStyle: !item.required_fill_in_nomenclature}">
              <!--Характеристика-->
              <td>
                <DropDownMenuStyled :is-class="'reverseIconContent'" :is-top="true" :open-on-hover="true">
                  <template #icon>
                    <section>{{ item.name_char }}</section>
                  </template>
                  <template #content>
                    <IconTooltip
                        :icon-text="'mdi-delete-outline'"
                        :text-tooltip="'Удалить Характеристику'"
                        @click-icon="localSetSelectedByDeleteCharacteristic(item)"
                    />
                  </template>
                </DropDownMenuStyled>
              </td>

              <!-- Инпут value характеристики номенклатуры-->
              <td v-for="(header, key) in headers" :key="key">
                <SelectStyled
                    v-if="item._characteristic_nomenclature.type_characteristic.code === 'vybor-iz-spravocnika'"
                    :items="item._characteristic_nomenclature.dictionary.d_dictionary_attributes"
                    :data="getValueCharacteristicNomenclature(item, header.id)"
                    :item-text="'value'"
                    :item-value="'value'"
                    :placeholder="item._characteristic_nomenclature.dictionary.name"
                    :current-rules="$store.state.nameRules"
                    :is-hide-details="true"
                    :is-loading="loading"
                    :is-disabled="loading || !item.required_fill_in_nomenclature"
                    :is-return-object="false"
                    @update-input="setMToMCharacteristicsNomenclature({
                    'id_characteristic': item.id_characteristic,
                    'id_nomenclature': header.id,
                    'value': $event,
                    'is_nomenclature': 1,
                    'required_fill_in_nomenclature': 1
                    })"
                />
                <InputStyledSimple
                    v-if="['stroka', 'cislo'].includes(item._characteristic_nomenclature.type_characteristic.code)"
                    :class="header.name"
                    :id="header.id"
                    :data="getValueCharacteristicNomenclature(item, header.id)"
                    :is-disabled="loading || !item.required_fill_in_nomenclature"
                    @change-input="setMToMCharacteristicsNomenclature({
                    'id_characteristic': item.id_characteristic,
                    'id_nomenclature': header.id,
                    'value': $event,
                    'is_nomenclature': 1,
                    'required_fill_in_nomenclature': 1
                    })"
                />
              </td>
            </tr>
          </template>
          <template v-slot:foot>
            <tfoot class="footer_static">
            <tr>
              <td :colspan="lengthListNomenclatureByFamily + 2" >
                <TooltipStyled :title="'Добавить Характеристику'">
                  <v-btn text block class="justify-start"
                         @click="openDialogCharacteristics"
                  >
                    <v-icon color="green">mdi-plus-thick</v-icon>
                  </v-btn>
                </TooltipStyled>
              </td>
            </tr>
            </tfoot>
          </template>
        </v-data-table>
      </v-card>

      <v-dialog :value="dialogFamily"
          @click:outside="closeDialogFamily()"
          @keydown.esc="closeDialogFamily()"
      >
        <v-card>
          <v-card-title>
            Новый элемент
          </v-card-title>
          <v-card-text>
            <v-col cols="12" sm="12" md="12">
              <ComboboxStyled
                  :is-items="listFamiliesBySearch"
                  :key="idParentFamily"
                  :is-return-object="true"
                  :is-item-text="'name'"
                  :is-item-value="'name'"
                  :is-hide-details="false"
                  :is-outlined="false"
                  :is-placeholder="'Поиск. Введите имя нового семейства'"
                  :is-loading="loading"
                  :is-disabled="loading"
                  @update-search-input="getFamilyBySearch($event)"
                  @change-search="localSetSearchFamily"
              ></ComboboxStyled>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="closeDialogFamily()" > Закрыть </v-btn>
            <v-btn color="primary" text
                   @click="addChildAction"
                   :disabled="!newFamily.id_family || loading"
                   :loading="loading"
            > Добавить </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Диалог добавления номенклатуры  -->
      <v-dialog :value="dialogNomenclature"
                @click:outside="closeDialogNomenclature()"
                @keydown.esc="closeDialogNomenclature()"
      >
        <v-card>
          <v-card-title>
           {{ 'Создание новой номенклатуры в семействе - ' + selectedFamily.name_leaf}}
          </v-card-title>
          <v-card-text>
            <v-col cols="12" sm="12" md="12">
              <ComboboxStyled
                  :is-items="listNomenclaturesBySearch"
                  :data="newNomenclature.name"
                  :key="newNomenclature.id"
                  :is-return-object="true"
                  :is-item-text="'name_modified'"
                  :is-item-value="'name_modified'"
                  :is-hide-details="false"
                  :is-error="responseAddNomenclature.isError"
                  :is-error-messages="responseAddNomenclature.message"
                  :is-outlined="false"
                  :is-placeholder="'Введите имя номенклатуры'"
                  :is-loading="loading"
                  :is-disabled="loading"
                  @update-search-input="getNomenclaturesBySearch($event)"
                  @change-search="localSetSearchNomenclature"
                  @click-clear="clearListNomenclaturesBySearch"
              ></ComboboxStyled>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="closeDialogNomenclature()" > Закрыть </v-btn>
            <v-btn color="primary" text
                   @click="closeDialogNomenclature()"
                   :disabled="!newNomenclature.id || loading || responseAddNomenclature.isError"
                   :loading="loading"
            > Добавить </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Диалог удаления номенклатуры  -->
      <v-dialog :value="dialogDeleteNomenclature"
                @click:outside="closeDialogDeleteNomenclature()"
                @keydown.esc="closeDialogDeleteNomenclature()"
      >
        <v-card>
          <v-card-title>
            {{ `Вы точно хотите удалить ${selectedByDeleteNomenclature.name} из семейства - ${selectedFamily.name_leaf}`}}
          </v-card-title>
          <v-card-actions>
            <v-btn color="primary" text @click="closeDialogDeleteNomenclature" > Закрыть </v-btn>
            <v-btn color="primary" text
                   @click="deleteNomenclatureByFamily(selectedByDeleteNomenclature.id)"
                   :disabled="!selectedByDeleteNomenclature.id || loading"
                   :loading="loading"
            > Удалить </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Диалог добавления характеристики  -->
      <v-dialog :value="dialogCharacteristics"
                @click:outside="closeDialogCharacteristics()"
                @keydown.esc="closeDialogCharacteristics()"
      >
        <v-card>
          <v-card-title>
            <section>Создание новой характеристики в семействе</section>
            <section>"{{selectedFamily.name_leaf}}"</section>
          </v-card-title>
          <v-card-text>
            <v-col cols="12" sm="12" md="12">
              <ComboboxStyled
                  :is-items="listCharacteristicsBySearch"
                  :data="newCharacteristics.name"
                  :key="newCharacteristics.id"
                  :is-return-object="true"
                  :is-item-text="'name'"
                  :is-item-value="'name'"
                  :is-error-messages="responseAddCharacteristics.message"
                  :is-error="responseAddCharacteristics.isError"
                  :is-hide-details="false"
                  :is-outlined="false"
                  :is-placeholder="'Поиск. Введите имя характеристики'"
                  :is-loading="loading"
                  :is-disabled="loading"
                  @update-search-input="getCharacteristicsBySearch($event)"
                  @change-search="localSetSearchCharacteristics"
                  @click-clear="clearResponseAddCharacteristics(); clearNewCharacteristics()"
              ></ComboboxStyled>
            </v-col>
            <v-row v-if="newCharacteristics.id && !responseAddCharacteristics.isError">
              <v-col>
                <SelectStyled
                    :data="newCharacteristics.id_type_characteristic"
                    :items="listTypeCharacteristics"
                    :item-text="'name'"
                    :item-value="'id'"
                    :placeholder="'Тип параметра'"
                    :current-rules="$store.state.nameRules"
                    :is-hide-details="false"
                    :is-loading="loading"
                    :is-disabled="loading"
                    @update-input="localSetTypeCharacteristic"
                />
              </v-col>
              <v-col cols="6" v-if="newCharacteristics.type_characteristic.code === 'vybor-iz-spravocnika'">
                <ComboboxStyled
                    autofocus
                    :data="newCharacteristics.dictionary.name"
                    :is-items="$store.state.DictionariesModule.listEntries"
                    :is-item-text="'name'"
                    :is-item-value="'id'"
                    :is-return-object="true"
                    :is-hide-details="false"
                    :is-placeholder="'Справочник'"
                    :is-loading="loading"
                    :is-disabled="loading"
                    @change-search="localSetDictionaryCharacteristic"
                ></ComboboxStyled>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="closeDialogCharacteristics()" > Закрыть </v-btn>
            <v-btn color="primary" text
                   @click="localSetMtoMCharacteristicsNomenclature()"
                   :disabled="!newCharacteristics.id || loading || responseAddCharacteristics.isError"
                   :loading="loading"
            > Добавить </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Диалог удаления характеристики  -->
      <v-dialog :value="dialogDeleteCharacteristic"
                @click:outside="closeDialogDeleteCharacteristic()"
                @keydown.esc="closeDialogDeleteCharacteristic()"
      >
        <v-card>
          <v-card-title class="d-block">
            <section>Вы точно хотите удалить характеристику</section>
            <section>"{{ selectedByDeleteCharacteristic._characteristic_nomenclature.name }}"</section>
            <section>{{ `из семейства - ${selectedFamily.name_leaf}` }}</section>
          </v-card-title>
          <v-card-actions>
            <v-btn color="primary" text @click="closeDialogDeleteCharacteristic" > Закрыть </v-btn>
            <v-btn color="primary" text
                   @click="deleteCharacteristicByMtoM(selectedByDeleteCharacteristic.id_characteristic)"
                   :disabled="!selectedByDeleteCharacteristic.id || loading"
                   :loading="loading"
            > Удалить </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-overlay
          :absolute="true"
          :value="loading"
      >
        <v-progress-circular
            v-if="loading"
            :indeterminate="true"
            :size="70"
            color="green"
            style="margin: auto"
            width="4"
        ></v-progress-circular>
      </v-overlay>
    </v-container>
</template>

<script>
import IconTooltip from '@/components/common/IconTooltip.vue';
import DropDownMenuStyled from '@/components/common/DropDownMenuStyled.vue';
import TooltipStyled from '@/components/common/TooltipStyled.vue';
import ComboboxStyled from '@/components/common/ComboboxStyled.vue';
import {mapState, mapGetters, mapMutations, mapActions} from "vuex";
import InputStyledSimple from "@/components/common/InputStyledSimple";
import CheckboxStyled from "@/components/common/CheckboxStyled";
import SelectStyled from "@/components/common/SelectStyled";

export default {
  name: "NomenclaturesTree",
  components: {InputStyledSimple, TooltipStyled, ComboboxStyled, DropDownMenuStyled, IconTooltip, CheckboxStyled, SelectStyled },
  data: () => ({
    open: ['Котлы'],
    icons: {
      openFolder: 'mdi-folder-open',
      closedFolder: 'mdi-folder',
      circle: 'mdi-circle-outline',
    },
    localTree: [],
    headersFamilyTable: [
      {
        text: 'Характеристика',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'Значение хар-ки', value: 'value', align: 'center'},
      { text: 'Обязательность заполнения в номенклатуре', value: 'nomenclature_filled', align: 'center' },
      { text: 'Обязательность заполнения *', value: 'required', align: 'center' },
    ],
  }),
  mounted() {
    this.getTreeOnMount();
  },
  watch: {},
  computed:{
    ...mapState('NomenclaturesTreeModule', [
        'dialogFamily',
        'dialogCharacteristics',
        'dialogNomenclature',
        'newFamily',
        'newNomenclature',
        'newCharacteristics',
        'listFamiliesBySearch',
        'listCharacteristicsBySearch',
        'listNomenclaturesBySearch',
        'listNomenclatureByFamily',
        'listCharacteristicsByFamily',
        'loading',
        'tree',
        'idParentFamily',
        'selectedFamily',
        'responseAddCharacteristics',
        'responseAddNomenclature',
        'dialogDeleteNomenclature',
        'selectedByDeleteNomenclature',
        'listTypeCharacteristics',
        'dialogDeleteCharacteristic',
        'selectedByDeleteCharacteristic'
    ]),
    ...mapGetters('NomenclaturesTreeModule',[
        'getMessageTitleFamilyTable',
        'getStateSelectedFamily',
        'getStateExistChildren',
        'lengthListNomenclatureByFamily',
        'listCharacteristicsFilteredByMToM',
        'getValueCharacteristicNomenclature',
        'getStateExistAddedCharacteristicInFamily',
    ]),
  },
  methods: {
    ...mapActions('NomenclaturesTreeModule', [
          'getCharacteristicsBySearch',
          'getFamilyBySearch',
          'getNomenclaturesBySearch',
          'getTreeOnMount',
          'addChildAction',
          'setFamilyByName',
          'deleteEntry',
          'setCharacteristicOnFamily',
          'setNomenclaturesByName',
          'setSelectedFamilyAction',
          'setMToMCharacteristicsNomenclature',
          'getNomenclatureByFamily',
          'deleteNomenclatureByFamily',
          'getListTypeCharacteristics',
          'updateCharacteristicAction',
          'deleteCharacteristicByMtoM'
        ],
    ),
    ...mapActions('DictionariesModule', [
      'getListDictionaries'
    ]),
    ...mapMutations('NomenclaturesTreeModule', [
        'closeDialogCharacteristics',
        'closeDialogFamily',
        'closeDialogNomenclature',
        'openDialogFamily',
        'openDialogCharacteristics',
        'openDialogNomenclature',
        'clearListNomenclaturesBySearch',
        'clearResponseAddCharacteristics',
        'clearNewCharacteristics',
        'openDialogDeleteNomenclature',
        'closeDialogDeleteNomenclature',
        'setSelectedByDeleteNomenclature',
        'setDictionaryCharacteristic',
        'setResponseAddCharacteristic',
        'setTypeCharacteristic',
        'closeDialogDeleteCharacteristic',
        'setSelectedByDeleteCharacteristic',
        'openDialogDeleteCharacteristic'
    ]),
    getIconRow(open, item){
      if (!item.children) return this.icons.circle

      return open ? 'mdi-folder-open' : 'mdi-folder';
    },
    localSetSearchFamily(obj){
      if (! obj) return false;

      const nameFamily = (obj.name) ? obj.name : obj;
      this.setFamilyByName(nameFamily);
    },
    async localSetSearchCharacteristics(obj){
      if (! obj) return false;

      const nameFamily = (obj.name) ? obj.name : obj;
      const entry = await this.setCharacteristicOnFamily(nameFamily);
      const existEntry = this.getStateExistAddedCharacteristicInFamily(entry.id)

      this.clearResponseAddCharacteristics();
      if (existEntry){
        this.setResponseAddCharacteristic({
          message: entry.name + ' уже добавлена в текущее семейство',
          codeResponse: 409
        });
        return false;
      }

      //Запрашиваем список типов характеристик для выбора типа характеристики
      await this.getListTypeCharacteristics();
      await this.getListDictionaries({query: {flag_nomenclature: true}})
    },
    async localSetMtoMCharacteristicsNomenclature(){
      const response = await this.setMToMCharacteristicsNomenclature({
        id_characteristic: this.newCharacteristics.id,
        required_fill_in_nomenclature: 1
      });
      if (response.codeResponse >= 400) return false;

      this.closeDialogCharacteristics()
    },

    async localSetSearchNomenclature(obj){
      if (! obj) return false;

      const name = (obj.name) ? obj.name : obj;
      await this.setNomenclaturesByName(name);

      await this.getNomenclatureByFamily(this.selectedFamily.id_family);
    },
    stateExistChildren(item){
      if (!item.children) return false

      if (! item.children.length) return false;

      return true;
    },
    getDeleteMessage(item){
      if (item.children) return 'Нельзя удалить семейство с детьми'

     return 'Удалить семейство'+`'${item.name_leaf}'`;
    },
    localSetSelectedByDeleteNomenclature(item){
      this.setSelectedByDeleteNomenclature(item)
      this.openDialogDeleteNomenclature();
    },
    localSetSelectedByDeleteCharacteristic(item){
      this.setSelectedByDeleteCharacteristic(item)
      this.openDialogDeleteCharacteristic();
    },
    async localSetTypeCharacteristic(DTypeCharacteristics){
      this.setTypeCharacteristic(DTypeCharacteristics)
      await this.updateCharacteristicAction()
    },
    async localSetDictionaryCharacteristic(Dictionary){
      this.setDictionaryCharacteristic(Dictionary)
      await this.updateCharacteristicAction()
    }
  },
  beforeRouteLeave: function(to, from, next) {
    this.closeDialogDeleteCharacteristic()
    this.closeDialogCharacteristics()
    this.closeDialogDeleteNomenclature()
    this.closeDialogNomenclature()
    this.closeDialogFamily()
    this.clearResponseAddCharacteristics()
    this.clearListNomenclaturesBySearch()
    this.clearNewCharacteristics()
    next();
  },
}
</script>

<style lang="scss" scoped>
.nomenclatures-tree{
  display: grid;
  grid-template-columns: 35% 1fr;
  grid-column-gap: 10px;
  #tree{
    max-height: 88vh;
    overflow: auto;
  }

  .table_container{
    .v-data-table{
      tbody {
        tr {
          td{
            padding-top: 10px;
            padding-bottom: 10px;
          }
        }
      }
    }
  }

  .parentPropertyStyle{
    background: #d3d3d37d;
  }

  .footer_static{
    position: sticky;
    background-color: #d3d3d347;
    width: 100%;
  }
}

</style>