import React from 'react';
import {
  AppRegistry,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Text
} from 'react-native';
import Camera from 'react-native-camera';
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

export default class WhoIsThis extends React.Component {
  constructor(props) {
    super(props);

    this.camera = null;

    this.state = {
      camera: {
        aspect: Camera.constants.Aspect.fill,
        captureTarget: Camera.constants.CaptureTarget.disk,
        type: Camera.constants.Type.back,
        orientation: Camera.constants.Orientation.auto,
        flashMode: Camera.constants.FlashMode.auto,
      },
      isRecording: false,
      result: {},
      path: ''
    };
  }

  takePicture = () => {
    if (this.camera) {
      this.camera.capture()
        .then((data) => this.setState({path : data.path}, () => {
          this.uploadImage()
        }))
        .catch(err => console.error(err));
    }
  }

// front or back camera
  switchType = () => {
    let newType;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      newType = front;
    } else if (this.state.camera.type === front) {
      newType = back;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        type: newType,
      },
    });
  }

  get typeIcon() {
    let icon;
    const { back, front } = Camera.constants.Type;

    if (this.state.camera.type === back) {
      icon = require('./assets/ic_camera_front_white.png');
    } else if (this.state.camera.type === front) {
      icon = require('./assets/ic_camera_front_white.png');
    }

    return icon;
  }

  // image upload
  async uploadImage() {
    let base64image = await RNFS.readFile(this.state.path, 'base64');
    let formData = new FormData();
    formData.append("csv", base64image);
    fetch(uri,
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
            this.formattedResult(response.result)
          }).catch(function(err) {
            console.log("error", err);
        });
  }

  formattedResult = (response) => {
    let result = "";
    for (var i = 0; i < response.length; i++){
      result+= response[i].data.face.identity.concepts[0].name + " | "
    }
    this.setState({result : result})
  }

  render() {
    return (
        <View style={styles.container}>
          <StatusBar
            animated
            hidden
          />
          <Camera
            ref={(cam) => {
              this.camera = cam;
            }}
            style={styles.preview}
            aspect={this.state.camera.aspect}
            captureTarget={this.state.camera.captureTarget}
            type={this.state.camera.type}
            flashMode={this.state.camera.flashMode}
            onFocusChanged={() => {}}
            onZoomChanged={() => {}}
            defaultTouchToFocus
            mirrorImage={false}
          />
          <View style={[styles.overlay, styles.topOverlay]}>
            <TouchableOpacity
              style={styles.typeButton}
              onPress={this.switchType}
            >
              <Image
                source={this.typeIcon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.flashButton}
              onPress={this.switchFlash}
            >
            </TouchableOpacity>
          </View>
          <View style={[styles.overlay, styles.bottomOverlay]}>
            <TouchableOpacity
                style={styles.captureButton}
                onPress={this.takePicture}
            >
              <Image
                  source={require('./assets/ic_camera_front_white.png')}
              />
            </TouchableOpacity>
            <View style={styles.buttonsSpace} />
          </View>
          <Text>{this.state.result.length > 0 ? this.state.result : ''}</Text>
        </View>
    );
  }
}

AppRegistry.registerComponent('WhoIsThis', () => WhoIsThis);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    padding: 16,
    right: 0,
    left: 0,
    alignItems: 'center',
  },
  topOverlay: {
    top: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomOverlay: {
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 40,
  },
  typeButton: {
    padding: 5,
  },
  flashButton: {
    padding: 5,
  },
  buttonsSpace: {
    width: 10,
  },
});
