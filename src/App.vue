<template>
  <div class="panel">
    <div class="form-item">
      <div class="label">启用</div>
      <div class="control">
        <div
          class="switch"
          :class="{ checked: refCurrent.enabled }"
          @click="refCurrent.enabled = !refCurrent.enabled"
        >
          <div class="switch-inner"></div>
        </div>
      </div>
    </div>
    <div class="tabs">
      <div
        class="tab"
        v-for="setting in refSettings"
        :key="setting.name"
        @click="refCurrent = setting"
      >
        <input v-model="setting.name" :disabled="!setting.editing" />
        <Icon name="delete"></Icon>
      </div>
    </div>
    <div class="form-item form-item--block">
      <div class="label">属性</div>
      <div class="control">
        <div class="attrs">
          <span
            class="attr"
            v-for="attr in allAttrs"
            :key="attr"
            :class="{ checked: refCurrent.attrs.indexOf(attr) > -1 }"
            @click="onAttrClick(attr)"
          >
            {{ attr }}
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
            :class="{ checked: scale === refCurrent.scale }"
            v-for="scale in scales"
            :key="scale"
            @click="refCurrent.scale = scale"
          >
            {{ scale }}x
          </div>
          <Input
            class="attr attr-input-number"
            type="number"
            v-model:value="refCurrent.scale"
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
            :class="{ checked: unit === refCurrent.unit }"
            v-for="unit in units"
            :key="unit"
            @click="refCurrent.unit = unit"
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
          :checked="refCurrent.border1pxEnabled"
          @change="refCurrent.border1pxEnabled = !refCurrent.border1pxEnabled"
        />
      </div>
    </div>
    <div class="form-item">
      <div class="label">兼容 font-weight</div>
      <div class="control">
        <Switch
          :checked="refCurrent.fixFontWeight"
          @change="refCurrent.fixFontWeight = !refCurrent.fixFontWeight"
        />
      </div>
    </div>
    <div class="form-item">
      <div class="label">变量</div>
      <div class="control">
        <Switch
          :checked="refCurrent.varEnabled"
          @change="refCurrent.varEnabled = !refCurrent.varEnabled"
        />
      </div>
      <div class="control control--block" v-if="refCurrent.varEnabled">
        <Textarea v-model:value="refCurrent.varStr"></Textarea>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, reactive, watch, watchEffect, toRef } from "vue";
import CONFIG from "./js/config.js";
import Input from "./components/input.vue";
import Textarea from "./components/textarea.vue";
import Switch from "./components/switch.vue";
import { getVarsFromStr, storageArrObjToArr } from "./utils/index";

export default {
  components: {
    Input,
    Textarea,
    Switch,
  },
  setup() {
    const returnValues = {};

    const { allAttrs, units, scales, settings } = CONFIG;
    const refSettings = ref(settings);
    let refCurrent = ref(refSettings.value[0]);
    let inited = false;

    Object.assign(returnValues, {
      allAttrs,
      units,
      scales,
      refSettings,
      refCurrent,
    });

    function onAttrClick(attr) {
      const attrs = refCurrent.value.attrs;
      const index = attrs.indexOf(attr);
      if (index > -1) {
        attrs.splice(index, 1);
      } else {
        attrs.push(attr);
      }
    }
    Object.assign(returnValues, { onAttrClick });

    watch(
      refCurrent,
      (v) => {
        const setting = v;
        inited &&
          chrome.storage &&
          chrome.storage.sync.set({
            setting,
          });
        console.log(setting, "current changed");
      },
      { deep: true }
    );
    watch(
      refSettings,
      (v) => {
        const settings = v;
        inited &&
          chrome.storage &&
          chrome.storage.sync.set({
            settings,
          });
        console.log("settings changed");
      },
      { deep: true }
    );
    chrome.storage &&
      chrome.storage.sync.get(["settings", "setting"], (stores) => {
        const { settings, setting } = stores;
        if (settings && setting) {
          refSettings.value = stores.settings;
          refCurrent.value =
            settings.find((item) => item.name === setting.name) || settings[0];
        }
        inited = true;
      });

    chrome.chrome.storage &&
      chrome.storage.sync.get(["settingIds", "currentId"], (stores) => {
        let { settingIds, currentId } = stores;
        if (!settingIds) {
          // 首次存储配置
          chrome.storage.sync.set({
            settingIds: CONFIG.settings.map((item) => item.id),
            currentId: settingIds[0],
          });
          settings.forEach((item) => {
            chrome.storage.sync.set({
              [`setting_${item.id}`]: item,
            });
          });
        } else {
          const sIds = settingIds.map((id) => `setting_${id}`);
          const settings = [];
          chrome.storage.sync.get(sIds, (stores) => {
            for (let id in stores) {
              settings.push(stores[id]);
            }
            refSettings.value = settings;
            refCurrent.value = settings.find((item) => item.id === currentId);
          });
        }
      });

    return returnValues;

    const refAttrs = ref(
      CONFIG.allAttrs.map((item) => {
        return {
          attr: item,
          checked: CONFIG.settings[0].attrs.indexOf(item) > -1,
        };
      })
    );
    const refEnabled = ref(CONFIG.settings[0].enabled);
    const refUnit = ref(CONFIG.settings[0].unit);
    const refScale = ref(CONFIG.settings[0].scale);
    const refBorder1pxEnabled = ref(CONFIG.settings[0].border1pxEnabled);
    const refFixFontWeight = ref(CONFIG.settings[0].fixFontWeight);
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

    const refVarsEnabled = ref(CONFIG.settings[0].varsEnabled);
    const refVars = ref(CONFIG.settings[0].vars);
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
        chrome.storage.sync.set({
          enabled,
          attrs,
          unit,
          scale,
          border1pxEnabled,
          fixFontWeight,
        });
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
