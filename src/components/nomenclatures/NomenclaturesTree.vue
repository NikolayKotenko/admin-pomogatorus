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
                    @click="open_dialog_family(item.id_family)"
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
                <DropDownMenuStyled :is-class="'reverseIconContent'" :is-top="true" >
                  <template #icon>
                    <section>{{ item.name_char }}</section>
                  </template>
                  <template #content>
                    <section class="d-inline-flex">
                      <IconTooltip
                          :icon-text="'mdi-delete-outline'"
                          :text-tooltip="'Удалить Характеристику'"
                          :is-disabled="loading"
                          @click-icon="set_characteristic(item); open_dialog_delete_characteristic();"
                      />
                      <IconTooltip
                          :icon-text="'mdi-pencil'"
                          :text-tooltip="'Редактировать Характеристику'"
                          :is-disabled="loading"
                          @click-icon="
                          set_action_query('edit');
                          set_characteristic({
                                'id': item._characteristic_nomenclature.id,
                                'name': item._characteristic_nomenclature.name,
                                'code': item._characteristic_nomenclature.code,
                                'description': item._characteristic_nomenclature.description,
                                'postfix': item._characteristic_nomenclature.postfix,
                                'id_type_characteristic': item._characteristic_nomenclature.id_type_characteristic,
                                'id_dictionary': item._characteristic_nomenclature.id_dictionary,
                                'type_characteristic': item._characteristic_nomenclature.type_characteristic,
                                'dictionary': item._characteristic_nomenclature.dictionary
                              });
                          openDialogCharacteristics();"
                      />
                    </section>
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
                    :current-rules="$store.state.requiredFieldRules"
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
                      @click-icon="set_action_query('add'); openDialogCharacteristics()"
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
                      <section class="d-inline-flex">
                        <IconTooltip
                            :icon-text="'mdi-delete-outline'"
                            :text-tooltip="'Удалить номенклатуру'"
                            :is-disabled="loading"
                            @click-icon="set_nomenclature(item); open_dialog_delete_nomenclature();"
                        />
                        <IconTooltip
                            :icon-text="'mdi-pencil'"
                            :text-tooltip="'Редактировать номенклатуру'"
                            :is-disabled="loading"
                            @click-icon="
                              set_action_query('edit');
                              set_nomenclature(item);
                              open_dialog_nomenclature();"
                        />
                      </section>
                    </template>
                  </DropDownMenuStyled>
                </th>

                <th>
                  <TooltipStyled :title="'Добавить Номенклатуру'">
                    <v-btn text block class="justify-center align-center"
                           @click="set_action_query('add'); open_dialog_nomenclature();"
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
                    <section class="d-inline-flex">
                        <IconTooltip
                            :icon-text="'mdi-delete-outline'"
                            :text-tooltip="deniedAccessByDeleteCharacteristic(item.id_characteristic)
                            ? 'Нельзя удалить характеристику, она задана в родителе'
                            : 'Удалить Характеристику'"
                            :is-disabled="deniedAccessByDeleteCharacteristic(item.id_characteristic) || loading"
                            @click-icon="set_characteristic({
                              'id': item.id_characteristic,
                              'name': item.name_char
                            }); open_dialog_delete_characteristic();"
                        />
                        <IconTooltip
                            :icon-text="'mdi-pencil'"
                            :text-tooltip="'Редактировать Характеристику'"
                            :is-disabled="loading"
                            @click-icon="
                            set_action_query('edit');
                            set_characteristic({
                              'id': item._characteristic_nomenclature.id,
                              'name': item._characteristic_nomenclature.name,
                              'code': item._characteristic_nomenclature.code,
                              'description': item._characteristic_nomenclature.description,
                              'postfix': item._characteristic_nomenclature.postfix,
                              'id_type_characteristic': item._characteristic_nomenclature.id_type_characteristic,
                              'id_dictionary': item._characteristic_nomenclature.id_dictionary,
                              'type_characteristic': item._characteristic_nomenclature.type_characteristic,
                              'dictionary': item._characteristic_nomenclature.dictionary
                            });
                            openDialogCharacteristics();"
                        />
                    </section>
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
                    :current-rules="$store.state.requiredFieldRules"
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
                    v-if="item._characteristic_nomenclature.type_characteristic.code === 'stroka'"
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
                <InputStyledSimple
                    v-if="item._characteristic_nomenclature.type_characteristic.code === 'cislo'"
                    :type-data="'number'"
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
                         @click="set_action_query('add'); openDialogCharacteristics()"
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
          @click:outside="close_dialog_family()"
          @keydown.esc="close_dialog_family()"
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
                  @update-search-input="getFamilyBySearch($event);"
                  @change-search="localSetSearchFamily"
                  @click-clear="clear_family"
              ></ComboboxStyled>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="close_dialog_family()" > Закрыть </v-btn>
            <v-btn color="primary" text
                   @click="addChildAction"
                   :disabled="!family.id_family || loading"
                   :loading="loading"
            > Добавить в дерево</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Диалог добавления номенклатуры  -->
      <v-dialog :value="dialogNomenclature"
                @click:outside="close_dialog_nomenclature(); clear_action_query();"
                @keydown.esc="close_dialog_nomenclature(); clear_action_query();"
      >
        <v-card>
          <v-card-title>
            <section>Создание/редактирование номенклатуры в семействе</section>
            <section>"{{selectedFamily.name_leaf}}"</section>
          </v-card-title>
          <v-card-text>
            <v-col>
              <p class="text-subtitle-1"></p>
              <ComboboxStyled
                  :is-items="listNomenclaturesBySearch"
                  :data="nomenclature.name"
                  :key="nomenclature.id"
                  :is-return-object="true"
                  :is-item-text="'name'"
                  :is-item-value="'name'"
                  :is-hide-details="false"
                  :is-error="responseAddNomenclature.isError"
                  :is-error-messages="responseAddNomenclature.message"
                  :is-outlined="false"
                  :is-placeholder="'Введите имя номенклатуры'"
                  :is-loading="loading"
                  @update-search-input="getNomenclaturesBySearch($event)"
                  @change-search="localSetSearchNomenclature"
                  @click-clear="clear_nomenclature(); clear_list_nomenclatures_by_search(); clear_response_add_nomenclature()"
              ></ComboboxStyled>
            </v-col>
            <v-col v-if="nomenclature.id && !responseAddNomenclature.isError">
              <InputStyledSimple
                  class="mb-5"
                  :data="nomenclature.seo_title"
                  :placeholder="'Seo title'"
                  @update-input="setPropertyNomenclature({ key: 'seo_title', payload: $event });"
              />
              <InputStyledSimple
                  class="mb-5"
                  :data="nomenclature.seo_keywords"
                  :placeholder="'Seo keywords'"
                  @update-input="setPropertyNomenclature({ key: 'seo_keywords', payload: $event });"
              />
              <VueEditor
                  v-model="nomenclature.seo_descriptionEditor"
                  placeholder="Seo description"
                  class="mt-3"
                  :editorToolbar="customToolbar"
                  ref="characteristicEditor"
                  @text-change="localSetDescriptionNomenclature"
              />
            </v-col>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="close_dialog_nomenclature(); clear_action_query();" > Закрыть </v-btn>
            <v-btn color="primary" text
                   v-if="$route.query.action === 'add'"
                   @click="close_dialog_nomenclature()"
                   :disabled="!nomenclature.id || loading || responseAddNomenclature.isError"
                   :loading="loading"
            > Добавить </v-btn>
            <v-btn color="primary" text
                   v-if="$route.query.action === 'edit'"
                   @click="getNomenclatureByFamily(selectedFamily.id_family); close_dialog_nomenclature(); clear_action_query()"
                   :disabled="!nomenclature.id || loading || responseAddNomenclature.isError"
                   :loading="loading"
            > Сохранить </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Диалог удаления номенклатуры  -->
      <v-dialog :value="dialogDeleteNomenclature"
                @click:outside="close_dialog_delete_nomenclature()"
                @keydown.esc="close_dialog_delete_nomenclature()"
      >
        <v-card>
          <v-card-title>
            {{ `Вы точно хотите удалить ${nomenclature.name} из семейства - ${selectedFamily.name_leaf}` }}
          </v-card-title>
          <v-card-actions>
            <v-btn color="primary" text @click="close_dialog_delete_nomenclature" > Закрыть </v-btn>
            <v-btn color="primary" text
                   @click="deleteNomenclatureByFamily(nomenclature.id)"
                   :disabled="!nomenclature.id || loading"
                   :loading="loading"
            > Удалить </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Диалог добавления / редактирования характеристики  -->
      <v-dialog :value="dialogCharacteristics"
                @click:outside="close_dialog_characteristics(); clear_action_query();"
                @keydown.esc="close_dialog_characteristics(); clear_action_query();"
      >
        <v-card>
          <v-card-title>
            <section>Создание/редактирование характеристики в семействе</section>
            <section>"{{selectedFamily.name_leaf}}"</section>
          </v-card-title>
          <v-card-text>
            <v-col cols="12" sm="12" md="12">
              <ComboboxStyled
                  :is-items="listCharacteristicsBySearch"
                  :data="characteristic.name"
                  :key="characteristic.id"
                  :is-return-object="true"
                  :is-item-text="'name'"
                  :is-item-value="'name'"
                  :is-error-messages="responseAddCharacteristics.message"
                  :is-error="responseAddCharacteristics.isError"
                  :is-hide-details="false"
                  :is-outlined="false"
                  :is-placeholder="'Поиск. Введите имя характеристики'"
                  :is-loading="loading"
                  @update-search-input="getCharacteristicsBySearch($event)"
                  @change-search="localSetSearchCharacteristics"
                  @click-clear="clear_response_add_characteristic(); clear_characteristic()"
              ></ComboboxStyled>
            </v-col>
            <v-row v-if="characteristic.id && !responseAddCharacteristics.isError">
              <v-col>
                <SelectStyled
                    :data="characteristic.id_type_characteristic"
                    :items="listTypeCharacteristics"
                    :item-text="'name'"
                    :item-value="'id'"
                    :placeholder="'Тип параметра'"
                    :current-rules="$store.state.requiredFieldRules"
                    :is-hide-details="false"
                    :is-loading="loading"
                    :is-disabled="loading || Boolean(characteristic.id_type_characteristic)"
                    :is-error="Boolean(characteristic.id_type_characteristic)"
                    :is-error-messages="'Уже выбран тип параметра для этой характеристики, изменить нельзя'"
                    @update-input="
                      set_type_characteristic($event)
                      updateCharacteristic()
                    "
                />
              </v-col>
              <v-col cols="6" v-if="characteristic.type_characteristic.code === 'vybor-iz-spravocnika'">
                <ComboboxStyled
                    :data="characteristic.dictionary.name"
                    :is-items="$store.state.DictionariesModule.listEntries"
                    :is-item-text="'name'"
                    :is-item-value="'id'"
                    :is-return-object="true"
                    :is-hide-details="false"
                    :is-placeholder="'Справочник'"
                    :is-loading="loading"
                    :is-disabled="loading || Boolean(characteristic.id_dictionary)"
                    :is-error="Boolean(characteristic.id_dictionary)"
                    :is-error-messages="'Уже выбран справочник для этой характеристики, изменить нельзя'"
                    @change-search="
                      set_dictionary_characteristic($event);
                      updateCharacteristic();
                    "
                    @click-clear="clear_characteristic"
                ></ComboboxStyled>
              </v-col>
              <v-col cols="12">
                <VueEditor
                    v-model="characteristic.descriptionEditor"
                    placeholder="Описание"
                    class="mt-5"
                    :editorToolbar="customToolbar"
                    ref="characteristicEditor"
                    @text-change="localSetDescriptionCharacteristic"
                />
              </v-col>
              <v-col cols="12">
                <SelectStyled
                    :items="dictionaryUnits.d_dictionary_attributes"
                    :item-text="'value'"
                    :item-value="'value'"
                    :data="characteristic.postfix"
                    :placeholder="dictionaryUnits.name"
                    :is-loading="loading"
                    :is-disabled="loading || Boolean(characteristic.postfix)"
                    :is-error="Boolean(characteristic.postfix)"
                    :is-return-object="false"
                    :is-error-messages="'Уже выбрана единица измерения для этой характеристики, изменить нельзя'"
                    @change-input="setPropertyCharacteristic({ key: 'postfix',payload: $event });"
                ></SelectStyled>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn color="primary" text @click="close_dialog_characteristics(); clear_action_query()" > Закрыть </v-btn>
            <v-btn color="primary" text
                   v-if="$route.query.action === 'add'"
                   @click="localSetMtoMCharacteristicsNomenclature()"
                   :disabled="!characteristic.id || !characteristic.id_type_characteristic || loading || responseAddCharacteristics.isError"
                   :loading="loading"
            > Добавить </v-btn>
            <v-btn color="primary" text
                   v-if="$route.query.action === 'edit'"
                   @click="getMToMNomenclatureCharacteristics(selectedFamily.id_family); close_dialog_characteristics(); clear_action_query()"
                   :disabled="!characteristic.id || !characteristic.id_type_characteristic || loading || responseAddCharacteristics.isError"
                   :loading="loading"
            > Сохранить </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Диалог удаления характеристики  -->
      <v-dialog :value="dialogDeleteCharacteristic"
                @click:outside="close_dialog_delete_characteristic()"
                @keydown.esc="close_dialog_delete_characteristic()"
      >
        <v-card>
          <v-card-title class="d-block">
            <section>Вы точно хотите удалить характеристику</section>
            <section>"{{ characteristic.name }}"</section>
            <section>{{ `из семейства - ${selectedFamily.name_leaf}` }}</section>
          </v-card-title>
          <v-card-actions>
            <v-btn color="primary" text @click="close_dialog_delete_characteristic" > Закрыть </v-btn>
            <v-btn color="primary" text
                   @click="deleteCharacteristicByMtoM(characteristic.id)"
                   :disabled="!characteristic.id || loading"
                   :loading="loading"
            > Удалить </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

<!--      <v-overlay-->
<!--          :absolute="true"-->
<!--          :value="loading"-->
<!--      >-->
<!--        <v-progress-circular-->
<!--            v-if="loading"-->
<!--            :indeterminate="true"-->
<!--            :size="70"-->
<!--            color="green"-->
<!--            style="margin: auto"-->
<!--            width="4"-->
<!--        ></v-progress-circular>-->
<!--      </v-overlay>-->
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
// import TextAreaStyled from "@/components/common/TextAreaStyled";
import {VueEditor} from "vue2-editor";

export default {
  name: "NomenclaturesTree",
  components: {
    InputStyledSimple,
    TooltipStyled,
    ComboboxStyled,
    DropDownMenuStyled,
    IconTooltip,
    CheckboxStyled,
    SelectStyled,
    // TextAreaStyled,
    VueEditor
  },
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

    //Editor
    customToolbar:[
      [{ font: [] }],
      [{ header: [false, 1, 2, 3, 4, 5, 6] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [
        { align: "" },
        { align: "center" },
        { align: "right" },
        { align: "justify" }
      ],
      [{ header: 1 }, { header: 2 }],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ color: [] }, { background: [] }],
      // ["link", "image", "video", "formula"],
      ["link",  "formula"],
      [{ direction: "rtl" }],
      ["clean"]
    ],
    debounceTimeout: null
  }),
  mounted() {
    this.getTreeOnMount();
    this.getDictionaryUnits()
  },
  watch: {},
  computed:{
    ...mapState('NomenclaturesTreeModule', [
        'dialogFamily',
        'dialogCharacteristics',
        'dialogNomenclature',
        'family',
        'nomenclature',
        'characteristic',
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
        'listTypeCharacteristics',
        'dialogDeleteCharacteristic',
        'characteristic',
        'dictionaryUnits'
    ]),
    ...mapGetters('NomenclaturesTreeModule',[
        'getStateSelectedFamily',
        'getStateExistChildren',
        'lengthListNomenclatureByFamily',
        'listCharacteristicsFilteredByMToM',
        'getValueCharacteristicNomenclature',
        'getStateExistAddedCharacteristicInFamily',
        'getStateExistAddedNomenclatureInFamily',
        'deniedAccessByDeleteCharacteristic',
    ]),
    ...mapGetters(['stateEditCreate'])
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
          'updateCharacteristic',
          'deleteCharacteristicByMtoM',
          'getDictionaryUnits',
          'getMToMNomenclatureCharacteristics',
          'openDialogCharacteristics',
          'setPropertyNomenclature',
          'setPropertyCharacteristic'
        ],
    ),
    ...mapActions('DictionariesModule', [
      'getListDictionaries'
    ]),
    ...mapMutations('NomenclaturesTreeModule', [
        'close_dialog_characteristics',
        'close_dialog_family',
        'close_dialog_nomenclature',
        'open_dialog_family',
        'open_dialog_nomenclature',
        'clear_list_nomenclatures_by_search',
        'clear_response_add_characteristic',
        'clear_response_add_nomenclature',
        'clear_nomenclature',
        'clear_characteristic',
        'clear_list_characteristics_by_search',
        'clear_family',
        'open_dialog_delete_nomenclature',
        'close_dialog_delete_nomenclature',
        'set_dictionary_characteristic',
        'set_response_add_characteristic',
        'set_response_add_nomenclature',
        'set_type_characteristic',
        'close_dialog_delete_characteristic',
        'set_characteristic',
        'open_dialog_delete_characteristic',
        'set_nomenclature',
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

      this.clear_response_add_characteristic();
      if (existEntry){
        this.set_response_add_characteristic({
          message: entry.name + ' уже добавлена в текущее семейство',
          codeResponse: 409
        });
        return false;
      }

      //Очищаем поиск для валидных данных с бэка
      this.clear_list_characteristics_by_search();

      await this.getListDictionaries({query: {flag_nomenclature: true}})
    },
    async localSetMtoMCharacteristicsNomenclature(){
      const response = await this.setMToMCharacteristicsNomenclature({
        id_characteristic: this.characteristic.id,
        required_fill_in_nomenclature: 1
      });
      if (response.codeResponse >= 400) return false;

      this.close_dialog_characteristics()
    },
    async localSetSearchNomenclature(obj){
      if (! obj) return false;

      const name = (obj.name) ? obj.name : obj;
      const entry = await this.setNomenclaturesByName(name);
      const existEntry = this.getStateExistAddedNomenclatureInFamily(entry.id)

      this.clear_response_add_nomenclature();
      if (existEntry){
        this.set_response_add_nomenclature({
          message: entry.name + ' уже добавлена в текущее семейство',
          codeResponse: 409
        });
        return false;
      }
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
    async localSetDescriptionCharacteristic(){
      if (this.characteristic.descriptionEditor === this.characteristic.description) return false;

      this.setPropertyCharacteristic({
        key: 'description',
        payload: this.characteristic.descriptionEditor
      })
    },
    async localSetDescriptionNomenclature(){
      if (this.nomenclature.seo_descriptionEditor === this.nomenclature.seo_description)  return false;

      this.setPropertyNomenclature({
        key: 'seo_description',
        payload: this.nomenclature.seo_descriptionEditor
      })
    },

    // Работаем с кверями
    clear_action_query(){
      this.$router.replace({
        query: null,
      }).catch(() => {});
    },
    set_action_query(action) {
      this.$router.replace({
        query: { action: action },
      }).catch(() => {});
    },
  },
  beforeRouteLeave: function(to, from, next) {
    this.close_dialog_delete_characteristic()
    this.close_dialog_characteristics()
    this.close_dialog_delete_nomenclature()
    this.close_dialog_nomenclature()
    this.close_dialog_family()
    this.clear_response_add_characteristic()
    this.clear_list_nomenclatures_by_search()
    this.clear_characteristic()
    this.clear_list_characteristics_by_search()
    next();
  },
}
</script>

<style lang="scss" scoped>
.nomenclatures-tree{
  display: grid;
  grid-template-columns: 35% 1fr;
  grid-column-gap: 10px;
  overflow: auto;
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