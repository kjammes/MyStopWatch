let timerObj = {
    minutes: 0,
    seconds: 0,
    timerId: 0
}

function soundAlarm() {
    let amount = 3;
    let audio = new Audio("Timer_Sound_Effect.mp3");

    function playSound() {
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    }

    for (var i = 0; i < amount; i++) {
        setTimeout(playSound, 1200 * i);
    }
}

function updateValue(key, value) {
    console.log("Update value is called with key,value --->", key, value);
    if (value < 0) {
        value = 0;
        console.log("Positive Values Only");
    }
    if (key == "seconds") {
        if (value < 10) {
            value = "0" + value;
        }
        if (value > 59) {
            value = 59;
        }
    }
    $("#" + key).html(value || 0);
    timerObj[key] = value;

    console.log("Mins", timerObj.minutes);
    console.log("Secs", timerObj.seconds);
}

(function detectChanges(key) {
    console.log("Detect changes");
    var input = "#" + key + "-input";
    console.log("Value of input var:-", input);
    console.log("Value of key", key);
    $(input).change(function() {
        console.log("Inside change callback function");
        updateValue(key, $(input).val());
    });

    console.log("Debugging1");

    $(input).keyup(function() {
        updateValue(key, $(input).val());
    });
    console.log("Debugging2");

    return arguments.callee;
})("minutes")("seconds");

function startTimer() {
    freezeInputs();
    buttonManager(["start", false], ["stop", true], ["pause", true]);

    timerObj.timerId = setInterval(function() {
        timerObj.seconds--;
        if (timerObj.seconds < 0) {
            if (timerObj.minutes == 0) {
                soundAlarm();
                return stopTimer();
            }
            timerObj.minutes--;
            timerObj.seconds = 59;
        }
        updateValue("minutes", timerObj.minutes);
        updateValue("seconds", timerObj.seconds);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerObj.timerId);
    unfreezeInputs();
    buttonManager(["start", true], ["stop", false], ["pause", true]);
    updateValue("minutes", $("minutes-input").val());
    let seconds = $("seconds-input").val();
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    updateValue("seconds", seconds);
}

function pauseTimer() {
    buttonManager(["start", true], ["stop", true], ["pause", false]);
    clearInterval(timerObj.timerId);
}

function buttonManager(...buttonsArray) {
    for (var i = 0; i < buttonsArray.length; i++) {
        let button = "#" + buttonsArray[i][0] + "-button";
        if (buttonsArray[i][1]) {
            $(button).removeAttr("disabled");
        } else {
            $(button).attr("disabled", "disabled");
        }
    }
}


function freezeInputs() {
    $("#minutes-input").attr("disabled", "disabled");
    $("#seconds-input").attr("disabled", "disabled");
}

function unfreezeInputs() {
    $("#minutes-input").removeAttr("disabled");
    $("#seconds-input").removeAttr("disabled");
}