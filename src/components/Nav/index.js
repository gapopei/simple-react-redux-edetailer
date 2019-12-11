import React, { Component } from "react"
import styled from "styled-components"
import navBtn from "./images/menu_btn.png"
import navBtnSelected from "./images/menu_btn_selected.png"
import menuBtn1 from "./images/btn1.png"
import menuBtn1Selected from "./images/btn1_selected.png"
import menuBtn2 from "./images/btn2.png"
import menuBtn2Selected from "./images/btn2_selected.png"
import menuBtn3 from "./images/btn3.png"
import menuBtn3Selected from "./images/btn3_selected.png"

const Wrapper = styled.div`
  width:100vw;
	height:100vh;
`

const Overlay = styled.div(props => ({
	width: "100vw",
	height: "100vh",
	position: "absolute",
	top: 0,
  left: 0,
  background: "rgba(0,0,0,0.5)",
	visibility: `${props.active ? "visible" : "hidden"}`,
	opacity: `${props.active ? 1 : 0}`,
	transition: `all ${props.active ? 0.5 : 0.5}s`,
	zIndex:9999
}))

const NavWrapper = styled.div(props => ({
	width: 897,
	height: 252,
	position: "absolute",
	bottom: 0,
	left: 0,
	visibility: `${props.active ? "visible" : "hidden"}`,
	opacity: `${props.active ? 1 : 0}`,
	transition: `all ${props.active ? 0.5 : 0.5}s`,
	zIndex:99999
}))

const NavBtn = styled.img(props => ({
	width: 250,
	height: "auto",
	position: "absolute",
	bottom: 0,
	left: 0
}))

const NavMenuBtn = styled.img(props => ({
	position: "absolute",
	width: props.bWidth,
	height: "auto",
	bottom: props.active ? 0 : -80,
	left: props.left,
	visibility: `${props.active ? "visible" : "hidden"}`,
	opacity: `${props.active ? 1 : 0}`,
	transition: `all 0.5s`,
	transitionDelay: `${props.active ? 0.25 * props.id : 0}s`
}))

export default class Nav extends Component {

  state = {
    menuActive: false,
		buttons: [
			{
				id: 1,
        src: menuBtn1,
        selectedSrc: menuBtn1Selected,
        left: 238,
        width: 260,
        selected: false
			},
			{
				id: 2,
        src: menuBtn2,
        selectedSrc: menuBtn2Selected,
        left: 454,
        width: 248,
        selected: false
			},
			{
				id: 3,
        src: menuBtn3,
        selectedSrc: menuBtn3Selected,
        left: 657,
        width: 248,
        selected: false
			}
		]
  }
  
  onMenuButtonClick = id => {

    let buttons = [...this.state.buttons]

    buttons.forEach(btn => btn.selected = btn.id === id)

    buttons[id-1].selected = true

    this.props.onNavMenuClick(id)

    this.setState({menuActive: false, buttons})

  }

  toggleNavMenu = () => {

    let buttons = [...this.state.buttons]

    buttons.forEach(btn => btn.selected = btn.id === this.props.sectionActive)

    this.setState({menuActive: !this.state.menuActive, buttons})

  }

	render() {
		return <Wrapper>
      <Overlay active={this.state.menuActive}/>
      <NavWrapper active={this.props.active}>
      <NavBtn src={this.state.menuActive ? navBtnSelected : navBtn} onClick={this.toggleNavMenu}/>
      {this.state.buttons.map((btn, i) => (
					<NavMenuBtn
            key={btn.id}
            src={btn.selected ? btn.selectedSrc : btn.src}
						active={this.state.menuActive}
            id={btn.id}
            left={btn.left}
            bWidth={btn.width}
						onClick={e => this.onMenuButtonClick(btn.id)}
					/>
				))}
    </NavWrapper>
    </Wrapper>
	}
}
