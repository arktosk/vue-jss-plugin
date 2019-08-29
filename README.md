# JSS plugin for Vue.js

## Instalation

```js
npm install vue-jss-plugin
```

## Example

Import vue and use plugin.

```js
import Vue from 'vue';
import jssPlugin from 'vue-jss-plugin';

Vue.use(jssPlugin);
```

Adding styles to component options allows you to automatically inject jss to project and assign classes names to component scoped variable.

```js
import HelloWorld from './components/HelloWorld.vue';

const styles = {
  app: {
    fontFamily: '"Avenir", Helvetica, Arial, sans-serif',
    '-webkit-fontSmoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    textAlign: 'center',
    // Reactive style example:
    color: ({themeColor}) => themeColor,
    marginTop: '60px',
  },
};

export default {
  name: 'app',
  // Add JSS rules as styles in component configuration:
  styles,
  components: {
    HelloWorld,
  },
  data() {
    return {
      themeColor: '#2c3e50',
    };
  },
  mounted() {
    this.$classes; // All available classes names from JSS rules.
  },
};
```

In template you can use `$classes` variable to get component scoped class name.

```html
<template>
  <div id="app" :class="$classes.app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>
```
