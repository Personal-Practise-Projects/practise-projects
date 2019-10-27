import React, {useRef, useEffect} from "react";
import {TweenMax, Linear} from 'gsap';

import '../App.css';
import logo from "../logo.svg";

export default function GSAPHook() {

	let logoElement = useRef(null);

	useEffect(() => {
		console.log(logoElement.current);
		TweenMax.to(
			logoElement.current,
			6,
			{
				repeat: -1,
				rotation: 360,
				ease: Linear.easeNone
			}
		)
	},[]);

	const scaleUp = () => {
		console.log('scaleUp');
		TweenMax.to(logoElement.current, 1, {
			scale: 1.25,
			ease: Linear.ease
		});
	}

	const scaleDown = () => {
		console.log('scaleDown');
		TweenMax.to(logoElement.current, 1, {
			scale: 0.75
		});
	}


	return (
		<div className="App">
			<header className="App-header">
				<img
					ref={logoElement}
					src={logo}
					className="App-logo"
					alt="logo"
					onMouseEnter={scaleUp}
					onMouseLeave={scaleDown}
				/>
			</header>
		</div>
	);
}
