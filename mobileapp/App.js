import React from 'react';
import Home from './src/home'
import Login from './src/login'

import {
	SafeAreaView,
	ScrollView,
	StatusBar,
	View,
} from 'react-native';
import { AsyncStorage } from 'react-native';

// Migrate to better alternative
async function _get_token () {
	return await AsyncStorage.getItem("TOKN");	
}

function set_status (){
	var status = "LOGN"
	if(_get_token !== null){
		status = "HOME"
	}
}

const App = () => {
	var status = set_status();
	
	switch(status){
		case "LOGN":
			return (
				<SafeAreaView>
					<Login />
				</SafeAreaView>
			)
		case "HOME":
			return (
				<SafeAreaView>
					<Home />
				</SafeAreaView>
			)
		default:
			return (
				<SafeAreaView>
					<Login />
				</SafeAreaView>
			)
	}
};

export default App;
