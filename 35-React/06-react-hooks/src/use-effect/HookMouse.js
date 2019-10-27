import React, {useState, useEffect} from 'react';


export default function HookMouse() {

	const [x, setX] = useState(0);
	const [y, setY] = useState(0);

	const logMousePosition = e => {
		console.log('logged position');
		setX(e.clientX);
		setY(e.clientY);
	}

	useEffect(() => {
		console.log('useEffect called');
		window.addEventListener('mousemove', logMousePosition)
		return () => {
			console.log('Component unmount code');
			window.removeEventListener('mousemove', logMousePosition);
		};
	}, []);


	return (
		<div>
			X - {x} Y - {y}
		</div>
	);
}
