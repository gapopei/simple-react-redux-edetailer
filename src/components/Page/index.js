import React, { Component } from "react"
import styled from "styled-components"
import Puzzle from "../Puzzle"

const PageWrapper = styled.div`
	width: 100vw;
  height: 100vh;
  position:relative;
`

const PageBackground = styled.img`
	width: 100vw;
	height: 100vh;
`

const PopupBtn = styled.div(props => ({
	position: "absolute",
	width: 50,
	height: 50,
	top: props.top - 8,
	left: props.left - 8
}))

const Popup = styled.img(props => ({
  width: props.popupWidth,
  height:"auto",
  position: "absolute",
  top: props.top,
  left: props.left,
	visibility: `${props.active ? "visible" : "hidden"}`,
  opacity: `${props.active ? 1 : 0}`,
  transition: "all 0.5s ease-in-out"
}))

export default class Page extends Component {
	render() {
		return (
			<PageWrapper>
				{this.props.puzzle ? (
					<Puzzle resetPuzzle={this.props.resetPuzzle}/>
				) : (
					<PageBackground
            src={`images/sections/${this.props.sectionId}/${this.props.id}.png`}
            alt="Page background"
					/>
				)}
				{this.props.popups && this.props.popups.map((popup, i) => (
					<PopupBtn
            key={`${this.props.id}_${i}`}
						left={popup.buttonPosition[0]}
            top={popup.buttonPosition[1]}
            onClick={(e) => this.props.openPopup(i)}
					/>
        ))}
        {this.props.popups && this.props.popups.map((popup, i) => (
					<Popup
            src={`images/sections/${this.props.sectionId}/popups/${this.props.id}/${i}.png`}
            alt="Page popup"
            key={`${this.props.id}_${i}`}
            popupWidth={popup.width}
						left={popup.position[0]}
            top={popup.position[1]}
            active={popup.active}
            onClick={(e) => this.props.closePopup(i)}
					/>
				))}
			</PageWrapper>
		)
	}
}
