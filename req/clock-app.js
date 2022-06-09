var main = {
    session: {},
    check_time_interval: () => {},
    stop: function (){
        clearInterval(main.check_time_interval)
    }
};
(function() {
    let $$ = function(selector) {
        return document.querySelectorAll(selector)
    }
    let $ = function(selector) {
        return $$(selector)[0]
    }
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1))
            let temp = array[i]
            array[i] = array[j]
            array[j] = temp
        }
    }
    main.e = {
        phrase: $('.phrase'),
        time_now: $('.time-now'),
        canvas: $('#canvas'),
        video: $('#video'),
    }
    main.data = {
        interval_every: 5e2,
        interval_pharses_seconds: 60,
        interval_canvas_update_seconds: 1,
        phrases: JSON.parse(JSON.stringify(all_phrases)),
        errorMessage: 'so basura tarada, adefecio humano, crees que no me esperaba que harias esto, ponte a usarlo y deja de hacer pruebas de error :)',
        draws: {
            cvCtx:  main.e.canvas.getContext('2d'),
            size: {h: 500, w: 300},
        },
    }
    shuffleArray(main.data.phrases)
    main.temp = {
        phrase_count_time: 0,
        requestExit: false,
        udate_canvas_time: 2,
    }
    main.fn = {
        reload: function () {
            main.temp.requestExit = true
            location.href = location.href
        },
        node: function (tag, classes){
            let new_element = document.createElement(tag)
            new_element.className = classes
            return new_element
        },
        decimal: function(number) {
            let n = Number(number)
            return n < 10 ? '0' + n : n
        },
        now: function() {
            return new Date().getTime()
        },
        cvtTime: function() {
            let s = this.split(':'),
            result = ''
            function nif(n){
                let sl = s.length,
                    or = sl - n
                    nn = s[or]
                    nn = Number(nn)
                return nn
            }
            let _a1 = nif(1) * 1
            let _a2 = nif(2) * 60 * 1
            if (s.length == 3) {
                let _a3 = nif(3) * 60 * 60 * 1
                result = _a3 + _a2 + _a1
            } else {
                result = _a2 + _a1
            }
            // console.log(s)
            // console.log(result)
            return result
        },
        cvtVal: function() {
            function tt(n) {
                let rr
                n < 10 ? rr = "0" + n : rr = n.toString()
                return rr
            }
            let _sn = parseInt(this, 10)
            let _h   = Math.floor(_sn / 3600)
            let _m = Math.floor((_sn - (_h * 3600)) / 60)
            let _s = _sn - (_h * 3600) - (_m * 60)
            let format = tt(_h) + ':' + tt(_m) + ':' + tt(_s)
            // console.log(this)
            // console.log(format)
            return format
        },
        errorAlert: function(message) {
            $('.root').classList.add('fail')
            $('.root').innerHTML = /*html*/ `
            <div class="error-box">
                <div class="error">
                    <p class="msg">${main.data.errorMessage}</p>
                    <p class="custom">${message}</p>
                    <p class="return">
                        <a>Reintentar</p>
                    </p>
                </div>
            </div>
            `
            $('.root .return a').addEventListener('click', function() {
                main.fn.reload()
            })
        },
        addHoursToDate: function(objDate, toAdd) {
            let numberOfMlSeconds = objDate.getTime();
            let addMlSeconds = toAdd * 1e3
            let newDateObj = new Date(numberOfMlSeconds + addMlSeconds)
         
            return newDateObj;
        },
        subtractTimeFromDate: function(objDate, toSubstract) {
            let numberOfMlSeconds = objDate.getTime()
            let addMlSeconds = toSubstract * 1e3
            let newDateObj = new Date(numberOfMlSeconds - addMlSeconds)
         
            return newDateObj
        },     
    }
    main.fn.difference_time = function(first, end) {
        let distance = first + end
    
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        let seconds = Math.floor((distance % (1000 * 60)) / 1000)
    
        let result = ("0" + hours).slice(-2) + ":" + ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2)
        if (result.includes('-')) {
            result = result.replaceAll('-1', '00')
            result = result.replaceAll('-', '0')
            result = '-' + result
        }
        return result
    }
    main.fn.createCard = function() {
        if (main.session.start !== undefined) {
            let now = main.fn.now()
            let box = $('.cards')
            let card = main.fn.node('div', 'card')
            let index_interval = $('.cards').childElementCount
            let next_time = 0
            if (index_interval > main.session.alerts_saved.length) {
                next_time = main.session.alerts_saved.pop()
            } else {
                next_time = main.session.alerts_saved[index_interval]
            }
            let difference_next_time = main.fn.difference_time(next_time.getTime(), now * -1)
            let isGood = difference_next_time.includes('-') ? false : true
            if (difference_next_time == '-00:00:00') {
                isGood = true
            }
            let code = /*html*/ `
                <div class="c-start c-log">
                    <i class="fa-solid fa-hourglass-end"></i>
                    <span>${main.fn.difference_time(now, main.session.last_click.getTime() * -1)}</span>
                </div>
                <div class="c-about">
                    <div class="c-log">
                        <i class="fa-solid fa-flag"></i>
                        <span>${main.fn.tmLocal(main.fn.now(), true)}</span>
                    </div>
                    <div class="c-log">
                        <i class="fa-solid fa-stopwatch"></i>
                        <span>${difference_next_time}</span>
                    </div>
                </div>
                <div class="c-icon">
                    ${isGood ? '<i class="fa-solid fa-star"></i>' : '<i class="fa-solid fa-heart-crack"></i>'}
                </div>
            `
            card.innerHTML = code
            if (isGood) {
                card.classList.add('good')
            } else {
                card.classList.add('bad')
            }
            box.appendChild(card)
            setTimeout(function() {
                box.scrollTo({
                    top: box.scrollHeight,
                    behavior:'smooth'
                })
            }, 1e2)
            main.session.last_click = new Date()
        }
    }
    $('#btn-step').addEventListener('click', function() {
        main.fn.createCard()
    })
    main.fn.tmLocal = function(time, seconds = false) {
        let val = new Date(time)
        let hrs = val.getHours()
        let min = val.getMinutes()
        let sec = val.getSeconds()
        function frm(val) {
            return main.fn.decimal(val)
        }
        let result = frm(hrs) + ':' + frm(min)
        seconds ? (result += ':' + frm(sec)) : result + ''
        return result
    }
    main.fn.now_format = function(){
        return main.fn.tmLocal(main.fn.now())
    }
    main.fn.newPhrase = function(){
        if (main.data.phrases.length > 0) {
            let thisPhrase = main.data.phrases[0]
            let text = main.fn.node('span', 'cite')
            text.innerText = thisPhrase[0]
            let author = main.fn.node('span', 'author')
            author.innerText = thisPhrase[1]
            main.e.phrase.innerHTML = ''
            main.e.phrase.appendChild(text)
            main.e.phrase.appendChild(author)
            main.data.phrases.shift()
        } else {
            console.log('not more phrases')
        }
    }
    main.fn.newPhrase()
    main.check_time_interval = setInterval(
        function() {
            let int_now = main.fn.now()
            if (main.temp.phrase_count_time == 1e3 / main.data.interval_every * main.data.interval_pharses_seconds) {
                main.fn.newPhrase()
                main.temp.phrase_count_time = 0
            } else {
                main.temp.phrase_count_time++
            }
            main.e.time_now.innerText = main.fn.tmLocal(main.fn.now(), true)
            
            if (main.session.start != undefined) {
                // console.log(main.session.start)
                if (int_now < main.session.ends.getTime() + 1e3) {
                    let update_canvas = false
                    if (main.temp.udate_canvas_time == 1e3 / main.data.interval_every * main.data.interval_canvas_update_seconds) {
                        update_canvas = true
                        main.temp.udate_canvas_time = 0
                    } else {
                        update_canvas = false
                        main.temp.udate_canvas_time++
                    }

                    $('#log-rest').classList.remove('closed')
                    if (main.session.alerts.length > 0) {
                        if (int_now > main.session.alerts[0].getTime()) {
                            main.session.alerts.shift()
                            main.temp.alert_count++
                            let aud = $('#alarm_audio')
                            aud.currentTime = 0
                            aud.play()
                            setTimeout(function(){
                                aud.pause()
                            }, 4200)
                        }
                        if (main.session.alerts.length > 0) {
                            $('#log-alert').innerText = main.fn.difference_time(main.session.alerts[0].getTime(), int_now * -1)
                        } else {
                            $('#log-alert').innerText = '00:00:00'
                        }
                        $('#log-alert-count').innerText = main.temp.alert_count + ' / ' + main.session.splits
                    } else {
                        $('#log-alert-count').innerText = main.session.splits + ' / ' + main.session.splits
                    }
                    let finished = main.session.ends.getTime() - main.session.margen * 1e3 * 60
                    finished = Math.floor(finished / 1e3) * 1e3
                    if (Math.floor(int_now / 1e3) * 1e3 ==  finished && !main.session.finished) {
                        main.session.finished = true
                        let alarm = $('#alarm_finish')
                        alarm.currentTime = 0
                        alarm.play()
                        setTimeout(function() {
                            alarm.pause()
                        }, alarm.duration * 1e3)

                    }
                    $('#log-used').innerText = main.fn.difference_time(int_now, main.session.start.getTime() * -1, true)
                    let ends_min_extra = main.session.ends.getTime() - main.session.margen * 1e3
                    $('#log-rest').innerText = main.fn.difference_time(ends_min_extra, int_now * -1, true)

                    if (update_canvas) {
                        html2canvas(document.querySelector(".count")).then(canvas => {
                            main.e.canvas.width = canvas.width
                            main.e.canvas.height = canvas.height
                            main.data.draws.cvCtx.drawImage(canvas, 0, 0)
                        })
                    }
                } else {
                    if (!$('.error')) {
                        $('#log-rest').classList.add('closed')
                        $('#log-rest').innerText = '00:00:00'
                    }
                }
            }
        }, main.data.interval_every
    )
    $('#stop-count').addEventListener('click', function() {
        main.fn.reload()
    })
    $('#init-config').addEventListener('click', () => {
        $('.box-sett').style.display = 'flex'
        setTimeout(() => {
            $('.box-sett').classList.add('open')
        }, 1e2) 
    })
    $('.btn.cancel').addEventListener('click', () => {
        $('.box-sett').classList.remove('open')
        setTimeout(() => {
            $('.box-sett').style.display = 'none'
        }, 3e2)
    });
    (function(){
        function myorder(element) {
            let ts = element, order = -1
            let chd = ts.parentNode.children
            let i = 0
            while (i < chd.length) {
                if (chd[i] == ts) {
                    order = i
                    break
                }
                i++
            }
            return order
        };
        ([
            'time-init',
            'time-init-now',
            'alerts',
            'extra',
            'time-end',
            'large'
        ]).forEach((e) => {
            let element = $('#' + e)
            let input_div = element.parentElement.parentElement
            input_div.addEventListener('click', function () {
                input_div.parentElement.setAttribute('data-selected', myorder(input_div))
            })
        })
        $$('input[type="number"]').forEach(function (i){
            let min = i.getAttribute('min')
            min = Number(min)
            i.setAttribute('value', min)
            i.addEventListener('input', function () {
                let v = i.value
                if (Number(v) < min){
                    i.value = min
                }
            })
        })
        $('#init-count').addEventListener('click', function () {
            let mssn = main.session
            let first_conf = $('.c-init .sett').getAttribute('data-selected')
            mssn.resulst_start = false
            let now = new Date()
            if (first_conf == '0') {
                mssn.resulst_start = (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear()
                mssn.resulst_start += ', ' + $('#time-init').value + ':00'
            } else {
                let other_format = now.toLocaleString()
                result_my_format = other_format.split('/')
                let group_temp = [result_my_format[1], result_my_format[0], result_my_format[2]]
                result_my_format = group_temp.join('/')
                mssn.resulst_start = result_my_format
            }

            mssn.start = new Date(mssn.resulst_start)
            mssn.last_click = new Date(mssn.resulst_start) 
            mssn.splits = Number($('#alerts').value)
            main.temp.alert_count = 0
            if (mssn.splits == 0) {mssn.splits = 1}
            mssn.margen = Number($('#extra').value)
            let ends_conf = $('.c-ends .sett').getAttribute('data-selected')
            mssn.resulst_ends = false
            if (ends_conf == '0') {
                mssn.resulst_ends = (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear()
                mssn.resulst_ends += ', ' + $('#time-end').value + ':00'
            } else {
                let addTimes = mssn.start.getTime()
                addTimes += Number($('#large').value) * 60 * 1e3
                addTimes = new Date(addTimes)
                mssn.resulst_ends = (now.getMonth() + 1) + '/' + now.getDate() + '/' + now.getFullYear()
                mssn.resulst_ends += ', ' + addTimes.getHours() + ':'
                mssn.resulst_ends += addTimes.getMinutes() + ':00'
            }
            mssn.ends = new Date(mssn.resulst_ends)
            mssn.finished = false;
            (function() {
                let distance = mssn.ends.getTime() - mssn.start.getTime()
                let splits_times = distance / mssn.splits
                // console.log(splits_times)
                let i_group_count = 0
                let group_intervals = []
                while (i_group_count < mssn.splits) {
                    let summ = mssn.start.getTime() + (splits_times * (i_group_count + 1))
                    group_intervals.push(new Date(summ))
                    i_group_count++
                }
                mssn.alerts = group_intervals
                mssn.alerts_saved = []
                group_intervals.forEach(function(date) {
                    mssn.alerts_saved.push(date)
                })
                // console.log(distance)

                if (now.getTime() > mssn.ends.getTime()) {
                    main.fn.errorAlert('La hora de finalización ya pasó. Coloque una hora posterior a la hora actual')
                } else if (mssn.ends == 'await' && $('#large').value < 1) {
                    main.fn.errorAlert('Me estas diciendo que quieres que cronometre menos de un minuto? Jodete')
                } else if (mssn.ends.getTime() < mssn.start.getTime()) {
                    main.fn.errorAlert('Entonces, terminas antes de empezar. Tu tiempo va a la inversa o que mrd?')
                } else if (mssn.margen > mssn.ends.getTime() - mssn.start.getTime()) {
                    main.fn.errorAlert('Según tú, tienes más tiempo de margen de seguridad que el mismo tiempo que tienes para la resolución. NO ME JODAS')
                }
            })()
            function alertComplete() {
                let modal = $('.modal-alert')
                modal.style.display = 'flex'
                setTimeout(function() {
                    modal.classList.add('on')
                }, 1e2)
                setTimeout(function() {
                    modal.classList.remove('on')
                    setTimeout(function() {
                        modal.style.display = 'none'
                    }, 2e2)
                }, 2e3)
            }
            if (main.session.start == 'Invalid Date' || main.session.ends == 'Invalid Date') {
                main.session = {}
                alertComplete()
            } else {
                if (!$('.error')) {
                    setTimeout(function() {
                        let canv = main.e.canvas
                        let video = main.e.video
                        video.srcObject = canv.captureStream()
                        video.muted = true
                        video.play()
                        $('#btn-pip').addEventListener('click', function(){
                            if (document.pictureInPictureElement == null) {
                                video.requestPictureInPicture()
                            } else {
                                document.exitPictureInPicture()
                            }
                        })
                    }, 1e3)
                    console.log(main.session)
                    $('.btn.cancel').click()
                }
            }
        })
    })();
    $('#alarm_audio').volume = 0.8
    window.addEventListener('keydown', function(event) {
        if (event.which == 32 || event.code == 'Space') {
            main.fn.createCard()
        }
    })
    window.onbeforeunload = function() {
        if (!main.temp.requestExit) {
            return 'Please press the Logout button to logout.'
        }
    };
    (function(){
        let test = true
        if (test) {
            $('#init-config').click()
            function next_minute() {
                let now = new Date()
                let min = 1e3 * 60
                let result = now.getTime() / min
                result = Math.floor(result)
                result = result + 1
                result = result * min
                result = new Date(result)
                return result
            }
            let next = next_minute()
            let value_format = main.fn.decimal(next.getHours()) + ':' + main.fn.decimal(next.getMinutes())
            $('#large').value = 5
            $('#time-init').value = value_format
            $('#alerts').value = 10
        }
    })()
})()