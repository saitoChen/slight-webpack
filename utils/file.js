/*
 * @Author: chenjianfeng
 * @Date: 2022-07-24 23:22:17
 * @Description: fs utils
 */
import path from 'path'

export const readFileCfg = {
    encoding: 'utf-8'
}

export const removePathBase = (path, base) => {
    const idx = path.lastIndexOf(base)
    return path.slice(0, idx)
}

export const getPathDir = (currentPath) => {
    return path.parse(currentPath).dir
}

const relativePathCountReg = /\.\./g 
export const relativePathCount = (path) => {
    return path.match(relativePathCountReg).length
}

export const generatePath = (basePath, targetPath) => {
    return path.resolve(basePath, targetPath)
}

// 将当前文件所处路径转化为引入文件所在路径
export const traverseRelativePath = (currentPath, relativePath) => {
    // normalize pass in relativePath
    // ../components/index.js -> ../components/index.js
    // ./components/index.js -> components/index.js
    const normalizeRelativePath = path.normalize(relativePath)
    // const currentPathIsFile = !!path.parse(currentPath).ext
    // const isRelativePathInSameFolder = !normalizeRelativePath.includes('..')

     // is currentPath and relativePath in same path
    // if (currentPathIsFile) {
    //     currentPath = getPathDir(currentPath)
    // }
    return generatePath(currentPath, normalizeRelativePath)

}