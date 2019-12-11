export const TIMER_START = "TIMER_START"
export const TIMER_TICK = "TIMER_TICK"
export const TIMER_STOP = "TIMER_STOP"
export const TIMER_RESTART = "TIMER_RESTART"

let timer = null;

export const start = () => dispatch => {
  clearInterval(timer)

  timer = setInterval(() => dispatch(tick()), 1000)

  dispatch({
    type: TIMER_START
  })

}

export const tick = () => ({
  type: TIMER_TICK
})

export const stop = () => dispatch => {

  clearInterval(timer)

  dispatch({
    type: TIMER_STOP
  })

}

export const restart = () => dispatch => {

  dispatch({
    type: TIMER_RESTART
  })

}