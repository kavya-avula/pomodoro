const startStopButton = document.getElementById("start-stop")
const stopBtn = document.getElementById("stop");
const reset = document.getElementById("reset");

const minutesSpan = document.getElementById("js-minutes");
const secondsSpan = document.getElementById("js-seconds");
const timer = document.getElementById("count");
const sessionsText = document.getElementById("sessions-text");
const progressBar = document.getElementById("js-progress");
const audio = document.getElementById("beep");
const modeButton = document.getElementsByClassName("mode-button")[0];

let pomodoro = 25; // Minutes
let shortBreak = 5; // Minutes (5m)
let longBreak = 15; // Minutes (15m)
let longBreakInterval = 4;
let pomodoroCount = 0;
let currentMode = "pomodoro"; // pomodoro -> short -> pomo -> long
let remainingTime = pomodoro * 60; // 60 sec = 1 min | 25 * min = 25 min

let total = pomodoro * 60

// Update timer display
const updateTimer = () => {
    const minutes = Math.floor(remainingTime / 60) < 0 ? 0 : Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60 < 0 ? 0 : remainingTime % 60;

    minutesSpan.textContent = minutes.toString().padStart(2, "0");
    secondsSpan.textContent = seconds.toString().padStart(2, "0");

    timer.textContent = pomodoroCount

    updateProgress();

    if (remainingTime <= 0) {
        console.log(currentMode)
        audio.play();

        // Switch from pomodoro to break or vice versa
        if (currentMode === "pomodoro") {
            pomodoroCount++;
            if (pomodoroCount % longBreakInterval === 0) {
                currentMode = "long-break";
                remainingTime = longBreak * 60; // Assuming longBreak is in minutes
            } else {
                currentMode = "short-break";
                remainingTime = shortBreak * 60; // Assuming shortBreak is in minutes
            }
        } else { // Switching from a break to a pomodoro
            if (currentMode === "long-break") {
                pomodoroCount = 0; // Reset the count after a long break
            }
            currentMode = "pomodoro";
            remainingTime = pomodoro * 60; // Assuming pomodoro is in minutes
        }

        // Update the timer display and progress bar
        updateProgress();
        modeButton.innerText = currentMode.replaceAll('-', ' ')
    } else {
        remainingTime--;
    }
};

// Update progress bar
const updateProgress = () => {
    const percent = (remainingTime / total) * 100;
    updateCircularProgress(percent)
}

let time;

startStopButton.addEventListener('click', ev => {
    if (!time) {
        modeButton.classList.add('active')
        startStopButton.disabled = true
        stopBtn.disabled = false
        time = setInterval(updateTimer, 1000);
        // updateTimer()
    }
})

function stop() {
    if (time) {
        clearInterval(time)
        startStopButton.disabled = false
        stopBtn.disabled = true


        modeButton.classList.remove('active')
        time = null;

    }
}
stopBtn.addEventListener('click', stop)
reset.addEventListener('click', () => {
    stop()
    remainingTime = pomodoro * 60;

    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;

    minutesSpan.textContent = minutes.toString().padStart(2, "0");
    secondsSpan.textContent = seconds.toString().padStart(2, "0");

    updateProgress();
})

function updateCircularProgress(percentage) {
    const progressBar = document.querySelector('.circular-progress');
    const progressColor = progressBar.getAttribute('data-progress-color');
    const bgColor = progressBar.getAttribute('data-bg-color');

    // Calculate the degree for the conic gradient based on the percentage
    const degree = percentage * 3.6;

    // Update the progress bar's background
    progressBar.style.background = `conic-gradient(${progressColor} ${degree}deg, ${bgColor} 0deg)`;
    progressBar.style.boxShadow = `0px 0px 10px ${bgColor}`

}

const shInput = document.querySelector('#pomotime')

shInput.addEventListener('change', (e) => {
    if(Number(e.target.value) < 0) {
    shInput.value = pomodoro
    } else {
    pomodoro = e.target.value
    
    remainingTime = Number(pomodoro) * 60

    total = remainingTime
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;


    minutesSpan.textContent = minutes.toString().padStart(2, "0");
    secondsSpan.textContent = seconds.toString().padStart(2, "0");
    }
})