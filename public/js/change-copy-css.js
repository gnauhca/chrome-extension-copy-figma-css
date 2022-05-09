const isBrowser = typeof window !== 'undefined';
const setting = {
  enabled: true,
  attrs: [
    'width',
    'height',
    'font-weight',
    'font-size',
    'line-height',
    'color',
    'border',
    'border-radius',
    'background',
    'background-color',
    'box-shadow',
    'text-shadow',
  ],
  unit: 'px',
  scale: 1,
  border1pxEnabled: true,
  fixFontWeight: true,
  varEnabled: false,
  varData: null,
  varStr: '',
};
if (isBrowser) {
  updateSetting();
  chrome.storage.onChanged.addListener(function () {
    updateSetting();
  });
}

function getVarsFromStr(str = '') {
  const vars = [];
  const regx = /([\w\-\@\$]+):([\s\S]+?);/gm;

  str.replace(regx, (s, key, value) => {
    let fixValue = value.replace(/!important/g, '');
    fixValue = fixValue.trim();
    vars.push([key, fixValue]);
  });
  return vars;
}

function updateSetting() {
  chrome.storage &&
    chrome.storage.sync.get(['settingIds', 'currentId'], (stores) => {
      const { settingIds, currentId } = stores;
      if (settingIds && settingIds.indexOf(currentId) > -1) {
        chrome.storage.sync.get([`setting_${currentId}`], (stores) => {
          Object.assign(setting, stores[`setting_${currentId}`]);
          setting.varData = getVarsFromStr(setting.varStr);
          tryBindCodeWrapperElemEvent();
          log('setting', setting);
        });
      }
    });
}

function transformUnit(rawStr) {
  let result = rawStr.replace(/([\d\.]+)px/g, (pxStr, number) => {
    return Number((number * setting.scale).toFixed(6)) + setting.unit;
  });
  return result;
}

function getMiniCss(rawStr) {
  let str = ``;
  const rowRegx = /s*[a-z-]+:s*(.+);/gim;
  const rows = rawStr.match(rowRegx);
  const isFont = Boolean(rawStr.match(/font-size/));
  if (rows) {
    rows.forEach((row) => {
      let [key, value] = row.split(':').map((item) => item.trim());
      value = value.replace(/;$/, '');
      if (setting.attrs.indexOf(key) === -1) {
        return;
      }
      if (isFont && (key === 'width' || key === 'height')) {
        return;
      }
      if (key === 'font-weight' && setting.fixFontWeight) {
        let fontWeightValue = Number(value);
        if (!isNaN(fontWeightValue)) {
          if (fontWeightValue < 400) {
            fontWeightValue = 400;
          } else if (fontWeightValue >= 500) {
            fontWeightValue = 700;
          }
        } else {
          fontWeightValue = value;
        }
        value = fontWeightValue + '';
      } else if (key === 'border' && value.indexOf('1px') > -1 && !setting.border1pxEnabled) {
        // 不处理
      } else {
        value = transformUnit(value);
      }

      // 变量替换
      if (setting.varEnabled && setting.varData) {
        value = value.replace(/\s*,\s*/g, ',');
        value = value.trim();
        value = value.toLowerCase();
        for (let [varkey, varValue] of setting.varData) {
          varValue = varValue.trim();
          varValue = varValue.toLowerCase();
          varValue = varValue.replace(/\s*,\s*/g, ',');
          let replaceKey = varkey;
          if (varkey.indexOf('--') === 0) {
            replaceKey = `var(${varkey})`;
          }
          value = value.split(varValue).join(replaceKey);
        }
      }

      str += `${key}: ${value};\n`;
    });
  }
  log('css copyed');
  log(str);
  str = str.trim().replace(/[^\S]$/gm, '');
  return str;
}

/* test getMiniCss */
if (!isBrowser) {
  const testStr = `
  font-weight: 300;
  font-weight: 600;
  font-size: 24px;
  border: 1px solid #000000;
  background: #FF8000;
  `;
  const result = getMiniCss(testStr);
  console.log(result);
  process.exit();
}

function setClipboardText(event) {
  if (!setting.enabled) {
    return;
  }
  var result = window.getSelection(0).toString();

  if (result.match(/[a-z-]+:\s.+;/)) {
    event.preventDefault();
    str = getMiniCss(result);
    if (event.clipboardData) {
      event.clipboardData.setData('text/plain', str);
    } else if (window.clipboardData) {
      return window.clipboardData.setData('text', str);
    }
  }
}
document.addEventListener('copy', setClipboardText);

/* auto copy */
let inspectTabTriggerElem;
let codeWrapperElem;
let observer;
let retryTime = 0;
let hasActiveTabTip = false;
let hasSuccessTip = false;
function init() {
  const inspectElemWrapper = document.querySelector('[class*="properties_panel--tabsHeader"]');
  if (!inspectElemWrapper) {
    retryTime++;
    if (retryTime < 10) {
      setTimeout(init, 1000);
    } else {
      toast('自动复制功能未生效，请刷新页面，并激活 Tab 以启用自动复制 CSS 的功能');
    }
    return;
  }
  inspectElemWrapper.addEventListener('click', () => {
    tryBindCodeWrapperElemEvent();
  });
  inspectElemWrapper.click();
}

function tryBindCodeWrapperElemEvent() {
  setTimeout(() => {
    const newCodeWrapperElem = document.querySelector('[class*="inspect_panels--tabularInspectionPanel"]');
    if (!newCodeWrapperElem) {
      if (!hasActiveTabTip) {
        hasActiveTabTip = true;
        hasSuccessTip = false;
        toast('请点击检查 Tab 以启用自动复制 CSS 的功能');
      }
      return;
    }
    codeWrapperElem = newCodeWrapperElem;
    observer && observer.disconnect();
    observer = new MutationObserver(() => {
      copyElemText(codeWrapperElem);
    });
    copyElemText(codeWrapperElem);
    observer.observe(codeWrapperElem, { childList: true, characterData: true, subtree: true });
  }, 500);
}

function copyElemText(elem) {
  if (!setting.enabled) {
    return;
  }
  var r = document.createRange();
  r.selectNode(elem);
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(r);
  document.execCommand('copy');
  window.getSelection().removeAllRanges();
  if (!hasSuccessTip) {
    hasSuccessTip = true;
    toast('自动复制 CSS 功能已开启！');
  }
}
window.addEventListener('load', init);

/* utils */
let toastT = 0;
const toastTipElemWrapper = document.createElement('div');
toastTipElemWrapper.innerHTML =
  '<div style="display: none; align-items: center; justify-content: center; pointer-events: none; position: fixed; z-index: 10000; top: 70px; left: 50%; transform: translate(-50%); background: #fff; padding: 10px 20px; border-radius: 4px; font-size: 14px; color: #333; font-family: -apple-system-font,Helvetica Neue,Helvetica,sans-serif; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);"></div>';
const toastTipElem = toastTipElemWrapper.children[0];

toastTipElem.innerHTML = `<img style="display: block; margin-right: 6px;" id="prewimg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA3VpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQ4IDc5LjE2NDAzNiwgMjAxOS8wOC8xMy0wMTowNjo1NyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDplZDQwY2IyNi1iZGFlLTQwOTQtYjAyZS1lMTQ4MzQ0N2M4YjAiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NTU3M0E0QjY0OTA0MTFFQzlCMDk5MzhDMjYzRkQwMjUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NTU3M0E0QjU0OTA0MTFFQzlCMDk5MzhDMjYzRkQwMjUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIxLjAgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4MDg0MDZiYy0zZDkwLTRhMTgtOTc5MS1mZGNkMzA1OGYzMTQiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6ZWQ0MGNiMjYtYmRhZS00MDk0LWIwMmUtZTE0ODM0NDdjOGIwIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+jHo9bgAAAb1JREFUeNqUkk9IVFEUxn/3vblv5jlNogOhkYUwNC6S6B8G1mqQwmgrFBUVtBBXLsNN7QzE7SxaRCBtYlAKIoRsYS2cFuLClFpEEVaIjdDMm3nz/lzfODOpbzcfB+7lHA7n+75zhFKKVqDRIpoNts2zLG9fhco2jH7l+Z+9TKTxLufZ/svIbX59Y2FW4dKRQpfy9PlbXd13P5Pp4Jixv8EqcbSH+CHGLrG0Itqg7ypCig8Lg4+eHIkZW06oQdfxvdpHOMTB3CUbhPLYTesiRKlcxveDtzSa23icM2OelUnNl42hzIW0YVTckIaNn+Q/cueB8sm/7Nv0JqImD0+yBqki63Clk8nvPE1janWXXKcWASuQZdotDls4pUAYdpVg7pkEn/5h+f8nHO/l4mUW34ubvYnxwszr1UQ8MnP23LuiHE4iYeoH2TTJyH4NgT+FggP35Ivl6180PTGR7B9IyoYj0GWEFud5aDVKVtWl6J9wOg0V3duuwFUhl2Imm79l1c713JjdXrnWfqpNNEoVRcEl2rQVVYdVUtlp9WZOHUTFVyOr6v66cpsZceBag1Vo4XPcchty6xCtnveOAAMA7C+4RkNxP6oAAAAASUVORK5CYII=" /><div></div>`;
const messageElem = toastTipElem.children[1];
window.addEventListener('load', () => {
  document.querySelector('body').appendChild(toastTipElem);
});

function toast(message, dur = 3000) {
  if (!setting.enabled) {
    return;
  }
  messageElem.innerHTML = message;
  toastTipElem.style.display = 'flex';

  clearTimeout(toastT);
  toastT = setTimeout(function () {
    toastTipElem.style.display = 'none';
  }, dur);
}

function log(...args) {
  console.log('copy-figma-css', ...args);
}
