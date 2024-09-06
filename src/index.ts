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
    const isImageVideoAudioRegex = /\.(jpg|jpeg|png|gif|webp|bmp|ico|cur|heic|svg|mp3|m4a|aac|ogg|mid|midi|wav|mp4|mov|webm|mpg|mpeg|avi|ogv|flv|wmv)$/

    // window.onload = () => {
    // 记录当前选择的媒体元素
    let selectedMediaElement = null

    // 为媒体元素添加右键菜单事件
    function addContextMenuEvent(element: Element) {
        if (element.tagName === 'A') { // 判断链接是否是 图片视频音频
            // 判断链接末尾是否是 指定后缀名
            const linkEle = element as HTMLLinkElement
            const fullLink = linkEle.href
            const url = new URL(fullLink)
            const baseLink = url.origin + url.pathname // 去除参数的基础路径
            // 如果两种情况都不符合，就排除
            if (!isImageVideoAudioRegex.test(fullLink) && !isImageVideoAudioRegex.test(baseLink)) {
                return
            }
        }
        element.addEventListener('contextmenu', (event) => {
            selectedMediaElement = element // 记录当前选择的媒体元素
        })
    }

    // 获取所有图片、视频和音频元素
    const mediaElements = document.querySelectorAll('img, video, audio, a')
    // 为每个媒体元素添加右键菜单事件
    mediaElements.forEach(addContextMenuEvent)

    // 使用MutationObserver监听DOM变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) { // 检查是否为元素节点
                    const ele = node as Element
                    if (ele.matches('img, video, audio, a')) {
                        addContextMenuEvent(ele)
                    }
                    // 递归检查子节点
                    const childMediaElements = ele.querySelectorAll('img, video, audio, a')
                    childMediaElements.forEach(addContextMenuEvent)
                }
            })
        })
    })

    // 配置并启动MutationObserver
    observer.observe(document.body, {
        childList: true,
        subtree: true,
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
    // }
})()
