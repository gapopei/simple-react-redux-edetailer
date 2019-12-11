import {
  createReducer
} from "redux-starter-kit"
import {
  TIMER_START,
  TIMER_TICK,
  TIMER_STOP,
  TIMER_RESTART
} from "../actions/timer"

let initialState = {
  defaultTime: 120,
  counter: 120,
  isOn: false
}

const timer = createReducer(initialState, {
  [TIMER_START](state, action) {
    return Object.assign({}, state, {
      isOn: true
    })
  },
  [TIMER_TICK](state, action) {
    return Object.assign({}, state, {
      counter: state.counter - 1
    })
  },
  [TIMER_STOP](state, action) {
    return Object.assign({}, state, {
      isOn: false,
      counter: state.defaultTime ? state.defaultTime : initialState.defaultTime
    })
  },
  [TIMER_RESTART](state, action) {
    return Object.assign({}, state, {
      counter: state.defaultTime ? state.defaultTime : initialState.defaultTime
    })
  }
})

export default timer