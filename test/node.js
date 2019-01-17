var test = require('tape')
var choo = require('choo')
var html = require('choo/html')
var meta = require('../')

test('meta in state', function (t) {
  t.plan(1)
  var app = choo()
  app.use(meta())
  app.route('/', main)
  app.toString('/')

  function main (state) {
    t.ok('meta' in state, 'state has meta property')
    return html`<body></body>`
  }
})

test('meta forwards title', function (t) {
  t.plan(1)
  var app = choo()
  app.use(meta())
  app.use(store)
  app.route('/', main)
  app.toString('/')

  function store (state, emitter) {
    emitter.on('DOMTitleChange', function (title) {
      t.equal(title, 'foo', 'title was forwarded with DOMTitleChange')
    })
  }

  function main (state, emit) {
    emit('meta', { title: 'foo' })
    // check that DOMTitlteChange is only emitted once when title doens't change
    emit('meta', { title: 'foo' })
    return html`<body></body>`
  }
})

test('derive open graph tags', function (t) {
  t.plan(2)
  var app = choo()
  app.use(meta({ origin: 'https://foo.bar' }))
  app.route('/baz', main)
  app.toString('/baz')
  t.equal(app.state.meta['og:title'], 'baz', 'og:title mirror title')
  t.equal(app.state.meta['og:url'], 'https://foo.bar/baz', 'og:url resolved')

  function main (state, emit) {
    emit('meta', { title: 'baz' })
    return html`<body></body>`
  }
})

test('handles any type', function (t) {
  t.plan(2)
  var app = choo()
  app.use(meta())
  app.route('/', main)
  t.doesNotThrow(() => app.toString('/'), 'handles numbers just fine')
  t.equal(app.state.meta.number, 123, 'numbers are unaltered')

  function main (state, emit) {
    emit('meta', { number: 123 })
    return html`<body></body>`
  }
})
