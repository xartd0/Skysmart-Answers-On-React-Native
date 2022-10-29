
import {Text, View, TextInput, Button, ScrollView, SafeAreaView, CardSection } from 'react-native';
import {Image} from 'react-native' ; 
import { useFonts } from 'expo-font';
import React, { useState } from "react";
import { TouchableOpacity} from 'react-native'
import { useWindowDimensions } from 'react-native';
import styles from './styles/styles.js';
import Parse_answers from './skysmart/parse_answers'
import { FlatGrid } from 'react-native-super-grid';
import Toast from 'react-native-toast-message';

const auth_token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpYXQiOjE2NjY1Mzg5MjQsImV4cCI6MTY2OTEzMDkyNCwicm9sZXMiOlsiUk9MRV9FRFVfU0tZU01BUlRfU1RVREVOVF9VU0FHRSJdLCJhdXRoVXNlcklkIjpudWxsLCJ1c2VySWQiOjY3Mzg5ODU3LCJlbWFpbCI6bnVsbCwibmFtZSI6bnVsbCwic3VybmFtZSI6bnVsbCwiaWRlbnRpdHkiOiJmdXh1Z29saXppIn0.llqu6-Sxsu6PKuxW1oCUKG0zvu7kYC8R4YvmlozBgWZ0qKiTJsltyrvm2qV0Xpu1H5bEjcwRWUM5n02Zq-Te_gT9dFsA78UQdUvOfHzqCzArIWumhOh5iIzdMpaDpS_ZHkHKk13diFhYViTo3xwOYvYFzrw9IiqsKPtjA18uOyFEQB1UZaAT63DufuC1edieiTr9AYKCQtQMV41ZVHwCp1DW4NE4jbo7F1pnjzXsj9cEsNEflKd6as8Dj91YyW1b5WtIt6otjucswf-bTVuiaaMFNK_LFRRuBUJ8KUUXFCpf2GIMEu-39VL2lY7BEjhG8zfZuEL_b51wamRPwPO-RYbLZS5vvLyRsHQ-P_auZMeqmjTA4ThOtQgoBL7Q9tre1VAa1MMxWn3AsXEHPWInPg04gqEIoRS5w5ADm5rWW5MaTa5ce1lUA6e77AC4IvgqzZVpNxqb__3HbfdoQ1P-mP8lTRIkH7PhKZAvYXeenRvzBBRP14v99u1LlpyK4m-e-_gm5-lK54pCXUpuUFi7Uw1sf0sZmaOPu0-cku6N4cogo_xCkU5NKknQmXlqFNrfG2bvN-nDzw1DTwNiaJ6Lod5xGS5GcPcFaF69bqku5hxkxEkg52sACFXRixnWHezNzyrkh7ccX_NdLgfk6VDdOX9U5AqLBE7fh_XvIsG1GaM';
const headers = {
    'Accept': 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Authorization' : auth_token,
}

export default function App() {
  let custom_fonts = useFonts({
    'roboto-regular': require('./assets/fonts/roboto-regular.ttf'),
    'roboto-700': require('./assets/fonts/roboto-700.ttf'),
  });

  const [data, setAnsw] = useState([]);
  const { width } = useWindowDimensions();
  const [taskHash,setText] = useState('');

  async function get_answers(taskHash){
    if (taskHash == undefined){
      Toast.show({
        type: 'error',
        text1: 'Укажите ссылку на тест.',
        text2: 'Пример: https://edu.skysmart.ru/student/likimugefo'
      });
    }else{
      const preview_url = 'https://api-edu.skysmart.ru/api/v1/task/preview'
      const step_url = 'https://api-edu.skysmart.ru/api/v1/content/step/load?stepUuid='
  
      const get_steps = await fetch(preview_url,{
          method: 'POST',
          headers: headers, 
          body: JSON.stringify({taskHash: taskHash,})
      })
      const steps = await get_steps.json()
      if (steps.meta.stepUuids.lenght != 0){
        Toast.show({
          type: 'success',
          text1: 'Ссылка правильная!',
          text2: 'Получаем ответы, подождите.'
        });
      }
  
      steps.meta.stepUuids.forEach(async (step) => {
          let get_answers_of_step = await fetch(step_url + step, {method: 'GET',headers: headers})
          let answers_of_step = await get_answers_of_step.json()
  
          let temp_answer = Parse_answers(answers_of_step.content, steps.meta.stepUuids.indexOf(step) + 1)
          
          data.push(temp_answer)
      })
      console.log(data)
    }
  }

  if (custom_fonts[0]) {
    return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.rectStack}>
          <View style={styles.rect}>
            <View style={styles.ответыНаSkysmartRow}>
              <Text style={styles.ответыНаSkysmart}>
                Ответы на{"\n"}Skysmart
              </Text>
              <Image
                source={require("./assets/images/1f85af07ddcb29e22eedf493525d1e2f.png")}
                resizeMode="contain"
                style={styles.image}
              ></Image>
            </View>
          </View>
          <Text style={styles.loremIpsum}>поддерживаются не все тесты</Text>
        </View>
      </View>
      <View style={styles.link_input}>
        <View style={styles.rect2Row}>
          <View style={styles.rect2}>
            <TextInput style={styles.loremIpsum2} 
                  placeholder =  "Введите ссылку на тест" 
                  placeholderTextColor = "#A4A4A4"
                  onChangeText={(taskHash) => setText(taskHash.split('student/')[1])}
                  value={taskHash}/>
          </View>
          <View style={styles.group}>
            <TouchableOpacity style={styles.button_answers} onPress={() => get_answers(taskHash)}>
              <Image
                source={require("./assets/images/right-arrow.png")}
                resizeMode="contain"
                style={styles.image2}
              ></Image>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={styles.answers_grid}>
      <FlatGrid
            itemDimension={180}
            data={data}
            renderItem={({ item }) => (<View style={styles.rect3} key={item['task_num']}><Text style={styles.text_answers_task}>{item['task_num']}</Text><Text style={styles.answer_text}>{item['answers']}</Text></View>)}
            />
      </View>
      <Toast/>
    </View>
    );
  }
  
}
