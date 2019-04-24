// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

import {
  Button,
  Collapse,
  CollapseItem,
  Dialog,
  Icon,
  Message,
  Tooltip,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  Form,
  FormItem,
  Input,
  InputNumber,
  Row,
  Col,
  Table,
  TableColumn,
  Popover,
  Loading,
  Switch,
  Select,
  Menu,
  Submenu,
  Scrollbar,
  MenuItem,
  Option
} from 'element-ui'

import Vuex from 'vuex'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store/index'

import $$ from './assets/js/methods'
// import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './assets/css/css.css'
import './assets/css/style.css'

import FastClick from 'fastclick'
import pwdSure from '@/components/public/pwdSure'


// import "classlist-polyfill";
// import PerfectScrollbar from 'perfect-scrollbar';
// import "perfect-scrollbar/css/perfect-scrollbar.css";

// const el_scrollBar = (el) => {
//   if (el._ps_ instanceof PerfectScrollbar) {
//     el._ps_.update();
//   } else {
//     el._ps_ = new PerfectScrollbar(el, { suppressScrollX: true });
//   }
// };

// Vue.directive("scrollBar",{
//   inserted(el, binding){
//     const { arg } = binding;
//     console.log(arg)
//     if(arg === "scrollVue"){
//       el = el.querySelector(".el-table__body-wrapper");
//       if(!el){
//         return console.warn("未发现className为el-table__body-wrapper的dom");
//       }
//     }
//     const rules = ["fixed", "absolute", "relative"];
//     if (!rules.includes(window.getComputedStyle(el, null).position)) {
//       console.error(`perfect-scrollbar所在的容器的position属性必须是以下之一：${rules.join("、")}`)
//     }
//     el_scrollBar(el);
//   },
//   componentUpdated(el, binding, vnode) {
//     const { arg } = binding;
//     if (arg === "scrollVue") {
//       el = el.querySelector(".el-table__body-wrapper");
//       if(!el){
//         return console.warn("未发现className为el-table__body-wrapper的dom");
//       }
//     }
//     vnode.context.$nextTick(
//       () => {
//         try {
//           el_scrollBar(el);
//         } catch (error) {
//           console.error(error);
//         }
//       }
//     )
//   },
// })



Vue.component('pwdSure', pwdSure)

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function () {
    FastClick.attach(document.body)
  }, false)
}
axios.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded'

Vue.use('axios')

Vue.use(Button)
Vue.use(Dialog)
Vue.use(Collapse)
Vue.use(CollapseItem)
Vue.use(Icon)
Vue.component(Message.name, Message)
Vue.use(Tooltip)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Checkbox)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Popover)
Vue.use(Loading)
Vue.use(Switch)
Vue.use(Select)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(Scrollbar)
Vue.use(MenuItem)
Vue.use(Option)

Vue.use(Vuex)

Vue.config.productionTip = false

let setLanguage = (lang) => {
  let langData
  if (lang === 'en') {
    langData = langEn
  } else if (lang === 'zh') {
    langData = langZh
  } else {
    langData = langEn
  }
  Vue.prototype.LANG = langData
}

let languageType = localStorage.getItem('FUSION_WALLET_LANGUAGE_TYPE')
let langZh = require('@/assets/js/language/zh')
let langEn = require('@/assets/js/language/en')
setLanguage(languageType)

Vue.prototype.$$ = $$
Vue.prototype.$http = axios
Vue.prototype.$message = Message
Vue.prototype.changeLang = (lang) => {
  setLanguage(lang)
}

window.$ajax = axios
window.Qs = require('qs')
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
