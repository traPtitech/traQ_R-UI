
const lightColors = {
  primary: '#0D67EA',
  secondary: '#0B60BF'
}

const darkColors = {
  primary: '#232C36',
  secondary: '#161C23'
}

export default {
  namespaced: true,
  state: {},
  getters: {
    themeColors: (state, getters, rootState) => {
      return rootState.theme === 'light' ? lightColors : darkColors
    }
  }
}
