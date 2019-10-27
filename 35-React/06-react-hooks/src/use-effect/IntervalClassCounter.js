import React, {Component} from 'react';

class IntervalClassCounter extends Component {
	constructor(props) {
		super(props);
		this.state = {
			count: 0
		}
	}

	componentDidMount() {
		this.interval = setInterval(this.tick, 1000);
	}

	tick = () => {
		this.setState({
			count: this.state.count + 1
		})
	}

	render() {
		return (
			<div>
				<h1>{this.state.count}</h1>
			</div>
		);
	}

	componentWillUnmount() {
		clearInterval(this.interval);
	}
}

export default IntervalClassCounter;
