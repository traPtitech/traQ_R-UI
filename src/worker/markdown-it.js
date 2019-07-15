import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import MarkdownItMark from 'markdown-it-mark'
import json from '@/worker/markdown-it-json'
import regexp from 'markdown-it-regexp'
import mila from 'markdown-it-link-attributes'
import * as store from '@/worker/store'

// exportできるのは関数のみ(asyncでくるまれるので)
export const updateData = (key, val) => {
  store.update(key, val)
}
export const initialize = states => {
  store.initialize(states)
}
export const getImportStates = () => {
  return store.importStates
}
export const getInitializePromise = () => {
  return store.initializePromise
}

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

const renderEmoji = size => match => {
  if (store.getStampFromName(match[1])) {
    return `<i class="emoji s${size} message-emoji" title=":${
      store.getStampFromName(match[1]).name
    }:" style="background-image: url(${store.getBaseURL()}/api/1.0/files/${
      store.getStampFromName(match[1]).fileId
    });">:${md.utils.escapeHtml(match[1])}:</i>`
  } else if (store.getUserByName(match[1])) {
    const user = store.getUserByName(match[1])
    return `<i class="emoji s${size} message-emoji" title=":${
      match[1]
    }:" style="background-image: url(${store.getBaseURL()}/api/1.0/files/${
      user.iconFileId
    });">:${md.utils.escapeHtml(match[1])}:</i>`
  } else {
    const colorReg = /0x([0-9a-f]{6})/
    const cols = colorReg.exec(match[1])
    if (cols) {
      return `<i class="emoji s${size} message-emoji" title=":0x${
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
md.use(regexp(/:([a-zA-Z0-9+_-]{1,32}):/, renderEmoji(12)))
md.use(mila, {
  attrs: {
    target: '_blank',
    rel: 'nofollow noopener noreferrer'
  }
})
md.disable('image')

export const render = text => {
  const match = /^:([a-zA-Z0-9+_-]{1,32}):$/.exec(text)
  if (match) {
    const converted = renderEmoji(24)(match)
    if (converted !== text) return converted
  }
  return md.render(text, {})
}

export const renderInline = text => {
  const parsed = md.parseInline(text, {})
  const tokens = parsed[0].children
  const rendered = []
  for (let token of tokens) {
    if (token.type === 'regexp-0') {
      // emoji
      rendered.push(renderEmoji(12)(token.meta.match))
    } else if (token.type === 'softbreak') {
      // newline
      rendered.push(' ')
    } else {
      rendered.push(md.utils.escapeHtml(token.content))
    }
  }
  return rendered.join('')
}
