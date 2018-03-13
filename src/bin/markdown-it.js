import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import MarkdownItMark from 'markdown-it-mark'
import myPlugin from '@/bin/markdown-it-extends'
import regexp from 'markdown-it-regexp'
import store from '@/store/index'
import milt from 'markdown-it-link-target'

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
  highlight: highlight
})

md.use(MarkdownItMark)
md.use(myPlugin)
md.use(regexp(/:(\w+):/, (match, utils) => {
  if (store.state.stampNameMap[match[1]]) {
    return `<i class="emoji s32" style="background-image: url(${store.state.baseURL}/api/1.0/files/${store.state.stampNameMap[match[1]].fileId});">:${utils.escape(match[1])}:</i>`
  } else {
    return match[0]
  }
}))
md.use(milt)
md.disable('image')

export default md
