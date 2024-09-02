<template>
  <VTooltip v-model="show" :bottom="(! isTop)" :content-class="getStateTooltip" :nudge-top="nudgeTop"
            :top="isTop"
            retain-focus-on-click
  >
    <template #activator="{ on, attrs }">
      <div v-bind="attrs" v-on="on">
        <slot />
      </div>
    </template>
    <template>
      <span class="tooltip-styled">{{ title }}</span>
    </template>
  </VTooltip>
</template>

<script>
export default {
  name: "TooltipStyled",
  props: {
    title: {
      type: String,
      default: ""
    },
    isTop: {
      type: Boolean,
      default: false
    },
    nudgeTop: {
      type: Number,
      default: 0
    },
    answer: {
      type: String,
      default: ""
    },
    offHiding: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    show: false
  }),
  computed: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },
    getStateTooltip() {
      return !this.title ? "hideTooltip" : "";
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.isMobile) {
        window.addEventListener("scroll", this.checkScroll);
      }
    });
  },
  beforeDestroy() {
    this.$nextTick(() => {
      if (this.isMobile) {
        window.removeEventListener("scroll", this.checkScroll);
      }
    });
  },
  methods: {
    checkScroll() {
      if (process.client) {
        this.$nextTick(() => {
          if (!this.offHiding) {
            this.show = false;
          }
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.hideTooltip {
  display: none;
}

</style>
