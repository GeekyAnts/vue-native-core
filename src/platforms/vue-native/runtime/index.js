import Vue from 'core/index'

import { lifeCycleMixin } from './lifeCycle'
import { renderMixin } from './render'

lifeCycleMixin(Vue)
renderMixin(Vue)

export default Vue
