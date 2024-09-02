<template>
  <v-menu
    :close-on-click="closeOnClickOutside"
    :close-on-content-click="closeOnContentClick"
    :open-on-hover="openOnHover"
    :close-delay="closeDelay"
    :left="isLeft"
    :nudge-bottom="nudgeBottom"
    :nudge-right="nudgeRight"
    :nudge-top="nudgeTop"
    :nudge-left="nudgeLeft"
    :offset-y="isOffsetY"
    :top="isTop"
    :content-class="isClass"
    :absolute="isAbsolute"
    bottom
  >
    <template #activator="{ on, attrs }">
      <div
        v-bind="attrs"
        v-on="on"
        class="icon_slot"
      >
        <slot name="icon"/>
      </div>
    </template>
    <slot name="content" :class="{ 'custom_position': isCustomPosition}"/>
  </v-menu>
</template>

<script>
export default {
  name: 'DropDownMenuStyled',
  props: {
    slotIcon: {
      type: Boolean,
      default: false
    },
    slotContent: {
      type: Boolean,
      default: false
    },
    isOffsetY: {
      type: Boolean,
      default: true
    },
    isTop: {
      type: Boolean,
      default: false
    },
    isLeft: {
      type: Boolean,
      default: false
    },
    nudgeBottom: {
      type: Number,
      default: 0
    },
    nudgeRight: {
      type: Number,
      default: 0
    },
    nudgeTop: {
      type: Number,
      default: 0
    },
    nudgeLeft: {
      type: Number,
      default: 0
    },
    closeOnClickOutside: {
      type: Boolean,
      default: true
    },
    closeOnContentClick: {
      type: Boolean,
      default: false
    },
    roundedSize: {
      type: String,
      default: ''
    },
    isAbsolute: {
      type: Boolean,
      default: false
    },
    openOnHover: {
      type: Boolean,
      default: false
    },
    closeDelay: {
      type: String,
      default: ''
    },
    isClass: {
      type: String,
      default: ''
    },
  }
};
</script>

<style lang="scss" scoped>
.icon_slot{
  width: fit-content;
  margin: auto;
}
.reverseIconContent{
  min-width: unset!important;
}
.v-menu__content{
  padding: 10px;
}
.custom_position {
  top: 0 !important;
  left: 0 !important;
}
</style>
