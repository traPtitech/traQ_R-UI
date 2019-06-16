import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import MarkdownItMark from 'markdown-it-mark'
import json from '@/bin/markdown-it-json'
import regexp from 'markdown-it-regexp'
import store from '@/store/index'
import mila from 'markdown-it-link-attributes'

function highlight(code, lang) {
  const [langName, langCaption] = lang.split(':')
  const citeTag = langCaption ? `<cite>${langCaption}</cite>` : ''
  if (hljs.getLanguage(langName)) {
    const result = hljs.highlight(langName, code)
    return `<pre class="traq-code traq-lang">${citeTag}<code class="lang-${
      result.language
    }">${result.value}</code></pre>`
  } else {
    const result = hljs.highlightAuto(code)
    return `<pre class="traq-code traq-lang">${citeTag}<code class="lang-${
      result.language
    }">${result.value}</code></pre>`
  }
}

const md = new MarkdownIt({
  breaks: true,
  linkify: true,
  highlight: highlight
})

md.block.State.prototype.skipEmptyLines = function skipEmptyLines(from) {
  for (var max = this.lineMax; from < max; from++) {
    if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) {
      break
    }
    this.push('hardbreak', 'br', 0)
  }
  return from
}

const renderEmoji = match => {
  if (store.state.stampNameMap[match[1]]) {
    return `<i class="emoji s24 message-emoji" title=":${
      store.state.stampNameMap[match[1]].name
    }:" style="background-image: url(${store.state.baseURL}/api/1.0/files/${
      store.state.stampNameMap[match[1]].fileId
    });">:${md.utils.escapeHtml(match[1])}:</i>`
  } else if (store.getters.getUserByName(match[1])) {
    const user = store.getters.getUserByName(match[1])
    return `<i class="emoji s24 message-emoji" title=":${
      match[1]
    }:" style="background-image: url(${store.state.baseURL}/api/1.0/files/${
      user.iconFileId
    });">:${md.utils.escapeHtml(match[1])}:</i>`
  } else {
    const colorReg = /0x([0-9a-f]{6})/
    const cols = colorReg.exec(match[1])
    if (cols) {
      return `<i class="emoji s24 message-emoji" title=":0x${
        cols[1]
      }:" style="background-color: #${cols[1]}">:${md.utils.escapeHtml(
        match[1]
      )}:</i>`
    }
    return match[0]
  }
}

md.use(MarkdownItMark)
md.use(json)
md.use(regexp(/:([a-zA-Z0-9+_-]{1,32}):/, renderEmoji))
md.use(mila, {
  attrs: {
    target: '_blank',
    rel: 'nofollow noopener noreferrer'
  }
})
md.disable('image')

export default md

export const renderInline = text => {
  const parsed = md.parseInline(text, {})
  const tokens = parsed[0].children
  const rendered = []
  for (let token of tokens) {
    if (token.type === 'regexp-0') {
      // emoji
      rendered.push(renderEmoji(token.meta.match))
    } else if (token.type === 'softbreak') {
      // newline
      rendered.push(' ')
    } else {
      rendered.push(md.utils.escapeHtml(token.content))
    }
  }
  return rendered.join('')
}
