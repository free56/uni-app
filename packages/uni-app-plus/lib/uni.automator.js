'use strict'
function t(t) {
  return t && 'object' == typeof t && 'default' in t ? t.default : t
}
var e = t(require('fs')),
  s = t(require('debug')),
  i = t(require('postcss-selector-parser')),
  r = t(require('fs-extra')),
  a = t(require('licia/dateFormat')),
  n = require('path'),
  o = require('util')
require('address'),
  require('default-gateway'),
  require('licia/isStr'),
  require('licia/getPort')
s('automator:devtool')
function l(t) {
  t.walk((t) => {
    if ('tag' === t.type) {
      const e = t.value
      t.value = 'page' === e ? 'body' : 'uni-' + e
    }
  })
}
const c = [
  'Page.getElement',
  'Page.getElements',
  'Element.getElement',
  'Element.getElements',
]
require('qrcode-terminal'), require('qrcode-reader')
const h = /^win/.test(process.platform),
  u = s('automator:launcher'),
  d = o.promisify(e.readdir),
  p = o.promisify(e.stat)
class m {
  constructor(t) {
    ;(this.id = t.id),
      (this.app = t.executablePath),
      (this.appid = t.appid || 'HBuilder'),
      (this.package = t.package || 'io.dcloud.HBuilder')
  }
  shouldPush() {
    return this.exists(this.FILE_APP_SERVICE)
      .then(
        () => (
          u(`${a('yyyy-mm-dd HH:MM:ss:l')} ${this.FILE_APP_SERVICE} exists`), !1
        )
      )
      .catch(
        () => (
          u(
            `${a('yyyy-mm-dd HH:MM:ss:l')} ${this.FILE_APP_SERVICE} not exists`
          ),
          !0
        )
      )
  }
  push(t) {
    return (async function t(e) {
      const s = await d(e)
      return (
        await Promise.all(
          s.map(async (s) => {
            const i = n.resolve(e, s)
            return (await p(i)).isDirectory() ? t(i) : i
          })
        )
      ).reduce((t, e) => t.concat(e), [])
    })(t)
      .then((e) => {
        const s = e.map((e) => {
          const s = ((t) => (h ? t.replace(/\\/g, '/') : t))(
            n.join(this.DIR_WWW, n.relative(t, e))
          )
          return (
            u(`${a('yyyy-mm-dd HH:MM:ss:l')} push ${e} ${s}`),
            this.pushFile(e, s)
          )
        })
        return Promise.all(s)
      })
      .then((t) => !0)
  }
  get FILE_APP_SERVICE() {
    return this.DIR_WWW + '/app-service.js'
  }
}
const y = s('automator:simctl')
function f(t) {
  const e = parseInt(t)
  return e > 9 ? String(e) : '0' + e
}
class g extends m {
  constructor() {
    super(...arguments), (this.bundleVersion = '')
  }
  async init() {
    const t = require('node-simctl').Simctl
    this.tool = new t({ udid: this.id })
    try {
      await this.tool.bootDevice()
    } catch (t) {}
    await this.initSDCard(), y(`${a('yyyy-mm-dd HH:MM:ss:l')} init ${this.id}`)
  }
  async initSDCard() {
    const t = await this.tool.appInfo(this.package)
    y(`${a('yyyy-mm-dd HH:MM:ss:l')} appInfo ${t}`)
    const e = t.match(/DataContainer\s+=\s+"(.*)"/)
    if (!e) return Promise.resolve('')
    const s = t.match(/CFBundleVersion\s+=\s+(.*);/)
    if (!s) return Promise.resolve('')
    ;(this.sdcard = e[1].replace('file:', '')),
      (this.bundleVersion = s[1]),
      y(`${a('yyyy-mm-dd HH:MM:ss:l')} install ${this.sdcard}`)
  }
  async version() {
    return Promise.resolve(this.bundleVersion)
  }
  formatVersion(t) {
    const e = t.split('.')
    return 3 !== e.length ? t : e[0] + f(e[1]) + f(e[2])
  }
  async install() {
    return (
      y(`${a('yyyy-mm-dd HH:MM:ss:l')} install ${this.app}`),
      await this.tool.installApp(this.app),
      await this.tool.grantPermission(this.package, 'all'),
      await this.initSDCard(),
      Promise.resolve(!0)
    )
  }
  async start() {
    try {
      await this.tool.terminateApp(this.package),
        await this.tool.launchApp(this.package)
    } catch (t) {}
    return Promise.resolve(!0)
  }
  async exit() {
    return (
      await this.tool.terminateApp(this.package),
      await this.tool.shutdownDevice(),
      Promise.resolve(!0)
    )
  }
  async captureScreenshot() {
    return Promise.resolve(await this.tool.getScreenshot())
  }
  exists(t) {
    return r.existsSync(t)
      ? Promise.resolve(!0)
      : Promise.reject(Error(t + ' not exists'))
  }
  pushFile(t, e) {
    return Promise.resolve(r.copySync(t, e))
  }
  get DIR_WWW() {
    return `${this.sdcard}/Documents/Pandora/apps/${this.appid}/www/`
  }
}
const w = require('adbkit'),
  M = s('automator:adb')
class P extends m {
  async init() {
    if (((this.tool = w.createClient()), !this.id)) {
      const t = await this.tool.listDevices()
      if (!t.length) throw Error('Device not found')
      this.id = t[0].id
    }
    ;(this.sdcard = (await this.shell(this.COMMAND_EXTERNAL)).trim()),
      M(`${a('yyyy-mm-dd HH:MM:ss:l')} init ${this.id} ${this.sdcard}`)
  }
  version() {
    return this.shell(this.COMMAND_VERSION).then((t) => {
      const e = t.match(/versionName=(.*)/)
      return e && e.length > 1 ? e[1] : ''
    })
  }
  formatVersion(t) {
    return t
  }
  async install() {
    let t = !0
    try {
      const e = (await this.tool.getProperties(this.id))[
        'ro.build.version.release'
      ].split('.')[0]
      parseInt(e) < 6 && (t = !1)
    } catch (t) {}
    if (
      (M(`${a('yyyy-mm-dd HH:MM:ss:l')} install ${this.app} permission=${t}`),
      t)
    ) {
      const t = require('adbkit/lib/adb/command.js'),
        e = t.prototype._send
      t.prototype._send = function (t) {
        return (
          0 === t.indexOf('shell:pm install -r ') &&
            ((t = t.replace('shell:pm install -r ', 'shell:pm install -r -g ')),
            M(`${a('yyyy-mm-dd HH:MM:ss:l')} ${t} `)),
          e.call(this, t)
        )
      }
    }
    return this.tool.install(this.id, this.app).then(() => this.init())
  }
  start() {
    return this.exit().then(() => this.shell(this.COMMAND_START))
  }
  exit() {
    return this.shell(this.COMMAND_STOP)
  }
  captureScreenshot() {
    return this.tool.screencap(this.id).then(
      (t) =>
        new Promise((e) => {
          const s = []
          t.on('data', function (t) {
            s.push(t)
          }),
            t.on('end', function () {
              e(Buffer.concat(s).toString('base64'))
            })
        })
    )
  }
  exists(t) {
    return this.tool.stat(this.id, t)
  }
  pushFile(t, e) {
    return this.tool.push(this.id, t, e)
  }
  shell(t) {
    return (
      M(`${a('yyyy-mm-dd HH:MM:ss:l')} SEND ► ${t}`),
      this.tool
        .shell(this.id, t)
        .then(w.util.readAll)
        .then((t) => {
          const e = t.toString()
          return M(`${a('yyyy-mm-dd HH:MM:ss:l')} ◀ RECV ${e}`), e
        })
    )
  }
  get DIR_WWW() {
    return `${this.sdcard}/Android/data/${this.package}/apps/${this.appid}/www`
  }
  get COMMAND_EXTERNAL() {
    return 'echo $EXTERNAL_STORAGE'
  }
  get COMMAND_VERSION() {
    return 'dumpsys package ' + this.package
  }
  get COMMAND_STOP() {
    return 'am force-stop ' + this.package
  }
  get COMMAND_START() {
    return `am start -n ${this.package}/io.dcloud.PandoraEntry --es ${this.appid} --ez needUpdateApp false --ez reload true`
  }
}
const v = s('automator:devtool')
let E,
  $ = !1
const S = { android: /android_version=(.*)/, ios: /iphone_version=(.*)/ }
const A = {
  'Tool.close': { reflect: async () => {} },
  'App.exit': { reflect: async () => E.exit() },
  'App.enableLog': { reflect: () => Promise.resolve() },
  'App.captureScreenshot': {
    reflect: async (t, e) => {
      const s = await E.captureScreenshot(e)
      return v('App.captureScreenshot ' + s.length), { data: s }
    },
  },
}
!(function (t) {
  c.forEach((e) => {
    t[e] = (function (t) {
      return {
        reflect: async (e, s) => e(t, s, !1),
        params: (t) => (
          t.selector && (t.selector = i(l).processSync(t.selector)), t
        ),
      }
    })(e)
  })
})(A)
const _ = {
  devtools: {
    name: 'App',
    paths: [],
    required: ['manifest.json', 'app-service.js'],
    validate: async function (t, s) {
      ;(t.platform = (
        t.platform || process.env.UNI_OS_NAME
      ).toLocaleLowerCase()),
        Object.assign(t, t[t.platform]),
        (E = (function (t, e) {
          return 'ios' === t ? new g(e) : new P(e)
        })(t.platform, t)),
        await E.init()
      const i = await E.version()
      if (i) {
        if (t.version) {
          const s = E.formatVersion(
            (function (t, s) {
              if (t.endsWith('.txt'))
                try {
                  const i = e.readFileSync(t).toString().match(S[s])
                  if (i) return i[1]
                } catch (t) {
                  console.error(t)
                }
              return t
            })(t.version, t.platform)
          )
          v('version: ' + i), v('newVersion: ' + s), s !== i && ($ = !0)
        }
      } else $ = !0
      if ($) {
        if (!t.executablePath)
          throw Error(`app-plus->${t.platform}->executablePath is not provided`)
        if (!e.existsSync(t.executablePath))
          throw Error(t.executablePath + ' not exists')
      }
      return t
    },
    create: async function (t, e, s) {
      $ && (await E.install()),
        ($ || s.compiled || (await E.shouldPush())) && (await E.push(t)),
        await E.start()
    },
  },
  adapter: A,
}
module.exports = _
