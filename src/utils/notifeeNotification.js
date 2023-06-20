import notifee, { AndroidStyle } from '@notifee/react-native';
import { images } from '../constants';


export const displayNotification = async () => {
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
    });

    // Display a notification

    await notifee.displayNotification({
        title: 'Flower',
        body: 'Flower | Definition, Parts, Anatomy, Types,& Facts | Britannica',
        data: { car: { name: "honda 1213", brand: "HONDA" }, price: 2342 },
        android: {
            channelId,
            // smallIcon: images.logo, // optional, defaults to 'ic_launcher'.
            pressAction: {
                id: 'default',
            },
            style: {
                type: AndroidStyle.BIGPICTURE,
                picture: 'https://cdn.britannica.com/84/73184-050-05ED59CB/Sunflower-field-Fargo-North-Dakota.jpg'
            }
            // style: { type: AndroidStyle.BIGTEXT, text: 'Large volume of text shown in the expanded state Large volume of text shown in the expanded state Large volume of text shown in the expanded state' },
        },
    });


    // await notifee.displayNotification({
    //     title: 'Sarah Lane',
    //     body: 'Great thanks, food later?',
    //     android: {
    //         channelId,
    //         style: {
    //             type: AndroidStyle.MESSAGING,
    //             person: {
    //                 name: 'John Doe',
    //                 icon: 'https://my-cdn.com/avatars/123.png',
    //             },
    //             messages: [
    //                 {
    //                     text: 'Hey, how are you?',
    //                     timestamp: Date.now() - 600000, // 10 minutes ago
    //                     showTimestamp: true,
    //                 },
    //                 {
    //                     text: 'hi sumit',
    //                     timestamp: Date.now(), // Now
    //                     showTimestamp: true,
    //                     person: {
    //                         name: 'Sunil',
    //                         icon: 'https://my-cdn.com/avatars/567.png',
    //                     },

    //                 },
    //                 {
    //                     text: 'hi sunil',
    //                     timestamp: Date.now(), // Now
    //                     showTimestamp: true,
    //                     person: {
    //                         name: 'Sumit',
    //                         icon: 'https://my-cdn.com/avatars/567.png',
    //                     },
    //                 },
    //                 {
    //                     text: 'hi sunil and sumit',
    //                     timestamp: Date.now(), // Now
    //                     showTimestamp: true,
    //                     person: {
    //                         name: 'Siddhartha',
    //                         icon: 'https://my-cdn.com/avatars/567.png',
    //                     },
    //                 },
    //             ],
    //         },
    //     },
    // });

    // notifee.displayNotification({
    //     title: 'Messages list',
    //     android: {
    //       channelId,
    //       style: {
    //         type: AndroidStyle.INBOX,
    //         lines: ['First Message', 'Second Message', 'Third Message', 'Forth Message'],
    //       },
    //     },
    //   });

    // notifee.displayNotification({
    //     title: 'Message from Sarah Lane',
    //     body: 'Tap to view your unread message from Sarah.',
    //     subtitle: 'Messages',
    //     android: {
    //         channelId,
    //         largeIcon: 'https://my-cdn/users/123.png',
    //         // largeIcon: images.logo,
    //         timestamp: Date.now() - 480000, // 8 minutes ago
    //         showTimestamp: true,
    //     },
    // });

}



const pushNotification = () => {
    // POST https://fcm.googleapis.com/v1/projects/myproject-b5ae1/messages:send HTTP/1.1

    // Content-Type: application/json
    // Authorization: Bearer ya29.ElqKBGN2Ri_Uz...HnS_uNreA

    // {
    //     "message": {
    //         "token": "bk3RNwTe3H0:CI2k_HHwgIpoDKCIZvvDMExUdFQ3P1...",
    //             "data": { },
    //         "notification": {
    //             "body": "This is an FCM notification message!",
    //                 "title": "FCM Message"
    //         }
    //     }
    // }
}