const SLIDER_PREV = "SLIDER_PREV"
const SLIDER_NEXT = "SLIDER_NEXT"
const SLIDER_GOTO = "SLIDER_GOTO"
const SLIDER_BEFORE_CHANGE = "SLIDER_MOVING"

export const prev = () => dispatch => {

  dispatch({
    type: SLIDER_PREV
  })

}

export const next = () => dispatch => {

  dispatch({
    type: SLIDER_NEXT
  })

}

export const beforeChange = (prev, next) => dispatch => {

  dispatch({
    type: SLIDER_BEFORE_CHANGE,
    indexes: [prev, next]
  })

}

export const goTo = index => dispatch => {

  dispatch({
    type: SLIDER_GOTO,
    index
  })

}