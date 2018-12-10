import "@babel/polyfill";
import Vue from 'vue';
import Buefy from 'buefy';
import TestViewData from './TestViewData.vue'
import './common.css';
import 'buefy/dist/buefy.css';
Vue.use(Buefy);


new Vue({
  render: h => h(TestViewData)
}).$mount('#app')

