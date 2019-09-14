import Vue from 'vue';
import App from './App.vue';
import jssPlugin from 'vue-jss-plugin/src';

Vue.config.productionTip = false;

Vue.use(jssPlugin);

new Vue({
  render: (render) => render(App),
}).$mount('#app');
