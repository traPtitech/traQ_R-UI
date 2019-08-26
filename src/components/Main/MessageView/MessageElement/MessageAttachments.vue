<template lang="pug">
  .message-attachments-container
    template(v-if="isLoadingAttachements")
      attached-messages-dummy(:count="attachedMessageCount")
      attached-files-dummy(:count="attachedFileCount")
    template(v-else)
      attached-messages(v-if="hasAttachedMessage" :messages="messages")
      attached-files(v-if="hasAttachedFile" :files="files")
</template>

<script>
import AttachedMessagesDummy from './AttachedMessagesDummy'
import AttachedFilesDummy from './AttachedFilesDummy'
import AttachedMessages from './AttachedMessages'
import AttachedFiles from './AttachedFiles'

import client from '@/bin/client'

export default {
  props: {
    attached: {
      type: Array,
      required: true
    }
  },
  components: {
    AttachedMessagesDummy,
    AttachedFilesDummy,
    AttachedMessages,
    AttachedFiles
  },
  data() {
    return {
      files: [],
      messages: [],
      isLoadingAttachements: true
    }
  },
  methods: {
    async getAttachments() {
      this.isLoadingAttachements = true
      this.files = await Promise.all(
        this.attached
          .filter(el => el.type === 'file')
          .map(async e => {
            return client
              .getFileMeta(e.id)
              .then(res => res.data)
              .catch(() => {
                return {
                  fileId: '',
                  name: 'not found',
                  mime: 'none',
                  size: 0,
                  dateTime: '2019-02-05T05:43:00.452Z',
                  hasThumb: true,
                  thumbWidth: 0,
                  thumbHeight: 0
                }
              })
          })
      )
      this.messages = await Promise.all(
        this.attached
          .filter(el => el.type === 'message')
          .map(async e => {
            return client
              .getMessage(e.id)
              .then(res => res.data)
              .catch(() => null)
          })
      )
      this.isLoadingAttachements = false
    }
  },
  computed: {
    attachedMessageCount() {
      return this.attached.filter(el => el.type === 'message').length
    },
    attachedFileCount() {
      return this.attached.filter(el => el.type === 'file').length
    },
    hasAttachedMessage() {
      return this.attachedMessageCount > 0
    },
    hasAttachedFile() {
      return this.attachedFileCount > 0
    }
  },
  watch: {
    attached() {
      this.getAttachments()
    }
  }
}
</script>
