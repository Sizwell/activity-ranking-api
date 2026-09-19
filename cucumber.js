module.exports = {
  default: {
    require: ["tests/step-definitions/**/*.ts"],
    requireModule: ["tsx/cjs"],
    format: ["progress"]
  }
};