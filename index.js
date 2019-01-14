module.exports = meta

function meta (opts) {
  opts = opts || {}

  return function (state, emitter, app) {
    state.meta = state.meta || {}

    emitter.on('meta', function (next) {
      if (next.title && next.title !== state.title) {
        emitter.emit('DOMTitleChange', next.title)
      }

      var tags = Object.assign({}, next)
      if (opts.origin) tags['og:url'] = state.origin + state.href
      if (next.title && !next['og:title']) tags['og:title'] = next.title

      Object.keys(tags).forEach(function (key) {
        if (!tags[key]) return
        var value = tags[key].replace(/"/g, '&quot;')
        if (opts.origin) value = value.replace(/^\//, opts.origin + '/')
        state.meta[key] = value
        if (typeof window === 'undefined') return
        var attribute = key.substr(0, 3) === 'og:' ? 'property' : 'name'
        var el = document.head.querySelector(`meta[${attribute}="${key}"]`)
        if (!el && opts.append) {
          el = document.createElement('meta')
          el.setAttribute(attribute, key)
          document.head.appendChild(el)
        }
        if (el) el.setAttribute('content', state.meta[key])
      })
    })
  }
}
