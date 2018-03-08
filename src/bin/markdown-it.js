import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'
import MarkdownItMark from 'markdown-it-mark'
import myPlugin from '@/bin/markdown-it-extends'

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
md.disable('image')

export default md
