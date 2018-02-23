import {
  TAB_INDENT,
  CREATE_ELEMENT,
  HELPER_HEADER,
  COMPONENT
} from './constants'

const COMMON = {
  'createElement': {
    name: `${HELPER_HEADER}${CREATE_ELEMENT}`,
    alias: CREATE_ELEMENT
  },
  'component': {
    name: `${HELPER_HEADER}${COMPONENT}`,
    alias: COMPONENT
  },
  'renderSlot': {
    name: `${HELPER_HEADER}renderSlot`,
    value: `${HELPER_HEADER}slotSet`,
    defaultSlot: `${HELPER_HEADER}defaultSlot`,
    slotTag: `${HELPER_HEADER}slotTag`,
    alias: 'renderSlot'
  },
  'template': {
    name: `${HELPER_HEADER}template`,
    type: `${HELPER_HEADER}template`,
    alias: 'template'
  },
  'renderList': {
    name: `${HELPER_HEADER}renderList`,
    alias: 'renderList'
  },
  'toNumber': {
    name: `${HELPER_HEADER}toNumber`,
    alias: 'toNumber'
  },
  'checkKeyCodes': {
    name: `${HELPER_HEADER}checkKeyCodes`,
    alias: 'checkKeyCodes'
  },
  'looseEqual': {
    name: `${HELPER_HEADER}looseEqual`,
    alias: 'looseEqual'
  },
  'looseIndexOf': {
    name: `${HELPER_HEADER}looseIndexOf`,
    alias: 'looseIndexOf'
  },
  'toString': {
    name: `${HELPER_HEADER}toString`,
    alias: '_toString'
  },
  'resolveFilter': {
    name: `${HELPER_HEADER}resolveFilter`,
    alias: 'resolveFilter'
  },
  'event': {
    name: `${HELPER_HEADER}event`,
    alias: 'event'
  },
  'directive': {
    name: `${HELPER_HEADER}buildDirective`,
    alias: 'buildDirective',
    component: `${HELPER_HEADER}directiveComponent`,
    tag: `${HELPER_HEADER}directiveTag`,
    context: `${HELPER_HEADER}directiveContext`
  },
  'dynamicComponent': {
    name: `${HELPER_HEADER}dynamicComponent`,
    alias: 'dynamicComponent'
  },
  'setRef': {
    name: `${HELPER_HEADER}setRef`
  },
  'customEvent': {
    name: `${HELPER_HEADER}customEvent`
  },
  'handleProps': {
    name: `${HELPER_HEADER}handleProps`,
    alias: 'handleProps'
  },
  'mergeProps': {
    name: `${HELPER_HEADER}mergeProps`,
    alias: 'mergeProps'
  }
}

const WEB = {
  'bindClass': {
    name: `${HELPER_HEADER}bindClass`,
    alias: `bindWebClass`
  },
  'bindStyle': {
    name: `${HELPER_HEADER}bindStyle`,
    alias: `bindWebStyle`
  },
  'emptyComponent': {
    name: `${HELPER_HEADER}buildEmptyComponent`,
    alias: 'buildWebEmptyComponent',
    component: `${HELPER_HEADER}EmptyComponent`
  },
  'inputComponent': {
    name: `${HELPER_HEADER}buildInputComponent`,
    alias: 'buildWebInputComponent',
    tag: `${HELPER_HEADER}inputComponentTag`,
    component: `${HELPER_HEADER}InputComponent`
  },
  'transition': {
    name: `${HELPER_HEADER}transition`,
    alias: `buildWebTransition`,
    component: `${HELPER_HEADER}transitionComponent`,
    collection: `${HELPER_HEADER}transitionCollection`
  },
  // unfinished
  'transitionGroup': {
    name: `${HELPER_HEADER}transitionGroup`,
    alias: `buildWebTransitionGroup`,
    component: `${HELPER_HEADER}transitionGroupComponent`,
    collection: `${HELPER_HEADER}transitionGroupCollection`
  }
}

const NATIVE = {
  'bindClass': {
    name: `${HELPER_HEADER}bindClass`,
    alias: `bindNativeClass`
  },
  'bindStyle': {
    name: `${HELPER_HEADER}bindStyle`,
    alias: `bindNativeStyle`
  }
}

export {
  COMMON,
  WEB,
  NATIVE,
  TAB_INDENT,
  CREATE_ELEMENT
}
