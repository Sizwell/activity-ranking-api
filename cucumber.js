module.exports = {
  default: {
    require: [
      "step-definitions/**/*.ts"
    ],
    requireModule: [
      "tsx/cjs"
    ],
    format: ["progress"]
  }
};