import { MutationTree } from 'vuex'
import { S } from './types'

const mutations: MutationTree<S> = {
  setClient(state, instance) {
    state.client = instance
  }
}

export default mutations
