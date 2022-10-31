import { parse } from 'node-html-parser';

export default function parse_answers(html, numtask){
    
    let parsed = parse(html); // получаем объект для парсинга
    let task_description = ''
    let answer_text = ''
    
    if (html.includes('vim-instruction')){
        task_description = parsed.querySelector('vim-instruction').innerText
    }
    if (html.includes('correct')){
        answer_text += Array.from(parsed.querySelectorAll("[correct='true']")).map(x => x.innerText)
    }
    if (html.includes('math-input-answer')){
        answer_text += Array.from(parsed.querySelectorAll("math-input-answer")).map(x => x.innerText)
    }
    if (html.includes('vim-input-answers')){
        let temp_list = Array.from(parsed.querySelectorAll("vim-input-item")).map(x => x.innerText.toLowerCase())
        answer_text += [...new Set(temp_list)]; //берем только уникальные элементы, т.к skysmart выдает сразу несколько вариантов одного ответа
    }
 
    let temp_ret = {
        'task_num' : 'Задание #' + numtask + '\n' + task_description,
        'answers': answer_text, 
    } // пока мало типов заданий, буду добавлять потихноьку

    return temp_ret // возвращаем словарь с номером и ответами задания
}
