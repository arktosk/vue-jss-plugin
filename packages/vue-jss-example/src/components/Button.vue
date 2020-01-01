<template>
  <button
    :class="[$classes.button, $classes[_uid]]"
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
import {mapProps, createStyles} from 'vue-jss-plugin';

const theme = {
  mainColor: color('#4fc08d'),
  secondaryColor: color('#2c3e50'),
};

const styles = createStyles(({mapState}) => ({
  button: {
    padding: '0.75em 2em',
    borderRadius: '2em',
    display: 'inline-block',
    color: '#fff',
    color: mapState(['color', 'textColor'], (color, textColor) => textColor),
    border: `1px solid`,
    borderColor: mapState(['color'], (color) => color),
    transition: 'all 0.15s ease',
    boxSizing: 'border-box',
    backgroundColor: mapState(['color'], function(color) {
      console.log(this);
      return this.color;
    }),

    margin: '1em 0.1em',
    fontSize: '1.05em',
    fontWeight: '600',
    letterSpacing: '0.1em',
    minWidth: '8em',
    textAlign: 'center',

    cursor: 'pointer',

    transition: ['opacity', 'background-color', 'box-shadow'].map((r) => [r, '0.25s', 'ease-in-out']),

    ['&:hover']: {
      opacity: 0.7,
    },
    ['&:focus']: {
      outline: 0,
      boxShadow: [0, 0, 0, '3px', `${theme.mainColor.fade(0.5)}`],
    },
    fallbacks: {
      opacity: 1,
      border: `1px solid`,
      borderColor: `${theme.mainColor}`,
      backgroundColor: `${theme.mainColor}`,
    }
  },
}));

export default {
  name: 'Button',
  styles: {
    button({color} = {}) {
      console.log(this.color, color);
      return {
        borderColor: `${this.color}`,
        backgroundColor: `${this.color}`,
      };
    },
  },
  data() {
    return {
      isSelected: false,
      isHover: false,
      textColor: 'white',
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

<style scoped />
