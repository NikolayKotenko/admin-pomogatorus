<template>
  <TooltipStyled
    :is-top="isTopTooltip"
    :title="textTooltip"
  >
    <v-icon
      :color="colorIcon"
      :disabled="isDisabled"
      :size="sizeIcon"
      @click="$emit('click-icon')"
    >
      {{ iconText }}
    </v-icon>
  </TooltipStyled>
</template>

<script>
import TooltipStyled from '@/components/common/TooltipStyled.vue';

export default {
  name: 'IconTooltip',
  components: {
    TooltipStyled
  },
  props: {
    sizeIcon: {
      type: String,
      default: '24'
    },
    colorIcon: {
      type: String,
      default: '#5D80B5'
    },
    iconText: {
      type: String,
      default: 'mdi-help-circle-outline'
    },
    textTooltip: {
      type: String,
      default: ''
    },
    isDisabled: {
      type: Boolean,
      default: false
    },
    isTopTooltip: {
      type: Boolean,
      default: false
    }
  }
};
</script>

