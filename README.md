```js
import Vue from 'vue';
import jssPlugin from 'vue-jss-plugin';

Vue.use(jssPlugin);
```

```html
<template>
  <div id="app" :class="$classes.app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>
```
```js
import HelloWorld from './components/HelloWorld.vue'

const styles = {
  app: {
    fontFamily: '"Avenir", Helvetica, Arial, sans-serif',
    '-webkit-fontSmoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    textAlign: 'center',
    // Reactive style example:
    color: ({themeColor}) => themeColor,
    marginTop: '60px',
  }
}

export default {
  name: 'app',
  // Add styles in component configuration:
  styles,
  components: {
    HelloWorld,
  },
  data() {
    return {
      themeColor: '#2c3e50',
    };
  },
}
```