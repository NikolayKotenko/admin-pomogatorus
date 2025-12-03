export function Constructor_instance(params) {
  const { data, instance } = params;

  this.data = data;
  this.instance = instance;
}

export function Imported_component(data) {
  const { index, component } = data;

  this.index = index;
  this.component = component;
}

export function AnswerVariable(id) {
  this.id = id;
  this.answer = "";
  this.commentary = "";
  this.showComentary = true;
  this.focused = false;
  this.dataEnv = null;
}

export function AnswerRangeMin(id) {
  this.id = id;
  this.answer = "";
  this.commentary = "";
  this.showComentary = true;
  this.focused = false;
  this.placeholder = "Минимальное значение";
  this.dataEnv = null;
}

export function AnswerRangeMax(id) {
  this.id = id;
  this.answer = "";
  this.commentary = "";
  this.showComentary = true;
  this.focused = false;
  this.placeholder = "Максимальное значение";
  this.dataEnv = null;
}

export function DTag(
  id = null,
  code = "",
  name = "",
  description = "",
  seo_description = "",
  seo_keywords = "",
  seo_title = "",
  flag_engineering_system = false,
  sort_engineering_system = "",
  flag_service = false
) {
  this.id = id;
  this.code = code;
  this.name = name;
  this.description = description;
  this.seo_description = seo_description;
  this.seo_keywords = seo_keywords;
  this.seo_title = seo_title;
  this.flag_engineering_system = flag_engineering_system;
  this.flag_service = flag_service;
  this.sort_engineering_system = sort_engineering_system;
}

/** TODO: Неудобная штука вписывать id согласно порядковому номеру в параметрах. В некст раз переписать с деструктуризацией и объектом **/
export function MToMTags(
  id_tag = null,
  id_answer = null,
  id_question = null,
  id_article = null,
  id_object_property = null
) {
  this.id_tag = id_tag;
  this.id_answer = id_answer;
  this.id_question = id_question;
  this.id_article = id_article;
  this.id_object_property = id_object_property;
}

export function MToMTagsTechTask(
  id_tag = null,
  id_question = null,
  id_object_property = null
) {
  this.id_tag = id_tag;
  this.id_question = id_question;
  this.id_object_property = id_object_property;
}

export function ObjectProperties(
  id = null,
  sort = null,
  code = null,
  name = null,
  id_type_property_object = null,
  id_dictionary = null,
  _all_tags = [],
  _all_public_tags = [],
  mtomtags = [],
  m_to_m_tags_tech_task = [],
  d_property_objects = {},
  d_dictionaries = {},
  broadcast_to_snippet = false
) {
  this.id = id;
  this.sort = sort;
  this.code = code;
  this.name = name;
  this.id_type_property_object = id_type_property_object;
  this.id_dictionary = id_dictionary;
  this._all_tags = _all_tags;
  this._all_public_tags = _all_public_tags;
  this.mtomtags = mtomtags;
  this.m_to_m_tags_tech_task = m_to_m_tags_tech_task;
  this.d_property_objects = d_property_objects;
  this.d_dictionaries = d_dictionaries;
  this.broadcast_to_snippet = broadcast_to_snippet;
}

export function DPropertyObject(id = null, name = "", code = "") {
  this.id = id;
  this.name = name;
  this.code = code;
}

export function Dictionary(
  id = null,
  name = "",
  code = "",
  flag_nomenclature = null,
  flag_objects = null,
  d_dictionary_attributes = []
) {
  this.id = id;
  this.name = name;
  this.code = code;
  this.flag_nomenclature = flag_nomenclature;
  this.flag_objects = flag_objects;
  this.d_dictionary_attributes = d_dictionary_attributes;
}

export function DictionaryAttribute(
  id = null,
  sort = null,
  code = "",
  value = "",
  id_dictionary = null
) {
  this.id = id;
  this.sort = sort;
  this.code = code;
  this.value = value;
  this.id_dictionary = id_dictionary;
}

export function NomenclaturesTreeLeaf(
  id_family = null,
  id_parent = null,
  name_leaf = "",
  depth_level = null,
  children = [],
  _family = new Family()
) {
  this.id_family = id_family;
  this.id_parent = id_parent;
  this.name_leaf = name_leaf;
  this.depth_level = depth_level;
  this.children = children;
  this._family = new Family(
    _family.id,
    _family.code,
    _family.name,
    _family.brand,
    _family.id_brand,
    _family.photos,
    _family.files,
    _family.seo_title,
    _family.seo_description,
    _family.seo_keywords,
    _family.ids_characteristics_public_display
  );
}

export function CharacteristicNomenclature(
  id = null,
  sort = null,
  name = "",
  code = "",
  description = "",
  postfix = "",
  id_type_characteristic = null,
  id_dictionary = null,
  type_characteristic = new DTypeCharacteristics(),
  dictionary = new Dictionary()
) {
  this.id = id;
  this.sort = sort;
  this.name = name;
  this.code = code;
  this.descriptionEditor = description;
  this.description = description;
  this.postfix = postfix;
  this.id_type_characteristic = id_type_characteristic;
  this.id_dictionary = id_dictionary;
  this.type_characteristic = type_characteristic
    ? new DTypeCharacteristics(
        type_characteristic.id,
        type_characteristic.name,
        type_characteristic.code
      )
    : new DTypeCharacteristics();

  this.dictionary = dictionary
    ? new Dictionary(
        dictionary.id,
        dictionary.name,
        dictionary.code,
        dictionary.flag_nomenclature,
        dictionary.flag_objects,
        dictionary.d_dictionary_attributes
      )
    : new Dictionary();
}

export function DTypeCharacteristics(id = null, name = "", code = "") {
  this.id = id;
  this.name = name;
  this.code = code;
}

export function Family(
  id = null,
  code = "",
  name = "",
  brand = "",
  id_brand = null,
  photos = null,
  files = null,
  seo_title = "",
  seo_description = "",
  seo_keywords = "",
  ids_characteristics_public_display = []
) {
  this.id = id;
  this.code = code;
  this.name = name;
  this.brand = brand;
  this.id_brand = id_brand;
  this.photos = photos;
  this.files = files;
  this.seo_title = seo_title;
  this.seo_description = seo_description;
  this.seo_descriptionEditor = seo_description;
  this.seo_keywords = seo_keywords;
  this.ids_characteristics_public_display = ids_characteristics_public_display;
}

export function Nomenclature(
  id = null,
  name = "",
  code = "",
  vendor_code = "",
  id_family = null,
  seo_title = "",
  seo_description = "",
  seo_keywords = "",
  link_market = "",
  link_market_ozon = "",
  link_market_lunda = ""
) {
  this.id = id;
  this.name = name;
  this.code = code;
  this.vendor_code = vendor_code;
  this.id_family = id_family;
  this.seo_title = seo_title;
  this.seo_description = seo_description;
  this.seo_descriptionEditor = seo_description;
  this.seo_keywords = seo_keywords;
  this.link_market = link_market;
  (this.link_market_ozon = link_market_ozon),
    (this.link_market_lunda = link_market_lunda);
}

export function ModifiedMtoMNomenclatureCharacteristics(
  name_char = "",
  data_char = []
) {
  this.name_char = name_char;
  this.data_char = data_char;
}

export function MtoMNomenclatureCharacteristics(
  id = null,
  id_family = null,
  id_characteristic = null,
  id_nomenclature = null,
  value = "",
  is_nomenclature = 0,
  required_fill_in_nomenclature = 0,
  _characteristic_nomenclature = new CharacteristicNomenclature(),
  _family = new Family()
) {
  this.id = id;
  this.id_family = id_family;
  this.id_characteristic = id_characteristic;
  this.id_nomenclature = id_nomenclature;
  this.is_nomenclature = is_nomenclature;
  this.required_fill_in_nomenclature = required_fill_in_nomenclature;
  this.value = value;
  this._characteristic_nomenclature = new CharacteristicNomenclature(
    _characteristic_nomenclature.id,
    _characteristic_nomenclature.sort,
    _characteristic_nomenclature.name,
    _characteristic_nomenclature.code,
    _characteristic_nomenclature.description,
    _characteristic_nomenclature.postfix,
    _characteristic_nomenclature.id_type_characteristic,
    _characteristic_nomenclature.id_dictionary,
    _characteristic_nomenclature.type_characteristic,
    _characteristic_nomenclature.dictionary
  );
  this._family = new Family(
    _family.id,
    _family.code,
    _family.name,
    _family.brand,
    _family.id_brand,
    _family.photos,
    _family.files,
    _family.seo_title,
    _family.seo_description,
    _family.seo_keywords,
    _family.ids_characteristics_public_display
  );
  this.name_char = _characteristic_nomenclature.name;
}

export function PropertyEntity(key = "", payload) {
  this.key = key;
  this.payload = payload;
}

export function Breadcrumb(text = "", disabled = false) {
  this.text = text;
  this.href = "#" + text;
  this.disabled = disabled;
}
