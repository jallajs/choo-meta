var test = require('tape')
var choo = require('choo')
var html = require('choo/html')
var meta = require('../')

var DOCUMENT_HEAD = document.head.innerHTML
var TITLE = document.title

test('append missing nodes by default', function (t) {
  document.title = TITLE
  document.head.innerHTML = DOCUMENT_HEAD

  t.plan(9)
  var app = choo()
  app.use(meta({ origin: 'https://foo.bar' }))
  app.route('/*', main)

  function main (state, emit) {
    emit('meta', { title: 'foo', description: 'bar', 'og:test': 'baz' })
    return html`<body></body>`
  }

  app.start()

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

  var ogUrl = document.querySelector(`meta[property="og:url"]`)
  t.ok(ogUrl, 'og:url tag added')
  t.equal(ogUrl.getAttribute('content'), 'https://foo.bar', 'og:url content match')
})

test('prevent appending missing nodes', function (t) {
  document.title = TITLE
  document.head.innerHTML = DOCUMENT_HEAD

  t.plan(3)
  var app = choo()
  app.use(meta({ append: false }))
  app.route('/*', main)

  function main (state, emit) {
    emit('meta', { title: 'foo', 'theme-color': '#fff' })
    return html`<body></body>`
  }

  app.start()

  var title = document.querySelector('title')
  t.equal(title.innerHTML, 'foo', 'title was updated')

  var ogTitle = document.querySelector(`meta[property="og:title"]`)
  t.notOk(ogTitle, 'og:title tag was not added')

  var theme = document.querySelector(`meta[name="theme-color"]`)
  t.notOk(theme, 'meta theme-color tag was not added')
})
