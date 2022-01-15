const fs = require('fs')
const path = require('path')
const colors = require('picocolors')

const priority = {
  'uni-shared': 100,
  'uni-i18n': 90,
  'uni-app': 90,
  'uni-cli-shared': 80,
  'uni-stat': 75,
  'uni-mp-vue': 75,
  'uni-mp-alipay': 70,
  'uni-mp-baidu': 70,
  'uni-mp-kuaishou': 70,
  'uni-mp-qq': 70,
  'uni-mp-lark': 70,
  'uni-mp-toutiao': 70,
  'uni-mp-weixin': 70,
  'uni-quickapp-webview': 70,
  'uni-cli-nvue': 55,
  'uni-h5': 50,
  'uni-h5-vite': 40,
  'uni-mp-compiler': 40,
  'uni-mp-vite': 35,
  'uni-app-vue': 35,
  'uni-app-plus': 30,
  'uni-app-vite': 30,
  'vite-plugin-uni': 20,
  'uni-cloud': 10,
  'uni-automator': 10,
  'size-check': 1,
}

exports.priority = priority

const targets = (exports.targets = fs.readdirSync('packages').filter((f) => {
  if (!fs.statSync(`packages/${f}`).isDirectory()) {
    return false
  }
  try {
    return (
      fs.existsSync(path.resolve(__dirname, `../packages/${f}/build.json`)) ||
      fs.existsSync(
        path.resolve(__dirname, `../packages/${f}/vite.config.ts`)
      ) ||
      fs.existsSync(path.resolve(__dirname, `../packages/${f}/tsconfig.json`))
    )
  } catch (e) {}
  return false
})).sort((a, b) => priority[b] - priority[a])
exports.fuzzyMatchTarget = (partialTargets, includeAllMatching) => {
  const matched = []
  partialTargets.forEach((partialTarget) => {
    for (const target of targets) {
      if (target.match(partialTarget)) {
        matched.push(target)
        if (!includeAllMatching) {
          break
        }
      }
    }
  })
  if (matched.length) {
    return matched.sort((a, b) => priority[b] - priority[a])
  } else {
    console.log()
    console.error(
      `  ${colors.bgRed.white(' ERROR ')} ${colors.red(
        `Target ${colors.underline(partialTargets)} not found!`
      )}`
    )
    console.log()

    process.exit(1)
  }
}

exports.resolvePackages = (dirname) => {
  dirname = path.resolve(__dirname, dirname)
  return fs
    .readdirSync(dirname)
    .filter(
      (p) =>
        !p.endsWith('.ts') &&
        !p.startsWith('.') &&
        fs.existsSync(path.join(dirname, p, 'package.json'))
    )
}
