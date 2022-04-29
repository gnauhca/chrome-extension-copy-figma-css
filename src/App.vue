<template>
  <div class="panel">
    <div class="form-item">
      <div class="label">启用</div>
      <div class="control">
        <div
          class="switch"
          :class="{ checked: refEnabled }"
          @click="refEnabled = !refEnabled"
        >
          <div class="switch-inner"></div>
        </div>
      </div>
    </div>
    <div class="form-item form-item--block">
      <div class="label">属性</div>
      <div class="control">
        <div class="attrs">
          <span
            class="attr"
            :class="{ checked: attr.checked }"
            @click="attr.checked = !attr.checked"
            v-for="attr in refAttrs"
            :key="attr.attr"
          >
            {{ attr.attr }}
          </span>
        </div>
      </div>
    </div>
    <div class="form-item">
      <div class="label">缩放</div>
      <div class="control">
        <div class="attrs">
          <div
            class="attr"
            :class="{ checked: scale === refScale }"
            v-for="scale in scales"
            :key="scale"
            @click="refScale = scale"
          >
            {{ scale }}x
          </div>
          <Input
            class="attr attr-input-number"
            type="number"
            v-model:value="refScale"
          />
        </div>
      </div>
    </div>
    <div class="form-item">
      <div class="label">单位</div>
      <div class="control">
        <div class="attrs">
          <div
            class="attr"
            :class="{ checked: unit === refUnit }"
            v-for="unit in units"
            :key="unit"
            @click="refUnit = unit"
          >
            {{ unit }}
          </div>
        </div>
      </div>
    </div>
    <div class="form-item">
      <div class="label">转换 1px border</div>
      <div class="control">
        <Switch
          :checked="refBorder1pxEnabled"
          @change="refBorder1pxEnabled = !refBorder1pxEnabled"
        />
      </div>
    </div>
    <div class="form-item">
      <div class="label">兼容 font-weight</div>
      <div class="control">
        <Switch
          :checked="refFixFontWeight"
          @change="refFixFontWeight = !refFixFontWeight"
        />
      </div>
    </div>
    <div class="form-item">
      <div class="label">变量</div>
      <div class="control">
        <Switch
          :checked="refVarsEnabled"
          @change="refVarsEnabled = !refVarsEnabled"
        />
      </div>
      <div class="control control--block" v-if="refVarsEnabled">
        <div class="attrs">
          <div
            class="attr"
            :class="{ checked: item === refEditingVars }"
            v-for="(item, index) in refVars"
            :key="index"
            @click="onVarsSelect(item)"
          >
            {{ item.name }}
          </div>
          <div class="attr" @click="onAddVars">+</div>
        </div>
        <div class="vars-edit" v-if="refEditingVars">
          <div class="action">
            <icon
              class="clickable"
              name="delete"
              @click="onDeleteVars(refEditingVars)"
            ></icon>
          </div>
          <div class="form-item form-item--block">
            <div class="label">name</div>
            <div class="controls">
              <Input v-model:value="refEditingVars.name"></Input>
            </div>
          </div>
          <div class="form-item form-item--block">
            <div class="label">var</div>
            <div class="controls">
              <Textarea v-model:value="refEditingVars.str"></Textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, watch, watchEffect } from "vue";
import "./js/config.js";
import Input from "./components/input.vue";
import Textarea from "./components/textarea.vue";
import Switch from "./components/switch.vue";
import { getVarsFromStr } from "./utils/index";

const CONFIG = window.COPY_FIGMA_CSS;

export default {
  components: {
    Input,
    Textarea,
    Switch,
  },
  setup() {
    const returnValues = {};

    const units = ["px", "rpx", "rem", "pt", "em"];
    const scales = [1, 2, 0.5];
    const refAttrs = ref(
      CONFIG.allAttr.map((item) => {
        return {
          attr: item,
          checked: CONFIG.settings.attrs.indexOf(item) > -1,
        };
      })
    );
    const refEnabled = ref(CONFIG.settings.enabled);
    const refUnit = ref(CONFIG.settings.unit);
    const refScale = ref(CONFIG.settings.scale);
    const refBorder1pxEnabled = ref(CONFIG.settings.border1pxEnabled);
    const refFixFontWeight = ref(CONFIG.settings.fixFontWeight);
    Object.assign(returnValues, {
      units,
      scales,
      refAttrs,
      refUnit,
      refScale,
      refEnabled,
      refBorder1pxEnabled,
      refFixFontWeight,
    });

    const refVarsEnabled = ref(CONFIG.settings.varsEnabled);
    const refVars = ref(CONFIG.settings.vars);
    const refEditingVars = ref(refVars.value[0]);
    const onVarsSelect = (vars) => {
      refVars.value.forEach((item) => (item.enabled = false));
      vars.enabled = true;
      refEditingVars.value = vars;
    };
    const onAddVars = () => {
      const newVars = {
        name: "new vars",
        str: "",
      };
      refVars.value.push(newVars);
      refEditingVars.value = newVars;
    };

    const onDeleteVars = () => {
      refVars.value = refVars.value.filter(
        (item) => item !== refEditingVars.value
      );
      refEditingVars.value = null;
    };
    const varObj = getVarsFromStr(refVars.value[0].str);
    console.log(varObj);

    Object.assign(returnValues, {
      refVarsEnabled,
      refVars,
      onVarsSelect,
      refEditingVars,
      onAddVars,
      onDeleteVars,
    });

    chrome.storage &&
      chrome.storage.sync.get(
        [
          "enabled",
          "attrs",
          "unit",
          "scale",
          "border1pxEnabled",
          "fixFontWeight",
          "varsEnabled",
          "vars",
          "editingVarsIndex",
        ],
        (stores) => {
          if (typeof stores.enabled !== "undefined") {
            refEnabled.value = stores.enabled;
          }
          if (typeof stores.unit !== "undefined") {
            refUnit.value = stores.unit;
          }
          if (typeof stores.scale !== "undefined") {
            refScale.value = stores.scale;
          }
          if (typeof stores.border1pxEnabled !== "undefined") {
            refBorder1pxEnabled.value = stores.border1pxEnabled;
          }
          if (typeof stores.fixFontWeight !== "undefined") {
            refFixFontWeight.value = stores.fixFontWeight;
          }
          if (typeof stores.attrs !== "undefined") {
            refAttrs.value.forEach((item) => {
              if (stores.attrs.indexOf(item.attr) > -1) {
                item.checked = true;
              } else {
                item.checked = false;
              }
            });
          }
          if (typeof stores.varsEnabled !== "undefined") {
            refVarsEnabled.value = stores.varsEnabled;
          }
          if (typeof stores.vars !== "undefined") {
            refVars.value = [];
            for (let key in stores.vars) {
              refVars.value.push(stores.vars[key]);
            }
          }
          if (stores.editingVarsIndex >= 0) {
            refEditingVars.value =
              refVars.value[stores.editingVarsIndex] || null;
          }
        }
      );

    watch(refScale, () => {
      if (refScale.value < 0) {
        refScale.value = 0;
      }
    });

    watchEffect(() => {
      let varData = null;
      let index = -1;
      if (refVarsEnabled.value && refEditingVars.value) {
        varData = getVarsFromStr(refEditingVars.value.str);
        index = refVars.value.indexOf(refEditingVars.value);
      }
      chrome.storage &&
        chrome.storage.sync.set({
          varsEnabled: refVarsEnabled.value,
          vars: refVars.value,
          varData,
          editingVarsIndex: index,
        });
    });

    watchEffect(() => {
      const enabled = refEnabled.value;
      const attrs = refAttrs.value
        .filter((item) => item.checked)
        .map((item) => item.attr);
      const unit = refUnit.value || "px";
      const scale = refScale.value || 1;
      const border1pxEnabled = refBorder1pxEnabled.value;
      const fixFontWeight = refFixFontWeight.value;

      if (chrome.storage /*  && chrome.tabs */) {
        chrome.storage.sync.set({ enabled, attrs, unit, scale, border1pxEnabled, fixFontWeight });
      }
    });
    return returnValues;
  },
};
</script>

<style lang="less">
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.panel {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 400px;
  padding: 10px 20px;
}
.form-item {
  display: block;
  & + .form-item {
    margin-top: 20px;
  }
  .label {
    margin-right: 20px;
    flex: none;
    font-size: 12px;
    margin-bottom: 6px;
  }
  .control {
    &--block {
      flex: none;
      margin-top: 10px;
      width: 100%;
    }
  }
}

.attrs {
  display: flex;
  flex-wrap: wrap;
}
.attr {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 10px;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 4px;
  margin: 2px;
  font-size: 12px;
  background: #f5f5f5;
  transition: background 0.3s, color 0.3s;
  user-select: none;
  &.checked {
    background: #1f8fff;
    color: #fff;
  }
}
.attr-input-number {
  padding: 5px 10px;
  width: 70px;
  height: 32px;
  background: #fff;
  border: 1px solid #dbdbdb;
}
.vars-edit {
  position: relative;
  margin-top: 10px;
  padding: 20px 10px;
  border: 1px solid #dbdbdb;
  border-radius: 4px;
  input,
  textarea {
    width: 100%;
  }
  .form-item {
    .label {
      font-size: 12px;
      margin-bottom: 5px;
    }
  }
  .action {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 16px;
    .icon {
      cursor: pointer;
      color: #999;
    }
  }
}
</style>
