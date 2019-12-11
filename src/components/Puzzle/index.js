import React, { Component } from "react"
import styled from "styled-components"
import bgOverlay from "./images/bg-overlay.png"
import unsolvedText from "./images/unsolved-text.png"
import solvedText from "./images/solved-text.png"
import title from "./images/title.png"
import damage from "./images/damage.png"
import damagePopup from "./images/damage-popup.png"
import humoral from "./images/humoral.png"
import humoralPopup from "./images/humoral-popup.png"
import innate from "./images/innate.png"
import innatePopup from "./images/innate-popup.png"
import cell from "./images/cell.png"
import cellPopup from "./images/cell-popup.png"

const Wrapper = styled.div`
  width:100%;
  height:100%;
  background:rgba(255,255,255,0.01);
  background-image:url("${bgOverlay}");
  background-size:contain;
  background-repeat:no-repeat;
  position: relative;
  top: 0;
  left: 0;
`

const Title = styled.img(props => ({
	width: 621,
	position: "absolute",
	top: 62,
	left: 63
}))

const UnsolvedText = styled.img(props => ({
	width: 1247.98,
	position: "absolute",
	top: 198.5,
	left: 63,
	visibility: `${!props.solved && props.visible ? "visible" : "hidden"}`,
	opacity: `${!props.solved && props.visible ? 1 : 0}`,
	transition: "all 1s ease-in-out"
}))

const SolvedText = styled.img(props => ({
	width: 1226,
	position: "absolute",
	top: 350,
	left: 329,
	visibility: `${props.solved && props.visible ? "visible" : "hidden"}`,
	opacity: `${props.solved && props.visible ? 1 : 0}`,
  transition: "all 1s ease-in-out",
  transitionDelay: `${!props.finishedSolving && props.solved ? "2.5s" : "none"}`
}))

const PuzzleWrapper = styled.div(props => ({
	position: "absolute",
	width: 702,
	height: 702,
	top: 233,
	left: 527,
	visibility: `${props.visible ? "visible" : "hidden"}`,
	opacity: `${props.visible ? 1 : 0}`,
	transform: `scale(${props.solved ? 0.7 : 1}) 
    translateX(${props.solved ? -287 : 0}px) 
    translateY(${props.solved ? -15 : 0}px)`,
	transformOrigin: "center left",
	transition: "all 1.5s ease-in-out",
	transitionDelay: `${!props.finishedSolving && props.solved ? "1s" : "none"}`
}))

const PuzzlePiece = styled.img(props => ({
	position: "absolute",
	width: `${props.pieceWidth ? props.pieceWidth : "352"}px`,
	height: `${props.pieceHeight ? props.pieceHeight : "352"}px`,
	transform: `rotate(${props.solved ? "0" : props.angle}deg)
    scale(${props.solved ? "1" : "0.72"}) 
    translateX(${props.solved ? props.solvedLeft : props.left}px) 
    translateY(${props.solved ? props.solvedTop : props.top}px)`,
	transformOrigin: `${
		props.transformOrigin ? props.transformOrigin : "top left"
	}`,
  transition: "all 1s ease-in-out",
  transitionDelay: `${!props.finishedSolving ? "0.5s" : "none"}`
}))

const PopupsWrapper = styled.div(props => ({
	width: 1468,
	height: "auto",
	position: "absolute",
	top: 202,
	left: 229,
	visibility: `${props.visible ? "visible" : "hidden"}`,
	opacity: `${props.visible ? 1 : 0}`,
	transition: "all 1s ease-in-out"
}))

const Popup = styled.img(props => ({
	width: "100%",
	height: "auto",
	position: "absolute",
	top: 0,
	left: 0,
	visibility: `${props.visible ? "visible" : "hidden"}`,
	opacity: `${props.visible ? 1 : 0}`,
	transition: "all 1s ease-in-out"
}))

export default class Puzzle extends Component {
	state = {
		solved: false,
		finishedSolving: false,
		clickable: true,
		popupOpened: false,
		pieces: [
			{
				type: "damage",
				src: damage,
				pieceWidth: 352,
				pieceHeight: 352,
				top: 0,
				solvedTop: 0,
				left: 0,
				solvedLeft: 0,
				angle: -7.7,
				transformOrigin: "bottom left",
				solved: false
			},
			{
				type: "humoral",
				src: humoral,
				pieceWidth: 453,
				pieceHeight: 453,
				top: -26.88,
				solvedTop: 0,
				left: 500.91,
				solvedLeft: 250,
				angle: 19.92,
				transformOrigin: "top right",
				solved: false
			},
			{
				type: "innate",
				src: innate,
				pieceWidth: 454,
				pieceHeight: 454,
				top: 330.97,
				solvedTop: 248,
				left: -59,
				solvedLeft: 0,
				angle: -7.7,
				transformOrigin: "bottom left",
				solved: false
			},
			{
				type: "cell",
				src: cell,
				pieceWidth: 352,
				pieceHeight: 352,
				top: 251.28,
				solvedTop: 350,
				left: 777.08,
				solvedLeft: 351,
				angle: 14.27,
				transformOrigin: "bottom right",
				solved: false
			}
		],
		popups: [
			{
				type: "damage",
				src: damagePopup,
				visible: false
			},
			{
				type: "humoral",
				src: humoralPopup,
				visible: false
			},
			{
				type: "innate",
				src: innatePopup,
				visible: false
			},
			{
				type: "cell",
				src: cellPopup,
				visible: false
			}
		]
	}
	reset = () => {
		let newState = { ...this.state }

		newState.pieces.map(piece => (piece.solved = false))

		newState.solved = false

		newState.popups.map(popup => (popup.visible = false))

		newState.popupOpened = false

    newState.clickable = true
    
		newState.finishedSolving = false

		this.setState(newState)
	}

	toggleClickable = () => {
		this.setState({
			clickable: !this.state.clickable
		})
	}

	handlePieceClick = (e, id) => {
		if (this.state.clickable) {
			this.openPopup(id)
		}
	}

	openPopup = id => {
		let newState = { ...this.state }

		let item = newState.popups[id]

		item.visible = true

		newState.popupOpened = true

		this.setState(newState)
	}

	closePopup = id => {
		let newState = { ...this.state }

		newState.popups.map(popup => (popup.visible = false))

		newState.popupOpened = false

		this.setState(newState)

		if (!newState.pieces[id].solved) {
			setTimeout(() => {
				this.solvePiece(id)
			}, 250)
		}
	}

	solvePiece = id => {
		// console.log(id)

		let newState = { ...this.state }

		let item = newState.pieces[id]

		item.solved = true

		if (
			newState.pieces.filter(piece => piece.solved).length ===
			newState.pieces.length
		) {
      newState.solved = true
      
      setTimeout(() => {
        this.setState({finishedSolving: true})
      }, 1500)
		}

		this.setState(newState)
	}

	handlePopupClick = (e, id) => {
		this.closePopup(id)
	}

	componentDidUpdate() {
		if (this.props.resetPuzzle) {
			setTimeout(() => {
				this.reset()
			}, 250)
		}
	}

	render() {
		return (
			<Wrapper>
				<Title src={title} />
				<UnsolvedText
					src={unsolvedText}
					solved={this.state.solved}
					visible={!this.state.popupOpened}
				/>
				<SolvedText
					src={solvedText}
          solved={this.state.solved}
          finishedSolving={this.state.finishedSolving}
					visible={!this.state.popupOpened}
				/>
				<PuzzleWrapper
          solved={this.state.solved}
          finishedSolving={this.state.finishedSolving}
					visible={!this.state.popupOpened}
					onAnimationEnd={() => this.setState({ finishedSolving: true })}
				>
					{this.state.pieces.map((piece, index) => (
						<PuzzlePiece
							key={index}
              {...piece}
              finishedSolving={this.state.finishedSolving}
							onClick={e => this.handlePieceClick(e, index)}
							onAnimationStart={this.toggleClickable}
							onAnimationEnd={this.toggleClickable}
						/>
					))}
				</PuzzleWrapper>
				<PopupsWrapper
					solved={this.state.solved}
					visible={this.state.popupOpened}
				>
					{this.state.popups.map((popup, index) => (
						<Popup
							solved={this.state.solved}
							key={index}
							{...popup}
							onClick={e => this.handlePopupClick(e, index)}
						/>
					))}
				</PopupsWrapper>
			</Wrapper>
		)
	}
}
