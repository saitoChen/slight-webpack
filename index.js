/*
 * @Author: chenjianfeng
 * @Date: 2022-07-24 22:51:38
 * @Description: slight
 */

import fs from 'fs'
import { readFileCfg, traverseRelativePath, getPathDir, generatePath } from './utils/file.js'
import babelParser from '@babel/parser'
import traverse from '@babel/traverse'
import { fileURLToPath } from 'url'
import path from 'path'
import {transformFromAst} from '@babel/core'
import render from "art-template"
import { entry, output } from './webpack.config.js'

const fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(fileName)
let id = 0


const createAsset = (path) => {
    const mapping = {}
    // 读取传入路径的内容
    const source = fs.readFileSync(path, readFileCfg)
    // 将传入的内容生成ast
    const ast = babelParser.parse(source, {
        sourceType: 'module'
    })

    // 依赖关系
    const deps = []

    // 从ast中获取到import相关的内容，存入到deps的依赖中
    traverse.default(ast, {
        ImportDeclaration({ node }) {
            deps.push(node.source.value)
        },
    })

    // 将代码中的import转为require
    const {code} = transformFromAst(ast, null, {
        presets: ['@babel/preset-env']
    })

    return {
        code,
        deps,
        mapping,
        id: id++
    }
}

const createGraph = (mainPath) => {
    const mainAsset = createAsset(mainPath)

    const queue = [mainAsset]

    // generate current path's dir
    let currentPath = getPathDir(generatePath(__dirname, mainPath))
    let targetPath = ''
    for (const asset of queue) {
        for (const relativePath of asset.deps) {
            targetPath = traverseRelativePath(currentPath, relativePath)
            const child = createAsset(targetPath)
            asset.mapping[relativePath] = child.id
            queue.push(child)
        }
        currentPath = getPathDir(targetPath)
    }

    return queue
}

const build = () => {
    const graphs = createGraph('./example/main.js')
    const data = graphs.map(asset => {
       return {
           id: asset.id,
           code: asset.code,
           mapping: asset.mapping
       }
    })
    const template = render(path.resolve(__dirname, './template/index.art'), { data })
    fs.writeFileSync(path.resolve(__dirname, './dist/bundle.js'), template)
}

build()