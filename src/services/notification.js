import messaging from '@react-native-firebase/messaging';
import axios from 'axios';
import notifee, { AndroidImportance, AndroidStyle, EventType } from '@notifee/react-native';
import NavigationService from '../utils/NavigationService';


export const getDeviceToken = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
        try {
            const token = await messaging().getToken()
            console.log("fcm token:", token)
            return token
        } catch (error) {
            console.log("error in creating token")
        }
    }
}



export const displayNotification = async (title, body, notificationData) => {
    // Request permissions (required for iOS)
    await notifee.requestPermission()
    let obj = Object.fromEntries(Object.entries(notificationData).filter(([_, v]) => v != null));
    console.log("displayNotification service : ", obj);

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
    });

    // Display a notification

    await notifee.displayNotification({
        title: title,
        body: body,
        data: obj,
        android: {
            channelId,
            pressAction: {
                id: 'default',
            },
        },
    });
}


export const sendNotification = async (token, notificationData) => {
    let obj = Object.fromEntries(Object.entries(notificationData).filter(([_, v]) => v != null));
    // console.log("displayNotification service : ", obj);
    console.log("enter send notification : ", notificationData)
    // const channelId = await notifee.createChannel({
    //     id: 'default',
    //     name: 'Default Channel',
    // });



    var data = JSON.stringify({
        // data: obj,
        data: notificationData,
        notification: {
            body: 'click to open check Post',
            title: 'New Post Added',
        },
        to: token,

    });
    var config = {
        method: 'post',
        url: 'https://fcm.googleapis.com/fcm/send',
        headers: {
            Authorization:
                'key=AAAA1j_cnWk:APA91bERWzsAUw1mWpCJVkIRnk-VefhHSttTmA7P952T3Dpit-zYDRJ9e6FHnpgj7bCI6qNtyi-1ctb60DibzWQLxVpLft2iP9aZKs3ay-PVlcgfTkqt7JzzGVWAGpq5UG5fD0zwBO6W',
            'Content-Type': 'application/json',
        },
        data: data,
    };
    axios(config)
        .then(function (response) {
            console.log("send notification response : ", JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log("send notification error : ", error);
        });
}



export const notificationListener = async () => {
    const unsubscribe = await messaging().onMessage(async remoteMessage => {
        console.log('A new FCM message arrived!', remoteMessage);
        const { data, notification } = remoteMessage
        let count = 0 
        if(count == 0){
            displayNotification(notification.title, notification.body,data)
            count = 1;
        }
    });

    notifee.onBackgroundEvent(async ({ type, detail }) => {
        const { notification, pressAction } = detail;
        switch (type) {
            case EventType.DISMISSED:
                console.log('onBackgroundEvent User dismissed notification', notification);
                break;
            case EventType.PRESS:
                console.log('onBackgroundEvent User pressed notification', notification);
                setTimeout(() => {
                    NavigationService.navigate("Notification", { data: notification?.data })
                }, 1200);
                break;
        }
    });

    notifee.onForegroundEvent(({ type, detail }) => {
        const { notification, pressAction } = detail;
        switch (type) {
            case EventType.DISMISSED:
                console.log('onForegroundEvent User dismissed notification', notification);
                break;
            case EventType.PRESS:
                console.log('onForegroundEvent User pressed notification', notification.data);
                NavigationService.navigate("Notification", { data: notification?.data })
                break;
        }
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage,
        );

        // setTimeout(() => {
        //     NavigationService.navigate("TripDetails", { data: remoteMessage?.data })
        // }, 1200);

    });

    messaging()
        .getInitialNotification()
        .then(remoteMessage => {
            if (remoteMessage) {
                console.log(
                    'Notification caused app to open from quit state:',
                    remoteMessage.notification,
                );
                setTimeout(() => {
                    NavigationService.navigate("Notification", { data: remoteMessage?.data })
                }, 1200);

            }
        });

    return unsubscribe;
}