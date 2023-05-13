import React, { useState } from "react";
import { TouchableOpacity, FlatList, View, Text, Image, StatusBar } from "react-native";
import styles from "./styles";
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { COLORS, SIZES, dummyData, images } from "../../constants";
import { connect, useDispatch, useSelector } from "react-redux";
import LoginBox from "../../component/atoms/LoginBox";
import NoDataBox from "../../component/atoms/noDataBox";
import Loading1 from "../../component/atoms/Loading/Loading1";
import { GetAllNotification } from "../../redux/actions/notificationAction";
import { useEffect } from "react";
import NotificationBox from "../../component/atoms/NotificationBox";
import { http2 } from "../../services/api";
import formatDate from "../../services/date";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Tab = createMaterialTopTabNavigator();

const Message = ({ navigation }) => {
  const dispatch = useDispatch()
  const loading = useSelector(state => state.booking.loading)
  const messages = dummyData.Message;
  return (
    <>
      {loading ?
        <Loading1 />
        :
        !messages ?
          <View style={styles.container}>
            <View style={styles.box}>
              <FlatList
                data={messages}
                renderItem={({ item, index }) => (
                  <TouchableOpacity style={[styles.messageBox, index == messages.length - 1 && { marginBottom: SIZES.height * .03, }]}
                  // onPress={() => navigation.navigate("Payment")} 
                  >
                    <View style={styles.messageRow} >
                      <View style={styles.row}>
                        <View style={styles.profileBox}>
                          <Image source={item.profile} resizeMode={"contain"} style={styles.profile} />
                        </View>
                        <View style={styles.contentBox}>
                          <Text style={styles.name}>{item.userName}</Text>
                          <Text style={styles.message}>{item.message}</Text>
                        </View>
                      </View>
                      <Text style={styles.time}>{item.time}</Text>
                    </View>
                  </TouchableOpacity>
                )}
                key={item => item.id}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
          :
          <NoDataBox source={images.notFound} title={"No Messages"} />
      }
    </>
  );
}


const Notification = ({ navigation }) => {
  const loading = useSelector(state => state.notification.loading)
  const notification = useSelector(state => state.notification.notification)
  const userData = useSelector(state => state.auth.userData)

  const userRole = useSelector(state => state.auth.userRole)

  const [userId, setUserId] = useState()
  const [notificationList, setNotificationList] = useState()
  // const notification = dummyData.Message;

  // useEffect(() => {
  //   getUserId()
  //   console.log("userid  : ", userId, userRole)
  //   let message;
  //   if (userRole == "vendor") {
  //     message = notification && notification.filter(item => item.booking_details.student_id == userId || item.message.id == userId )
  //     setNotificationList(message)
  //   }
    
  //   console.log("notification1 : ", message && message.length)
  // }, [userRole, userId]) 

  const getUserId = async () => {
    let id = await AsyncStorage.getItem("@USER_ID")
    setUserId(id)
  }

  // useEffect(() => {
  //  getUserId()
  // }, [])

  console.log("notification2 : ", notification&& notification.length)

  return (
    <>
      {loading ?
        <Loading1 />
        :
        notification && notification[0] ?
          <View style={styles.container}>
            <View style={{ alignItems: 'center' }}>
              <FlatList
                data={notification}
                renderItem={({ item, index }) => (
                  <NotificationBox
                    source={{ uri: http2 + item.image }}
                    date={formatDate(item.booking_details && item.booking_details.booking_date)}
                    bookingId={item.booking_details && item.booking_details.booking_id}
                    carName={item.title}
                    style={index == 0 ? { marginTop: SIZES.height * .02 } : null}
                    price={item.booking_details && item.booking_details.price}
                    location={item.booking_details && item.booking_details.location}
                    // customer_name={userData && userData[0]&& userData[0].role == "vendor" ? item.booking_details && item.booking_details.customer_name : null}
                    onPress={() => navigation.navigate("TripDetails", { data: item })}
                  />

                )}
                key={item => item.id}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </View>
          :
          <NoDataBox source={images.noNotification} title={"No Notification"} />
      }
    </>
  );

}

const InboxPage = ({ navigation, token, GetAllNotification }) => {
  useEffect(() => {
    GetAllNotification()
  }, [])
  return (
    <View
      style={styles.container}
    >
      <StatusBar
        backgroundColor={COLORS.light}
        barStyle="dark-content"
      />

      {/* <InboxTabs /> */}
      {token ?
        <Notification navigation={navigation} />
        // <Tab.Navigator
        //   screenOptions={{
        //     tabBarActiveTintColor: COLORS.black,
        //     tabBarInactiveTintColor: "#777777",
        //     tabBarLabelStyle: styles.tabBarLabelStyle,
        //     tabBarIndicatorStyle: { backgroundColor: COLORS.black },
        //   }}

        // >
        //   <Tab.Screen name="Message" component={Message} />
        //   <Tab.Screen name="Notification" component={Notification} />
        // </Tab.Navigator>
        :
        <LoginBox onPress={() => navigation.navigate("Login")} />
      }
    </View>

  )
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  notification: state.notification.notification
})

const mapDispatchToProps = {
  GetAllNotification,
}

export default connect(mapStateToProps, mapDispatchToProps)(InboxPage)