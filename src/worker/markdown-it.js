import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import MarkdownItMark from 'markdown-it-mark'
import json from '@/worker/markdown-it-json'
import regexp from 'markdown-it-regexp'
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
  'marquee',
  'marquee-inv',
  'rainbow'
])
const sizeEffectSet = new Set(['ex-large', 'large', 'small'])

const animeEffectAliasMap = new Map([
  ['marquee', 'conga'],
  ['marquee-inv', 'conga-inv']
])

const maxEffectCount = 5

const md = new MarkdownIt({
  breaks: true,
  linkify: true,
  highlight: highlight
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

  // aliasの置き換え
  const replacedAnimeEffects = animeEffects.map(e =>
    animeEffectAliasMap.has(e) ? animeEffectAliasMap.get(e) : e
  )

  // 複数サイズ指定が合った場合は最後のものを適用
  const sizeEffectClass = sizeEffects[sizeEffects.length - 1] || ''

  const stampHtml = `<i class="emoji s24 message-emoji ${sizeEffectClass}" title=":${escapedTitle}:" style="${escapedStyle};">:${escapedName}:</i>`

  return wrapWithEffect(stampHtml, replacedAnimeEffects, sizeEffectClass)
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

  if (store.getStampFromName(stampName)) {
    // 通常スタンプ
    return renderEmojiDom(
      match[0],
      stampName,
      store.getStampFromName(stampName).name,
      `/api/1.0/files/${store.getStampFromName(stampName).fileId}`,
      effects
    )
  } else if (store.getUserByName(stampName)) {
    // ユーザーアイコン
    const user = store.getUserByName(stampName)
    return renderEmojiDom(
      match[0],
      stampName,
      stampName,
      `/api/1.0/files/${user.iconFileId}`,
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

export const render = text => {
  return md.render(text, {})
}

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
