var test = require('tape')
var choo = require('choo')
var html = require('choo/html')
var meta = require('../')

test('prevent appending missing nodes', function (t) {
  t.plan(3)
  var app = choo()
  app.use(meta({ append: false }))
  app.route('/*', main)

  function main (state, emit) {
    emit('meta', { title: 'foo', description: 'bar' })
    return html`<body></body>`
  }

  app.mount('body')

  window.requestAnimationFrame(function () {
    var title = document.querySelector('title')
    t.equal(title.innerHTML, 'foo', 'title was updated')

    var ogTitle = document.querySelector(`meta[property="og:title"]`)
    t.notOk(ogTitle, 'og:title tag was not added')

    var description = document.querySelector(`meta[name="description"]`)
    t.notOk(description, 'meta description tag was not added')
  })
})
