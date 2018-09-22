### PWA
    PWA(Progressive Web Apps)是一种Web App新模型，并不是具体指某一种前沿的技术或者单一个
    单一的知识点。这是一个渐进式Web App，是通过一系列新的web特性，配合优秀的UI交互设计，逐步的增强Web App的用户体验
     1. Https环境部署
     2.响应式设计，一次部署，可以在移动设备和PC设备上运行，在不同浏览器下可正常访问
     3.浏览器离线和弱网环境可极速访问
     4.可以把App Icon入口添加到桌面
     5.点击Icon入口有类似Native App的动画效果
     6.灵活的热更新


### ServiceWorker
     Service workers本质上充当web应用程序与浏览器之间的代理服务器，也可以在网络可用时
    作为浏览器和网络间的代理。能够创建有效的离线体验，拦截网络请求并基于网络是否可用以及更新资源是否驻留在服务器上来采取适当的动作。还允许推送通知和后台同步api
 
    该技术通常用来做缓存文件，提高首屏速度

    ServiceWorker
    1.后台消息传递
    2.网络代理，转发请求，伪造响应
    3.离线缓存
    4.消息推送

    目前ServiceWorker的主要能力集中在网络代理和离线缓存上。具体的实现可以理解为ServiceWorker是一个能在网页关闭时仍然运行的WebWorker

### ServiceWorker的生命周期
    link: https://www.cnblogs.com/dojo-lzz/p/8047336.html
                                1. No Service Worker
                                        |
                                2.   Installing
                                     |         |
                                3. Activated 4.Error
                                     |
                                4.  Idle
                                    <--->       <--->           
                                5. Terminated   Fetch/Message
    整个过程中，一个ServiceWorker会经历：安装，激活，等待，销毁的阶段。

        Main
    Parsed --> Installed ---> activated ---> Redundant

      SW 
         ----Installing            Activating -----
         |                                        |
         install 事件                             active 事件


### 代码
    index.js
    if(navigator.serviceWorker != null){
        navigator.serviceWorker.register('sw.js')
            .then(function(){
                window.registration = registration;
            })
    }

    这个时候ServiceWorker处于Parsed解析阶段。当解析完成后ServiceWorker处于 Installing安装阶段，主线程的registration的installing属性代表正在安装的ServiceWorker实例，同时子线程中会触发install事件，并在install事件中指定缓存资源

    sw.js
    self.addEventListener('install', (e) = >{
        e.waitUntil(caches.open(key).then(function(cache){
            return cache.addAll(cacheList)
        }))
    })

    这里使用Cache API来讲资源缓存起来，同时是同e.waitUntil接手一个Promise来等待资源缓存成功，等到这个Promise状态成功后，
    ServiceWorker进入installed状态，意味着安装完毕。这时候主线程中的registration.waiting属性代表进入installed状态
    的ServiceWorker。


    这个时候并不意味着这个ServiceWorker会立马进入下一个阶段，除非之前没有新的ServiceWorker实例
     如果之前已有ServiceWorker，这个版本只是对ServiceWorker进行了更新，那么需要满足如下任意一条件，新的
     ServiceWorker才会进入下一个阶段
        1.在新的ServiceWorker线程代码中，使用了self.skipWaiting()
        2.当用户导航到别的网页，因此释放了旧的ServiceWorker时候
        3.指定的时间过去后，释放了之前的ServiceWorker
    这个时候ServiceWorker的生命周期进入Activaing阶段，ServiceWorker子线程接收到activate事件