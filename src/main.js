import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import App from './App';
import store from './store.js';

Vue.use(VueResource);
Vue.use(Vuex);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  store,
  components: { App }
});



