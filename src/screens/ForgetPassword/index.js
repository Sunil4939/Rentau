import React, { useState } from 'react'
import { View, Text, TouchableOpacity, Linking } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import Button1 from '../../component/atoms/buttons/Button1';
import InputWithIcon from '../../component/atoms/inputs/InputWithIcon';
import { COLORS, SIZES } from '../../constants';
import { ForgetPasswordApi, LoginApi } from '../../redux/actions/authAction';
import styles from './styles';
import { RNToasty } from 'react-native-toasty';



const ForgetPassword = ({ navigation, ForgetPasswordApi }) => {
    const [email, setEmail] = useState('')

    const [postData, setPostData] = useState({
        email: null,
    })
    // console.log(route.params.mobile)
    const handleChange = (name, value) => {
        setPostData({
            ...postData,
            [name]: value
        })
    }

    const handleSubmit = () => {
        if (postData.email) {
            ForgetPasswordApi(postData, navigation)
            setPostData({
                "email": null
            })
        } else {
            RNToasty.Error({
                title: "Please enter your email",
                duration: 2
            })
        }
    }
    return (
        <KeyboardAwareScrollView
            keyboardShouldPersistTaps={'handled'}
            showsVerticalScrollIndicator={false}
            style={styles.container}>
            <View style={{ alignItems: 'center' }}>
                <Text style={styles.title}>Forget Password</Text>
                <InputWithIcon
                    label={"Email Id"}
                    placeholder={"Enter Your Email Id"}
                    leftIcon={"email"}
                    value={postData.email}
                    onChangeText={(text) => handleChange("email", text)}
                />
                {/* <InputWithIcon1
                    label={"Password"}
                    placeholder={"Enter Password"}
                    leftIcon={"lock"}
                    rightIcon={secure ? "eye-off" : "eye"}
                    onPress={() => setSecure(!secure)}
                    secureTextEntry={secure}
                    value={postData.password}
                    onChangeText={(text) => handleChange("password", text)}
                /> */}
                {/* <View style={styles.box}>
                    <TouchableOpacity
                        onPress={() => Linking.openURL("https://www.car.theprojecttest.xyz/reset_password")}
                        // onPress={() => navigation.navigate("ResetPassword")}
                        style={styles.btn}>
                        <Text style={styles.blueText}>Forgot Your Password?</Text>
                    </TouchableOpacity>
                </View> */}
                <Button1 style={{ width: SIZES.width * .9 }}
                    backgroundColor={COLORS.black}
                    textColor={COLORS.white}
                    onPress={handleSubmit}
                >Done</Button1>

                {/* <View style={styles.row}>
                    <View style={styles.line} />
                    <Text style={styles.or}>Or</Text>
                    <View style={styles.line} />
                </View> */}

                {/* <View style={styles.btnRow}>
                    <TouchableOpacity style={styles.socailBtn}>
                        <Icons name={"facebook"} size={25} color={COLORS.black} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socailBtn}>
                        <Icons name={"google"} size={25} color={COLORS.black} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.socailBtn}>
                        <Icons name={"apple"} size={25} color={COLORS.black} />
                    </TouchableOpacity>
                </View> */}

                {/* <View style={styles.row1}>
                    <Text style={styles.text}>Already have  an account?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("SignUp")}
                    >
                        <Text style={styles.blueText}> Sign up</Text>
                    </TouchableOpacity>
                </View> */}
            </View>
        </KeyboardAwareScrollView>
    )
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {
    ForgetPasswordApi,
}

export default connect(mapStateToProps, mapDispatchToProps)(ForgetPassword)