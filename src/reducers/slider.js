import { createReducer } from "redux-starter-kit"
import { SLIDER_PREV, SLIDER_NEXT, SLIDER_GOTO, SLIDER_BEFORE_CHANGE } from "../actions/slider"

let initialState = {
	sections: []
}

const slider = createReducer(initialState, {
	[SLIDER_PREV](state, action) {
    let newState = {...state}

		return Object.assign({}, state, {
			isOn: true
		})
	},
	[SLIDER_NEXT](state, action) {
		return Object.assign({}, state, {
			counter: state.counter - 1
		})
	},
	[SLIDER_GOTO](state, action) {
		return Object.assign({}, state, {
			isOn: false,
			counter: state.defaultTime ? state.defaultTime : initialState.defaultTime
		})
  },
  [SLIDER_BEFORE_CHANGE](state, action) {
		return Object.assign({}, state, {
			isOn: false,
			counter: state.defaultTime ? state.defaultTime : initialState.defaultTime
		})
	}
})

export default slider
