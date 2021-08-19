import React, { Component } from "react";
import {
    SafeAreaView,
    TextInput,
    StyleSheet,
    Text,
    Button
} from 'react-native';

class Home extends Component {
    render() {
        return (
            <SafeAreaView>
                <Text>Sign in</Text>
                <TextInput style={styles.input}/>
                <TextInput style={styles.input}/>
                <Button title="Sign in"/>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 5,
      borderWidth: 1,
      padding: 5,
    },
});

export default Home