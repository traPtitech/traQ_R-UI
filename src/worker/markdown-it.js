import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import MarkdownItMark from 'markdown-it-mark'
import spoiler from 'markdown-it-spoiler'
import stamp, { renderStamp } from '@/worker/markdown-it-stamp'
import json from '@/worker/markdown-it-json'
import katex from '@iktakahiro/markdown-it-katex'
import katexE from 'katex'
import mila from 'markdown-it-link-attributes'
import filter from 'markdown-it-image-filter'
import whitelist from '@/bin/domain_whitelist.json'
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
    return `<pre class="traq-code traq-lang">${citeTag}<code class="lang-${result.language}">${result.value}</code></pre>`
  } else {
    const result = hljs.highlightAuto(code)
    return `<pre class="traq-code traq-lang">${citeTag}<code class="lang-${result.language}">${result.value}</code></pre>`
  }
}

const md = new MarkdownIt({
  breaks: true,
  linkify: true,
  highlight
})

md.renderer.rules.table_open = () => '<table class="is-scroll">'
md.renderer.rules.blockquote_open = () => '<blockquote class="is-scroll">'
md.renderer.rules.bullet_list_open = () => '<ul class="is-scroll">'
md.renderer.rules.ordered_list_open = () => '<ol class="is-scroll">'

md.block.State.prototype.skipEmptyLines = function skipEmptyLines(from) {
  for (var max = this.lineMax; from < max; from++) {
    if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) {
      break
    }
    this.push('hardbreak', 'br', 0)
  }
  return from
}

md.use(MarkdownItMark)
md.use(spoiler, true)
md.use(json)
md.use(katex, {
  katex: katexE,
  output: 'html',
  maxSize: 100,
  blockClass: 'is-scroll'
})
md.use(mila, {
  attrs: {
    target: '_blank',
    rel: 'nofollow noopener noreferrer'
  }
})
md.use(filter(whitelist, { httpsOnly: true }))

export const render = text => {
  return md.render(text, {})
}

export const renderInline = text => {
  const parsed = md.parseInline(text, {})
  const tokens = parsed[0].children
  const rendered = []
  for (let token of tokens) {
    if (token.type === 'regexp-0') {
      // stamp
      rendered.push(renderStamp(token.meta.match))
    } else if (token.type === 'spoiler_open') {
      rendered.push('<span class="spoiler">')
    } else if (token.type === 'spoiler_close') {
      rendered.push('</span>')
    } else if (token.type === 'softbreak') {
      // newline
      rendered.push(' ')
    } else {
      rendered.push(md.utils.escapeHtml(token.content))
    }
  }
  return rendered.join('')
}
