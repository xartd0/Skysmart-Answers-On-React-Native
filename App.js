
import {Text, View, TextInput, ScrollView, Animated } from 'react-native';
import {Image} from 'react-native' ; 
import { useFonts } from 'expo-font';
import React, { useEffect, useState, useRef } from "react";
import { TouchableOpacity} from 'react-native'
import styles from './styles/styles.js';
import Parse_answers from './skysmart/parse_answers'
import Toast from 'react-native-toast-message';

const auth_token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NjY1Mzg5MjQsImV4cCI6MTY2OTEzMDkyNCwicm9sZXMiOlsiUk9MRV9FRFVfU0tZU01BUlRfU1RVREVOVF9VU0FHRSJdLCJhdXRoVXNlcklkIjpudWxsLCJ1c2VySWQiOjY3Mzg5ODU3LCJlbWFpbCI6bnVsbCwibmFtZSI6bnVsbCwic3VybmFtZSI6bnVsbCwiaWRlbnRpdHkiOiJmdXh1Z29saXppIn0.llqu6-Sxsu6PKuxW1oCUKG0zvu7kYC8R4YvmlozBgWZ0qKiTJsltyrvm2qV0Xpu1H5bEjcwRWUM5n02Zq-Te_gT9dFsA78UQdUvOfHzqCzArIWumhOh5iIzdMpaDpS_ZHkHKk13diFhYViTo3xwOYvYFzrw9IiqsKPtjA18uOyFEQB1UZaAT63DufuC1edieiTr9AYKCQtQMV41ZVHwCp1DW4NE4jbo7F1pnjzXsj9cEsNEflKd6as8Dj91YyW1b5WtIt6otjucswf-bTVuiaaMFNK_LFRRuBUJ8KUUXFCpf2GIMEu-39VL2lY7BEjhG8zfZuEL_b51wamRPwPO-RYbLZS5vvLyRsHQ-P_auZMeqmjTA4ThOtQgoBL7Q9tre1VAa1MMxWn3AsXEHPWInPg04gqEIoRS5w5ADm5rWW5MaTa5ce1lUA6e77AC4IvgqzZVpNxqb__3HbfdoQ1P-mP8lTRIkH7PhKZAvYXeenRvzBBRP14v99u1LlpyK4m-e-_gm5-lK54pCXUpuUFi7Uw1sf0sZmaOPu0-cku6N4cogo_xCkU5NKknQmXlqFNrfG2bvN-nDzw1DTwNiaJ6Lod5xGS5GcPcFaF69bqku5hxkxEkg52sACFXRixnWHezNzyrkh7ccX_NdLgfk6VDdOX9U5AqLBE7fh_XvIsG1GaM';
const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Authorization' : auth_token,
}

const FadeInView = (props) => { 
  /**
 * Простая анимация с доков https://reactnative.dev/docs/animations
 */

  const fadeAnim = useRef(new Animated.Value(0)).current  

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }
    ).start();
  }, [fadeAnim])

  return (
    <Animated.View                 
      style={{
        ...props.style,
        opacity: fadeAnim,         
      }}
    >
      {props.children}
    </Animated.View>
  );
}

export default function App() {
  /**
 * Подгрузка шрифтов
 */
  let custom_fonts = useFonts({
    'roboto-regular': require('./assets/fonts/roboto-regular.ttf'),
    'roboto-700': require('./assets/fonts/roboto-700.ttf'),
  });

  const [data, setAnsw] = useState([]); // массив для всех ответов
  const [taskHash,setText] = useState(''); // стэйт для названия комнаты
  const fadeAnim = useRef(new Animated.Value(0)).current  // подгрузка анимации

  const removeElement = (num) => { // удаление ответа
    data.forEach(element => { // цикл по все овтетам
      if (element['task_num'] == num){
        data.splice(data.indexOf(element), 1) // удаляем из массива
      }
    });
    setText(num.split('\n')[0] + ' удалено!') // обновляем стейт, чтобы элементы обновились
  };

  const format_link = (link) => {
    if (link.includes('start')){
      return link.split('task/')[1].split('/')[0]
    }else{
      return link.split('student/')[1]
    }
  }

  const Get_answers = async(taskHash) =>{
    if (taskHash == undefined){ // проверка, ввел ли что-нибуль пользователь
      Toast.show({ // уведомление с ошибкой
        type: 'error',
        text1: 'Укажите ссылку на тест.',
        text2: 'Пример: https://edu.skysmart.ru/student/likimugefo'
      });
    }else{ // обнуляем массив, чтобы ответы не перемешались
      if (data.length != 0){
        data.length = 0
      }
      const preview_url = 'https://api-edu.skysmart.ru/api/v1/task/preview' // ссылка на api ская, для получения айди заданий
      const step_url = 'https://api-edu.skysmart.ru/api/v1/content/step/load?stepUuid=' // ссылка на api ская, для получения контента каждого задания
  
      const get_steps = await fetch(preview_url,{ // получаем все uuid заданий теста
          method: 'POST',
          headers: headers, 
          body: JSON.stringify({taskHash: taskHash,}) // сюда кладем название комнаты
      }) 
      const steps = await get_steps.json() // получаем json со массивом всех uuid заданий
      if (Object.values(steps.meta.stepUuids).length != 0){
         Toast.show({ // успешное уведомление, если задания есть
          type: 'success',
          text1: 'Успешно!',
          text2: 'Получаем ответы, подождите.'
        });
      }
  
      steps.meta.stepUuids.forEach(async (step) => { // цикл по всем uuid
          let get_answers_of_step = await fetch(step_url + step, {method: 'GET',headers: headers}) // запрос для получения html задания
          let answers_of_step = await get_answers_of_step.json() // получаем json с контентом задания
          let task_num = steps.meta.stepUuids.indexOf(step) + 1 // получаем номер задания
  
          let temp_answer = Parse_answers(answers_of_step.content, task_num) // парсим ответы задания по html из запроса
          
          data.push(temp_answer) // добавляем в массив

          if (data.length == Object.values(steps.meta.stepUuids).length){ // проверяем не последнее ли это задание
            setText('Все ответы получены!') // если да, то обновляем стейт на данный текст
          }else{
            setText('Получаем ответы на #' + task_num) // если нет, то обновляем стейт и отправляем пользователю номер задания
          }
      })
    }
  }

  if (custom_fonts[0]) { // ну тут фронт короче
    return (
    <View style={styles.container}>
      <View style={styles.header_group}>
        <View style={styles.header_intro}>
          <View style={styles.header_text_group}>
            <Text style={styles.header_main_text}>
              Ответы на{"\n"}Skysmart
            </Text>
            <Image
              source={require("./assets/images/1f85af07ddcb29e22eedf493525d1e2f.png")}
              resizeMode="contain"
              style={styles.image_header}
            ></Image>
          </View>
        </View>
        <Text style={styles.header_text_mini}>поддерживаются не все тесты</Text>
      </View>
      <View style={styles.link_input}>
        <View style={styles.link_input_group}>
          <View style={styles.link_input_cont}>
            <TextInput style={styles.link_input_text} 
                  placeholder =  "Введите ссылку на тест" 
                  placeholderTextColor = "#A4A4A4"
                  onChangeText={(taskHash) => setText(format_link(taskHash))}
                  value={taskHash}/>
          </View>
          <View style={styles.group}>
            <TouchableOpacity style={styles.button_answers} onPress={() => Get_answers(taskHash)}>
              <Image
                source={require("./assets/images/right-arrow.png")}
                resizeMode="contain"
                style={styles.answer_button_image}
              ></Image>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.answers_grid}>
          <ScrollView>
            {data.map((item) =>
              <FadeInView key={item['task_num']}>
                <View style={styles.answer_cont}>
                  <Text style={styles.text_answers_task}>{item['task_num']}</Text>
                  <Text style={styles.answer_text}>{item['answers']}</Text>
                  <TouchableOpacity onPress={() => removeElement(item['task_num'])}>
                    <Image
                      source={require("./assets/images/trash-10-128.png")}
                      resizeMode="contain"
                      style={styles.button_delete_answer_image}>
                    </Image>
                  </TouchableOpacity>
                </View>
              </FadeInView>
            )}
          </ScrollView>
        </View>
      <Toast/>
    </View>
    );
  }
}
