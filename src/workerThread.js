
//全局对象为self, this指向self
var i = 1;

function simpleCount(){
    i++;
    self.postMessage(i);
    setTimeout(simpleCount, 1000);
}

simpleCount();

self.onmessage = ev =>{
    postMessage(ev.data + 'worker');
}