import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import MarkdownItMark from 'markdown-it-mark'

function highlight (code, lang) {
  const [langName, langCaption] = lang.split(':')
  const citeTag = langCaption ? `<cite>${langCaption}</cite>` : ''
  if (hljs.getLanguage(langName)) {
    const result = hljs.highlight(langName, code)
    return `<pre class="traq-code traq-lang">${citeTag}<code class="lang-${result.language}">${result.value}</code></pre>`
  } else {
    return `<pre class="traq-code">${citeTag}<code>${code}</code></pre>`
  }
}

const md = new MarkdownIt({
  breaks: true,
  highlight: highlight
})

md.use(MarkdownItMark)

export default md
