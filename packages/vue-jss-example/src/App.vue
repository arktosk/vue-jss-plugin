<template>
  <div id="app" :class="$classes.app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";

const styles = {
  app: {
    fontFamily: "'Avenir', Helvetica, Arial, sans-serif",
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    textAlign: "center",
    color: () => "#2c3e50",
    marginTop: "60px",
  },
};

// console.log(module, module.hot);

if (module.hot) {
  module.hot.dispose(() => {
    console.log("Accepting the updated <App /> module!");
  });
}

export default {
  name: "App",
  styles,
  components: {
    HelloWorld,
  },
};
</script>
