<template>
  <div id="messages">
    <input type="file" v-on:change="change($event)"/>
    <textarea v-model="input" rows="5" v-on:drop="drop($event)" />
    <p v-for="(file, index) in files" v-on:click="remove(index)" >
      {{ file.name }}
    </p>
  </div>
</template>

<script>

export default {
  name: 'Upload',
  data () {
    return {
      input: '',
      files: []
    }
  },
  methods: {
    change (e) {
      for (let i = 0; i < e.target.files.length; i++) {
        this.files.push(e.target.files[i])
      }
    },
    remove (id) {
      this.files.splice(id, 1)
    },
    drop (e) {
      e.preventDefault()
      if (e.dataTransfer.files[0]) {
        this.files.push(e.dataTransfer.files[0])
      }
    }
  }
}
</script>

<style scoped>
#messages {
  text-align: left;
  margin-top: 0px;
}
</style>
