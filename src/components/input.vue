<template>
  <input v-model="refDataValue" @blur="onBlur" type="text" v-bind="$attrs">
</template>
<script>
import { ref, watchEffect } from 'vue';

export default {
  props: {
    value: [String, Number],

  },
  setup(props, { emit }) {
    const refDataValue = ref(props.value);

    watchEffect(() => {
      refDataValue.value = props.value;
    });
    function onBlur() {
      emit('update:value', refDataValue.value);
    }
    return {
      refDataValue,
      onBlur,
    }
  },
};
</script>
<style lang="less">
input {
  padding: 4px 8px;
  font-size: 12px;
  line-height: 16px;
  background: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
}
</style>
