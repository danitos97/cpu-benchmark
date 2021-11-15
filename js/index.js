(function(){

    //load scores
    
    function getScores(remark,delay = 0){
        const initTime = Date.now()
        console.log(initTime)

        let extra = remark? '?remark='+remark : ''


        fetch('getScores' + extra).then(res => res.json()).then(scores => {
            let text = ''
            if(scores.length){
                scores.forEach( score => {
                    text+=`
                        <div class="${score.remark? 'remark':''}" style="width: ${score.multi * 100 / maxScore}%;">
                            <div>${score.top}</div>
                            <div>${score.cpu} (${score.cores}c)</div>
                            <div>${score.mono} / ${score.multi}</div>
                        </div>`
                })
               
                console.log(text)
            }
            
            else {
                text = `<div class="center">
                            There is no scores yet
                        </div>`
            }
            
            setTimeout(function(){
                $('.table .body').html(text)
                if(scores.length) 
                    $('.table .body').removeClass('no-scores')
            },delay - (Date.now() - initTime))
            
        })
    }
    
   getScores(undefined,850)

    $('#velocimetro').speedometer({
        maxVal : 100,
        dangerLevel : 90,
        gagueLabel : '<small>CPU Usage</small>'
    })

    setSpeed(0)

    // const d=id=>{const e=document.querySelectorAll(id);return e.length==1?e[0]:e.length==0?null:[...e]}
    // EventTarget.prototype.on = EventTarget.prototype.addEventListener
    // Array.prototype.on = function(ev,f){this.forEach(e=>{e.on(ev,f)})}


    const maxScore = 10000
    const benchTime = 20//seconds
    const nCores = navigator.hardwareConcurrency
    const progress = document.querySelector('.progress-bar > div')

    $('.detected span').html(nCores? nCores : 'No')
    
    let threads = []
    let scores = []
    let mono;

    $('#start, .restart').on('click',function(){
        console.log("click")
        scores = []
        $('.restart,form,.start,#thanks').hide()
        $('.progress-bar').addClass('visible')
        $('#single-core .score, #multi-core .score').html('')
        $("#single-core .loading,#multi-core .loading, .scores").show();
        createThread()
        setSpeed(calcSpeed())
        updateBar(0)
    })


    function updateBar(porcentage){
        setTimeout(function(){
            progress.innerHTML = `${porcentage}%`
            if(porcentage == 37){
                setSingleScore(scores[0])
                for(let i = 1; i < nCores; i++)
                    createThread()
                setSpeed(100)
            }
            if(porcentage < 100)
                updateBar(++porcentage)
            else{
                // $('#start').show()
                $('form').show()
                $('.restart').css('display','inline-block')
                $('.progress-bar').removeClass('visible')
                for(let i = 0; i < nCores; i++)
                    removeThread()
                setSpeed(0)
                
                setMultiScore(sumScores())
                console.log(scores)
            }
        },10 * benchTime)
        
    }
    function sumScores(){
        let sum = 0;
        scores.forEach(score => {
            sum += score
        })
        return sum
    }
    function setSingleScore(score){
        mono = score
        $("#single-core .loading").hide()
        $('#single-core .score').html(mono)
    }

    function setMultiScore(score){
        $("#multi-core .loading").hide()
        $('#multi-core .score').html(score)
    }

    $('.show-scores').click(function(){
        $('.table-container').addClass('modal')
    })
    
    $('.table-container').click(function(){
        $(this).removeClass('modal')
    })
    $('.table').click(function(e){
        e.stopPropagation()
    })
    $('#btn-save-score').click(function(e){
        const nombre = $('#nombre').val().trim()
        const cpu = $('#cpu').val().trim()
        if(nombre != '' && cpu != ''){
            e.preventDefault()
            const data = {
                nombre: nombre,
                cpu   : cpu,
                cores : nCores,
                mono  : mono,
                multi : sumScores()
            }
            fetch('score',{
                method:"POST", 
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            }).then(r => r.json()).then(res => {
                    if(res.status == 'ok'){
                        $('form').hide()
                        $('#thanks').show()
                        getScores(res.id)
                    }
                    else{
                        alert("Please try again")
                    }
            })
        }
    })

    function calcSpeed(){
        return Math.floor(100 / nCores + 8)
    }
    function createThread(){
        const hilo = new Worker('js/thread.js')
        threads.push(hilo)
        let i = scores.length
        scores.push(0)
       
        hilo.onmessage = function(){
            scores[i]++
        }
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
