
 if(navigator.serviceWorker){
     //注册一个新的service worker
     navigator.serviceWorker.register('sw.js')
        .then(function(registration){
            window.registration = registration;
            console.log('service worker 注册成功');
            console.log(`Registered events at scope: ${registration.scope}`)
        })
        .catch(function(err){
            console.log('service worker 注册失败');
        });
 }