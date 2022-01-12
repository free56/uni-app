import {
  initAppProvide,
  uniHBuilderXConsolePlugin,
  uniViteInjectPlugin,
  UNI_EASYCOM_EXCLUDE,
} from '@dcloudio/uni-cli-shared'

import { uniEasycomPlugin } from '../plugins/easycom'
import { uniManifestJsonPlugin } from '../plugins/manifestJson'
import { uniAppNVuePlugin } from './plugin'
import { uniMainJsPlugin } from './plugins/mainJs'
import { uniPagesJsonPlugin } from './plugins/pagesJson'

export function initNVuePlugins() {
  return [
    uniEasycomPlugin({ exclude: UNI_EASYCOM_EXCLUDE }),
    uniHBuilderXConsolePlugin(),
    uniMainJsPlugin(),
    ...(process.env.UNI_RENDERER === 'native' ? [uniManifestJsonPlugin()] : []),
    uniPagesJsonPlugin(),
    uniViteInjectPlugin('uni:app-inject', initAppProvide()),
    uniAppNVuePlugin(),
  ]
}
