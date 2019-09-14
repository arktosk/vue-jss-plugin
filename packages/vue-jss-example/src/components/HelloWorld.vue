<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br />
      check out the
      <a :class="$classes.anchor" href="https://cli.vuejs.org" target="_blank" rel="noopener"
        >vue-cli documentation</a
      >.
    </p>
    <h3 :class="$classes.header">Installed CLI Plugins</h3>
    <ul :class="$classes.list">
      <li :class="$classes.listItem">
        <a :class="$classes.anchor"
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel"
          target="_blank"
          rel="noopener"
          >babel</a
        >
      </li>
      <li :class="$classes.listItem">
        <a :class="$classes.anchor"
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint"
          target="_blank"
          rel="noopener"
          >eslint</a
        >
      </li>
      <li :class="$classes.listItem">
        <a
          :class="$classes.anchor"
          href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-unit-jest"
          target="_blank"
          rel="noopener"
          >unit-jest</a
        >
      </li>
    </ul>
    <h3 :class="$classes.header">Essential Links</h3>
    <ul :class="$classes.list">
      <li :class="$classes.listItem">
        <a :class="$classes.anchor" href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a>
      </li>
      <li :class="$classes.listItem">
        <a :class="$classes.anchor" href="https://forum.vuejs.org" target="_blank" rel="noopener"
          >Forum</a
        >
      </li>
      <li :class="$classes.listItem">
        <a :class="$classes.anchor" href="https://chat.vuejs.org" target="_blank" rel="noopener"
          >Community Chat</a
        >
      </li>
      <li :class="$classes.listItem">
        <a :class="$classes.anchor" href="https://twitter.com/vuejs" target="_blank" rel="noopener"
          >Twitter</a
        >
      </li>
      <li :class="$classes.listItem">
        <a :class="$classes.anchor" href="https://news.vuejs.org" target="_blank" rel="noopener">News</a>
      </li>
    </ul>
    <h3 :class="$classes.header">Ecosystem</h3>
    <ul :class="$classes.list">
      <li :class="$classes.listItem">
        <a :class="$classes.anchor" href="https://router.vuejs.org" target="_blank" rel="noopener"
          >vue-router</a
        >
      </li>
      <li :class="$classes.listItem">
        <a :class="$classes.anchor" href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a>
      </li>
      <li :class="$classes.listItem">
        <a :class="$classes.anchor"
          href="https://github.com/vuejs/vue-devtools#vue-devtools"
          target="_blank"
          rel="noopener"
          >vue-devtools</a
        >
      </li>
      <li :class="$classes.listItem">
        <a :class="$classes.anchor" href="https://vue-loader.vuejs.org" target="_blank" rel="noopener"
          >vue-loader</a
        >
      </li>
      <li :class="$classes.listItem">
        <a :class="$classes.anchor"
          href="https://github.com/vuejs/awesome-vue"
          target="_blank"
          rel="noopener"
          >awesome-vue</a
        >
      </li>
    </ul>
  </div>
</template>

<script>
const styles = {
  header: {
    margin: "40px 0 0",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    display: "inline-block",
    margin: "0 10px",
  },
  anchor: {
    color: "#42b983",
  },
};

export default {
  name: "HelloWorld",
  styles,
  props: {
    msg: String,
  },
};
</script>
