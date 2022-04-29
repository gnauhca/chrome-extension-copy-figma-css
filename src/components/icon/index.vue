<template>
  <i class="icon icon-icon" :class="[`icon-${name}`]"> </i>
</template>
<script>
export default {
  props: {
    name: String,
  },
};
</script>
<style lang="less">
@import "./iconfont/style.css";
.icon-icon {
  line-height: inherit;
}
</style>
