import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import MarkdownItMark from 'markdown-it-mark'
import myPlugin from '@/bin/markdown-it-extends'
import regexp from 'markdown-it-regexp'
import store from '@/store/index'
import mila from 'markdown-it-link-attributes'

function highlight (code, lang) {
  const [langName, langCaption] = lang.split(':')
  const citeTag = langCaption ? `<cite>${langCaption}</cite>` : ''
  if (hljs.getLanguage(langName)) {
    const result = hljs.highlight(langName, code)
    return `<pre class="traq-code traq-lang">${citeTag}<code class="lang-${result.language}">${result.value}</code></pre>`
  } else {
    const result = hljs.highlightAuto(code)
    return `<pre class="traq-code traq-lang">${citeTag}<code class="lang-${result.language}">${result.value}</code></pre>`
  }
}

const md = new MarkdownIt({
  breaks: true,
  linkify: true,
  highlight: highlight
})

md.use(MarkdownItMark)
md.use(myPlugin)
md.use(regexp(/:([a-zA-Z0-9+_-]{1,32}):/, (match, utils) => {
  if (store.state.stampNameMap[match[1]]) {
    return `<i class="emoji s32 message-emoji" title=":${store.state.stampNameMap[match[1]].name}:" style="background-image: url(${store.state.baseURL}/api/1.0/files/${store.state.stampNameMap[match[1]].fileId});">:${utils.escape(match[1])}:</i>`
  } else if (store.getters.getUserByName(match[1])) {
    const user = store.getters.getUserByName(match[1])
    return `<i class="emoji s32 message-emoji" title=":${match[1]}:" style="background-image: url(${store.state.baseURL}/api/1.0/users/${user.userId}/icon);">:${utils.escape(match[1])}:</i>`
  } else {
    const colorReg = /0x([0-9a-f]{6})/
    const cols = colorReg.exec(match[1])
    if (cols) {
      return `<i class="emoji s32 message-emoji" title=":0x${cols[1]}:" style="background-color: #${cols[1]}">:${utils.escape(match[1])}:</i>`
    }
    return match[0]
  }
}))
md.use(mila, {
  attrs: {
    target: '_blank',
    rel: 'nofollow noopener noreferrer'
  }
})
md.disable('image')

export default md
