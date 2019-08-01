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

const renderEmojiDomWithStyle = (stampName, imgTitle, style) =>
  `<i class="emoji s24 message-emoji" title=":${imgTitle}:" style="${style};">:${md.utils.escapeHtml(
    stampName
  )}:</i>`

const renderEmojiDom = (stampName, imgTitle, imgUrl) =>
  renderEmojiDomWithStyle(
    stampName,
    imgTitle,
    `background-image: url(${imgUrl})`
  )

const functionStampReg = /^(.+\(.+\))(.*)/

const renderHslEmoji = match => {
  // HSL: hsl(..., ...%, ...%)
  return renderEmojiDomWithStyle(
    match[1],
    match[1],
    `background-color: ${match[1]}`
  )
}

const renderRgbEmoji = match => {
  // RGB: 0x......
  return renderEmojiDomWithStyle(
    `0x${match[1]}`,
    match[1],
    `background-color: #${match[1]}`
  )
}

const renderEmoji = match => {
  const functionStampMatch = functionStampReg.exec(match[1])

  const splitted = match[1].split('.')
  const stampName = functionStampMatch ? functionStampMatch[1] : splitted[0]
  const effects = functionStampMatch
    ? functionStampMatch[2].split('.')
    : splitted.length > 1
    ? splitted.slice(1)
    : []

  if (store.state.stampNameMap[stampName]) {
    // 通常スタンプ
    return renderEmojiDom(
      stampName,
      store.state.stampNameMap[stampName].name,
      `${store.state.baseURL}/api/1.0/files/${
        store.state.stampNameMap[stampName].fileId
      }`
    )
  } else if (store.getters.getUserByName(stampName)) {
    // ユーザーアイコン
    const user = store.getters.getUserByName(stampName)
    return renderEmojiDom(
      stampName,
      stampName,
      `${store.state.baseURL}/api/1.0/files/${user.iconFileId}`
    )
  }

  return match[0]
}

md.use(MarkdownItMark)
md.use(json)
md.use(
  regexp(/:(hsl\(\d+,\s*[\d]+.?[\d]*%,\s*[\d]+.?[\d]*%\)):/, renderHslEmoji)
)
md.use(regexp(/:0x([0-9a-f]{6}):/, renderRgbEmoji))
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
