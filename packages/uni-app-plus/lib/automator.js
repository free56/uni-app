var e,
  t = Object.prototype.hasOwnProperty,
  n = function (e) {
    return null == e
  },
  r = Array.isArray,
  o = function (e) {
    var t = Object.create(null)
    return function (n) {
      return t[n] || (t[n] = e(n))
    }
  },
  u = /\B([A-Z])/g,
  i = o(function (e) {
    return e.replace(u, '-$1').toLowerCase()
  }),
  c = /-(\w)/g,
  a = o(function (e) {
    return e.replace(c, function (e, t) {
      return t ? t.toUpperCase() : ''
    })
  }),
  s = o(function (e) {
    return e.charAt(0).toUpperCase() + e.slice(1)
  }),
  f =
    /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g
function l(e, n) {
  if (r(e)) return e
  if (n && ((o = n), (u = e), t.call(o, u))) return [e]
  var o,
    u,
    i = []
  return (
    e.replace(f, function (e, t, n, r) {
      return i.push(n ? r.replace(/\\(\\)?/g, '$1') : t || e), r
    }),
    i
  )
}
function d(e, t) {
  var r,
    o = l(t, e)
  for (r = o.shift(); !n(r); ) {
    if (null == (e = e[r])) return
    r = o.shift()
  }
  return e
}
function p(e) {
  return e.__wxWebviewId__
    ? e.__wxWebviewId__
    : e.privateProperties
    ? e.privateProperties.slaveId
    : e.$page
    ? e.$page.id
    : void 0
}
function g(e) {
  return e.route || e.uri
}
function m(e) {
  return e.options || (e.$page && e.$page.options) || {}
}
function v(e) {
  return { id: p(e), path: g(e), query: m(e) }
}
function _(e) {
  var t = (function (e) {
    return getCurrentPages().find(function (t) {
      return p(t) === e
    })
  })(e)
  return t && t.$vm
}
function h(e, t) {
  var n = _(e)
  return (
    n &&
    (function e(t, n) {
      var r
      return (
        t &&
          (!(function (e, t) {
            return (
              (function (e) {
                if (e._$weex) return e._uid
                if (e._$id) return e._$id
                var t = (function (e) {
                  for (var t = e.$parent; t; ) {
                    if (t._$id) return t
                    t = t.$parent
                  }
                })(e)
                if (!e.$parent) return '-1'
                var n = e.$vnode,
                  r = n.context
                return r && r !== t && r._$id
                  ? r._$id + ';' + t._$id + ',' + n.data.attrs._i
                  : t._$id + ',' + n.data.attrs._i
              })(e) === t
            )
          })(t, n)
            ? t.$children.find(function (t) {
                return (r = e(t, n))
              })
            : (r = t)),
        r
      )
    })(n, t)
  )
}
function E(e, t) {
  var n
  return (
    e && (n = t ? d(e.$data, t) : Object.assign({}, e.$data)),
    Promise.resolve({ data: n })
  )
}
function y(e, t) {
  return (
    e &&
      Object.keys(t).forEach(function (n) {
        e[n] = t[n]
      }),
    Promise.resolve()
  )
}
function w(t, n, r) {
  return new Promise(function (o, u) {
    if (!t) return u(e.VM_NOT_EXISTS)
    if (!t[n]) return u(e.VM_NOT_EXISTS)
    var i,
      c = t[n].apply(t, r)
    !(i = c) ||
    ('object' != typeof i && 'function' != typeof i) ||
    'function' != typeof i.then
      ? o({ result: c })
      : c.then(function (e) {
          o({ result: e })
        })
  })
}
!(function (e) {
  ;(e.VM_NOT_EXISTS = 'VM_NOT_EXISTS'),
    (e.METHOD_NOT_EXISTS = 'METHOD_NOT_EXISTS')
})(e || (e = {}))
var T = [
    'stopRecord',
    'getRecorderManager',
    'pauseVoice',
    'stopVoice',
    'pauseBackgroundAudio',
    'stopBackgroundAudio',
    'getBackgroundAudioManager',
    'createAudioContext',
    'createInnerAudioContext',
    'createVideoContext',
    'createCameraContext',
    'createMapContext',
    'canIUse',
    'startAccelerometer',
    'stopAccelerometer',
    'startCompass',
    'stopCompass',
    'hideToast',
    'hideLoading',
    'showNavigationBarLoading',
    'hideNavigationBarLoading',
    'navigateBack',
    'createAnimation',
    'pageScrollTo',
    'createSelectorQuery',
    'createCanvasContext',
    'createContext',
    'drawCanvas',
    'hideKeyboard',
    'stopPullDownRefresh',
    'arrayBufferToBase64',
    'base64ToArrayBuffer',
  ],
  x = {},
  P = /Sync$/,
  S = /^on|^off/
function O(e) {
  return P.test(e) || -1 !== T.indexOf(e)
}
var $ = {
    getPageStack: function () {
      return Promise.resolve({
        pageStack: getCurrentPages().map(function (e) {
          return v(e)
        }),
      })
    },
    getCurrentPage: function () {
      var e = getCurrentPages(),
        t = e.length
      return new Promise(function (n, r) {
        t ? n(v(e[t - 1])) : r(Error('getCurrentPages().length=0'))
      })
    },
    callUniMethod: function (e) {
      var t = e.method,
        n = e.args
      return new Promise(function (e, r) {
        if (!uni[t]) return r(Error('uni.' + t + ' not exists'))
        if (O(t)) return e({ result: uni[t].apply(uni, n) })
        var o = [
          Object.assign({}, n[0] || {}, {
            success: function (n) {
              setTimeout(
                function () {
                  e({ result: n })
                },
                'pageScrollTo' === t ? 350 : 0
              )
            },
            fail: function (e) {
              r(Error(e.errMsg.replace(t + ':fail ', '')))
            },
          }),
        ]
        uni[t].apply(uni, o)
      })
    },
    mockUniMethod: function (e) {
      var t = e.method
      if (!uni[t]) throw Error('uni.' + t + ' not exists')
      if (
        !(function (e) {
          return !S.test(e)
        })(t)
      )
        throw Error("You can't mock uni." + t)
      var r = e.result
      if (n(r)) return x[t] && ((uni[t] = x[t]), delete x[t]), Promise.resolve()
      var o = O(t)
        ? function () {
            return r
          }
        : function (e) {
            setTimeout(function () {
              r.errMsg && -1 !== r.errMsg.indexOf(':fail')
                ? e.fail && e.fail(r)
                : e.success && e.success(r),
                e.complete && e.complete(r)
            }, 4)
          }
      return x[t] || (x[t] = uni[t]), (uni[t] = o), Promise.resolve()
    },
  },
  b = {
    getData: function (e) {
      return E(_(e.pageId), e.path)
    },
    setData: function (e) {
      return y(_(e.pageId), e.data)
    },
    callMethod: function (t) {
      var n,
        r =
          (((n = {})[e.VM_NOT_EXISTS] = 'Page[' + t.pageId + '] not exists'),
          (n[e.METHOD_NOT_EXISTS] = 'page.' + t.method + ' not exists'),
          n)
      return new Promise(function (e, n) {
        w(_(t.pageId), t.method, t.args)
          .then(function (t) {
            return e(t)
          })
          .catch(function (e) {
            n(Error(r[e]))
          })
      })
    },
  }
function I(e) {
  return e.nodeId || e.elementId
}
var C = {
  getData: function (e) {
    return E(h(e.pageId, I(e)), e.path)
  },
  setData: function (e) {
    return y(h(e.pageId, I(e)), e.data)
  },
  callMethod: function (t) {
    var n,
      r = I(t),
      o =
        (((n = {})[e.VM_NOT_EXISTS] =
          'Component[' + t.pageId + ':' + r + '] not exists'),
        (n[e.METHOD_NOT_EXISTS] = 'component.' + t.method + ' not exists'),
        n)
    return new Promise(function (e, n) {
      w(h(t.pageId, r), t.method, t.args)
        .then(function (t) {
          return e(t)
        })
        .catch(function (e) {
          n(Error(o[e]))
        })
    })
  },
}
/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */
function M() {
  for (var e = 0, t = 0, n = arguments.length; t < n; t++)
    e += arguments[t].length
  var r = Array(e),
    o = 0
  for (t = 0; t < n; t++)
    for (var u = arguments[t], i = 0, c = u.length; i < c; i++, o++) r[o] = u[i]
  return r
}
;('undefined' != typeof crypto &&
  crypto.getRandomValues &&
  crypto.getRandomValues.bind(crypto)) ||
  ('undefined' != typeof msCrypto &&
    'function' == typeof msCrypto.getRandomValues &&
    msCrypto.getRandomValues.bind(msCrypto))
for (var A = [], D = 0; D < 256; ++D) A[D] = (D + 256).toString(16).substr(1)
function N(e) {
  var t = getCurrentPages().find(function (t) {
    return t.$page.id === e
  })
  if (!t) throw Error('page[' + e + '] not found')
  var n = t.$vm._$weex
  return n.document.__$weex__ || (n.document.__$weex__ = n), n.document
}
var k = {},
  q = {}
;['text', 'image', 'input', 'textarea', 'video', 'web-view', 'slider'].forEach(
  function (e) {
    ;(k[e] = !0), (q['u-' + e] = !0)
  }
)
var j = [
    'movable-view',
    'picker',
    'ad',
    'button',
    'checkbox-group',
    'checkbox',
    'form',
    'icon',
    'label',
    'movable-area',
    'navigator',
    'picker-view-column',
    'picker-view',
    'progress',
    'radio-group',
    'radio',
    'rich-text',
    'u-slider',
    'swiper-item',
    'swiper',
    'switch',
  ],
  R = j.map(function (e) {
    return s(a(e))
  })
function V(e) {
  var t = e.type
  if (q[t]) return t.replace('u-', '')
  var n = e.__vue__ && e.__vue__.$options.name
  return 'USlider' === n ? 'slider' : n && -1 !== R.indexOf(n) ? i(n) : t
}
function L(e) {
  var t = { elementId: e.nodeId, tagName: V(e), nvue: !0 },
    n = e.__vue__
  return (
    n && !n.$options.isReserved && (t.nodeId = n._uid),
    'video' === t.tagName && (t.videoId = t.nodeId),
    t
  )
}
function B(e, t, n) {
  for (var r = e.children, o = 0; o < r.length; o++) {
    var u = r[o]
    if (t(u)) {
      if (!n) return u
      n.push(u)
    }
    if (n) B(u, t, n)
    else {
      var i = B(u, t, n)
      if (i) return i
    }
  }
  return n
}
function H(e, t, n) {
  var r, o
  if (
    (0 === t.indexOf('#')
      ? ((r = t.substr(1)),
        (o = function (e) {
          return e.attr && e.attr.id === r
        }))
      : 0 === t.indexOf('.') &&
        ((r = t.substr(1)),
        (o = function (e) {
          return e.classList && -1 !== e.classList.indexOf(r)
        })),
    o)
  ) {
    var u = B(e, o, n)
    if (!u) throw Error('Node(' + t + ') not exists')
    return u
  }
  if ('body' === t) return Object.assign({}, e, { type: 'page' })
  0 === t.indexOf('uni-') && (t = t.replace('uni-', ''))
  var i = k[t] ? 'u-' + t : t,
    c = -1 !== j.indexOf(i) ? s(a(i)) : '',
    f = B(
      e,
      function (e) {
        return e.type === i || (c && e.__vue__ && e.__vue__.$options.name === c)
      },
      n
    )
  if (!f) throw Error('Node(' + t + ') not exists')
  return f
}
var U = [
  {
    test: function (e) {
      return (
        2 === e.length &&
        -1 !== e.indexOf('document.documentElement.scrollWidth') &&
        -1 !== e.indexOf('document.documentElement.scrollHeight')
      )
    },
    call: function (e) {
      var t = e.__$weex__ || e.ownerDocument.__$weex__
      return new Promise(function (n) {
        'scroll-view' === e.type &&
          1 === e.children.length &&
          (e = e.children[0]),
          t.requireModule('dom').getComponentRect(e.ref, function (e) {
            e.result ? n([e.size.width, e.size.height]) : n([0, 0])
          })
      })
    },
  },
  {
    test: function (e) {
      return 1 === e.length && 'document.documentElement.scrollTop' === e[0]
    },
    call: function (e) {
      var t = e.__$weex__ || e.ownerDocument.__$weex__
      return new Promise(function (n) {
        'scroll-view' === e.type &&
          1 === e.children.length &&
          (e = e.children[0]),
          t.requireModule('dom').getComponentRect(e.ref, function (e) {
            n([(e.size && Math.abs(e.size.top)) || 0])
          })
      })
    },
  },
  {
    test: function (e) {
      return (
        2 === e.length &&
        -1 !== e.indexOf('offsetWidth') &&
        -1 !== e.indexOf('offsetHeight')
      )
    },
    call: function (e) {
      var t = e.__$weex__ || e.ownerDocument.__$weex__
      return new Promise(function (n) {
        t.requireModule('dom').getComponentRect(e.ref, function (e) {
          e.result ? n([e.size.width, e.size.height]) : n([0, 0])
        })
      })
    },
  },
  {
    test: function (e, t) {
      return 1 === e.length && 'innerText' === e[0]
    },
    call: function (e) {
      return Promise.resolve([X(e, []).join('')])
    },
  },
]
function X(e, t) {
  return (
    'u-text' === e.type
      ? t.push(e.attr.value)
      : e.pureChildren.map(function (e) {
          return X(e, t)
        }),
    t
  )
}
function W(e) {
  return e.replace(/\n/g, '').replace(/<u-/g, '<').replace(/<\/u-/g, '</')
}
function z(e, t) {
  return 'outer' === t
    ? 'body' === e.role && 'scroll-view' === e.type
      ? '<page>' + W(z(e, 'inner')) + '</page>'
      : W(e.toString())
    : W(
        e.pureChildren
          .map(function (e) {
            return e.toString()
          })
          .join('')
      )
}
var J = {
  input: {
    input: function (e, t) {
      e.setValue(t)
    },
  },
  textarea: {
    input: function (e, t) {
      e.setValue(t)
    },
  },
  'scroll-view': {
    scrollTo: function (e, t, n) {
      e.scrollTo(n)
    },
    scrollTop: function (e) {
      return 0
    },
    scrollLeft: function (e) {
      return 0
    },
    scrollWidth: function (e) {
      return 0
    },
    scrollHeight: function (e) {
      return 0
    },
  },
  swiper: {
    swipeTo: function (e, t) {
      e.__vue__.current = t
    },
  },
  'movable-view': {
    moveTo: function (e, t, n) {
      var r = e.__vue__
      ;(r.x = t), (r.y = n)
    },
  },
  switch: {
    tap: function (e) {
      var t = e.__vue__
      t.checked = !t.checked
    },
  },
  slider: {
    slideTo: function (e, t) {
      e.__vue__.value = t
    },
  },
}
function F(e) {
  return N(e).body
}
var K = {
  getWindow: function (e) {
    return F(e)
  },
  getDocument: function (e) {
    return F(e)
  },
  getEl: function (e, t) {
    var n = N(t).getRef(e)
    if (!n) throw Error('element destroyed')
    return n
  },
  getOffset: function (e) {
    var t = e.__$weex__ || e.ownerDocument.__$weex__
    return new Promise(function (n) {
      t.requireModule('dom').getComponentRect(e.ref, function (e) {
        e.result
          ? n({ left: e.size.left, top: e.size.top })
          : n({ left: 0, top: 0 })
      })
    })
  },
  querySelector: function (e, t) {
    return Promise.resolve(L(H(e, t)))
  },
  querySelectorAll: function (e, t) {
    return Promise.resolve({
      elements: H(e, t, []).map(function (e) {
        return L(e)
      }),
    })
  },
  queryProperties: function (e, t) {
    var n = U.find(function (n) {
      return n.test(t, e)
    })
    return n
      ? n.call(e).then(function (e) {
          return { properties: e }
        })
      : Promise.resolve({
          properties: t.map(function (t) {
            return d(e, t)
          }),
        })
  },
  queryAttributes: function (e, t) {
    var n = e.attr
    return Promise.resolve({
      attributes: t.map(function (t) {
        return 'class' === t
          ? (e.classList || []).join(' ')
          : String(n[t] || n[a(t)] || '')
      }),
    })
  },
  queryStyles: function (e, t) {
    var n = e.style
    return Promise.resolve({
      styles: t.map(function (e) {
        return n[e]
      }),
    })
  },
  queryHTML: function (e, t) {
    return Promise.resolve({ html: z(e, t) })
  },
  dispatchTapEvent: function (e) {
    return (
      e.fireEvent(
        'click',
        { timeStamp: Date.now(), target: e, currentTarget: e },
        !0
      ),
      Promise.resolve()
    )
  },
  dispatchLongpressEvent: function (e) {
    return (
      e.fireEvent(
        'longpress',
        { timeStamp: Date.now(), target: e, currentTarget: e },
        !0
      ),
      Promise.resolve()
    )
  },
  dispatchTouchEvent: function (e, t, n) {
    return (
      n || (n = {}),
      n.touches || (n.touches = []),
      n.changedTouches || (n.changedTouches = []),
      n.touches.length || n.touches.push({ identifier: Date.now(), target: e }),
      e.fireEvent(
        t,
        Object.assign(
          { timeStamp: Date.now(), target: e, currentTarget: e },
          n
        ),
        !0
      ),
      Promise.resolve()
    )
  },
  callFunction: function (e, t, n) {
    var r = d(J, t)
    return r
      ? Promise.resolve({ result: r.apply(null, M([e], n)) })
      : Promise.reject(Error(t + ' not exists'))
  },
  triggerEvent: function (e, t, n) {
    var r = e.__vue__
    return (
      r
        ? r.$trigger && r.$trigger(t, {}, n)
        : e.fireEvent(
            t,
            { timeStamp: Date.now(), target: e, currentTarget: e },
            !1,
            { params: [{ detail: n }] }
          ),
      Promise.resolve()
    )
  },
}
var Q = {}
Object.keys($).forEach(function (e) {
  Q['App.' + e] = $[e]
}),
  Object.keys(b).forEach(function (e) {
    Q['Page.' + e] = b[e]
  }),
  Object.keys(C).forEach(function (e) {
    Q['Element.' + e] = C[e]
  })
var Y,
  Z,
  G,
  ee = process.env.UNI_AUTOMATOR_WS_ENDPOINT
function te(e) {
  G.send({ data: JSON.stringify(e) })
}
function ne(e) {
  var t = JSON.parse(e.data),
    n = t.id,
    r = t.method,
    o = t.params,
    u = { id: n },
    i = Q[r]
  if (!i) {
    if (Z) {
      var c = Z(n, r, o, u)
      if (!0 === c) return
      i = c
    }
    if (!i) return (u.error = { message: r + ' unimplemented' }), te(u)
  }
  try {
    i(o)
      .then(function (e) {
        e && (u.result = e)
      })
      .catch(function (e) {
        u.error = { message: e.message }
      })
      .finally(function () {
        te(u)
      })
  } catch (e) {
    ;(u.error = { message: e.message }), te(u)
  }
}
;(Z = function (e, t, n, r) {
  var o = n.pageId,
    u = (function (e) {
      var t = getCurrentPages()
      if (!e) return t[t.length - 1]
      return t.find(function (t) {
        return t.$page.id === e
      })
    })(o)
  return u
    ? !u.$page.meta.isNVue
      ? (UniServiceJSBridge.publishHandler(
          'sendAutoMessage',
          { id: e, method: t, params: n },
          o
        ),
        !0)
      : (Y ||
          (Y = Object.assign(
            {},
            (function (e) {
              return {
                'Page.getElement': function (t) {
                  return e.querySelector(e.getDocument(t.pageId), t.selector)
                },
                'Page.getElements': function (t) {
                  return e.querySelectorAll(e.getDocument(t.pageId), t.selector)
                },
                'Page.getWindowProperties': function (t) {
                  return e.queryProperties(e.getWindow(t.pageId), t.names)
                },
              }
            })(K),
            (function (e) {
              var t = function (t) {
                return e.getEl(t.elementId, t.pageId)
              }
              return {
                'Element.getElement': function (n) {
                  return e.querySelector(t(n), n.selector)
                },
                'Element.getElements': function (n) {
                  return e.querySelectorAll(t(n), n.selector)
                },
                'Element.getDOMProperties': function (n) {
                  return e.queryProperties(t(n), n.names)
                },
                'Element.getProperties': function (n) {
                  var r = t(n),
                    o = r.__vue__ || r.attr || {}
                  return e.queryProperties(o, n.names)
                },
                'Element.getOffset': function (n) {
                  return e.getOffset(t(n))
                },
                'Element.getAttributes': function (n) {
                  return e.queryAttributes(t(n), n.names)
                },
                'Element.getStyles': function (n) {
                  return e.queryStyles(t(n), n.names)
                },
                'Element.getHTML': function (n) {
                  return e.queryHTML(t(n), n.type)
                },
                'Element.tap': function (n) {
                  return e.dispatchTapEvent(t(n))
                },
                'Element.longpress': function (n) {
                  return e.dispatchLongpressEvent(t(n))
                },
                'Element.touchstart': function (n) {
                  return e.dispatchTouchEvent(t(n), 'touchstart', n)
                },
                'Element.touchmove': function (n) {
                  return e.dispatchTouchEvent(t(n), 'touchmove', n)
                },
                'Element.touchend': function (n) {
                  return e.dispatchTouchEvent(t(n), 'touchend', n)
                },
                'Element.callFunction': function (n) {
                  return e.callFunction(t(n), n.functionName, n.args)
                },
                'Element.triggerEvent': function (n) {
                  return e.triggerEvent(t(n), n.type, n.detail)
                },
              }
            })(K)
          )),
        Y[t])
    : ((r.error = { message: 'page[' + o + '] not exists' }), te(r), !0)
}),
  UniServiceJSBridge.subscribe('onAutoMessageReceive', function (e) {
    te(e)
  }),
  setTimeout(function () {
    var e
    void 0 === e && (e = {}),
      (G = uni.connectSocket({ url: ee, complete: function () {} })).onMessage(
        ne
      ),
      G.onOpen(function (t) {
        e.success && e.success(), console.log('已开启自动化测试...')
      }),
      G.onError(function (e) {
        console.log('automator.onError', e)
      }),
      G.onClose(function () {
        e.fail && e.fail({ errMsg: '$$initRuntimeAutomator:fail' }),
          console.log('automator.onClose')
      })
  }, 500)
