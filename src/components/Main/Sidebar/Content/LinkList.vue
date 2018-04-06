<template lang="pug">
div.links-list-wrap
  ul.links-list
    li
      a(href="https://trap.jp" target="_blank")
        div.link-icon
          div.fas.fa-link
        p.link-title
          | Official website
    li
      a(href="https://wiki.trapti.tech" target="_blank")
        div.link-icon
          div.fas.fa-book
        p.link-title
          | Wiki
    li
      a(href="https://blog.trapti.tech" target="_blank")
        div.link-icon
          div.fab.fa-snapchat-ghost
        p.link-title
          | Ghost
    li
      a(href="https://drive.trapti.tech" target="_blank")
        div.link-icon
          div.fas.fa-cloud
        p.link-title
          | Drive
    li
      a(href="https://git.trapti.tech" target="_blank")
        div.link-icon
          div.fas.fa-code-branch
        p.link-title
          | Gitea
    li
      a(href="https://showcase.trapti.tech" target="_blank")
        div.link-icon
          div.fas.fa-cube
        p.link-title
          | Showcase
    li
      a(href="https://md.trapti.tech" target="_blank")
        div.link-icon
          div.fas.fa-file-alt
        p.link-title
          | Hackmd
</template>

<script>
export default {
  name: 'LinkList'
}
</script>

<style lang="sass">
.links-list-wrap
  padding: 15px 10px
.links-list li
  margin: 5px 0
.links-list li a
  display: flex
  align-items: center
  color: #2c3e50
.link-icon
  font-size: 1.5em
  width: 30px
  height: 30px
.link-title
  margin: 5px 0 5px 10px
  font-size: 1em
</style>
