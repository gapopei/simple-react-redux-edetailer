import React, { Component } from "react"
import { connect } from "react-redux"
import * as actionCreators from "../actions/timer"
import styled from "styled-components"
const {
	ipcRenderer
} = require("electron")

const Wrapper = styled.div`
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
`

const StyledVideo = styled.video(props => ({
	position: "absolute",
	top: 0,
	left: 0,
	width: "100%",
	height: "100%",
	visibility: `${props.visible ? "visible" : "hidden"}`,
	opacity: `${props.visible ? 1 : 0}`,
	transition: "all 0.5s"
}))

export class Timer extends Component {
	vidRef = React.createRef()

	handleClick = () => {
		if (this.props.isOn) {
			this.props.restart()
		} else {
      this.props.start()
      this.props.backToMenu()
      this.vidRef.current.pause()
      this.vidRef.current.currentTime = 0
		}
	}

	componentDidMount() {
		this.vidRef.current.play()
		if (window && window.process && window.process.type) {
			ipcRenderer.send("logData", { name: "Holding Screen", appStart: true, timeout: false })
		}
	}

	componentDidUpdate() {
		if (this.props.counter <= 0) {
      this.props.screensaver()
      this.props.stop()
      this.vidRef.current.play()
    }
	}

	render() {
		return (
			<Wrapper onClick={this.handleClick}>
				{this.props.children}
				<StyledVideo loop ref={this.vidRef} visible={!this.props.isOn}>
					<source src={"videos/screensaver.mp4"}></source>
				</StyledVideo>
			</Wrapper>
		)
	}
}

const mapStateToProps = state => {
	const { timer } = state
	return timer
}

export default connect(
	mapStateToProps,
	actionCreators
)(Timer)
