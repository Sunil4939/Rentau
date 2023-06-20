import React, { useEffect } from "react";
import Root from "./root";
import SplashScreen from 'react-native-splash-screen'
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { store } from "./redux";
import { StripeProvider } from '@stripe/stripe-react-native';
import { STRIPE_PUBLISH_KEY } from "./services/keys";
import NavigationService from './utils/NavigationService';
import { PermissionsAndroid, Platform } from 'react-native';
import { notificationListener } from "./services/notification";
import { notificationListeners, requestUserPermission } from './utils/notificationServices';
import { displayNotification } from "./utils/notifeeNotification";



const App = () => {
  useEffect(() => {
    SplashScreen.hide();
  }, [])


  useEffect(() => {
    notificationListener()
    // requestUserPermission()
    // displayNotification()
  }, [])


  // useEffect(() => {

  //   if (Platform.OS == "android") {
  //     requestUserPermission()
  //     // notificationListeners()
  //   } else {
  //     console.log("error permission")
  //   }

  // }, [])

  return (
    <Provider store={store}>
      <StripeProvider publishableKey={STRIPE_PUBLISH_KEY}
        merchantIdentifier="merchant.identifier" // required for Apple Pay
        urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      >
        <NavigationContainer ref={(ref) => NavigationService.setTopLevelNavigator(ref)}>
          <Root />
        </NavigationContainer>
      </StripeProvider>
    </Provider>

  )
}

export default App;
