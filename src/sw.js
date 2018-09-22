var cacheStorageKey = 'my-cache';

// 资源数组
var cacheList = [
    '/'
]

//监听 ‘install’事件，回调缓存中所需文件, Application 中可以查看Service Workers的信息
self.addEventListener('install', e=>{
    e.waitUntil(
        caches.open(cacheStorageKey).then(function(cache){ //Cache storage,open(`key`)
            return cache.addAll(cacheList);
        })
    )
})

/**
 * 浏览器获取了新版本的ServiceWorker代码，如果浏览器本身对sw.js进行缓存的话，也不会得到最新代码，所以对sw文件最好配置成cache-control: no-cache或者添加md5。
 * etch事件中，如果缓存命中那么直接从缓存中取，这就会导致即使我们的index页面有更新，浏览器获取到的永远也是都是之前的ServiceWorker缓存的index页面，所以有些ServiceWorker框架支持我们配置资源更新策略，
 * 比如我们可以对主页这种做策略，首先使用网络请求获取资源，如果获取到资源就使用新资源，同时更新缓存，如果没有获取到则使用缓存中的资源。
 */

 self.addEventListener('fetch', e=>{
     e.respondWith(
        fetch(e.request.url)
        .then(function(httpRes){
            //请求失败，直接返回失败的结果
            if(!httpRes || httpRes.status !== 200){
                return caches.match(e.request);
            }

            //请求成功的话，将请求缓存起来
            var responseClone = httpRes.clone();
            caches.open(cacheStorageKey).then(function(cache){
                return cache.delete(e.request).then(function(){
                    cache.put(e.request, responseClone);
                });
            });
            return httpRes;
        }).catch(function(err){
            //无网络情况从缓存中读取
            return caches.match(e.request);
        })
       
     );
 });

 /**
  * 如果当前浏览器没有激活的service worker或者已经激活的worker被解雇，
    新的service  worker进入active事件
  */

  self.addEventListener('activate', e=>{
      console.log('Activate event');
      console.log('Promise all', Promise, Promise.all);
      //active事件中通常做一些国企释放资源的工作
      var cacheDeletePromises = caches.keys().then(cacheNames => {
          console.log('cacheNames', cacheNames, cacheNames.map);
          return Promise.all(cacheNames.map(name => {
              if(name !== cacheStorageKey){
                  //如果资源的key与当前需要缓存的key不同则释放资源
                  var deletePromise = caches.delete(name);
                  return deletePromise;
              }else{
                  Promise.resolve();
              }
          }))
      });
  })