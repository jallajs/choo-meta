module.exports = meta

function meta (opts) {
  opts = opts || {}
  var append = typeof opts.append === 'undefined' || opts.append

  return function (state, emitter, app) {
    state.meta = state.meta || {}

    emitter.on('meta', function (next) {
      if (next.title && next.title !== state.title) {
        // forward title to choo
        emitter.emit('DOMTitleChange', next.title)
      }

      var tags = Object.assign({}, next)

      // derive open graph meta tags
      if (opts.origin && !next['og:url']) tags['og:url'] = opts.origin + state.href

      Object.keys(tags).forEach(function (key) {
        var value = tags[key]
        if (value == null || key === 'title') return

        if (typeof value === 'string') {
          // escape quotes
          value = value.replace(/"/g, '&quot;')
          // make urls absolute
          if (opts.origin) value = value.replace(/^\//, opts.origin + '/')
        }

        state.meta[key] = value

        if (typeof window === 'undefined') return

        // lookup existing DOM node
        var attribute = key.substr(0, 3) === 'og:' ? 'property' : 'name'
        var selector = 'meta[' + attribute + '="' + key + '"]'
        var el = document.head.querySelector(selector)

        // optionally append new node if missing
        if (!el && append) {
          el = document.createElement('meta')
          el.setAttribute(attribute, key)
          document.head.appendChild(el)
        }

        // update node content
        if (el) el.setAttribute('content', state.meta[key])
      })
    })
  }
}
