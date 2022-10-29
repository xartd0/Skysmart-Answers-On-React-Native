import { parse } from 'node-html-parser';
import React, { useState } from "react";


export default function parse_answers(html, numtask){
    
    let parsed = parse(html);
    let temp_ret = {
        'task_num' : 'Задание #' + numtask,
        'answers': '- ' + parsed.querySelector('math-input-answer').rawText,
    }

    return temp_ret
}