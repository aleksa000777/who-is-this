 - if on react-native < 0.40: `npm i react-native-camera@0.4`
 - if on react-native >= 0.40 `npm i react-native-camera@0.6`

 - JDK >= 1.7 (if you run on 1.6 you will get an error on "_cameras = new HashMap<>();")
 - With iOS 10 and higher you need to add the "Privacy - Camera Usage Description" key to the info.plist of your project. This should be found in `'your_project/ios/your_project/Info.plist'`. Add the following code:
```
<key>NSCameraUsageDescription</key>
<string>Your message to user when the camera is accessed for the first time</string>

<!-- Include this only if you are planning to use the camera roll -->
<key>NSPhotoLibraryUsageDescription</key>
<string>Your message to user when the photo library is accessed for the first time</string>

<!-- Include this only if you are planning to use the microphone for video recording -->
<key>NSMicrophoneUsageDescription</key>
<string>Your message to user when the microsphone is accessed for the first time</string>
```

- `react-native link react-native-camera`

** to run on device
settings -> general -> device managment -> trust app
on xcode -> preferences -> login to your accaunt
libraries -> RCTWebSocket.xcodeproj -> RCTWebSocketExecutor -> find 'localhost'
change to your computer IP

```NSInteger port = [[[_bridge bundleURL] port] integerValue] ?: '/';
    NSString *host = [[_bridge bundleURL] host] ?: @"xxx.xxx.xx.xxx";
    ```



lsof -i :8081
kill -9 <PID>
