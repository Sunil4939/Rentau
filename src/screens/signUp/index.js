import CheckBox from '@react-native-community/checkbox';
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Platform } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RNToasty } from 'react-native-toasty';
import { connect } from 'react-redux';
import Button1 from '../../component/atoms/buttons/Button1';
import InputWithIcon from '../../component/atoms/inputs/InputWithIcon';
import InputWithIcon1 from '../../component/atoms/inputs/InputWithIcon1';
import { COLORS, SIZES } from '../../constants';
import { SignUpApi } from '../../redux/actions/authAction';
import styles from './styles';
import { getDeviceToken } from '../../services/notification';


const SignUp = ({ navigation, SignUpApi, device_token }) => {
    const [secure, setSecure] = useState(true)
    const [secure1, setSecure1] = useState(true)
    const [checked, setChecked] = useState(false)

    const [postData, setPostData] = useState({
        name: null,
        email: null,
        password: null,
        confirm_password: null,
        device_token: null,
    })
    const handleChange = (name, value) => {
        setPostData({
            ...postData,
            [name]: value
        })
    }


    const handleSubmit = () => {
        if (postData.device_token) {
            if (postData.name && postData.email && postData.password && postData.confirm_password) {
                if (checked) {
                    SignUpApi(postData, navigation)
                    // console.log("postdata: ", postData)
                } else {
                    RNToasty.Error({
                        title: "Please checked terms and policy",
                        duration: 2
                    })
                }
            } else {
                RNToasty.Error({
                    title: "Please fill all fields",
                    duration: 2
                })
            }
        } else {
            RNToasty.Error({
                title: "Your device token is null",
                duration: 2
            })
        }

    }

    useEffect(() => {
        if (Platform.OS == "android") {
            getDeviceToken().then(deviceToken => {
                console.log("response device token : ", deviceToken);
                handleChange("device_token", deviceToken)
            }).catch(err => {
                console.log("deviceToken error : ", err);
            })
        } else {
            console.log("error permission")
        }
    }, [])

    console.log("signup postdata : ", postData)


    return (
        <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.title}>Sign up</Text>
                <InputWithIcon
                    label={"Name"}
                    placeholder={"Enter Your Name"}
                    leftIcon={"user"}
                    onChangeText={(text) => handleChange("name", text)}
                    value={postData.name}
                />

                <InputWithIcon
                    label={"Email Id"}
                    placeholder={"Enter Your Email Id"}
                    leftIcon={"email"}
                    onChangeText={(text) => handleChange("email", text)}
                    value={postData.email}
                />
                <InputWithIcon1
                    label={"Password"}
                    placeholder={"Enter Password"}
                    leftIcon={"lock"}
                    rightIcon={secure ? "eye-off" : "eye"}
                    onPress={() => setSecure(!secure)}
                    secureTextEntry={secure}
                    onChangeText={(text) => handleChange("password", text)}
                    value={postData.password}
                />
                <InputWithIcon1
                    label={"Confirm Password"}
                    placeholder={"Enter Password"}
                    leftIcon={"lock"}
                    rightIcon={secure1 ? "eye-off" : "eye"}
                    onPress={() => setSecure1(!secure1)}
                    secureTextEntry={secure1}
                    onChangeText={(text) => handleChange("confirm_password", text)}
                    value={postData.confirm_password}
                />
                <View style={styles.row}>
                    <CheckBox
                        disabled={false}
                        value={checked}
                        tintColors={{ true: '#0F56CC', false: 'black' }}
                        onValueChange={() => setChecked(!checked)}
                        style={{ marginLeft: -5, }}
                    />
                    <View style={styles.row2}>
                        <Text style={styles.text1}>I accept the</Text>
                        <Text style={{ ...styles.text1, borderBottomWidth: 1, borderBottomColor: COLORS.black1 }}> terms of service </Text>
                        <Text style={styles.text1}>and</Text>
                        <Text style={{ ...styles.text1, borderBottomWidth: 1, borderBottomColor: COLORS.black }}> privacy policy.</Text>
                    </View>

                </View>
                <Button1 style={{ width: SIZES.width * .9 }}
                    backgroundColor={COLORS.black}
                    textColor={COLORS.white}
                    onPress={handleSubmit}
                >Sign up</Button1>
                <View style={styles.row1}>
                    <Text style={styles.text}>Already have  an account?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Login")}
                    >
                        <Text style={styles.blueText}> Log in</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAwareScrollView>
    )
}

const mapStateToProps = (state) => ({
    device_token: state.home.device_token,
})

const mapDispatchToProps = {
    SignUpApi,
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)