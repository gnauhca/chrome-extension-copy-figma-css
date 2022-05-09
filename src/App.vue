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
            @click="refCurrent = setting"
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
    <div class="setting-wrapper" v-if="refCurrent.enabled">
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
          <div class="vars-edit">
            <Textarea
              placeholder="支持 sass less cssvar 例：@primary-color: #abc;"
              v-model:value="refCurrent.varStr"
            ></Textarea>
          </div>
        </div>
      </div>
    </div>
    <Modal :visible="refHelpDialogVisible" title="使用说明" :footer="null" @cancel="refHelpDialogVisible = false">
      <div class="help-content">
        <p>1 打开 figma 设计稿，<span class="warning">打开新设计稿需刷新页面</span></p>
        <p class="warning">2 激活 “检查(inspect)” tab</p>
        <p>3 选中元素，样式即自动复制到剪贴板</p>
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
    const returnValues = {};
    const refTabWrapper = ref(null);

    const { allAttrs, units, scales, settings } = CONFIG;
    const refSettings = ref(settings);
    const refCurrent = ref(refSettings.value[0]);
    const refHelpDialogVisible = ref(false);

    Object.assign(returnValues, {
      refTabWrapper,

      allAttrs,
      units,
      scales,
      refSettings,
      refCurrent,
      refHelpDialogVisible,
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
          refCurrent.value = newSetting;
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
          refCurrent.value =
            refSettings.value[Math.max(0, refSettings.value.length - 1)];

          chrome.storage && chrome.storage.sync.remove(`setting_${removeId}`);
        },
      });
    }
    function onTabBlur(e, setting) {
      setting.name = e.target.innerText;
    }
    Object.assign(returnValues, { onSettingAdd, onSettingDelete, onTabBlur });

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
              refCurrent.value = settings.find((item) => item.id === currentId);
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
  width: 350px;
  padding-bottom: 15px;
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
    font-size: 12px;
    margin-bottom: 4px;
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
</style>
