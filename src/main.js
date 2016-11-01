import Vue from 'vue';
import Vuex from 'vuex';
import VueResource from 'vue-resource';
import App from './App';

Vue.use(VueResource);
Vue.use(Vuex);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  data: {
  	myh1: '<h1>haha</h1>'
  },
  template: '<App/>',
  components: { App }
});



