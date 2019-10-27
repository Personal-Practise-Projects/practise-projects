import React from 'react';

export default class ClassCounter extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			count: 0
		}
	}
	
	styles = {
		backgroundColor: 'palevioletred',
		color: 'papayawhip',
	};

	incrementCounter = () => {
		this.setState({
			count: this.state.count + 1
		})
	}

	render() {
		return (
			<button style={this.styles} onClick={this.incrementCounter}>Count - {this.state.count}</button>
		)
	}

}
