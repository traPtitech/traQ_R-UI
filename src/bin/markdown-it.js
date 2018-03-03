import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import MarkdownItMark from 'markdown-it-mark'
import iterator from 'markdown-it-for-inline'
import store from '@/store/index'

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

const jsonParse = (text) => {
  console.log('json parse: ' + text)
  try {
    const data = JSON.parse(text)
    if (typeof data['type'] !== 'string' || typeof data['raw'] !== 'string' || typeof data['id'] !== 'string') {
      return '!' + text
    }
    if (data['type'] === 'user' && store.state.memberMap[data['id']]) {
      return '[user reply]'
    } else if (data['type'] === 'channel' && store.state.channelMap[data['id']]) {
      return '[channel link]'
    } else if (data['type'] === 'tag' && store.state.tagMap[data['id']]) {
      return '[tag]'
    } else if (data['type'] === 'file') {
      return '[file]'
    }
    return text
  } catch (e) {
    return '!' + text
  }
}

md.use(iterator, 'message-extends', 'text', (tokens, idx) => {
  const text = tokens[idx].content
  let replaced = ''
  let isInside = false
  let startIndex = -1
  let isString = false
  for (let i = 0; i < text.length; i++) {
    if (isInside) {
      if (text[i] === '\\') {
        i++
      } else if (text[i] === '"') {
        isString ^= true
      } else if (!isString && text[i] === '}') {
        isInside = false
        replaced += jsonParse(text.substr(startIndex + 1, i + 1 - startIndex))
      }
    } else {
      if (i < text.length - 1 && text[i] === '!' && text[i + 1] === '{') {
        startIndex = i
        i++
        isInside = true
        isString = false
      } else {
        replaced += text[i]
      }
    }
  }
  if (isInside) {
    replaced += text.substr(startIndex)
  }
  tokens[idx].content = replaced
})
md.disable('image')

export default md
