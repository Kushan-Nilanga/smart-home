import React, { Component } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    View,
} from 'react-native';

class Home extends Component {
    render() {
        return (
            <SafeAreaView>
                <StatusBar />
                <ScrollView>
                    <View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        )
    }
}

export default Home