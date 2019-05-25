import axios from 'axios'

interface Window {
  debug: boolean
}
declare var window: Window

axios.interceptors.response.use(
  res => {
    if (process.env.NODE_ENV === 'development' || window.debug) {
      console.info((res.config.method || '').toUpperCase(), res.config.url, res)
    }
    return res
  },
  err => {
    if (process.env.NODE_ENV === 'development' || window.debug) {
      console.info((err.config.method || '').toUpperCase(), err.config.url, err)
    }
    return err
  }
)

export default axios
