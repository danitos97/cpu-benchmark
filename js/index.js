(function(){

    $('#velocimetro').speedometer({
        maxVal : 100,
        dangerLevel : 90,
        gagueLabel : '<small>CPU Usage</small>'
    })

    setSpeed(0);

    // const d = id => {const e = document.querySelectorAll(id);return e.length==1?e[0]:e.length==0?null:[...e]}
    // EventTarget.prototype.on = EventTarget.prototype.addEventListener
    // Array.prototype.on = function(ev,f){this.forEach(e=>{e.on(ev,f)})}

    const nCores = navigator.hardwareConcurrency || 32

    console.log(nCores)

    let nThreads = 2
    let isStarted = false
    let threads = []

    $('#start').on('click',function(){
        isStarted = !isStarted
        for(let i = 0; i < nThreads; i++)
            isStarted? createThread() : removeThread()
        $('#start b').html(isStarted? 'STOP' : 'START')
        setSpeed(isStarted? calcSpeed() : 0)
        $('#start').toggleClass('stop');
    })
    
    $('#add').on('click', function() {
        if(nThreads < nCores){
            $('#n-threads').html(++nThreads)
            if(isStarted) {
                setSpeed(calcSpeed());
                createThread()
            }
        }
    })
    $('#sub').on('click', function() {
        if(nThreads > 1){
            $('#n-threads').html(--nThreads)
            if(isStarted) {
                setSpeed(calcSpeed());
                removeThread()
            }
        }
    })
    function calcSpeed(){
        let speed = Math.floor(nThreads * 100 / nCores + (nThreads / 3))
        // if(speed < 100) speed += nThreads;
        return speed
    }
    function createThread(){
        const hilo = new Worker('js/thread.js')
        threads.push(hilo)
    }
    function removeThread(){
        threads[0].terminate()
        threads.shift()
    }
    function setSpeed(speed){
        $('#velocimetro').val(speed)
        $('#velocimetro').trigger('change');
    }

})()
