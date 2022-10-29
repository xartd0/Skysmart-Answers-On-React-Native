import { parse } from 'node-html-parser';

export default function parse_answers(html, numtask){
    
    let parsed = parse(html);
    // получаем объект для парсинга
    let temp_ret = {
        'task_num' : 'Задание #' + numtask,
        'answers': '- ' + parsed.querySelector('math-input-answer').rawText,
    } // пока только один тип задания (математика) чисто для тестов

    return temp_re // возвращаем словарь с номером и ответами задания
}