<template lang="pug">
div.links-list-wrap.is-scroll
  ul.links-list
    li
      a(href="https://trap.jp" target="_blank")
        div.link-icon.flex-center
          IconLogotraP(:size="20")
        p.link-title
          | traP公式サイト
    li
      a(href="https://wiki.trapti.tech" target="_blank")
        div.link-icon.flex-center
          IconLogoGrowi(:size="20")
        p.link-title
          | Wiki
    li
      a(href="https://blog.trapti.tech" target="_blank")
        div.link-icon.flex-center
          IconLogoGhost(:size="20")
        p.link-title
          | Blog
    li
      a(href="https://drive.trapti.tech" target="_blank")
        div.link-icon.flex-center
          IconLogoNextCloud(:size="26")
        p.link-title
          | Drive
    li
      a(href="https://git.trapti.tech" target="_blank")
        div.link-icon.flex-center
          IconLogoGitea(:size="24")
        p.link-title
          | Gitea
    li
      a(href="https://showcase.trapti.tech" target="_blank")
        div.link-icon.flex-center
          IconLogoShowcase(:size="20")
        p.link-title
          | Showcase
    li
      a(href="https://md.trapti.tech" target="_blank")
        div.link-icon.flex-center
          IconLogoHackMD(:size="20")
        p.link-title
          | Hackmd
</template>

<script>
import IconLogoGhost from '@/components/Icon/IconLogoGhost'
import IconLogoGitea from '@/components/Icon/IconLogoGitea'
import IconLogoGrowi from '@/components/Icon/IconLogoGrowi'
import IconLogoHackMD from '@/components/Icon/IconLogoHackMD'
import IconLogoNextCloud from '@/components/Icon/IconLogoNextCloud'
import IconLogoShowcase from '@/components/Icon/IconLogoShowcase'
import IconLogotraP from '@/components/Icon/IconLogotraP'
export default {
  name: 'LinkList',
  components: {
    IconLogoGhost,
    IconLogoGitea,
    IconLogoGrowi,
    IconLogoHackMD,
    IconLogoNextCloud,
    IconLogoShowcase,
    IconLogotraP
  }
}
</script>

<style lang="sass">
.links-list-wrap
  padding: 0 0 15px
  height: 100%
  overflow-y: scroll

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
