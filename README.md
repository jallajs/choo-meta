# choo-meta

[![npm version](https://img.shields.io/npm/v/choo-meta.svg?style=flat-square)](https://npmjs.org/package/choo-meta) [![build status](https://img.shields.io/travis/jallajs/choo-meta/master.svg?style=flat-square)](https://travis-ci.org/jallajs/choo-meta)
[![downloads](http://img.shields.io/npm/dm/choo-meta.svg?style=flat-square)](https://npmjs.org/package/choo-meta)
[![style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square)](https://npmjs.org/package/choo-meta)

Keeps document meta tags up to date. Drop-in replacement for [choo][choo] native
`DOMTitleChange` event.

## Usage
Add the plugin as you would any other choo store.

```javascript
var choo = require('choo')
var app = choo()
app.use(require('choo-meta')())
app.mount('body')
```

And switch out all your `DOMTitleChange` events for `meta` events with an object
of meta properties to update. Will forward to `DOMTitlteChange` under the hood
to preserve choo behaviour.

```diff
- emit('DOMTitleChange', 'My Website')
+ emit('meta', { title: 'My Website', 'og:image': '/logo.jpg' })
```

## API
### `emit([opts])`
Create a [choo][choo] store which listens for the `meta` event. Will lookup meta
tags in document head and update them in place, optionally adding new tags if
not found.

### Options
- __`append`__ (*default: true*) create and append new meta tags if they can't
be found
- __`origin`__ webpage domain used for resolving relative urls and adding the
`og:url` property

## License
MIT

[choo]: https://github.com/choojs/choo
