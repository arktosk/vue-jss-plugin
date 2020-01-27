import Vue from 'vue';
import App from './App.vue';
import jssPlugin from '../../../src';

Vue.config.productionTip = false;

Vue.use(jssPlugin, {WYSIWYG: true});

const $app = document.createElement('div');
document.body.appendChild($app);

new Vue({
  render: (render) => render(
      App,
      {
        attrs: {
          'data-app': 'vue-jss-example',
          'data-version': VERSION,
        },
      },
    ),
}).$mount($app);
