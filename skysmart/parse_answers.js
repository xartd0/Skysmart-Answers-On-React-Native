import { parse } from 'node-html-parser';
import React, { useState } from "react";


export default function parse_answers(html, numtask){

    let parsed = parse(html);

    return 'Задание #' + numtask + '\n' + parsed.querySelector('math-input-answer').rawText
}