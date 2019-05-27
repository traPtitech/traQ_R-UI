import { ExStore } from 'vuex'

declare module 'vue/types/vue' {
  interface Vue {
    $store: ExStore
  }
}

declare module '*.vue' {
  import Vue from 'vue'
  export default Vue
}
