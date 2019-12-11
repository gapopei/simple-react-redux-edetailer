import React, { Component } from "react"
import styled from "styled-components"
import menuBg from "./images/circles.png"
import menuBtn1 from "./images/btn1.png"
import menuBtn2 from "./images/btn2.png"
import menuBtn3 from "./images/btn3.png"

const MenuWrapper = styled.div(props => ({
	width: "100vw",
	height: "100vh",
	position: "absolute",
	top: 0,
	left: 0,
	visibility: `${props.active ? "visible" : "hidden"}`,
	opacity: `${props.active ? 1 : 0}`,
	transition: `all ${props.active ? 0.5 : 0}s`,
	transitionDelay: `${props.active ? 0.25 : 0}s`
}))

const MenuBackground = styled.img`
	width: 100vw;
	height: 100vh;
`

const MenuBtn = styled.img(props => ({
	position: "absolute",
	width: 523,
	height: "auto",
	top: props.top,
	left: 1133,
	visibility: `${props.active ? "visible" : "hidden"}`,
	opacity: `${props.active ? 1 : 0}`,
	transition: `all ${props.active ? 0.5 : 0}s`,
	transitionDelay: `${props.active ? 0.5 + 0.25 * props.id : 0}s`
}))

export default class Menu extends Component {
	state = {
		buttons: [
			{
				id: 1,
				src: menuBtn1,
				top: 309
			},
			{
				id: 2,
				src: menuBtn2,
				top: 492
			},
			{
				id: 3,
				src: menuBtn3,
				top: 675
			}
		]
	}

	render() {
		return (
			<MenuWrapper active={this.props.active}>
				<MenuBackground src={menuBg} />
				{this.state.buttons.map((btn, i) => (
					<MenuBtn
						key={btn.id}
						active={this.props.active}
						{...btn}
						onClick={e => this.props.onMenuButtonClick(i + 1)}
					/>
				))}
			</MenuWrapper>
		)
	}
}
