import fs from 'fs'
import { defineConfig } from 'tsup'
import dotenv from 'dotenv'

const env = dotenv.config({
    path: '.env',
})?.parsed || {}

const banner = fs.readFileSync('./src/index.ts', 'utf8').match(/\/\/ ==UserScript==[\s\S]*?\/\/ ==\/UserScript==/)?.[0]

export default defineConfig({
    platform: 'browser', // 目标平台
    entry: ['src/index.ts'],
    format: ['cjs'],
    outExtension({ format }) {
        switch (format) {
            case 'cjs':
                return {
                    js: '.cjs',
                    dts: '.d.ts',
                }
            case 'esm':
                return {
                    js: '.mjs',
                    dts: '.d.ts',
                }
            case 'iife':
                return {
                    js: '.global.js',
                    dts: '.d.ts',
                }
            default:
                break
        }
        return {
            js: '.js',
            dts: '.d.ts',
        }
    },
    splitting: false, // 代码拆分
    sourcemap: false,
    clean: true,
    dts: false,
    minify: false, // 缩小输出
    shims: true, // 注入 cjs 和 esm 填充代码，解决 import.meta.url 和 __dirname 的兼容问题
    esbuildOptions(options, context) { // 设置编码格式
        options.charset = 'utf8'
    },
    // external: [], // 排除的依赖项
    // noExternal: [/(.*)/], // 将依赖打包到一个文件中
    // bundle: true,
    banner: {
        js: banner,
    },
    env: {
        ...env,
    },
    define: {},
    replaceNodeEnv: true,
})
