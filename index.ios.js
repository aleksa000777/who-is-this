import React from 'react';
import {
  AppRegistry,
  Image,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Text
} from 'react-native';
import Camera from 'react-native-camera';

const xhr = new XMLHttpRequest();
const port = 'http://localhost:3000/' || 'https://calm-savannah-34510.herokuapp.com/'


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
      modalVisible: false,
      path: ''
    };
  }

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  }

  takePicture = () => {
    if (this.camera) {
      this.camera.capture()
        .then((data) => this.setState({path : data.path}, () => {
          this.uploadImage()
        }))
        // .then(this.getMoviesFromApiAsync())
        .catch(err => console.error(err));
    }
  }


  getMoviesFromApiAsync () {
    let url = 'http://www.celebritybeliefs.com/wp-content/uploads/2016/07/matt-damon-religion-hobbies-political-views.jpg'
    console.log('url', url);
    fetch(port + url, {method: "GET"})
          .then((response) => response.json())
          .then((response) => {
            console.log('success on front!!!');
            console.log(response.result.name);
            this.setState({result : response.result.name}, () => {
              this.setModalVisible(!this.state.modalVisible)
            });
          }).done()
  }


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

  switchFlash = () => {
    let newFlashMode;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      newFlashMode = on;
    } else if (this.state.camera.flashMode === on) {
      newFlashMode = off;
    } else if (this.state.camera.flashMode === off) {
      newFlashMode = auto;
    }

    this.setState({
      camera: {
        ...this.state.camera,
        flashMode: newFlashMode,
      },
    });
  }

  get flashIcon() {
    let icon;
    const { auto, on, off } = Camera.constants.FlashMode;

    if (this.state.camera.flashMode === auto) {
      icon = require('./assets/ic_camera_front_white.png');
    } else if (this.state.camera.flashMode === on) {
      icon = require('./assets/ic_camera_front_white.png');
    } else if (this.state.camera.flashMode === off) {
      icon = require('./assets/ic_camera_front_white.png');
    }

    return icon;
  }

  // image upload
  uploadImage = () => {
    const photo = {
      uri: this.state.path,
      type: 'image/jpeg',
      name: 'photo.jpg',
    };
    const postData = new FormData();
    postData.append('authToken', 'secret');
    postData.append('photo', photo);
    postData.append('title', 'A beautiful photo!');

    fetch(port, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: postData
    }).then((response) => response.json())
      .then((response) => {
        console.log('success on front!!!');
        console.log(response);
        this.setState({result : response.name})
      }).catch(function(err) {
        console.log("error", err);
    });
  }


  render() {
    console.log('this.state', this.state.result);
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
              <Image
                source={this.flashIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={[styles.overlay, styles.bottomOverlay]}>
            {
              !this.state.isRecording
              &&
              <TouchableOpacity
                  style={styles.captureButton}
                  onPress={this.takePicture}
              >
                <Image
                    source={require('./assets/ic_camera_front_white.png')}
                />
              </TouchableOpacity>
              ||
              null
            }
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
