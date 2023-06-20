import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { COLORS, icons, } from "../constants";
import { connect } from "react-redux";
import Auth from "../screens/auth";
import homePage from "../screens/homePage";
import AllCarList from "../screens/AllCarList";
import AddCarList from "../screens/AddCarList";
import tripPage from "../screens/tripPage";
import inboxPage from "../screens/inboxPage";
import searchPage from "../screens/searchPage";
import morePage from "../screens/morePage";
import Icons from "../component/atoms/Icons";
import styles from "./styles";
import HeaderLeft from "../component/atoms/HeaderLeft";
import Header1 from "../component/atoms/Header1";
import Header from "../component/atoms/Header";
import Notification from "../screens/Notification";


const Tab = createBottomTabNavigator();

const BottomTab = ({ token, userData, userRole }) => {
  const role = userData && userData.role
  // const [role, setRole] = useState("customer")
  // console.log("bottom tab user role : ",  userRole)

  return (
    <Tab.Navigator
      // initialRouteName='Home'
      screenOptions={() => ({
        tabBarActiveTintColor: COLORS.black,
        tabBarInactiveTintColor: COLORS.light3,
        tabBarStyle: styles.tabBarStyle,
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: styles.labelStyle,
        // headerShown: false,
      })} >
      {userRole == "vendor" ?
        <>
          <Tab.Screen name="Home" component={homePage}
            options={() => ({
              headerShown: false,
              tabBarIcon: ({ color }) => <Icons name={"home"} size={25} color={color} />
            })}
          />
          <Tab.Screen name="CarList" component={AddCarList}
            options={({ navigation }) => ({
              header: () => (
                <Header navigation={navigation} />
              ),
              tabBarLabel: "Add Car",
              tabBarIcon: ({ color }) => <Icons name={"addPost"} size={25} color={color} />
            })}
          />
        </>
        :
        <>
          <Tab.Screen name="Search" component={searchPage}
            options={() => ({
              headerShown: false,
              tabBarIcon: ({ color }) => <Icons name={"search"} size={25} color={color} />
            })}
          /> 

          <Tab.Screen name="CarList" component={token ? AllCarList : Auth}
            options={() => ({
              headerShown: false,
              tabBarLabel: token ? "Car List" : "Login",
              tabBarIcon: ({ color }) => <Icons name={token ? "carlist" : "accountcircle"} size={token ? 25 : 30} color={color} />
            })}
          />
        </>
      }

      <Tab.Screen name="Trips" component={tripPage}
        options={() => ({
          header: ({ navigation }) => (
            <HeaderLeft navigation={navigation} title={"Trip"} />
          ),
          tabBarIcon: ({ color }) => <Icons name={"trip"} size={25} color={color} />
        })}

      />
      <Tab.Screen name="Inbox" component={inboxPage}
        options={() => ({
          header: ({ navigation }) => (
            <HeaderLeft navigation={navigation} title={"Notification"} />
          ),
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color }) => <Icons name={"inbox"} size={28} color={color} />
        })}
      />
      <Tab.Screen name="More" component={morePage}
        options={() => ({
          header: ({ navigation }) => (
            <Header1 navigation={navigation} />
          ),
          tabBarIcon: ({ color }) => <Icons name={"threeDots"} size={28} color={color} />
        })}
      />
    </Tab.Navigator>
  )
}

const mapStateToProps = (state) => ({
  token: state.auth.token,
  userData: state.auth.userData,
  userRole: state.auth.userRole,

})

const mapDispatchToProps = {

}


export default connect(mapStateToProps, mapDispatchToProps)(BottomTab);

