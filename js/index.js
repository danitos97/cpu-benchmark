(function(){

    $('#velocimetro').speedometer({
        maxVal : 100,
        dangerLevel : 90,
        gagueLabel : '<small>CPU Usage</small>'
    })

    setSpeed(0);

    // const d=id=>{const e=document.querySelectorAll(id);return e.length==1?e[0]:e.length==0?null:[...e]}
    // EventTarget.prototype.on = EventTarget.prototype.addEventListener
    // Array.prototype.on = function(ev,f){this.forEach(e=>{e.on(ev,f)})}

    const nCores = navigator.hardwareConcurrency || 32
    const progress = document.querySelector('.progress-bar > div')

 
    let threads = []

    $('#start').on('click',function(){
        $(this).hide()
        $('.progress-bar').addClass('visible')
        $('.scores').show()
        createThread()
        setSpeed(calcSpeed())
        updateBar(0)
    })

    function updateBar(porcentage){
        setTimeout(function(){
            progress.innerHTML = `${porcentage}%`
            if(porcentage == 30){
                setSingleScore(1333)
                for(let i = 1; i < nCores; i++)
                    createThread()
                setSpeed(100)
            }
            if(porcentage < 100)
                updateBar(++porcentage)
            else{
                // $('#start').show()
                $('.progress-bar').removeClass('visible')
                for(let i = 0; i < nCores; i++)
                    removeThread()
                setSpeed(0)
                setMultiScore(7686)
            }
        },10 * 10)
        
    }

    function setSingleScore(score){
        $("#single-core .loading").hide()
        $('#single-core .score').html(score)
    }

    function setMultiScore(score){
        $("#multi-core .loading").hide()
        $('#multi-core .score').html(score)
    }
    
    
    // $('#add').on('click', function() {
    //     if(nThreads < nCores){
    //         $('#n-threads').html(++nThreads)
    //         if(isStarted) {
    //             setSpeed(calcSpeed());
    //             createThread()
    //         }
    //     }
    // })
    // $('#sub').on('click', function() {
    //     if(nThreads > 1){
    //         $('#n-threads').html(--nThreads)
    //         if(isStarted) {
    //             setSpeed(calcSpeed());
    //             removeThread()
    //         }
    //     }
    // })
    function calcSpeed(){
        return Math.floor(100 / nCores + 8)
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
