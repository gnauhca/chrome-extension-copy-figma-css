<template>
  <div
    class="switch"
    :class="{ checked }"
    @click="onChange"
  >
    <div class="switch-inner"></div>
  </div>
</template>
<script>
export default {
  props: {
    checked: Boolean,
  },
  setup(props, { emit }) {
    function onChange() {
      emit('change');
    }
    return { onChange };
  }
};
</script>
<style lang="less">
.switch {
  margin-left: 2px;
  width: 32px;
  height: 16px;
  border-radius: 10px;
  background: #dbdbdb;
  transition: background 0.3s;
  cursor: pointer;
  &-inner {
    width: 16px;
    height: 16px;
    border-radius: 10px;
    transform: scale(1.2);
    background: #fff;
    transition: all 0.3s;
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.04);
    border: 1px solid #dbdbdb;
  }
  &.checked {
    background: #1f8fff;
    .switch-inner {
      transform: translateX(16px) scale(1.2);
    }
  }
}
</style>
