import React from 'react';
import './App.css';

// defaultState is only created here for aesthetic purposes
const defaultState = {
	breakLength: 5,
	sessionLength: 25,
	minutes: 25,
	seconds: 0,
	running: false,
	label: 'Session'
};

// interval is created outside the class for proper handling
let interval;

class Pomodoro extends React.Component {
	state = defaultState;

	handleReset = () => {
		const audio = document.getElementById('beep');
		this.setState(defaultState);
		clearInterval(interval);
		audio.pause();
		audio.currentTime = 0;
	};

	handleBreak = event => {
		const change = event.target.id.split('-')[1];
		const { breakLength } = this.state;
		if (change === 'increment' && breakLength !== 60)
			this.setState({ breakLength: breakLength + 1 });
		else if (change === 'decrement' && breakLength !== 1)
			this.setState({ breakLength: breakLength - 1 });
	};

	handleChange = event => {
		if (!this.state.running) {
			const [id, change] = event.target.id.split('-');
			const stateValue = this.state[id + 'Length'];
			if (change === 'decrement' && stateValue !== 1) {
				this.setState({
					[id + 'Length']: stateValue - 1,
					minutes: stateValue - 1,
					seconds: 0
				});
			} else if (change === 'increment' && stateValue !== 60) {
				this.setState({
					[id + 'Length']: stateValue + 1,
					minutes: stateValue + 1,
					seconds: 0
				});
			}
		}
	};

	handleStartStop = () => {
		if (this.state.running) {
			clearInterval(interval);
			this.setState({ running: false });
		} else {
			this.setState({
				running: true
			});

			interval = setInterval(() => {
				const minutes = this.state.minutes;
				const seconds = this.state.seconds;

				if (minutes === 0 && seconds === 0) {
					document.getElementById('beep').play();
					if (this.state.label === 'Session') {
						this.setState({ label: 'Break', minutes: this.state.breakLength });
					} else if (this.state.label === 'Break') {
						this.setState({
							label: 'Session',
							minutes: this.state.sessionLength
						});
					}
				} else if (!this.state.seconds) {
					this.setState({
						minutes: minutes - 1,
						seconds: 59
					});
				} else this.setState({ seconds: seconds - 1 });
			}, 1000);
		}
	};

	render() {
		const minutes = this.state.minutes.toString().padStart(2, '0');
		const seconds = this.state.seconds.toString().padStart(2, '0');

		return (
			<div className='App'>
				<p>Pomodoro Clock</p>
				<div className='break'>
					<p id='break-label'>Break Length</p>
					<button id='break-decrement' onClick={this.handleBreak}>
						<ion-icon name='arrow-round-down' />
					</button>
					<span id='break-length'>{this.state.breakLength}</span>
					<button id='break-increment' onClick={this.handleBreak}>
						<ion-icon name='arrow-round-up' />
					</button>
				</div>
				<div className='session'>
					<p id='session-label'>Session Length</p>
					<button id='session-decrement' onClick={this.handleChange}>
						<ion-icon name='arrow-round-down' />
					</button>
					<span id='session-length'>{this.state.sessionLength}</span>
					<button id='session-increment' onClick={this.handleChange}>
						<ion-icon name='arrow-round-up' />
					</button>
				</div>
				<div className='rest'>
					<p id='timer-label'>{this.state.label}</p>
					<p id='time-left'>
						{minutes}:{seconds}
					</p>
					<button id='start_stop' onClick={this.handleStartStop}>
						<i>
							<ion-icon name='stopwatch' />
						</i>
					</button>
					<button id='reset' onClick={this.handleReset}>
						<i>
							<ion-icon name='refresh' />
						</i>
					</button>
				</div>
				<audio id='beep' src='https://goo.gl/65cBl1' />
			</div>
		);
	}
}

export default Pomodoro;
