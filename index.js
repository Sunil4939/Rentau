/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

messaging().setBackgroundMessageHandler(async remoteMessage => {
    // ...is not working
    console.log('Message handled in the background!', remoteMessage);
  });
  
AppRegistry.registerComponent(appName, () => App);
