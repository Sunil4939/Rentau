import { View, Text, StatusBar, ScrollView, TouchableOpacity, TextInput, FlatList, Image } from 'react-native'
import React, { useEffect } from 'react'
import styles from './styles'
import { COLORS, SIZES, images, dummyData, icons } from '../../constants'
import Icons from '../../component/atoms/Icons'
import Slider from '../../component/atoms/slider'
import { connect } from 'react-redux';
import Loading from '../../component/atoms/Loading'
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react'
import formatAMPM from '../../services/time'
import * as Progress from 'react-native-progress';
import { ReviewCard } from '../../component/atoms/cards'
import Button1 from '../../component/atoms/buttons/Button1';
import SelectDropdown from 'react-native-select-dropdown'
import SwitchToggle from 'react-native-switch-toggle'
import { BottomSheet } from 'react-native-btr'
import filterImageObjectToArray from '../../services/filterImageObjectToArray'
import { RNToasty } from 'react-native-toasty'
import { createCustomer } from '../../redux/actions/paymentAction'
import { AddReviewApi, DeleteReview, SingleCarDataApi, StoreCarBookingApi } from '../../redux/actions/productAction'
import formatDate from '../../services/date'
import { http2 } from '../../services/api'
import CheckBox from '@react-native-community/checkbox'
import AsyncStorage from '@react-native-async-storage/async-storage'
import combineDateAndTime from '../../services/combineDateAndTime'



const BottomSheetBox = ({ onPress, visible, children }) => {

  return (
    <BottomSheet
      visible={visible}
      onBackButtonPress={onPress}
      onBackdropPress={onPress}
    >
      <View style={styles.bottom_sheet}>
        <View style={styles.bottom_top_row}>
          <Icons name={"questioncircle"} size={40} color={COLORS.black} />
        </View>
        <Text style={styles.bottom_text}>{children}</Text>
      </View>
    </BottomSheet>
  )
}

const ResourceRow = ({ price, title }) => {
  return (
    <View style={styles.resource_row}>
      <View style={styles.toggle_row}>
        <SwitchToggle
          // switchOn={toggle.includes(data.item.id)}
          // onPress={() => handleArrayChange(data.item.id)}
          switchOn={true}
          circleColorOff={COLORS.white}
          circleColorOn={COLORS.white}
          backgroundColorOn={COLORS.green1}
          backgroundColorOff={COLORS.lightGrey2}
          containerStyle={styles.toggleContainerStyle}
          circleStyle={styles.toggleCircleStyle}
        />
        <Text style={styles.toggle_title}>{title}</Text>
      </View>
      <Text style={styles.toggle_price}>{price}</Text>
    </View>
  )
}

const RatingRow = ({ text, rating }) => {
  return (
    <View style={styles.rating_row}>
      <Text style={styles.rating_row_text}>{text}</Text>
      <View style={styles.rating_row1}>
        <Progress.Bar
          progress={Number(rating) / 5}
          width={SIZES.width * .5}
          height={6}
          style={styles.progressBar}
          color={COLORS.black}
          unfilledColor={'#F1F1F1'}
          borderColor={'#F1F1F1'}
          showsText={true}
        />
        <Text style={styles.rating_row_text}>{rating}</Text>
      </View>
    </View>
  )
}

const SelectTrip = ({ style, placeholderDate, label, onSelectedDate, placeholderTime, onChangeDate, onChangeTime, date, time }) => {
  // const [date, setDate] = useState(false);
  const [display, setDisplay] = useState(false);

  const selectDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setDisplay(false);
    onSelectedDate && onSelectedDate(currentDate)
    let month = String(currentDate.getMonth() + 1).length == 1 ? `0${(currentDate.getMonth() + 1)}` : `${(currentDate.getMonth() + 1)}`
    let d = String(currentDate.getDate()).length == 1 ? `0${currentDate.getDate()}` : `${currentDate.getDate()}`
    onChangeDate && onChangeDate(`${d}-${month}-${currentDate.getFullYear()}`)
  }
  const [timePicker, setTimePicker] = useState(false);

  const onTimeSelected = (event, value) => {
    onChangeTime && onChangeTime(formatAMPM(value))
    // console.log("item time : ", value)
    setTimePicker(false);
  };

  return (
    <View style={style}>
      <Text style={styles.tripLabel}>{label}</Text>
      <View style={styles.tripBoxRow}>
        <View style={styles.dateBtnBox}>
          <TouchableOpacity style={styles.dateBtn} onPress={() => setDisplay(!display)}>
            <TextInput style={{ ...styles.dateText, width: SIZES.width * .42, }}
              placeholder={placeholderDate} value={date}
              placeholderTextColor={'#59595A'}
              editable={false}
            />
            <Icons name={"down-outline"} size={20} color={COLORS.black} />
          </TouchableOpacity>
          {display && (
            <DateTimePicker
              value={new Date()}
              mode={'date'}
              display="default"
              onChange={selectDate}
              minimumDate={new Date()}
            />
          )}
        </View>
        <View style={styles.btnBox}>
          <TouchableOpacity style={styles.dateBtn} onPress={() => setTimePicker(!timePicker)}>
            {/* <Text style={{ ...styles.dateText, color: value ? COLORS.black : "#59595A" }}>{value ? value : placeholder}</Text> */}
            <TextInput style={styles.dateText}
              placeholder={placeholderTime} value={time}
              placeholderTextColor={'#59595A'}
              editable={false}
            />
            <Icons name={"down-outline"} size={20} color={COLORS.black} />
          </TouchableOpacity>
          {timePicker && (
            <DateTimePicker
              testID="timePicker"
              value={new Date()}
              mode="time"
              display="clock"
              minimumDate={new Date()}
              onChange={onTimeSelected}
            />
          )}
        </View>
      </View>
    </View>
  )
}

const ProductDetails = ({ navigation, singleCarData, SingleCarDataApi, StoreCarBookingApi, route, token, loading, AddReviewApi, DeleteReview }) => {
  // const singleCarData = route.params && route.params.carData;
  // let slider = [images.car1, images.car2, images.car3, images.car4]
  let sliderImages = filterImageObjectToArray(singleCarData && singleCarData.car_details && singleCarData.car_details.image ? singleCarData.car_details.image : {});
  // let sliderImages =singleCarData.image

  //  console.log("singleCarData : ", singleCarData);
  // const data = route.params && route.params.carData && route.params.carData.location
  // console.log("route success : ",route.params && route.params.routeName)

  const data = singleCarData && singleCarData.car_details && singleCarData.car_details.location
  const car_details = singleCarData && singleCarData.car_details
  const host_details = singleCarData && singleCarData.host_details && singleCarData.host_details[0]
  let car_ratings = singleCarData && singleCarData.car_details && singleCarData.car_details.car_rating


  const [checkout, setCheckout] = useState(false)

  const [condition, setCondition] = useState()

  let d = new Date()
  let time = formatAMPM(d)
  let month = String(d.getMonth() + 1).length == 1 ? `0${(d.getMonth() + 1)}` : `${(d.getMonth() + 1)}`
  let date = String(d.getDate()).length == 1 ? `0${d.getDate()}` : `${d.getDate()}`
  date = `${date}-${month}-${d.getFullYear()}`

  const [startDate, setStartDate] = useState(d)
  const [endDate, setEndDate] = useState(d)

  // console.log("single car data car id : ", singleCarData && singleCarData.car_details && singleCarData.car_details.id)

  const [postData, setPostData] = useState({
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    checked: true,
  })

  const [userId, setUserId] = useState()

  const getUserId = async () => {
    let id = await AsyncStorage.getItem("@USER_ID")
    setUserId(id)
  }

  useEffect(() => {
    getUserId()
  }, [])

  useEffect(() => {
    if (data) {
      setPostData({
        "carPrice": data && data.price,
        "locations": data && data.location,
        "carPriceDurationId": data && data.price_duration_id,
        "currencyId": data && data.currency_id,
        "carId": data && data.car_id,
        "distanceAllowed": data && data.distance,
        "distanceUnitId": data && data.distance_unit_id,
        "startDate": date,
        "endDate": date,
        "startTime": time,
        "endTime": time,
        "insurance": true,
        "currency": "inr",
        "gst": ((data.price + 25) * (5 / 100)).toFixed(2),
        "qst": ((data.price + 25) * (9.975 / 100)).toFixed(2),
      })
      setReviewData({
        "carId": data && data.car_id,
      })
    }
  }, [data])


  const handleChange = (name, value) => {
    setPostData({
      ...postData,
      [name]: value,
    })
  }

  const [rating, setRating] = useState()

  const [reviewData, setReviewData] = useState({
    ratingValue: null,
    ratingDescription: null,
    carId: data && data.car_id,
  })

  const handleReview = (name, value) => {
    setReviewData({
      ...reviewData,
      [name]: value,
    })
  }


  const handleCarBook = () => {
    if (token) {
      calculateCarPrice()
      // setCheckout(!checkout)
    } else {
      RNToasty.Normal({
        title: 'Please Login first',
        duration: 2
      })
    }
  }

  const handleSendReview = () => {
    if (reviewData.ratingValue && reviewData.ratingDescription) {
      AddReviewApi({ ...reviewData, carId: data && data.car_id })
      setReviewData({
        "ratingValue": null,
        "ratingDescription": null,
      })
      SingleCarDataApi(data && data.car_id)
    } else {
      RNToasty.Normal({
        title: 'Please fill rating and description',
        duration: 2
      })
    }
  }



  const [totalPrice, setTotalPrice] = useState()
  const [amount, setAmount] = useState()


  useEffect(() => {
    if (postData.carPrice) {
      setPostData({
        ...postData,
        "gst": ((postData.carPrice) * (5 / 100)).toFixed(2),
        "qst": ((postData.carPrice) * (9.975 / 100)).toFixed(2)
      })

      // handleChange("carPrice", postData.insurance ? (data.price + 25) * booking_days : data.price * booking_days)
      // "distanceAllowed": data && data.distance,
    }
  }, [postData.carPrice])

  useEffect(() => {
    setTotalPrice((Number(postData.carPrice) + Number(postData.gst) + Number(postData.qst)).toFixed(2))
  }, [postData.gst, postData.qst])

  const calculateCarPrice = () => {
    if (data) {
      let total_days = calculteTotalDays()
      console.log("total_days ; ", total_days);
      if (total_days) {
        setPostData({
          ...postData,
          "carPrice": postData.insurance ? (data.price + 25) * total_days : data.price * total_days,
          "distanceAllowed": data.distance * total_days,
        })
        setCheckout(!checkout)
      }

    }

  }

  const calculteTotalDays = () => {
    var today = new Date()
    var date1 = combineDateAndTime(startDate, postData.startTime);
    var date2 = combineDateAndTime(endDate, postData.endTime);
    var total_hours = ((date2.getTime() - date1.getTime()) / (1000 * 3600)).toFixed(2);
    var days = parseInt(total_hours / 24)
    var hours = (total_hours % 24).toFixed(2);
    let total_days = 0;

    console.log("hours ; ", days, hours, total_hours);

    if (date1.getTime() > today.getTime() && date2.getTime() > today.getTime()) {
      // console.log("date1 date2 : ", date1.getTime(), date2.getTime())
      if (days <= 0 && hours <= 0) {
        RNToasty.Error({
          title: 'Please select valid date and time',
          duration: 2,
        })
      } else if (days == 0 && hours > 0) {
        total_days = hours <= 12 ? 0.5 : 1
      } else if (days >= 1 && hours == 0) {
        total_days = Number(days)
      }
      else if (days >= 1 && hours > 0) {
        total_days = hours <= 12 ? Number(days) + 0.5 : Number(days) + 1
      }
    } else {
      RNToasty.Error({
        title: 'Please select valid time',
        duration: 2,
      })
    }
    return total_days
  }

  

  console.log(`userId ${userId}, carprice ${postData.carPrice}, totalPrice ${totalPrice}  product details: `, postData.distanceAllowed, postData.gst, postData.qst,)


  return (
    <>
      {loading ?
        <Loading />
        :
        <View style={styles.container}>
          <StatusBar
            backgroundColor={COLORS.light}
            barStyle="dark-content"
          />
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => navigation.goBack()}
            >
              <Icons name={"back"} size={20} color={COLORS.black} />
            </TouchableOpacity>
          </View>
          {singleCarData &&
            <ScrollView showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps={'handled'}
            >
              <View style={styles.sliderBox}>
                <Slider data={sliderImages} duration={5000} />
              </View>
              <View style={{ alignItems: 'center' }}>
                {/* car features */}
                <View style={styles.box}>
                  <Text style={styles.carName}>{`${car_details && car_details.name} ${car_details && car_details.build_year}`}</Text>
                  <View style={styles.row}>
                    <View style={styles.featuresRow}>
                      <View style={styles.dot} />
                      <Text style={styles.features}>{car_details && car_details.brand}</Text>
                    </View>
                    <View style={styles.featuresRow}>
                      <View style={styles.dot} />
                      <Text style={styles.features}>{car_details && car_details.transmission}</Text>
                    </View>
                    <View style={styles.featuresRow}>
                      <View style={styles.dot} />
                      <Text style={styles.features}>{car_details && car_details.fuel == 'petrol' ? 'gasoline' : car_details.fuel}</Text>
                    </View>
                    <View style={styles.featuresRow}>
                      <View style={styles.dot} />
                      <Text style={styles.features}>{car_details && car_details.seat} Seats</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.hr_line} />

                {/* trip box  */}
                <View style={styles.tripBox}>
                  <SelectTrip
                    label={"Trip Start"}
                    placeholderDate={"start date"}
                    placeholderTime={"start time"}
                    onChangeDate={(date) => handleChange("startDate", date)}
                    // onChangeTime={(time) => handleTime("startTime", time)}
                    onChangeTime={(time) => handleChange("startTime", time)}
                    date={postData.startDate}
                    time={postData.startTime}
                    onSelectedDate={(date) => setStartDate(date)}
                  />
                  <SelectTrip
                    style={{ marginTop: SIZES.height * .02, }}
                    label={"Trip End"}
                    placeholderDate={"end date"}
                    placeholderTime={"end time"}
                    onChangeDate={(date) => handleChange("endDate", date)}
                    // onChangeTime={(time) => handleTime("endTime", time)}
                    onChangeTime={(time) => handleChange("endTime", time)}
                    date={postData.endDate}
                    time={postData.endTime}
                    onSelectedDate={(date) => setEndDate(date)}
                  />
                </View>

                {/* features  */}
                {car_details && car_details.features[0] ?
                  <View style={styles.featuresContainer}>
                    <Text style={styles.title}>Features</Text>
                    <View style={styles.featuresBox}>
                      <FlatList
                        data={car_details.features}
                        renderItem={({ item }) => (
                          <View style={styles.featureRow} key={item.id}>

                            {/* <View style={styles.featureIcon}>
                             
                              <Icons name={item.icon} size={10} color={COLORS.white} />
                            </View> */}
                            <Text style={styles.featureText}>{item.feature}</Text>
                          </View>
                        )}
                        key={item => item.id}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                      />

                    </View>
                  </View>
                  :
                  <View style={styles.no_data_box}>
                    <Text style={styles.no_data}>No Features Available</Text>
                  </View>
                }

                {/* description */}
                <View style={styles.descriptionBox}>
                  <Text style={styles.title}>Description</Text>
                  {car_details && car_details.description &&
                    <Text style={styles.text}>{car_details.description.length > 100 ? car_details.description.slice(0, 100) + "..." : car_details.description}</Text>
                  }
                  <View style={{ alignItems: 'flex-end' }}>
                    {car_details && car_details.description && car_details.description.length > 100 &&
                      <TouchableOpacity style={styles.readMoreBtn}
                        onPress={() => setCondition("description")}
                      >
                        <Text style={styles.readMoreText}>Read More</Text>
                      </TouchableOpacity>
                    }
                    <BottomSheetBox
                      visible={condition == "description"}
                      onPress={() => setCondition(false)}
                    >
                      {car_details && car_details.description}
                    </BottomSheetBox>
                  </View>
                </View>
                <View style={styles.hr_line1} />

                {/* Insurance & Protection */}
                <View style={styles.descriptionBox}>
                  <Text style={styles.title}>Insurance & Protection</Text>
                  <Text style={styles.text}>Insurance & Protection</Text>
                  <View style={{ alignItems: 'flex-end' }}>
                    <TouchableOpacity style={styles.readMoreBtn}
                      onPress={() => setCondition("insurance")}
                    >
                      <Text style={styles.readMoreText}>Read More</Text>
                    </TouchableOpacity>
                    <BottomSheetBox
                      visible={condition == "insurance"}
                      onPress={() => setCondition(false)}
                    >
                      All protection plans include coverage under a third-party liability insurance policy issued to Auto Passion from Travelers Excess and Surplus Lines Company (“Travelers”). The Travelers policy provides secondary (excess) coverage
                      for third-party liability unless primary coverage is explicitly required by an applicable state statute (e.g., Maryland and New York).
                      Liability coverage is up to $750,000 depending on the plan chosen, except in some states
                      and at some airports that require additional coverage. For New York trips, the liability coverage is $1,250,000. Protection plans also come with 24/7 customer support and access
                      to roadside service, subject to additional terms, conditions, and costs described here
                    </BottomSheetBox>
                  </View>
                </View>
                <View style={styles.hr_line1} />

                {/* car basics */}
                <View style={styles.descriptionBox}>
                  <Text style={styles.title}>Car Basics</Text>
                  <View style={styles.car_basic_row}>
                    <View style={styles.featureRow1} >
                      <View style={styles.featureIcon}>
                        <Icons name={"play"} size={10} color={COLORS.white} />
                      </View>
                      <Text style={styles.featureText}>{car_details.seat} Seats</Text>
                    </View>

                    <View style={styles.featureRow1}>
                      <View style={styles.featureIcon}>
                        <Icons name={"play"} size={10} color={COLORS.white} />
                      </View>
                      <Text style={styles.featureText}>{car_details.fuel == 'petrol' ? 'gasoline' : car_details.fuel}(Premium)</Text>
                    </View>
                  </View>
                </View>


                {car_ratings && car_ratings[0] ?
                  <View style={styles.rating_card_container}>
                    <FlatList
                      data={car_ratings}
                      renderItem={({ item }) => (
                        <ReviewCard
                          // source={item.source}
                          name={item.user_name}
                          rating={item.value}
                          message={item.description}
                          date={formatDate(item.created_at)}
                          deletePress={() => { DeleteReview(item.id), SingleCarDataApi(data && data.car_id) }}
                          showDelete={item.student_id == userId ? true : false}
                        // deletePress={() => console.log("id : ", item.id)}
                        />
                      )}
                      key={item => item.id}
                      horizontal={true}
                      showsVerticalScrollIndicator={false}
                    />


                  </View>
                  :
                  <View style={styles.no_data_box}>
                    <Text style={styles.no_data}>No Car Ratings Available</Text>
                  </View>
                }


                {/* rating card container */}

                {/* <View style={styles.hr_line1} /> */}

                {/* hosted container */}
                {host_details &&
                  <>
                    <View style={styles.hostContainer}>
                      <Text style={styles.title}>Hosted By</Text>
                      <View style={styles.hostRow}>
                        <View style={styles.hostImgBox}>
                          {/* <Image source={images.profileImage} style={styles.hostImage} resizeMode='contain' /> */}
                          <Image source={host_details.profile_image ? { uri: http2 + host_details.profile_image } : images.profileImage} style={styles.hostImage} resizeMode='contain' />
                        </View>
                        <View style={styles.host_title_box}>
                          <Text style={styles.host_name}>{host_details.driver_first_name} {host_details.driver_last_name}</Text>
                          {host_details.stripe_email &&
                            <Text style={styles.host_subtitle}>{host_details.stripe_email}</Text>
                          }
                          <Text style={styles.host_subtitle}>{host_details.stripe_phone}</Text>
                        </View>
                      </View>


                    </View>
                    <View style={styles.hr_line1} />
                  </>
                }

                {/* pick up location */}
                <View style={styles.bookingBox}>
                  <Text style={styles.pickup_title}>Pickup Location</Text>

                  <View>
                    <SelectDropdown
                      dropdownIconPosition={'right'}
                      rowTextStyle={{ textAlign: 'center', padding: 0 }}
                      renderDropdownIcon={() => (
                        <Icons name="down" size={15} style={styles.down} color={COLORS.black} />
                      )}
                      dropdownStyle={styles.dropDown}
                      buttonStyle={styles.dropDownBtnStyle}
                      buttonTextStyle={styles.dropDownTextStyle}
                      data={data && [data.location]}
                      defaultValueByIndex={0}
                      onSelect={(selectedItem, index) => {
                        console.log(selectedItem, index)
                        // onChangeText && onChangeText(selectedItem, index)
                      }}
                      buttonTextAfterSelection={(selectedItem, index) => {
                        return selectedItem
                      }}
                      rowTextForSelection={(item, index) => {
                        return item
                      }}
                    />
                  </View>
                </View>


                <View>
                  <Text style={styles.pickup_title}>Insurance Details</Text>
                  <View style={styles.row}>
                    <CheckBox
                      disabled={false}
                      value={postData.insurance}
                      tintColors={{ true: '#0F56CC', false: 'black' }}
                      onValueChange={() => handleChange("insurance", !postData.insurance)}
                    // style={styles.checkBox}
                    />
                    <Text style={styles.text}>$25/day insurance</Text>
                  </View>
                </View>

                {/* button container */}
                <View style={styles.buttonBox}>

                  <Button1 backgroundColor={COLORS.black} textColor={COLORS.white}
                    onPress={handleCarBook}
                    style={styles.btn_style}
                  // onPress={() => navigation.navigate("CheckOut", { data: postData, carData: singleCarData })}
                  >
                    Book Now
                  </Button1>
                  {!token &&
                    <Button1 backgroundColor={COLORS.white} textColor={COLORS.black}
                      onPress={() => navigation.navigate("Login")}
                      style={styles.btn_style}
                    >
                      Login
                    </Button1>
                  }
                </View>

                {/* review form */}
                <View style={{ alignItems: 'center', }}>

                  <View style={styles.no_data_box}>
                    <Text style={{ ...styles.no_data, marginTop: SIZES.height * .02, }}>Add Reviews</Text>
                  </View>
                  <View style={styles.rating_row2}>
                    <TouchableOpacity
                      onPress={() => handleReview("ratingValue", 1)}
                    >
                      <Icons name={reviewData.ratingValue >= 1 ? "star-fill" : "star-outline"} size={30} color={COLORS.yellow} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleReview("ratingValue", 2)}
                    >
                      <Icons name={reviewData.ratingValue >= 2 ? "star-fill" : "star-outline"} size={30} color={COLORS.yellow} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleReview("ratingValue", 3)}
                    >
                      <Icons name={reviewData.ratingValue >= 3 ? "star-fill" : "star-outline"} size={30} color={COLORS.yellow} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleReview("ratingValue", 4)}
                    >
                      <Icons name={reviewData.ratingValue >= 4 ? "star-fill" : "star-outline"} size={30} color={COLORS.yellow} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleReview("ratingValue", 5)}
                    >
                      <Icons name={reviewData.ratingValue >= 5 ? "star-fill" : "star-outline"} size={30} color={COLORS.yellow} />
                    </TouchableOpacity>
                  </View>
                  <TextInput
                    placeholder={"comment"}
                    placeholderTextColor={"#BABFD1"}
                    onChangeText={(text) => handleReview("ratingDescription", text)}
                    value={reviewData.ratingDescription}
                    numberOfLines={10}
                    multiline={true}
                    style={[styles.inputTextStyle]}

                  />
                  <Button1 backgroundColor={COLORS.black} textColor={COLORS.white}
                    onPress={handleSendReview}
                    style={styles.btn_style}
                  >
                    Submit Review
                  </Button1>
                </View>



                {/* bottom sheet */}
                <BottomSheet
                  visible={checkout}
                  onBackButtonPress={() => setCheckout(!checkout)}
                  onBackdropPress={() => setCheckout(!checkout)}
                >
                  <View style={styles.bottom_container}>
                    <View style={styles.close_container}>
                      <TouchableOpacity style={styles.closeBox}
                        onPress={() => setCheckout(!checkout)}
                      >
                        <Icons name={"close"} size={20} color={COLORS.black} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.bottom_container}>
                      <View style={styles.bottomSheet}>
                        <View style={styles.priceBox}>
                          {/* <Text style={styles.price}>{data && data.currency.symbol + data && data.price}</Text> */}
                        </View>

                        <View style={{ ...styles.totalBtn, backgroundColor: COLORS.light, borderWidth: 0 }}>
                          <Text style={styles.totalBtnText}>Cart Totals</Text>
                        </View>

                        <View style={styles.totalBtn}>
                          <Text style={styles.totalBtnText}>Subtotal</Text>
                          <Text style={styles.totalBtnText}>{"$" + (postData && Number(postData.carPrice))}</Text>
                          {/* <Text style={styles.totalBtnText}>{data && (data.currency.symbol ? data.currency.symbol : "$") + (data && data.price * booking_days)}</Text> */}
                        </View>
                        <View style={styles.totalBtn}>
                          <Text style={styles.totalBtnText}>GST</Text>
                          <Text style={styles.totalBtnText}>{"$" + postData.gst}</Text>
                        </View>

                        <View style={styles.totalBtn}>
                          <Text style={styles.totalBtnText}>QST</Text>
                          <Text style={styles.totalBtnText}>{"$" + postData.qst}</Text>
                          {/* <Text style={styles.totalBtnText}>{data && data.currency.symbol + "0"}</Text> */}
                        </View>
                        <View style={styles.totalBtn}>
                          <Text style={styles.totalBtnText}>Total</Text>
                          <Text style={styles.totalBtnText}>{"$" + (Number(totalPrice)).toFixed(2)}</Text>
                          {/* <Text style={styles.totalBtnText}>{data && data.currency.symbol +(Number(postData.carPrice + Number(postData.gst) + Number(postData.qst))).toFixed(2)}</Text> */}
                          {/* <Text style={styles.totalBtnText}>{data && data.currency.symbol + (Number(postData.insurance ? (data && data.price + 25) * booking_days : data.price * (data && data.price + 25) * booking_days))}</Text> */}
                        </View>


                        <Button1 style={styles.btn}
                          backgroundColor={COLORS.black} textColor={COLORS.white}
                          onPress={() => {
                            setCheckout(!checkout), StoreCarBookingApi({
                              ...postData,
                              "subtotal": postData.carPrice,
                              "carPrice": totalPrice
                            }, (Number(totalPrice)).toFixed(2), "INR", navigation)
                          }}
                        >
                          Process To Check Out
                        </Button1>
                      </View>
                    </View>
                  </View>

                </BottomSheet>
              </View>
            </ScrollView>
          }
        </View>
      }
    </>
  )
}


const mapStateToProps = (state) => ({
  token: state.auth.token,
  loading: state.product.loading,
  singleCarData: state.product.singleCarData,
})

const mapDispatchToProps = {
  createCustomer,
  StoreCarBookingApi,
  DeleteReview,
  AddReviewApi,
  SingleCarDataApi,
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails)



