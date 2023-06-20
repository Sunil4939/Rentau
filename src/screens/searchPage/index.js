import React from 'react'
import { View, Text, StatusBar, ScrollView, ImageBackground, TextInput, Image, TouchableOpacity, FlatList } from 'react-native'
import Icons from '../../component/atoms/Icons';
import { COLORS, SIZES, images } from '../../constants';
import styles from './styles';
import { connect } from 'react-redux';
import { SearchCarApi } from '../../redux/actions/searchAction';
import { useEffect } from 'react';
import { AvailableLocationApi } from '../../redux/actions/searchAction';
import Loading from '../../component/atoms/Loading';
import Button1 from '../../component/atoms/buttons/Button1';
import { displayNotification } from '../../utils/notifeeNotification';
import { sendNotification } from '../../services/notification';


const TextBox = ({ iconName, iconStyle, title, children }) => {
  return (
    <View style={styles.textBox}>
      <View style={styles.textRow}>
        <Icons name={iconName} size={20} style={iconStyle} />
        <Text style={styles.title1}>{title}</Text>
      </View>
      <View>
        <Text style={styles.content}>{children}</Text>
      </View>
    </View>
  )
}


const SearchPage = ({ navigation, token, loading, location, AvailableLocationApi, searchData, SearchCarApi }) => {
  // console.log("search data : ", token)
  useEffect(() => {
    AvailableLocationApi()
  }, [])

  const notificationData = {
    "data": { "name": "sunil", "age": 20 },
    "notification": {
      "body": "This is an FCM notification message!",
      "title": "FCM Message"
    },
    "token": "feEl_7t9Raq47Fv3QbiNGW:APA91bENuAMOFR-36DxgoLkY91rYiRBcKZfpQxQWcRiNmKF77IXR31VtgX6Dl1yOsDp9ESqPTnOsAb5mD4aJ-lkUAuUnFBLOlWceCWJQANMpfpp7CRAEzoMUmoLfWdusbm3ZSqKkLmT-"
  }
  return (
    <>
      {loading ?
        <Loading />
        :
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={styles.container}
        >
          <StatusBar
            backgroundColor={COLORS.white}
            barStyle="dark-content"
          />
          <View>
            <Image source={images.image2} style={styles.bgImage} resizeMode="stretch" />
            <View style={styles.searchBox}>
              <TouchableOpacity style={styles.search}
                //  onPress={() => { SingleCarDataApi(item.id), navigation.navigate("ProductDetails", {routeName: "AddCarList"}) }}
                onPress={() => navigation.navigate(token ? "Product" : "SearchScreen")}
              >
                <Icons name={"search"} size={20} color={COLORS.black} style={styles.searchIcon} />
                <TextInput placeholder={"City, Airport, Address or Hotel"}
                  placeholderTextColor={"#6D6D6D"}
                  style={styles.input}
                  editable={false}
                />
                {/* <Text style={{ ...styles.input, color: "#6D6D6D" }}>City, Airport, Address or Hotel</Text> */}
              </TouchableOpacity>
            </View>
          </View>

          {/* <Button1 onPress={() => sendNotification(notificationData.token, notificationData.data)}>Send notification</Button1> */}

          <View style={styles.contentBox}>
            <Text style={styles.title}>Find your drive</Text>
            <TextBox iconName={"contact"}
              iconStyle={styles.iconStyle}
              title={"We’ve got your back"} >
              There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.
            </TextBox>
            <TextBox iconName={"car"}
              iconStyle={styles.car}
              title={"Endless options"} >
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, </TextBox>
            <TextBox iconName={"shield"}
              iconStyle={styles.iconStyle}
              title={"Drive Confidently"} >
              All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures,  </TextBox>

            <View style={styles.lineBox}>
              <Image source={images.line} style={styles.line} resizeMode='contain' />
            </View>

            <Text style={styles.title}>Fuel your daydreams</Text>
            <View style={styles.boxContainer}>
              <Image source={images.image5} style={styles.bgImage} resizeMode="stretch" />
              <View style={styles.box}>
                <View style={styles.innerBox}>
                  <Text style={styles.featured}>Featured travelogue</Text>
                  <Text style={styles.featuredTitle}>Home state escape:
                    kaua’i edition</Text>
                  <Text style={styles.featuredText}>the first true generator on the Internet.
                    It uses a dictionary of over 200 Latin words.</Text>
                  <TouchableOpacity style={styles.btn}>
                    <Text style={styles.btnText}>Read more</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            {/* Available location container */}
            {/* {location &&
              <View
                style={{ width: SIZES.width * .9, }}
              >
                <Text style={styles.title2}>Available Locations</Text>
                <FlatList
                  data={location}
                  renderItem={({ item }) => (
                    <View style={styles.location_box}>
                      <TouchableOpacity style={styles.button}
                      onPress={() => navigation.navigate("SearchScreen", {routeName: "SearchPage",location: item.location})}
                      >
                        <Text style={styles.location}>{item.location}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                  key={item => item.id}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            } */}
          </View>
        </ScrollView>
      }
    </>
  )
}

const mapStateToProps = (state) => ({
  loading: state.search.loading,
  token: state.auth.token,
  searchData: state.search.searchData,
  location: state.search.location
})

const mapDispatchToProps = {
  SearchCarApi,
  AvailableLocationApi,
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchPage)

