<template lang="pug">
div
  template(v-if="loading")
    | ロード中
  template(v-else)
    template(v-if="clientInfo != null")
      | クライアント名: {{ clientInfo.name }}
      br
      | クライアント説明: {{ clientInfo.description }}
      br
      | クライアント製作者: {{ userDisplayName(clientInfo.creatorId) }}
      br
      | 要求スコープ: {{ scope }}
      form(method="post" action="/api/1.0/oauth2/authorize/decide")
        button(type="submit" name="submit" value="approve") 承認
        button(type="submit" name="submit" value="deny") 拒否
    template(v-else)
      | クライアント情報の取得に失敗しました
</template>

<script>
import { mapGetters } from 'vuex'
import client from '@/bin/client'

export default {
  name: 'consent',
  data() {
    return {
      loading: true,
      clientInfo: null,
      scope: ''
    }
  },
  async created() {
    this.loading = true
    this.scope = this.$route.query.scopes
    try {
      const { data } = await client.getClient(this.$route.query.client_id)
      this.clientInfo = data
    } catch (e) {
      this.clientInfo = null
    } finally {
      this.loading = false
    }
  },
  computed: {
    ...mapGetters(['userDisplayName'])
  },
  beforeRouteEnter(to, from, next) {
    if (to.query.client_id && to.query.scopes) {
      next()
    } else {
      next('/')
    }
  }
}
</script>
