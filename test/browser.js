var test = require('tape')
var choo = require('choo')
var html = require('choo/html')
var meta = require('../')

test('append missing nodes by default', function (t) {
  t.plan(7)
  var app = choo()
  app.use(meta())
  app.route('/*', main)

  function main (state, emit) {
    emit('meta', { title: 'foo', description: 'bar', 'og:test': 'baz' })
    return html`<body></body>`
  }

  app.mount('body')

  window.requestAnimationFrame(function () {
    var title = document.querySelector('title')
    t.equal(title.innerHTML, 'foo', 'title was updated')

    var ogTitle = document.querySelector(`meta[property="og:title"]`)
    t.ok(ogTitle, 'og:title tag added')
    t.equal(ogTitle.getAttribute('content'), 'foo', 'og:title match title')

    var description = document.querySelector(`meta[name="description"]`)
    t.ok(description, 'meta description tag added')
    t.equal(description.getAttribute('content'), 'bar', 'meta description content match')

    var ogTest = document.querySelector(`meta[property="og:test"]`)
    t.ok(ogTest, 'og:test tag added')
    t.equal(ogTest.getAttribute('content'), 'baz', 'og:test content match')
  })
})
