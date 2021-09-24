'use strict'
function e(e) {
  return e && 'object' == typeof e && 'default' in e ? e.default : e
}
var t = e(require('debug')),
  o = e(require('postcss-selector-parser'))
const n = t('automator:devtool')
function r(e) {
  e.walk((e) => {
    if ('tag' === e.type) {
      const t = e.value
      e.value = 'page' === t ? 'uni-page-body' : 'uni-' + t
    }
  })
}
const s = [
  'Page.getElement',
  'Page.getElements',
  'Element.getElement',
  'Element.getElements',
]
const i = ['chromium', 'firefox', 'webkit']
let a = !1
try {
  a = !!require('playwright')
} catch (e) {}
const c = new Map()
function p(e = 'chromium') {
  const t = e && i.includes(e) ? e : i[0]
  let o = c.get(t)
  return (
    o ||
      ((o = (function (e) {
        if ('webkit' === e) return l('webkit')
        if ('firefox' === e) return l('firefox')
        return a
          ? l('chromium')
          : (function () {
              const e = require('puppeteer')
              let t, o
              return {
                type: 'chromium',
                provider: 'puppeteer',
                async open(r, s, i) {
                  t = await e.launch(s.options)
                  const a = t.process()
                  a ? n('%s %o', a.spawnfile, s.options) : n('%o', s.options),
                    (o = await t.newPage()),
                    o.on('console', (e) => {
                      i.emit('App.logAdded', {
                        type: e.type(),
                        args: [e.text()],
                      })
                    }),
                    o.on('pageerror', (e) => {
                      i.emit('App.exceptionThrown', e)
                    }),
                    await o.goto(s.url || r),
                    await o.waitFor(1e3)
                },
                close: () => t.close(),
                screenshot: (e = !1) =>
                  o.screenshot({ encoding: 'base64', fullPage: e }),
              }
            })()
      })(t)),
      c.set(t, o)),
    o
  )
}
function l(e) {
  const t = require('playwright')
  let o, r
  return {
    type: e,
    provider: 'playwright',
    async open(s, i, a) {
      ;(o = await t[e].launch(i.options)),
        'firefox' === e && (i.contextOptions.isMobile = !1),
        n('browser.newContext ' + JSON.stringify(i.contextOptions))
      const c = await o.newContext(i.contextOptions)
      ;(r = await c.newPage()),
        r.on('console', (e) => {
          a.emit('App.logAdded', { type: e.type(), args: [e.text()] })
        }),
        r.on('pageerror', (e) => {
          a.emit('App.exceptionThrown', e)
        }),
        await r.goto(i.url || s),
        await r.waitForTimeout(1e3)
    },
    close: () => o.close(),
    screenshot: (e = !1) =>
      r.screenshot({ fullPage: e }).then((e) => e.toString('base64')),
  }
}
let u
const f = {
  'Tool.close': {
    reflect: async () => {
      await u.close()
    },
  },
  'App.exit': { reflect: async () => {} },
  'App.enableLog': { reflect: () => Promise.resolve() },
  'App.captureScreenshot': {
    reflect: async (e, t) => {
      const o = await u.screenshot(!!t.fullPage)
      return n('App.captureScreenshot ' + o.length), { data: o }
    },
  },
}
!(function (e) {
  s.forEach((t) => {
    e[t] = (function (e) {
      return {
        reflect: async (t, o) => t(e, o, !1),
        params: (e) => (
          e.selector && (e.selector = o(r).processSync(e.selector)), e
        ),
      }
    })(t)
  })
})(f)
const h = {
  devtools: {
    name: 'browser',
    paths: [],
    validate: async function (e) {
      return (
        (e.options = e.options || {}),
        e.executablePath &&
          !e.options.executablePath &&
          (e.options.executablePath = e.executablePath),
        (e.contextOptions = {
          viewport: Object.assign(
            { width: 375, height: 667 },
            e.options.defaultViewport || {}
          ),
          hasTouch: !0,
          isMobile: !0,
          deviceScaleFactor: 2,
        }),
        (e.options.defaultViewport = Object.assign(
          {
            width: 375,
            height: 667,
            deviceScaleFactor: 2,
            hasTouch: !0,
            isMobile: !0,
          },
          e.options.defaultViewport || {}
        )),
        e.teardown ||
          (e.teardown = !1 === e.options.headless ? 'disconnect' : 'close'),
        e
      )
    },
    create: async function (e, t, o) {
      ;(u = p(process.env.BROWSER)),
        n(
          'createDevtools ' +
            (u.provider + ' ' + u.type + ' ' + JSON.stringify(t))
        ),
        await u.open(e, t, o)
    },
  },
  shouldCompile: (e, t) => !t.url,
  adapter: f,
}
module.exports = h
