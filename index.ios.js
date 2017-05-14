/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  TextInput,
} from 'react-native';



export default class WhoIsThis extends Component {
  constructor(props) {
    super(props);
    this.state = {
      result: {},
      text: ''
    };
    this.onButtonPress = this.onButtonPress.bind(this)
  }

 onButtonPress() {
      this.getMoviesFromApiAsync();
  }

  getMoviesFromApiAsync () {
    let url = this.state.text
    console.log('url', url);
    fetch("http://localhost:3000/" + url, {method: "GET"})
          .then((response) => response.json())
          .then((response) => {
            console.log('success on front!!!');
            console.log(response.result.name);
            this.setState({result : response.result.name});
          }).done()
  }


  render() {
    console.log('hello');
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          {this.state.result.length > 0 ? this.state.result: 'hello'}
        </Text>
        <TextInput
          style={{height: 40, borderColor: 'gray', borderWidth: 1}}
          onChangeText={(text) => this.setState({text})}
          value={this.state.text}
        />
        <Button
          onPress={this.onButtonPress}
          title="Learn More"
          color="#841584"
          accessibilityLabel="Learn more about this purple button"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('WhoIsThis', () => WhoIsThis);
