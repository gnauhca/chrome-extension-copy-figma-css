<template>
  <div class="textarea-wrapper">
    <textarea
      v-model="refDataValue"
      @blur="onBlur"
      type="text"
      v-bind="$attrs"
      ref="refTextarea"
      spellcheck="false"
    ></textarea>
    <textarea
      v-model="refDataValue"
      class="textarea--hidden"
      type="text"
      ref="refTextarea2"
      spellcheck="false"
      style="visibility: hidden; pointer-events: none"
    ></textarea>
  </div>
</template>
<script>
import { ref, watch, watchEffect, onMounted } from "vue";

export default {
  props: {
    value: [String, Number],
  },
  setup(props, { emit }) {
    const refDataValue = ref(props.value);
    const refTextarea = ref(null);
    const refTextarea2 = ref(null);
    function resize() {
      if (refTextarea.value) {
        refTextarea.value.style.height =
          refTextarea2.value.scrollHeight + 2 + "px";
      }
      setTimeout(() => {
        if (refTextarea.value) {
          refTextarea.value.style.height =
            refTextarea2.value.scrollHeight + 2 + "px";
        }
      }, 10);
    }

    watchEffect(() => {
      refDataValue.value = props.value;
    });

    watch(() => refDataValue.value, resize, { immediate: true });
    function onBlur() {
      emit("update:value", refDataValue.value);
    }
    return {
      refDataValue,
      refTextarea,
      refTextarea2,
      onBlur,
    };
  },
};
</script>
<style lang="less">
.textarea-wrapper {
  position: relative;
}
textarea {
  display: block;
  width: 100%;
  padding: 5px 10px;
  background: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  font-size: 12px;
  height: 28px;
}
.textarea--hidden {
  position: absolute;
  visibility: hidden;
  pointer-events: none;
  top: -9999px;
  left: -9999px;
}
</style>
