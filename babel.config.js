const vueCliPreset = require('@vue/cli-plugin-babel/preset')

module.exports = api => {
  api.cache(() => process.env.VUE_CLI_MODERN_BUILD)

  const isModern = process.env.VUE_CLI_MODERN_BUILD

  if (isModern) {
    process.env.VUE_CLI_MODERN_BUILD = false
  }
  const config = vueCliPreset(api)
  if (isModern) {
    process.env.VUE_CLI_MODERN_BUILD = true
  }
  return config
}
