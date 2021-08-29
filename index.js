(function(){

    const $ = id => {const e = document.querySelectorAll(id);return e.length==1?e[0]:e.length==0?null:[...e]}
    EventTarget.prototype.on = EventTarget.prototype.addEventListener
    Array.prototype.on = function(ev,f){this.forEach(e=>{e.on(ev,f)})}

    const nCores = navigator.hardwareConcurrency || 16

    console.log(nCores)

    let nThreads = 2
    let isStarted = false
    let threads = []

    $('#start').on('click',function(){
        isStarted = !isStarted
        for(let i = 0; i < nThreads; i++){
            if(isStarted) createThread()
            else removeThread()
        }
    })

    $('#add').on('click', function() {
        if(nThreads < 32){
            nThreads++
            $('#n-threads').innerHTML = nThreads;
            if(isStarted)
                createThread()
        }
    })
    $('#sub').on('click', function() {
        if(nThreads > 1){
            nThreads--
            $('#n-threads').innerHTML = nThreads
            if(isStarted)
                removeThread()
        }
    })

    function createThread(){
        const hilo = new Worker('thread.js')
        threads.push(hilo)
    }
    function removeThread(){
        threads[0].terminate()
        threads.shift()
    }


})();
