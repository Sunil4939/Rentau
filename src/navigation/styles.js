import { StyleSheet, Dimensions } from "react-native";
import { COLORS, FONTS, SIZES } from "../constants";
const { width, height } = Dimensions.get('window')


export default StyleSheet.create({
  
    logo:{
        width: width * .15,
        height:height * .05,
    },
    menu:{
        width: width * .06,
        height:height * .03,
    },
    brandName:{
        width: width * .6,
        height: height * .05,
    },
    headerBtn:{
        width: width * .1,
        height:height * .05,
        justifyContent:'center',
        alignItems:'center',
        borderWidth:1,
        borderRadius:50,
        backgroundColor: '#FDFDFD',
        borderColor: '#E3E9ED',
        marginRight: width * .04,
    },
    header:{
        backgroundColor: COLORS.white,
        elevation:10,
    },
   
// ================ bottom tab ==============

tabBarStyle:{
    backgroundColor: COLORS.white, 
    borderRadius: 12, 
    marginHorizontal: 0, 
    paddingVertical: 8,  
    height: SIZES.height * .08, 
    paddingBottom: 8, 
    elevation: 15
},

labelStyle: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    marginBottom: -2,
},
 
  })