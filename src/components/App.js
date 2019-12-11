import React, { Component } from "react"
import { connect } from "react-redux"
import styled from "styled-components"
import background from "../images/background.png"
import Timer from "./Timer"
import { restart } from "../actions/timer"
import PageSlider from "./PageSlider"
import Menu from "./Menu"
import Nav from "./Nav"

const {
	ipcRenderer
} = require("electron")

const MenuBtn = styled.div`
	position:absolute;
	width: 20%
	height: 10%;
	bottom: 0;
	right:0;
`

export class App extends Component {
	state = {
		menuActive: false,
		navActive: false,
		fromNav: false,
		resetPuzzle: false,
		sections: [
			{
				id: 1,
				name: "Disease Course Over Time",
				pages: [
					{
						name: "Disease Course Over Time Title Page",
						active: true
					},
					{
						name: "Disease Course",
						active: false
					},
					{
						name: "Organ Damage",
						active: false
					},
					{
						name: "Early Organ Damage as a Predictor of Mortality",
						active: false
					},
					{
						name: "Disease Course Over Time Thank You Page",
						active: false
					}
				],
				sectionAactive: false
			},
			{
				id: 2,
				name: "Complexity of disease",
				pages: [
					{
						name: "Complexity of disease Title Page",
						active: true
					},
					{
						name:
							"Multiple Elements of the Immune System Are Involved in SLE Pathogenesis 1",
						active: false
					},
					{
						name:
							"Multiple Elements of the Immune System Are Involved in SLE Pathogenesis 2",
						active: false
					},
					{
						name: "Crosstalk Between Innate and Adaptive Systems",
						active: false,
						popups: [
							{
								name: "Adaptive Immune System",
								width: 520,
								position: [746, 258],
								buttonPosition: [728, 241],
								active: false
							},
							{
								name: "Innate Immune System",
								width: 520,
								position: [928, 262],
								buttonPosition: [1335, 244],
								active: false
							},
							{
								name: "IFNa",
								width: 520,
								position: [1010, 676],
								buttonPosition: [990, 663],
								active: false
							}
						]
					},
					{
						name: "Type 1 IFNs Play a Central Role in SLE Pathogenesis",
						active: false,
						popups: [
							{
								name: "Adaptive Immune System",
								width: 520,
								position: [1064, 137],
								buttonPosition: [1044, 120],
								active: false
							},
							{
								name: "Type 1 IFN",
								width: 520,
								position: [1024, 442],
								buttonPosition: [1002, 424],
								active: false
							},
							{
								name: "B cell",
								width: 520,
								position: [1353, 582],
								buttonPosition: [1336, 565],
								active: false
							}
						]
					},
					{
						name: "Complexity of disease Thank You Page",
						active: false
					}
				],
				active: false
			},
			{
				id: 3,
				name: "Role of Type 1 Interferon",
				pages: [
					{
						name: "Role of Type 1 Interferon Title Page",
						active: true
					},
					{
						name: "The Puzzle of SLE Pathogenesis ... Connecting the Pieces",
						puzzle: true,
						active: false
					},
					{
						name: "Role of Type 1 Interferon Thank You Page",
						active: false
					}
				],
				active: false
			}
		]
	}

	onMenuButtonClick = id => {
		let newState = { ...this.state }

		newState.menuActive = false

		newState.fromNav = false

		newState.navActive = true

		newState.sections[id - 1].active = true

		if (window && window.process && window.process.type) {
			ipcRenderer.send("logData", { name: newState.sections[id - 1].pages[0].name})
		}

		this.setState(newState)
	}

	onNavMenuClick = id => {
		let newState = { ...this.state }

		newState.menuActive = false

		newState.fromNav = true

		newState.resetPuzzle = true

		newState.sections.forEach(section => {
			section.active = section.id === id

			section.pages.forEach((page, i) => {
				page.popups && page.popups.forEach(popup => (popup.active = false))
			})
		})

		if (window && window.process && window.process.type) {
			ipcRenderer.send("logData", { name:	newState.sections[id - 1].pages[0].name})
		}

		this.setState(newState)
	}

	onBeforeChange = (prev, next) => {
		if (prev !== next) {
			let newState = { ...this.state }

			newState.fromNav = false

			newState.sections.forEach((section, s) => {
				section.active &&
					section.pages.forEach((page, p) => {
						if (p === prev) {
							page.active = false
							if (page.puzzle) {
								newState.resetPuzzle = true
							} else {
								newState.resetPuzzle = false
							}
						}

						if (p === next) {
							page.active = true

							if (window && window.process && window.process.type) {
								ipcRenderer.send("logData", { name: page.name })
							}
						}

						page.popups && page.popups.forEach(popup => (popup.active = false))
					})
			})

			this.setState(newState)
		}
	}

	openPopup = id => {
		let { sections } = this.state

		sections
			.filter(section => section.active)[0]
			.pages.filter(page => page.active)[0]
			.popups.forEach((popup, i) => {

				popup.active = i === id

				if(popup.active){

					if (window && window.process && window.process.type) {
						ipcRenderer.send("logData", { name: popup.name })
					}

				}

			})

		this.setState({ sections })
	}

	closePopup = id => {
		let { sections } = this.state

		sections
			.filter(section => section.active)[0]
			.pages.filter(page => page.active)[0].popups[id].active = false

		this.setState({ sections })
	}

	backToMenu = () => {
		let newState = { ...this.state }

		newState.menuActive = true

		newState.navActive = false

		newState.fromNav = false

		newState.resetPuzzle = true

		newState.sections.forEach(section => {
			section.active = false

			section.pages.forEach((page, i) => {
				page.popups && page.popups.forEach(popup => (popup.active = false))
			})
		})

		this.setState(newState)

		if (window && window.process && window.process.type) {
			ipcRenderer.send("logData", { name: "Menu Screen" })
		}
	}

	screensaver = () => {
		let newState = { ...this.state }

		newState.menuActive = false

		newState.navActive = false

		newState.fromNav = false

		newState.resetPuzzle = true

		newState.sections.forEach(section => {
			section.active = false

			section.pages.forEach((page, i) => {
				page.popups && page.popups.forEach(popup => (popup.active = false))
			})
		})

		this.setState(newState)

		if (window && window.process && window.process.type) {
			ipcRenderer.send("logData", { name: "Holding Screen", appStart: false, timeout: true })
		}
	}

	componentDidMount() {
		if (window && window.process && window.process.type) {
			let items = [
				{
					name: "Holding Screen",
					holding: true
				},
				{
					name: "Menu Screen"
				}
			]

			this.state.sections.forEach(section => {
				section.pages &&
					section.pages.forEach(page => {
						items.push({ name: page.name })

						page.popups && page.popups.forEach(popup => {
							items.push({ name: popup.name })
						})

					})
			})

			ipcRenderer.send("constructLog", {showName:"ACR19", items })
		}
	}

	render() {
		return (
			<div className="aspect-ratio ar169">
				<Timer screensaver={this.screensaver} backToMenu={this.backToMenu}>
					<div className="content">
						<img src={background} alt="" className="background" />
						<Menu
							active={this.state.menuActive}
							onMenuButtonClick={this.onMenuButtonClick}
						/>
						{this.state.sections.map(section => (
							<PageSlider
								key={section.id}
								{...section}
								onBeforeChange={this.onBeforeChange}
								onSwipe={this.props.restart}
								openPopup={this.openPopup}
								closePopup={this.closePopup}
								onMenu={this.state.menuActive || this.state.fromNav}
								resetPuzzle={this.state.resetPuzzle}
							/>
						))}
						<MenuBtn onClick={this.backToMenu} />
						<Nav
							active={this.state.navActive}
							sectionActive={
								this.state.sections.filter(section => section.active).length > 0
									? this.state.sections.filter(section => section.active)[0].id
									: null
							}
							onNavMenuClick={this.onNavMenuClick}
						/>
					</div>
				</Timer>
			</div>
		)
	}
}

const mapStateToProps = state => {
	const { timer } = state
	return { timer: timer }
}

export default connect(
	mapStateToProps,
	{ restart }
)(App)
