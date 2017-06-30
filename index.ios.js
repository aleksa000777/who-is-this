import React from 'react';
import {
  AppRegistry,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  PixelRatio,
  Text
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
const RNFS = require('react-native-fs');
const xhr = new XMLHttpRequest();

// server running on heroku
const uri = 'https://calm-savannah-34510.herokuapp.com/'

// your IP for local server testing
// const url = 'http://xx.xx.x.xx'
// const port = 3000
// const uri = `${url}:${port}/`

if(typeof global.self === "undefined")
{
    global.self = global;
}

String.prototype.capitalize = function() {
  return this.replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

export default class WhoIsThis extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      result: {},
      avatar: null
    };
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };
    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let source = { uri: response.uri };
        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };
        const result = this.state.result;
        result.name = "Loading ...";
        result.age = null;
        result.gender = null;
        result.race = null;
        this.setState({
          avatar: source,
          result,
        }, () => {
          let apiV = "celebrity";
          this.uploadImage(apiV);
        });
      }
    });
  }

  // image upload
  async uploadImage(apiV) {
    let base64image = await RNFS.readFile(this.state.avatar.uri, 'base64');
    let formData = new FormData();
    formData.append("csv", base64image);
    fetch(uri + '?v=' + apiV,
      {
          method: "POST",
          headers: {
            'Accept': 'application/json',
            'Content-Type': "multipart/form-data",
          },
          body: formData
      })
      .then((response) => response.json())
      .then((response) => {
          if(!!response.result){
            this.formattedResult(response.result, apiV)
          } else {
            this.setState({result: {...this.state.result, name: null,},});
          }
          }).catch(function(err) {
            console.log("error", err);
        });
  }

  formattedResult = (response, apiV) => {
    if(apiV === "celebrity"){
      let name = "";
      for (var i = 0; i < response.length; i++){
        let val = (response[i].data.face.identity.concepts[0].value * 100).toFixed(2)
        name+= val+"%: " + response[i].data.face.identity.concepts[0].name.capitalize() + "\n"
      }
      const result = this.state.result;
      result.name = name;
      this.setState({
          result,
      });
      if(response.length == 1){
        let apiV = "demographics";
        this.uploadImage(apiV);
      }
    } else {
      const result = this.state.result;
      result.age = response[0].data.face.age_appearance.concepts[0].name;
      result.gender = response[0].data.face.gender_appearance.concepts[0].name;
      result.race = response[0].data.face.multicultural_appearance.concepts[0].name;
      this.setState({
          result,
      });
    }
  }

  render() {
    let resultUI = null;
    if(this.state.result.name){
      resultUI = this.state.result.name
      if(this.state.result.age){
        resultUI =
        this.state.result.name + '\n'
        + 'Age: '+ this.state.result.age + '\n'
         + 'Gender: ' + this.state.result.gender + '\n'
         +'Race: ' + this.state.result.race
      }
    } else {
      resultUI = "Try again"
    }

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
            { this.state.avatar === null ? <Text>Select a Photo</Text> :
              <Image style={styles.avatar} source={this.state.avatar} />
            }
          </View>
       </TouchableOpacity>
       <Text>{resultUI}</Text>
      </View>
    );
  }
}

AppRegistry.registerComponent('WhoIsThis', () => WhoIsThis);
var windowSize = Dimensions.get('window');
const styles = StyleSheet.create({

  avatarContainer: {
    borderColor: '#9B9B9B',
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: windowSize.width - 4,
    height: windowSize.width - 4
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF'
  }
});
