<template>
  <div
    id="app"
    :class="$classes.app"
  >
    <div>
      <Button
        v-for="(button, index) in buttons"
        :key="index"
      />
    </div>
    <img
      alt="Vue logo"
      src="./assets/logo.png"
    >
    <HelloWorld message="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import Button from './components/Button.vue';
import HelloWorld from './components/HelloWorld.vue';

const styles = {
  app: {
    fontFamily: '"Avenir", Helvetica, Arial, sans-serif',
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
    textAlign: ({textAlign}) => textAlign,
    color: ({color}) => color,
    marginTop: '60px',
  },
};

export default {
  name: 'App',
  styles,
  components: {
    Button,
    HelloWorld,
  },
  data() {
    return {
      buttons: [0, 1, 2],
      textAlign: 'center',
      color: '#2c3e50',
    };
  },
};
</script>
