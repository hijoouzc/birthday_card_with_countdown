// Các biến toàn cục
let countdownInterval;
let wishTimerInterval;
let fireworksInterval;
let typingInterval;
let music = new Audio('hbd.mp3');

// Phần tử DOM
const countdownScreen = document.getElementById('countdown-screen');
const birthdayScreen = document.getElementById('birthday-screen');
const wishScreen = document.getElementById('wish-screen');
const cardScreen = document.getElementById('card-screen');
const countdownElement = document.getElementById('countdown');
const wishTimerElement = document.getElementById('wish-timer');
const cardElement = document.querySelector('.card');
const messageElement = document.getElementById('message');
const typingSound = document.getElementById('typing-sound');
const candleCountDisplay = document.getElementById('candleCount');

// Tin nhắn trong thiệp
const birthdayMessage = `Chúc mừng sinh nhật lần thứ 9!\n\nChúc bạn luôn mạnh khỏe, hạnh phúc và gặp nhiều may mắn trong cuộc sống.\n\nHãy luôn giữ nụ cười trên môi và theo đuổi những ước mơ của mình.\n\nThân ái!`;

// Thiết lập thời gian đếm ngược
const targetDate = new Date('2025-09-09T00:00:00');

// Hàm bắt đầu đếm ngược
function startCountdown() {
    let currentTime = new Date('2025-09-08T23:59:58');

    countdownInterval = setInterval(() => {
        const h = currentTime.getHours();
        const m = currentTime.getMinutes();
        const s = currentTime.getSeconds();

        countdownElement.textContent = `${formatTime(h)}:${formatTime(m)}:${formatTime(s)}`;

        if (h === 0 && m === 0 && s === 0) {
            clearInterval(countdownInterval);
            showBirthdayCake();
            return;
        }

        currentTime.setSeconds(currentTime.getSeconds() + 1);
    }, 1000);
}

// Định dạng thời gian
function formatTime(time) {
    return time < 10 ? `0${time}` : time;
}

// ----------------- Nến -----------------
document.addEventListener("DOMContentLoaded", function () {
    const cake = document.querySelector(".cake");
    let candles = [];
    let audioContext, analyser, microphone;

    function updateCandleCount() {
        const activeCandles = candles.filter(
            (candle) => !candle.classList.contains("out")
        ).length;
        candleCountDisplay.textContent = activeCandles;

        if (activeCandles >= 9) {
            document.getElementById("candleReminder").textContent = "Bạn đã cắm đủ 9 ngọn nến, hãy thổi để dập!";
            document.getElementById("candleReminder").style.color = "lime";
        } else {
            document.getElementById("candleReminder").textContent = "Hãy cắm đủ 9 ngọn nến để bắt đầu thổi!";
            document.getElementById("candleReminder").style.color = "yellow";
        }

    }

    function addCandle(left, top) {
        const candle = document.createElement("div");
        candle.className = "candle";
        candle.style.left = left + "px";
        candle.style.top = top + "px";

        const flame = document.createElement("div");
        flame.className = "flame";
        candle.appendChild(flame);

        cake.appendChild(candle);
        candles.push(candle);
        updateCandleCount();
    }

    // Click vào bánh để thêm nến
    cake.addEventListener("click", function (event) {
        const rect = cake.getBoundingClientRect();
        const left = event.clientX - rect.left;
        const top = event.clientY - rect.top;
        addCandle(left, top);
    });

    function isBlowing() {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        let average = sum / bufferLength;

        return average > 10; // độ nhạy
    }

    function blowOutCandles() {
    let blownOut = 0;

    // chỉ thổi nếu có đủ 9 ngọn nến
    if (candles.length >= 9 && candles.some((c) => !c.classList.contains("out"))) {
        if (isBlowing()) {
            candles.forEach((candle) => {
                if (!candle.classList.contains("out") && Math.random() > 0.5) {
                    candle.classList.add("out");
                    blownOut++;
                }
            });
        }

        if (blownOut > 0) updateCandleCount();

        // khi tất cả nến tắt
        if (candles.every((c) => c.classList.contains("out"))) {
            setTimeout(function() {
                startWish();
            }, 500);
        }
    }
}

    if (navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then(function (stream) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);
                analyser.fftSize = 256;
                setInterval(blowOutCandles, 200);
            })
            .catch(function (err) {
                console.log("Unable to access microphone: " + err);
            });
    }
});

// ----------------- Birthday Cake -----------------
function showBirthdayCake() {
    countdownScreen.style.display = 'none';
    birthdayScreen.style.display = 'flex';

    music.play().catch(() => {
        document.body.addEventListener("click", () => music.play(), { once: true });
    });

    createFireworks();
}

// ----------------- Fireworks -----------------
function createFireworks() {
    fireworksInterval = setInterval(() => {
        createFirework();
    }, 300);
}

function createFirework() {
    const firework = document.createElement('div');
    firework.className = 'firework';

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    const colors = ['#ff3366', '#ffcc00', '#00ccff', '#66ff33', '#ff9933', '#cc66ff'];
    const color = colors[Math.floor(Math.random() * colors.length)];

    firework.style.left = `${x}px`;
    firework.style.top = `${y}px`;
    firework.style.backgroundColor = color;

    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 200;
    const xOffset = Math.cos(angle) * distance;
    const yOffset = Math.sin(angle) * distance;

    firework.style.setProperty('--x', `${xOffset}px`);
    firework.style.setProperty('--y', `${yOffset}px`);
    firework.style.animation = `firework-animation 1s forwards`;

    document.body.appendChild(firework);

    setTimeout(() => firework.remove(), 1000);
}

// ----------------- Wish countdown -----------------
function startWish() {
    birthdayScreen.style.display = 'none';
    wishScreen.style.display = 'flex';

    music.pause();
    music.currentTime = 0;

    clearInterval(fireworksInterval);

    let timeLeft = 10;
    wishTimerElement.textContent = timeLeft;

    wishTimerInterval = setInterval(() => {
        timeLeft--;
        wishTimerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(wishTimerInterval);
            showCard();
        }
    }, 1000);
}

// ----------------- Card -----------------
function showCard() {
    wishScreen.style.display = 'none';
    cardScreen.style.display = 'flex';

    music.pause();
    music.currentTime = 0;
}

// Xử lý mở thiệp
cardElement.addEventListener('click', () => {
    if (!cardElement.classList.contains('open')) {
        cardElement.classList.add('open');
        typeMessage();
    }
});

// Hiệu ứng gõ chữ
function typeMessage() {
    let i = 0;
    messageElement.innerHTML = '';
    typingSound.play();

    typingInterval = setInterval(() => {
        if (i < birthdayMessage.length) {
            messageElement.innerHTML += (birthdayMessage[i] === '\n') ? '<br>' : birthdayMessage[i];
            i++;
        } else {
            clearInterval(typingInterval);
            typingSound.pause();
        }
    }, 100);
}


// ----------------- Start -----------------
window.addEventListener('load', startCountdown);
