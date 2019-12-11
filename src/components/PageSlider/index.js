import React, { Component } from "react"
import Slider from "react-slick"
import prevImg from "./images/prev.png"
import nextImg from "./images/next.png"
import "slick-carousel/slick/slick.css"
// import "slick-carousel/slick/slick-theme.css"
import styled from "styled-components"
import Page from "../Page"

const SliderWrapper = styled.div(props => ({
	width: "100%",
	height: "100%",
	position: "absolute",
	top: 0,
	left: 0,
	background: "rgba(255,255,255,0.01)",
	visibility: `${props.active ? "visible" : "hidden"}`,
	opacity: `${props.active ? 1 : 0}`,
	transition: "all 0.5s"
}))

const SampleNextArrow = props => {
	const { className, style, onClick } = props
	return (
		<div
			className={className}
			style={{
				...style,
				width: 162,
				height: 78,
				right: 0,
				position: "absolute",
				top: "50%",
				display: "block",
				padding: 0,
				transform: "translate(0, -50%)",
				border: 0,
				outline: "none",
				backgroundImage: `url(${nextImg})`,
				visibility: className.includes("disabled") ? "hidden" : "visible",
				opacity: className.includes("disabled") ? 0 : 1,
				transition: "all 0.5s",
				zIndex: 999
			}}
			onClick={onClick}
		/>
	)
}

const SamplePrevArrow = props => {
	const { className, style, onClick } = props
	return (
		<div
			className={className}
			style={{
				...style,
				width: 162,
				height: 78,
				left: 0,
				position: "absolute",
				top: "50%",
				display: "block",
				padding: 0,
				transform: "translate(0, -50%)",
				border: 0,
				outline: "none",
				backgroundImage: `url(${prevImg})`,
				visibility: className.includes("disabled") ? "hidden" : "visible",
				opacity: className.includes("disabled") ? 0 : 1,
				transition: "all 0.5s",
				zIndex: 999
			}}
			onClick={onClick}
		/>
	)
}

export class PageSlider extends Component {
	state = {
		settings: {
			accessibility: false,
			arrows: true,
			dots: false,
			infinite: false,
			speed: 1000,
			slidesToShow: 1,
			slidesToScroll: 1,
			draggable: true,
			touchThreshold: 15,
			swipeToSlide: true,
			nextArrow: <SampleNextArrow />,
			prevArrow: <SamplePrevArrow />
		}
	}

	componentDidUpdate() {
		if (this.props.onMenu) {

			setTimeout(() => {
				this.slider.slickGoTo(0)
			}, 500)
			
		}
	}

	render() {
		return (
			<SliderWrapper active={this.props.active}>
				<Slider
					ref={slider => (this.slider = slider)}
					{...this.state.settings}
					beforeChange={(prev, next) => {
						if (
							this.props.onBeforeChange &&
							typeof this.props.onBeforeChange === "function"
						) {
							this.props.onBeforeChange(prev, next)
						}
					}}
					onSwipe={this.props.onSwipe}
				>
					{this.props.pages.map((page, i) => (
						<Page
							key={`${this.props.id}_${i}`}
							sectionId={this.props.id}
							id={i}
							{...page}
							openPopup={this.props.openPopup}
							closePopup={this.props.closePopup}
							resetPuzzle={this.props.resetPuzzle}
						/>
					))}
				</Slider>
			</SliderWrapper>
		)
	}
}

export default PageSlider
