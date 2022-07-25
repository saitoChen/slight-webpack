/*
 * @Author: chenjianfeng
 * @Date: 2022-07-24 22:51:38
 * @Description: slight
 */

import fs from 'fs'
import { readCfg } from './utils/file.js'
import babelParser from '@babel/parser'
import traverse from '@babel/traverse'

const createAsset = async () => {
    const source = fs.readFileSync('./example/main.js', readCfg)
    const ast = babelParser.parse(source, {
        sourceType: 'module'
    })

    // 依赖关系
    const deps = []

    traverse.default(ast, {
        ImportDeclaration({ node }) {
            deps.push(node.source.value)
        },
    })

    return {
        source,
        deps
    }
}

const asset = createAsset()
console.log(asset)