
import { connect } from 'react-redux';
import { confirmPaymentIntent, createCustomer, createPaymentIntent } from '../../redux/actions/paymentAction';
import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import Button1 from '../../component/atoms/buttons/Button1';
import { COLORS, SIZES } from '../../constants';
import styles from './styles'
import Loading1 from '../../component/atoms/Loading/Loading1'
import { CreatePaymentApi, CreateSessionId, UpdateBookingStatus } from '../../redux/actions/bookingAction';



const Payment = ({ navigation, CreatePaymentApi, createCustomer, UpdateBookingStatus, customerData, route, paymentIntent, loading }) => {
    const [paymentStatus, setPaymentStatus] = useState(null);
    const { initPaymentSheet, presentPaymentSheet } = useStripe();

    const amount = route.params && route.params.amount
    const car_booking_id = route.params && route.params.car_booking_id

    // console.log("payment intent secret key : ", paymentIntent && paymentIntent.id)

    // console.log("payment intent secret key : ", paymentIntent && paymentIntent.id, paymentIntent && paymentIntent.client_secret)
    const initializePaymentSheet = async () => {
        const result = await initPaymentSheet({
            merchantDisplayName: "Example, Inc.",
            paymentIntentClientSecret: paymentIntent && paymentIntent.client_secret,
            customerId: customerData && customerData.id,
        });
        if (result.error) {
            console.log('Error initializing payment sheet:', result.error);
        } else {
            openPaymentSheet()
        }
    };

    const openPaymentSheet = async () => {

        const result = await presentPaymentSheet({
            paymentIntentClientSecret: paymentIntent && paymentIntent.client_secret,
            paymentMethodTypes: ['card'],
        });
        console.log('Error processing payment:', result);
        if (result.error) {
            // console.log('Error processing payment:', result.error);
            setPaymentStatus('failed');
            navigation.navigate("PaymentFailed")
        } else {
           
            // navigation.navigate("PaymentSuccess", { amount: amount })
            // UpdateBookingStatus(car_booking_id, paymentIntent && paymentIntent.id, navigation)
            CreatePaymentApi({
                car_booking_id: car_booking_id,
                payment_intent: paymentIntent && paymentIntent.id,
                currency: "inr"
            },amount, navigation)
            setPaymentStatus('succeeded');
        }
        //  else if (result.paymentStatus === 'succeeded') {
        //     console.log('Payment succeeded!');
        //     setPaymentStatus('succeeded');
        //     navigation.navigate("PaymentSuccess", { success: "success", paymentResult: result, amount:amount })
        // } else {
        //     console.log('Payment failed:', result.paymentStatus);
        //     setPaymentStatus('failed');
        //     navigation.navigate("PaymentSuccess", { success: "failed", amount:amount })
        // }
    };

    // const stripe = useStripe()

    // const [cardInfo, setCardInfo] = useState(null)

    //   const fetchCardDetails = (cardDetails) => {
    //     // console.log('my cardDetails', cardDetails);
    //     if (cardDetails.complete) {
    //       setCardInfo(cardDetails)
    //     } else {
    //       setCardInfo(null)
    //     }
    //   }

    //   const onDone = async () => {

    //     try {
    //       let res = await stripe.confirmPayment("pi_3MzYl9SCc88vSVBk1ttwwxtN_secret_UGxebmE33pSw5D1Tnj9eMEviE", { 
    //         paymentMethodType: "Card" 
    //     })
    //       console.log("confirmPaymentIntent response : ", res)
    //       alert("payment success")
    //     } catch (err) {
    //       console.log("payment err : ", err)
    //     }
    //     console.log("card info  : ", cardInfo)

    //   }
    //   const { confirmPayment } = useStripe();

    //   const handlePayment = async () => {

    //     try {
    //       const { paymentIntent, error } = await confirmPayment('pi_3Myf8WSCc88vSVBk1SsJrx1V_secret_H9cB1RC3kpqp2mgGmSzWqUIk9', {
    //         paymentMethodType: 'Card',
    //         cardDetails: cardInfo,
    //         billingDetails: {
    //           name: 'John Doe',
    //           email: 'john.doe@example.com',
    //         },
    //       });

    //       if (error) {
    //         console.log('Payment failed:', error);
    //       } else {
    //         console.log('Payment succeeded:', paymentIntent);
    //       }
    //     } catch (e) {
    //       console.log('Error:', e);
    //     }
    //   };

    return (
        <>
            {loading ?
                <Loading1 />
                :
                <View
                    style={styles.container}
                >
                    <StatusBar
                        backgroundColor={COLORS.light}
                        barStyle="dark-content"
                    />

                    <View style={styles.btn_box}>
                        <Button1 backgroundColor={"#000000"}
                            textColor={COLORS.white}
                            style={{ width: SIZES.width * .9, borderWidth: 0 }}
                            onPress={initializePaymentSheet}
                        >
                            Pay Now
                        </Button1>
                    </View>

                </View>
            }
        </>
    )
}

const mapStateToProps = (state) => ({
    loading: state.payment.loading,
    customerData: state.payment.customerData,
    paymentIntent: state.payment.paymentIntent,
})

const mapDispatchToProps = {
    createPaymentIntent,
    createCustomer,
    confirmPaymentIntent,
    UpdateBookingStatus,
    CreatePaymentApi,
}

export default connect(mapStateToProps, mapDispatchToProps)(Payment)