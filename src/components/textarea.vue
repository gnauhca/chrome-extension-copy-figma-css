<template>
  <textarea v-model="refDataValue" @blur="onBlur" type="text" v-bind="$attrs" :rows="5"></textarea>
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
textarea {
  padding: 5px 10px;
  background: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
}
</style>
