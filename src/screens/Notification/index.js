import { View, Text, StatusBar, TouchableOpacity, Image, ScrollView } from 'react-native'
import React from 'react'
import { COLORS, SIZES, images } from '../../constants'
import { connect } from 'react-redux'
import Icons from '../../component/atoms/Icons'
import styles from './styles'
import formatAMPM from '../../services/time'
import { http2 } from '../../services/api'

const Notification = ({ loading, route, }) => {

    const data =  route?.params?.data

    console.log("route notification data : ", route?.params?.data)


    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <StatusBar
                backgroundColor={COLORS.light}
                barStyle="dark-content"
            />
                <View style={styles.container1}>
                    <View style={styles.title_box}>
                        <Text style={styles.title}>Customer Details</Text>
                        <View>
                            <View style={styles.pickup_row}>
                                <Text style={styles.label}>Customer Name: </Text>
                                <Text style={styles.text}>{data?.customer_name}</Text>
                            </View>
                            <View style={styles.pickup_row}>
                                <Text style={styles.label}>Customer Email : </Text>
                                <Text style={styles.text}>{data?.customer_email}</Text>
                            </View>
                            {/* <Text style={{ ...styles.title, marginTop: SIZES.height * .02, }}>Car Details</Text> */}
                            <Text ></Text> 
                            <View style={styles.top_row}>
                                <View style={styles.top_box}>
                                    <View style={styles.label_row}>
                                        <Text style={styles.label}>Car Name: </Text>
                                        <Text style={styles.text}>{data?.name}</Text>
                                    </View>
                                    <View style={styles.label_row}>
                                        <Text style={styles.label}>Car Details: </Text>
                                        <Text style={styles.text}>{ `${data?.brand} ${data?.transmission} ${data?.fuel == 'petrol' ? 'gasoline' : data?.fuel} ${data?.color} ${data?.build_year}`}</Text>
                                    </View>
                                    <View style={styles.label_row}>
                                        <Text style={styles.label}>Insurance Amount: </Text>
                                        <Text style={styles.text}>{"$"+ (data?.insurance_amt > 0 ? data?.insurance_amt :  0 )}</Text>
                                    </View> 
                                    <View style={styles.review_row}>
                                        <Text style={styles.review}>5.0</Text>
                                        <Icons name={"star"} color={COLORS.black} size={12} />
                                        <Text style={styles.review}>{data?.review}</Text>
                                    </View>
                                    
                                </View>
                                <Text style={styles.price}>${data?.price}</Text>
                            </View>

                        </View>

                    </View>

                    <View style={styles.date_row}>
                        <Text style={styles.pickup}>Pickup Date:-</Text>
                        <Text style={styles.text}>{data?.pickup_date?.split("T")?.[0]}</Text>
                        <Text style={styles.text}>{ data?.start_time}</Text>
                        {/* <Text style={styles.text}>{formatAMPM(new Date(data && data.start_time))}</Text> */}
                    </View>
                    <View style={styles.hr_line} />
                    <View style={styles.date_row}>
                        <Text style={styles.pickup}>Drop Date:-</Text>
                        <Text style={styles.text}>{data?.drop_date?.split("T")?.[0]}</Text>
                        <Text style={styles.text}>{data?.end_time}</Text>
                        {/* <Text style={styles.text}>{formatAMPM(new Date(data && data.end_time))}</Text> */}
                    </View>
                    <View style={styles.hr_line} />
                    <View>
                        <View style={styles.title_box}>
                            <Text style={styles.title1}>Pickup Details</Text>
                            <View style={styles.pickup_row}>
                                <Text style={styles.label}>Pickup Latitude: </Text>
                                <Text style={styles.text}>{data?.pickup_latitude ? data?.pickup_latitude : "Not Available"}</Text>
                            </View>
                            <View style={styles.pickup_row}>
                                <Text style={styles.label}>Pickup Longitude: </Text>
                                <Text style={styles.text}>{data?.pickup_longitude ? data?.pickup_longitude : "Not Available"}</Text>
                            </View>

                            <View style={styles.pickup_row}>
                                <Text style={styles.label}>Description: </Text>
                                {/* <Text style={styles.label}>Pickup & Drop Location: </Text> */}
                                <Text style={styles.text}>{data?.description ? data?.description : "Not Available"}</Text>
                            </View>
                        </View>
                    </View>
                </View>

        </ScrollView>
    )
}

const mapStateToProps = (state) => ({
    loading: state.auth.loading,
    
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Notification)