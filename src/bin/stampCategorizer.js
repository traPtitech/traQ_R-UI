import stampCategorized from '@/bin/unicode_emojis.json'

export default function(stampData) {
  const categorized = new Array(stampCategorized.length + 1)
  categorized[0] = {
    category: 'traq',
    stamps: {}
  }
  stampData.forEach(stamp => {
    categorized[0].stamps[stamp.name] = stamp
  })
  stampCategorized.forEach(category => {
    categorized[category.order] = {
      category: category.category,
      stamps: {}
    }
    category.emojis.forEach(stamp => {
      const temp = categorized[0].stamps[stamp.name]
      if (temp) {
        categorized[category.order].stamps[stamp.name] = temp
        delete categorized[0].stamps[stamp.name]
      }
    })
  })
  categorized.forEach(category => {
    category.stamps = Object.values(category.stamps)
  })
  categorized[0].stamps.sort((lhs, rhs) => {
    if (lhs.name < rhs.name) {
      return -1
    } else if (lhs.name > rhs.name) {
      return 1
    } else {
      return 0
    }
  })
  return categorized
}
