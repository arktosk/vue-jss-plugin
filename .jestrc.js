module.exports = {
  globals: {
    VERSION: require("./package.json").version,
    "process.env.NODE_ENV": "testing",
  },
};