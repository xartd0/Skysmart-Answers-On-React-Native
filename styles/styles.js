import { StyleSheet} from 'react-native';

export default StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center', 
    },
    header_group: {
      width: 326,
      height: 107,
      marginTop: 50,
    },
    header_intro: {
      width: 326,
      height: 99,
      position: "absolute",
      backgroundColor: "rgba(228,251,255,1)",
      borderRadius: 9,
      flexDirection: "row"
    },
    header_main_text: {
      fontFamily: "roboto-700",
      color: "rgba(20,155,206,1)",
      height: 58,
      width: 212,
      fontSize: 23,
      marginTop: 9
    },
    image_header: {
      width: 70,
      height: 85,
      marginLeft: 12
    },
    header_text_group: {
      height: 85,
      flexDirection: "row",
      flex: 1,
      marginRight: 17,
      marginLeft: 15
    },
    header_text_mini: {
      top: 66,
      left: 15,
      position: "absolute",
      fontFamily: "roboto-regular",
      color: "rgba(0,0,0,1)",
      height: 39,
      width: 212,
      opacity: 0.45
    },
    link_input: {
      width: 327,
      height: 39,
      flexDirection: "row",
      marginTop: 7,
    },
    link_input_cont: {
      width: 280,
      height: 39,
      backgroundColor: "rgba(244,245,246,1)",
      borderRadius: 9
    },
    link_input_text: {
      fontFamily: "roboto-regular",
      color: "rgba(164,164,164,1)",
      width: 280,
      height: 39,
      padding: 10,
    },
    group: {
      width: 39,
      height: 39,
      marginLeft: 6
    },
    button_answers: {
      width: 39,
      height: 39,
      backgroundColor: "rgba(250,216,0,1)",
      borderRadius: 9
    },
    answer_button_image: {
      width: 16,
      height: 15,
      marginTop: 12,
      marginLeft: 13
    },
    link_input_group: {
      height: 39,
      flexDirection: "row",
      flex: 1,
      marginRight: -50
    },
    answer_cont: {
      width: 326,
      height: 100,
      backgroundColor: "rgba(244,245,246,1)",
      borderRadius: 9,
      borderWidth: 0.5,
      borderColor: '#e9eced',
      marginTop: 16,
    },
    answer_text: {
      marginTop: 4,
      marginLeft: 25
    },
    text_answers_task :{
      fontSize: 15,
      fontWeight: "bold",
      marginTop: 15,
      marginLeft: 15,
    },
    answers_grid:{
      flex: 1,
    }
  });