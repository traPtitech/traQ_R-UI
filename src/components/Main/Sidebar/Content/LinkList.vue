<template lang="pug">
div.links-list-wrap
  ul.links-list
    li
      a(href="https://trap.jp" target="_blank")
        div.link-icon
          icon(name="link")
        p.link-title
          | traP公式サイト
    li
      a(href="https://wiki.trapti.tech" target="_blank")
        div.link-icon
          icon(name="book")
        p.link-title
          | Wiki
    li
      a(href="https://blog.trapti.tech" target="_blank")
        div.link-icon
          icon(name="snapchat-ghost")
        p.link-title
          | Blog
    li
      a(href="https://drive.trapti.tech" target="_blank")
        div.link-icon
          icon(name="cloud")
        p.link-title
          | Drive
    li
      a(href="https://git.trapti.tech" target="_blank")
        div.link-icon
          icon(name="code-branch")
        p.link-title
          | Gitea
    li
      a(href="https://showcase.trapti.tech" target="_blank")
        div.link-icon
          icon(name="cube")
        p.link-title
          | Showcase
    li
      a(href="https://md.trapti.tech" target="_blank")
        div.link-icon
          icon(name="file-alt")
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
  padding: 0 0 15px
.links-list
  padding-top: 15px
  li
    padding: 5px 10px 5px 20px
    transition: all .5s ease
    &:hover
      background-color: rgba(0,0,0,0.1)
  a
    display: flex
    align-items: center
    color: $text-light-color
.link-icon
  font-size: 1.5em
  width: 30px
  height: 30px
.link-title
  margin: 5px 0 5px 10px
  font-size: 1em
  user-select: none
</style>
