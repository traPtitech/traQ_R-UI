import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import MarkdownItMark from 'markdown-it-mark'
import json from '@/bin/markdown-it-json'
import regexp from 'markdown-it-regexp'
import store from '@/store/index'
import mila from 'markdown-it-link-attributes'
import filter from 'markdown-it-image-filter'
import whitelist from '@/bin/domain_whitelist.json'

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

const animeEffectSet = new Set([
  'rotate',
  'rotate-inv',
  'wiggle',
  'parrot',
  'zoom',
  'inversion',
  'turn',
  'turn-v',
  'happa',
  'pyon',
  'flashy',
  'pull',
  'atsumori',
  'stretch',
  'stretch-v',
  'conga',
  'conga-inv',
  'rainbow'
])
const sizeEffectSet = new Set(['ex-large', 'large', 'small'])

const maxEffectCount = 5

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

const wrapWithEffect = (stampHtml, animeEffects, sizeEffect) => {
  const filterOpenTag = animeEffects
    .map(
      (e, i) =>
        `<span class="emoji-effect ${e}${
          i == 0 && sizeEffect ? ` ${sizeEffect}` : ''
        }">`
    )
    .join('')
  const filterCloseTag = '</span>'.repeat(animeEffects.length)
  return filterOpenTag + stampHtml + filterCloseTag
}

const renderEmojiDomWithStyle = (
  rawMatch,
  stampName,
  imgTitle,
  style,
  effects
) => {
  const escapedTitle = md.utils.escapeHtml(imgTitle)
  const escapedStyle = md.utils.escapeHtml(style)
  const escapedName = md.utils.escapeHtml(stampName)

  const sizeEffects = effects.filter(e => sizeEffectSet.has(e))
  const animeEffects = effects.filter(e => animeEffectSet.has(e))

  // 知らないエフェクトはダメ
  if (sizeEffects.length + animeEffects.length < effects.length) {
    return rawMatch
  }

  // アニメーション系エフェクトは5つまで
  if (animeEffects.length > maxEffectCount) {
    return rawMatch
  }

  // 複数サイズ指定が合った場合は最後のものを適用
  const sizeEffectClass = sizeEffects[sizeEffects.length - 1] || ''

  const stampHtml = `<i class="emoji s24 message-emoji ${sizeEffectClass}" title=":${escapedTitle}:" style="${escapedStyle};">:${escapedName}:</i>`

  return wrapWithEffect(stampHtml, animeEffects, sizeEffectClass)
}

const renderEmojiDom = (rawMatch, stampName, imgTitle, imgUrl, effects) =>
  renderEmojiDomWithStyle(
    rawMatch,
    stampName,
    imgTitle,
    `background-image: url(${imgUrl})`,
    effects
  )

const emojiReg = /[a-zA-Z0-9+_-]{1,32}/
const hslReg = /(hsl\(\d+,\s*[\d]+(?:\.[\d]+)?%,\s*[\d]+(?:\.[\d]+)?%\))(.*)/
const hexReg = /0x([0-9a-f]{6})(.*)/

const renderHslEmoji = match => {
  // HSL: hsl(..., ...%, ...%)
  const effects = match[2] === '' ? [] : match[2].split('.').slice(1)
  return renderEmojiDomWithStyle(
    `:${match[0]}:`,
    match[1],
    match[1],
    `background-color: ${match[1]}`,
    effects
  )
}

const renderHexEmoji = match => {
  // Hex: 0x......
  const effects = match[2] === '' ? [] : match[2].split('.').slice(1)
  return renderEmojiDomWithStyle(
    `:${match[0]}:`,
    `0x${match[1]}`,
    `0x${match[1]}`,
    `background-color: #${match[1]}`,
    effects
  )
}

const renderEmoji = match => {
  // match[1] は:を除いた部分
  const hexMatch = hexReg.exec(match[1])
  if (hexMatch) {
    return renderHexEmoji(hexMatch)
  }

  const hslMatch = hslReg.exec(match[1])
  if (hslMatch) {
    return renderHslEmoji(hslMatch)
  }

  if (!emojiReg.exec(match[1])) {
    return match[0]
  }

  const splitted = match[1].split('.')
  const stampName = splitted[0]
  const effects = splitted.length > 1 ? splitted.slice(1) : []

  if (store.state.stampNameMap[stampName]) {
    // 通常スタンプ
    return renderEmojiDom(
      match[0],
      stampName,
      store.state.stampNameMap[stampName].name,
      `${store.state.baseURL}/api/1.0/files/${
        store.state.stampNameMap[stampName].fileId
      }`,
      effects
    )
  } else if (store.getters.getUserByName(stampName)) {
    // ユーザーアイコン
    const user = store.getters.getUserByName(stampName)
    return renderEmojiDom(
      match[0],
      stampName,
      stampName,
      `${store.state.baseURL}/api/1.0/files/${user.iconFileId}`,
      effects
    )
  }

  return match[0]
}

md.use(MarkdownItMark)
md.use(json)
md.use(
  regexp(
    /:((?:[a-zA-Z0-9+_-]{1,32}|\w+\([^:<>"'=+!?]+\))[\w+-.]*):/,
    renderEmoji
  )
)
md.use(mila, {
  attrs: {
    target: '_blank',
    rel: 'nofollow noopener noreferrer'
  }
})
md.use(filter(whitelist))

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
