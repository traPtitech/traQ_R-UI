import axios from 'axios'

if (process.env.NODE_ENV === 'development' || process.env.ENV === 'dev') {
  axios.defaults.baseURL = 'https://traq-dev.tokyotech.org'
}

axios.defaults.withCredentials = true

export default axios
