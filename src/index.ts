/* eslint-disable no-undef */
// ==UserScript==
// @name         图片视频音频下载加速
// @namespace    https://cmyr.dev/
// @version      0.1
// @description  在默认右键菜单中添加“通过 CDN 加速下载”选项，使用自定义 CDN 链接加速下载图片、视频和音频
// @author       CaoMeiYouRen
// @match        *://*/*
// @grant        GM_registerMenuCommand
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict'

    // 自定义CDN链接
    const cdnBaseUrl = process.env.CDN_BASE_URL || 'https://proxy.example.com/'
    const isImageVideoAudioRegex = /\.(jpg|jpeg|png|gif|webp|bmp|ico|cur|heic|svg|mp3|m4a|aac|ogg|mid|midi|wav|mp4|mov|webm|mpg|mpeg|avi|ogv|flv|wmv|zip|rar|7z|gz|tgz)$/

    // 记录当前选择的媒体元素
    let selectedMediaElement = null

    document.body.addEventListener('contextmenu', (event) => {
        const element = event.target as Element
        if (!element) {
            return
        }
        if (element.nodeType === Node.ELEMENT_NODE && ['IMG', 'VIDEO', 'AUDIO', 'A'].includes(element.tagName)) {
            if (element.tagName === 'A') { // 判断链接是否是 图片视频音频
                try {
                    // 判断链接末尾是否是 指定后缀名
                    const linkEle = element as HTMLLinkElement
                    const fullLink = linkEle.href
                    const url = new URL(fullLink)
                    const baseLink = url.origin + url.pathname // 去除参数的基础路径
                    // 如果两种情况都不符合，就排除
                    if (!isImageVideoAudioRegex.test(fullLink) && !isImageVideoAudioRegex.test(baseLink)) {
                        return
                    }
                } catch (error) {
                    console.error(error)
                    return
                }
            }
            selectedMediaElement = element // 记录当前选择的媒体元素
        }
    })

    // 注册Tampermonkey菜单命令
    GM_registerMenuCommand('通过 CDN 加速下载', () => {
        if (selectedMediaElement) {
            const mediaUrl = selectedMediaElement.href || selectedMediaElement.src || selectedMediaElement.currentSrc
            const cdnUrl = cdnBaseUrl + mediaUrl
            window.open(cdnUrl) // 打开新的页面
            return
        }
        alert('请先右键点击要下载的图片、视频或音频元素。')
    })
})()
