/*
 * @Author: chenjianfeng
 * @Date: 2022-07-24 22:51:38
 * @Description: slight
 */

import fs from 'fs'
import { readFileCfg, getPathDir, traverseRelativePath } from './utils/file.js'
import babelParser from '@babel/parser'
import traverse from '@babel/traverse'
import { fileURLToPath } from 'url'
import path from 'path'
import {transformFromAst} from '@babel/core'

const fileName = fileURLToPath(import.meta.url)
const __dirname = path.dirname(fileName)

const createAsset = (path) => {
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

    const {code} = transformFromAst(ast, null, {
        presets: ['@babel/preset-env']
    })

    return {
        source,
        deps
    }
}

const createGraph = (mainPath) => {
    const mainAsset = createAsset(mainPath)

    const queue = [mainAsset]

    // console.log(traverseRelativePath(currentPath, relativePath))

    let currentPath = path.resolve(__dirname, mainPath)
    // // let currentPath = '/Users/jeffchen/code/app/slight-webpack/example/index.js'

    for (const asset of queue) {
        for (const relativePath of asset.deps) {
            const targetPath = traverseRelativePath(currentPath, relativePath)
            const child = createAsset(targetPath)
            queue.push(child)
            currentPath = targetPath
        }
    }

    // for (const asset of queue) {
    //     for (const relativePath of asset.deps) {
    //         // const normalizePath = path.normalize(relativePath)
    //         const normalizePath = path.normalize('../../asset/index.js')
    //         const currentPathIsFile = !!path.parse(currentPath).ext
    //         const notInSameFolder = normalizePath.includes('..')
    //         // 当前完整路径
    //         let targetPath;
    //         if (!currentPathIsFile && !notInSameFolder) {
    //             console.log('------------1')
    //             targetPath = path.resolve(currentPath, normalizePath)
    //         }
    //         if (currentPathIsFile && !notInSameFolder) {
    //             console.log('------------2')
    //             currentPath = getPathDir(currentPath)
    //             targetPath = path.resolve(currentPath, normalizePath)
    //             console.log(targetPath)
    //         }
    //         if (currentPathIsFile && notInSameFolder) {
    //             console.log('-------------3')
    //             currentPath = getPathDir(currentPath)
    //             targetPath = path.resolve(currentPath, normalizePath)
    //             console.log(targetPath)
    //         }
    //         if (!currentPathIsFile && notInSameFolder) {
    //             console.log('-------------4')
    //             targetPath = path.resolve(currentPath, normalizePath)
    //             console.log(targetPath)
    //         }

    //     }
    //     // 下次循环时需要更新currentPath的状态  -> currentPath = targetPath
    // }

    
    // const result = path.normalize('./components/bar.js')
    // console.log(__dirname)
    // console.log(result)
    // console.log(result.includes('..'))

    // const base = '/Users/jeffchen/code/app/slight-webpack/example/components/'
    // const relative = '../../asset/test.js'

    // console.log('path --->', path.resolve(base, relative))

    // for (const asset of queue) {
    //     for (const relativePath of asset.deps) {
    //         // 获取入口文件下所有的依赖文件
    //         // ？问题，components下的依赖没法拿到正确路径
    //         // 解决方案，每次循环时都进入到对应得路径进行处理
    //         console.log(relativePath)
    //         // console.log(__dirname)     
    //         const currentPath = path.resolve('./example', relativePath)
    //         console.log(currentPath)
    //         console.log(path.normalize('./../../components/bar.js'))
    //         // const currentPath = path.resolve(__dirname, './example', relativePath)
    //         // console.log('currentPath -->', currentPath)
    //         // const child = createAsset(currentPath)
    //         // console.log(child)
    //         // // 递归的去插入模块到队列中
    //         // queue.push(child)
    //     }
    // }
    return queue
}

console.log(createGraph('./example/main.js'))

