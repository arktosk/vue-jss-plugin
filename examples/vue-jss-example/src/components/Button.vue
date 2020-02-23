<template>
  <button
    :class="$classes.button"
    type="button"
    @click="toggle"
    @mouseenter="isHover = true"
    @mouseleave="isHover = false"
  >
    Component № {{ _uid }}
  </button>
</template>

<script>
import color from 'color';

const theme = {
  mainColor: color('#4fc08d'),
  secondaryColor: color('#2c3e50'),
};

const styles = {
  button: {
    padding: '0.75em 2em',
    borderRadius: '2em',
    display: 'inline-block',
    color: '#fff',
    backgroundColor() {
      return this.color;
    },
    transition: 'all 0.15s ease',
    boxSizing: 'border-box',
    border: `1px solid`,
    borderColor: ({color}) => color,

    margin: '1em 0.1em',
    fontSize: '1.05em',
    fontWeight: '600',
    letterSpacing: '0.1em',
    minWidth: '8em',
    textAlign: 'center',

    cursor: 'pointer',

    opacity: ({isHover}) => isHover ? 0.7 : 1,
    transition: ['opacity', 'background-color', 'box-shadow'].map((r) => [r, '0.25s', 'ease-in-out']),

    ['&:focus']: {
      outline: 0,
      boxShadow: [0, 0, 0, '3px', `${theme.mainColor.fade(0.5)}`],
    },
    fallbacks: {
      // backgroundColor: `${theme.mainColor}`,
      // borderColor: `${theme.mainColor}`,
    },
  },
};

export default {
  name: 'Button',
  styles,
  data() {
    return {
      isSelected: false,
      isHover: false,
      realColor: theme.mainColor,
    };
  },
  computed: {
    color() {
      return this.isSelected ? `${theme.secondaryColor}` : `${theme.mainColor}`;
    },
  },
  methods: {
    toggle(event) {
      this.realColor = this.realColor.alpha(this.isSelected ? 0.5 : 1);
      this.isSelected = !this.isSelected;
    },
  },
};
</script>
