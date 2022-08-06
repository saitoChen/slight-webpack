import bar from './bar.js'
import {currentData} from '../utils/index.js'
import { lang } from './language.js'
bar()
const date = currentData()
console.log(date)
console.log('This lang is ->', lang)
const entry = () => {
    console.log('This is component entry!')
}

export default entry