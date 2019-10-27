import React from 'react';
import styles from './App.css';
import ClassCounter from "./use-state/ClassCounter";
import HookCounter from "./use-state/HookCounter";
import HookCounterTwo from "./use-state/HookCounterTwo";
import HookCounterThree from "./use-state/HookCounterThree";
import HookCounterFour from "./use-state/HookCounterFour";
import ClassCounterOne from "./use-effect/ClassCounterOne";
import HookCounterOne from "./use-effect/HookCounterOne";
import ClassMouse from "./use-effect/ClassMouse";
import HookMouse from "./use-effect/HookMouse";
import MouseContainer from "./use-effect/MouseContainer";
import IntervalClassCounter from "./use-effect/IntervalClassCounter";
import IntervalHookCounter from "./use-effect/IntervalHookCounter";
import DataFetching from "./data-fetching/DataFetching";
import DataFetching01 from "./data-fetching/DataFetching01";
import ComponentC from "./use-context/ComponentC";
import CounterOne from "./use-reducer/CounterOne";
import CounterTwo from "./use-reducer/CounterTwo";
import CounterThree from "./use-reducer/CounterThree";

export const UserContext = React.createContext();
export const ChannelContext = React.createContext();

function App() {
	return (
		<div className='container' style={styles}>
			{/*<ClassCounter/>*/}
			{/*<HookCounter/>*/}
			{/*<HookCounterTwo/>*/}
			{/*<HookCounterThree/>*/}
			{/*<HookCounterFour/>*/}

			{/*<ClassCounterOne />*/}
			{/*<HookCounterOne/>*/}
			{/*<ClassMouse/>*/}
			{/*<HookMouse/>*/}
			{/*<MouseContainer/>*/}
			{/*<IntervalClassCounter/>*/}
			{/*<IntervalHookCounter/>*/}

			{/*<DataFetching/>*/}
			{/*<DataFetching01/>*/}

			{/*<UserContext.Provider value={'Akshay'}>*/}
			{/*	<ChannelContext.Provider value={'Codevolution'}>*/}
			{/*		<ComponentC/>*/}
			{/*	</ChannelContext.Provider>*/}
			{/*</UserContext.Provider>*/}

			{/*<CounterOne/>*/}
			{/*<CounterTwo/>*/}
			<CounterThree/>
		</div>
	);
}

export default App;
