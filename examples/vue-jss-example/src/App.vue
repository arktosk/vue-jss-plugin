<template>
  <div
    :class="$classes.app"
  >
    <div>
      <Button
        v-for="(button, index) in buttons"
        :key="index"
        :data-id="button"
      />
    </div>
    <div>
      <button @click="addButton">
        +
      </button>
      <button @click="removeButton">
        -
      </button>
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

export default {
  name: 'App',
  components: {
    Button,
    HelloWorld,
  },
  styles: {
    app: {
      fontFamily: '"Avenir", Helvetica, Arial, sans-serif',
      WebkitFontSmoothing: 'antialiased',
      MozOsxFontSmoothing: 'grayscale',
      textAlign: ({textAlign}) => textAlign,
      color: ({color}) => color,
      marginTop: '60px',
    },
  },
  data() {
    return {
      buttons: [0, 1, 2],
      textAlign: 'center',
      color: '#2c3e50',
    };
  },
  methods: {
    addButton() {
      this.buttons.push(Math.random());
    },
    removeButton() {
      this.buttons.splice(this.buttons.length - 1, 1);
    },
  },
};
</script>
