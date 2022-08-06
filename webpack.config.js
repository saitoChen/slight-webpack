/*
 * @Author: chenjianfeng
 * @Date: 2022-08-02 15:48:36
 * @Description: 
 */
import path from 'path'
import { fileURLToPath } from 'url'

const fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(fileName)

export const entry = path.resolve(__dirname, './example/main.js')

export const output =  'dist'
