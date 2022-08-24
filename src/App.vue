<template>
  <div class="panel">
    <div class="help" @click="refHelpDialogVisible = true">?</div>
    <div class="tabs">
      <div class="tab-nav-wrapper" ref="refTabWrapper">
        <div class="tab-nav-inner">
          <div
            class="tab-nav"
            :class="{ current: setting === refCurrent }"
            v-for="setting in refSettings"
            :key="setting.name"
            @click="onSettingSelect(setting)"
          >
            <span
              :contenteditable="setting === refCurrent"
              @blur="onTabBlur($event, setting)"
            >
              {{ setting.name }}
            </span>
            <span
              class="delete"
              @click="onSettingDelete(setting)"
              v-if="refSettings.length > 1"
            >
              +
            </span>
          </div>
        </div>
      </div>
      <div class="add" @click="onSettingAdd">+</div>
    </div>
    <!-- 启用 -->
    <div class="form-item">
      <div class="label">{{ locale.enable }}</div>
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
    <div class="setting-wrapper" v-if="refCurrent.enabled">
      <!-- <div class="form-item form-item--block" v-if="0">
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
      </div> -->
      <!-- 缩放 -->
      <div class="form-item">
        <div class="label">{{ locale.scale }}</div>
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
      <!-- 单位 -->
      <div class="form-item">
        <div class="label">{{ locale.unit }}</div>
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
      <!-- 不缩放 1px -->
      <div class="form-item">
        <div class="label">{{ locale.ignore1px }}</div>
        <div class="control">
          <Switch
            :checked="refCurrent.border1pxEnabled"
            @change="refCurrent.border1pxEnabled = !refCurrent.border1pxEnabled"
          />
        </div>
      </div>
      <!-- 忽略属性 -->
      <div class="form-item form-item--block">
        <div class="label">{{ locale.ignoreAttrs }}<span class="label__tip">({{ locale.ignoreAttrsTip }})</span></div>
        <div class="control">
          <Textarea
            class="textarea"
            v-model:value="refCurrent.disableAttrsStr"
          ></Textarea>
        </div>
      </div>
      <!-- 自定义替换 -->
      <div class="form-item form-item--block">
        <div class="label" @click="refCustomHelpDialogVisible = true">
          {{ locale.customReplace }}
          <span class="label__help"><span>?</span></span>
        </div>
        <div class="control">
          <Switch
            :checked="refCurrent.customEnable"
            @change="refCurrent.customEnable = !refCurrent.customEnable"
          />
        </div>
        <div
          class="control control--block control"
          v-if="refCurrent.customEnable"
        >
          <div class="custom-str">
            <div class="to">{{ locale.customReplaceFrom }}</div>
            <Textarea
              class="textarea"
              :placeholder="locale.customReplacePlaceholder1"
              v-model:value="refCurrent.customFromStr"
            ></Textarea>
            <div class="to">{{ locale.customReplaceTo }}</div>
            <Textarea
              class="textarea"
              :placeholder="locale.customReplacePlaceholder2"
              v-model:value="refCurrent.customToStr"
            ></Textarea>
          </div>
        </div>
      </div>
      <!--  <div class="form-item" v-if="0">
        <div class="label">兼容 font-weight</div>
        <div class="control">
          <Switch
            :checked="refCurrent.fixFontWeight"
            @change="refCurrent.fixFontWeight = !refCurrent.fixFontWeight"
          />
        </div>
      </div> -->
      <!-- 变量 -->
      <div class="form-item">
        <div class="label">{{ locale.var }}</div>
        <div class="control">
          <Switch
            :checked="refCurrent.varEnabled"
            @change="refCurrent.varEnabled = !refCurrent.varEnabled"
          />
        </div>
        <div class="control control--block" v-if="refCurrent.varEnabled">
          <div class="vars-edit">
            <Textarea
              :placeholder="locale.varPlaceholder"
              v-model:value="refCurrent.varStr"
            ></Textarea>
          </div>
        </div>
      </div>
    </div>
    <Modal
      :visible="refHelpDialogVisible"
      :title="locale.help.title"
      :footer="null"
      @cancel="refHelpDialogVisible = false"
    >
      <div class="help-content">
        <p>{{ locale.help.content[0] }}</p>
        <p>
          2
          <span class="warning">{{ locale.help.content[1][0] }}</span
          >{{ locale.help.content[1][1] }}
        </p>
        <p>{{ locale.help.content[2] }}</p>
      </div>
    </Modal>

    <Modal
      :visible="refCustomHelpDialogVisible"
      :title="locale.customReplaceHelp.title"
      :footer="null"
      @cancel="refCustomHelpDialogVisible = false"
    >
      <div class="help-content">
        <p>{{ locale.customReplaceHelp.content[0] }}</p>
        <p>
          {{ locale.customReplaceHelp.content[1] }}
        </p>
        <div>
          {{ locale.customReplaceHelp.content[2] }}<br>
          <div style="margin: 5px 0 0 10px; font-size: 11px; color: #888;">
            · {{ locale.customReplaceHelp.contentExtra[0] }}<br>
            · {{ locale.customReplaceHelp.contentExtra[1] }}<br>
            · {{ locale.customReplaceHelp.contentExtra[2] }}
          </div>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
import { ref, watch } from "vue";
import cloneDeep from "lodash/cloneDeep";
import CONFIG from "./js/config.js";
import Input from "./components/input.vue";
import Textarea from "./components/textarea.vue";
import Switch from "./components/switch.vue";
import { Modal } from "ant-design-vue";
import locales from './locale/index'

const locale = navigator.language.indexOf('zh') > -1 ? locales.zh : locales.en;
window.getAll = function () {
  chrome.storage &&
    chrome.storage.sync.get(null, (stores) => {
      console.log(stores);
    });
};
window.clearAll = function () {
  chrome.storage && chrome.storage.sync.clear();
};

export default {
  components: {
    Input,
    Textarea,
    Switch,
    Modal,
  },
  setup() {
    const returnValues = { locale };
    const refTabWrapper = ref(null);

    const { allAttrs, units, scales, settings } = CONFIG;
    const refSettings = ref(settings);
    const refCurrent = ref(refSettings.value[0]);
    const refHelpDialogVisible = ref(false);
    const refCustomHelpDialogVisible = ref(false);

    Object.assign(returnValues, {
      refTabWrapper,

      allAttrs,
      units,
      scales,
      refSettings,
      refCurrent,
      refHelpDialogVisible,
      refCustomHelpDialogVisible,
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

    function onSettingAdd() {
      const newSetting = cloneDeep(CONFIG.settings[0]);
      if (!chrome.storage) {
        refSettings.value.push(newSetting);
        refCurrent.value = newSetting;
      } else {
        chrome.storage.sync.get(["settingIds"], (stores) => {
          const { settingIds } = stores;
          const newId = Math.max.apply(null, settingIds) + 1;
          newSetting.id = newId;
          newSetting.name = `config ${newId}`;
          settingIds.push(newId);
          chrome.storage &&
            chrome.storage.sync.set({
              [`setting_${newId}`]: newSetting,
              settingIds,
              currentId: newId,
            });
          refSettings.value.push(newSetting);
          changeSetting(newSetting);
        });
      }
      scrollToCurrent();
    }
    function onSettingDelete(setting) {
      Modal.confirm({
        title: `确认删除 ${setting.name} 配置吗?`,
        cancelText: "取消",
        okText: "确认",
        onOk() {
          const index = refSettings.value.indexOf(setting);
          const removeId = refSettings.value[index].id;
          refSettings.value.splice(index, 1);
          changeSetting(
            refSettings.value[Math.max(0, refSettings.value.length - 1)]
          );
          chrome.storage && chrome.storage.sync.remove(`setting_${removeId}`);
        },
      });
    }
    function onSettingSelect(setting) {
      changeSetting(setting);
    }
    function onTabBlur(e, setting) {
      setting.name = e.target.innerText;
    }
    Object.assign(returnValues, {
      onSettingAdd,
      onSettingDelete,
      onSettingSelect,
      onTabBlur,
    });

    function scrollToCurrent() {
      const currentElem = refTabWrapper.value.querySelector(".current");
      console.log(currentElem.innerText);
      setTimeout(() => {
        refTabWrapper.value.scrollTo({
          left: currentElem.offsetLeft,
          behavior: "smooth",
        });
        console.log(refTabWrapper.value);
      }, 50);
    }

    function changeSetting(setting) {
      if (typeof setting.customFromStr === "undefined") {
        setting.customFromStr = CONFIG.settings[0].customFromStr;
        setting.customToStr = CONFIG.settings[0].customToStr;
        setting.customEnable = true;
      }
      if (typeof setting.disableAttrsStr === "undefined") {
        setting.disableAttrsStr = CONFIG.settings[0].disableAttrsStr;
      }
      refCurrent.value = setting;
    }

    setTimeout(scrollToCurrent, 500);

    watch(
      refCurrent,
      (v) => {
        const setting = cloneDeep(v);
        chrome.storage &&
          chrome.storage.sync.set({
            [`setting_${setting.id}`]: setting,
            settingIds: refSettings.value.map((item) => item.id),
            currentId: setting.id,
          });
        console.log("current changed", setting);
      },
      { deep: true }
    );

    chrome.storage &&
      chrome.storage.sync.get(
        ["settingIds", "currentId", "version"],
        (stores) => {
          let { settingIds, currentId } = stores;
          if (!settingIds) {
            // 首次存储配置
            const ids = CONFIG.settings.map((item) => item.id);
            const cId = ids[0];
            chrome.storage.sync.set({
              settingIds: ids,
              currentId: cId,
            });
            const settingStores = {};
            settings.forEach((item) => {
              settingStores[`setting_${item.id}`] = item;
              chrome.storage.sync.set(settingStores);
            });
          } else {
            const sIds = settingIds.map((id) => `setting_${id}`);
            const settings = [];
            chrome.storage.sync.get(sIds, (stores) => {
              for (let id in stores) {
                settings.push(stores[id]);
              }
              refSettings.value = settings;
              changeSetting(settings.find((item) => item.id === currentId));
            });
          }
        }
      );

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
body {
  overscroll-behavior: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
.panel {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  position: relative;
  color: #2c3e50;
  width: 400px;
  padding-bottom: 15px;
  font-size: 12px;
  line-height: 1.5;
}
.help {
  position: absolute;
  top: 50px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 100%;
  color: #fff;
  background: #1f8fff;
  cursor: pointer;
}
.help-content {
  font-size: 13px;
  p {
    margin-bottom: 5px;
    font-size: 12px;
  }
  .warning {
    color: red;
  }
}
.tabs {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  background: #f5f5f5;
  .add {
    flex: none;
    margin-right: 10px;
    width: 34px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    border-radius: 100%;
    cursor: pointer;
    user-select: none;
  }
  .tab-nav-wrapper {
    overflow-x: scroll;

    &::-webkit-scrollbar {
      display: none;
    }
    .tab-nav-inner {
      display: flex;
      align-items: center;
      flex-wrap: nowrap;
    }
    .tab-nav {
      display: flex;
      align-items: center;
      flex: none;
      position: relative;
      user-select: none;
      padding: 6px 12px;
      font-size: 12px;
      margin-left: -1px;
      &.current {
        position: relative;
        z-index: 1;
        background: #fff;
      }
      &[contenteditable="true"] {
        user-select: unset;
        outline: none;
      }
      &:first-child {
        padding-left: 20px;
      }
      .delete {
        display: inline-block;
        width: 10px;
        height: 10px;
        line-height: 10px;
        margin-left: 5px;
        transform: rotate(45deg);
        font-size: 16px;
        text-align: center;
        cursor: pointer;
      }
      &:not(.current)::after {
        content: "";
        position: absolute;
        top: 50%;
        right: 0;
        height: 60%;
        border-right: 1px solid #ddd;
        transform: translateY(-50%);
      }
    }
  }
}
.form-item {
  display: block;
  padding: 0 20px;
  & + .form-item {
    margin-top: 12px;
  }
  .label {
    margin-right: 20px;
    flex: none;
    display: flex;
    align-items: center;
    font-size: 12px;
    margin-bottom: 4px;
    font-weight: bold;
    &__help {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 6px;
      width: 13px;
      height: 13px;
      font-size: 12px;
      line-height: 0;
      border-radius: 100%;
      border: 1px solid #333;
      cursor: pointer;
      span {
        display: block;
        transform: scale(0.8);
      }
    }
    &__tip {
      font-size: 10px;
      color: #888;
      margin-left: 6px;
      font-weight: normal;
    }
  }
  .control {
    &--block {
      flex: none;
      margin-top: 10px;
      width: 100%;
    }
  }
}

.setting-wrapper {
  margin-top: 12px;
}

.attrs {
  display: flex;
  flex-wrap: wrap;
}
.attr {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px 8px;
  white-space: nowrap;
  cursor: pointer;
  border-radius: 4px;
  margin: 2px;
  font-size: 12px;
  line-height: 16px;
  background: #f5f5f5;
  transition: background 0.3s, color 0.3s;
  user-select: none;
  &.checked {
    background: #1f8fff;
    color: #fff;
  }
}
.textarea {
  font-size: 12px;
}
.attr-input-number {
  padding: 4px 8px;
  font-size: 12px;
  line-height: 16px;
  width: 70px;
  background: #fff;
  border: 1px solid #dbdbdb;
}
.vars-edit {
  position: relative;
  margin-top: 10px;
  textarea {
    width: 100%;
    font-size: 12px;
  }
}
.custom-str {
  .to {
    margin: 5px 0;
    font-size: 10px;
  }
}
</style>
