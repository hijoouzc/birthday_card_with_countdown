// Các biến toàn cục
let countdownInterval;
let wishTimerInterval;
let fireworksInterval;
let starsInterval;
let typingInterval;
let music = new Audio('happybirthday.mp3');
let song = new Audio('song.mp3');

// Phần tử DOM
const countdownScreen = document.getElementById('countdown-screen');
const dateDisplay = document.getElementById('date-display'); 
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
const birthdayMessage = `Chúc mừng sinh nhật em iu nhaaaa 💗\n\n Cuối cùng cũng đã đến ngày 9/9/2025 rồi đó, thấy nhanh vô cùng chưa. Đến lúc khép lại tuổi 19 quá nhiều sự kiện, mở ra tuổi 20 - khởi đầu mới. Xong bây giờ bằng tuổi anh rồi đó, lên đầu 2 cái là thấy khác biệt hẳn ha.\n\n Mong em hãy luôn giữ gìn sức khoẻ, đi đường an toàn, về nhà cẩn thận, và có những giấc ngủ ngon!\n\n Mong cuộc đời đối xử nhẹ nhàng với em, mong những ước muốn của em dù bất kể như nào cũng sẽ dần dần thành hiện thực.\n\nYêu em, Hoàng Mai Chi!`;

// Thiết lập thời gian đếm ngược
const targetDate = new Date('2025-09-09T00:00:00');


function startCountdown() {
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    
    let currentTime = new Date('2025-09-08T23:59:57');
    dateDisplay.textContent = '8/9/2025';
    createStars();

    countdownInterval = setInterval(() => {
        // Cập nhật thời gian thực mỗi giây
        currentTime = new Date(currentTime.getTime() + 1000);
        
        const h = currentTime.getHours();
        const m = currentTime.getMinutes();
        const s = currentTime.getSeconds();

        countdownElement.textContent = `${formatTime(h)}:${formatTime(m)}:${formatTime(s)}`;

        if (h === 0 && m === 0 && s === 0) {
            dateDisplay.textContent = '9/9/2025';
            clearInterval(countdownInterval);
            showBirthdayCake();
            return;
        }
    }, 1000);
}

// Hàm hiển thị nút play nếu tự động phát bị chặn
function showPlayButton() {
    // Kiểm tra nếu nút đã tồn tại thì không tạo lại
    if (document.getElementById('playButton')) {
        return;
    }
    
    const playButton = document.createElement('button');
    playButton.id = 'playButton'; // Thêm ID để kiểm tra
    playButton.textContent = ' 👆🏻 ';
    playButton.style.fontFamily = '"Lora", serif';
    playButton.style.fontSize = '50px';
    playButton.style.position = 'absolute';
    playButton.style.top = '80%';
    playButton.style.padding = '10px 15px';
    playButton.style.backgroundColor = '#d7e7f3ff';
    playButton.style.color = '#5bc7f6';
    playButton.style.border = '#24aae4ff 10px solid';
    playButton.style.borderRadius = '30px';
    playButton.style.cursor = 'pointer';
    playButton.style.zIndex = '1000';
    
    document.body.appendChild(playButton);

    playButton.addEventListener('click', () => {
        // Xóa nút sau khi click
        playButton.remove();
        // Bắt đầu countdown
        startCountdown();
    });
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
            document.getElementById("candleReminder").textContent = "ôi ôi đủ nến rùi, dừng lại thổi thui nào";
            document.getElementById("candleReminder").style.color = "#1cee2eff";
            document.getElementById("candleCount").style.color = "#1cee2eff";
        } else {
            document.getElementById("candleReminder").textContent = "em cắm 9 cái nến xong thổi hếc sức nhoa!";
            document.getElementById("candleReminder").style.color = "#69bce2";
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

        return average > 50; // độ nhạy
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
    // Thêm hiệu ứng làm tối màn hình
    countdownScreen.classList.add('screen-darken');
    
    // Sau 1 giây, ẩn màn hình đếm ngược và hiện màn hình sinh nhật
    setTimeout(() => {
        countdownScreen.style.opacity = '0';
        countdownScreen.style.display = 'none';
        
        // Hiển thị màn hình sinh nhật với hiệu ứng sáng dần
        birthdayScreen.style.opacity = '1';
        birthdayScreen.style.pointerEvents = 'auto';
        birthdayScreen.classList.add('screen-brighten');

        birthdayScreen.style.display = 'flex';

    music.play().catch(() => {
        document.body.addEventListener("click", () => music.play(), { once: true });
    });

        createFireworks();
        clearInterval(starsInterval);
        
    }, 3000);
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
    firework.innerHTML = '💗'; 
    firework.style.fontSize = '50px'; // Kích thước của pháo hoa

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    firework.style.left = `${x}px`;
    firework.style.top = `${y}px`;

    const angle = Math.random() * Math.PI * 2;
    const distance = 100 + Math.random() * 200;
    const xOffset = Math.cos(angle) * distance;
    const yOffset = Math.sin(angle) * distance;

    firework.style.setProperty('--x', `${xOffset}px`);
    firework.style.setProperty('--y', `${yOffset}px`);
    firework.style.animation = `firework-animation 3s forwards`;

    document.body.appendChild(firework);

    setTimeout(() => firework.remove(), 1000);
}

function createStars() {
    starsInterval = setInterval(() => {
        createStar();
    }, 300);
}

function createStar() {
    const firework = document.createElement('div');
    firework.className = 'firework';
    firework.innerHTML = '⭐'; 
    firework.style.fontSize = '50px'; // Kích thước của pháo hoa

    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;

    firework.style.left = `${x}px`;
    firework.style.top = `${y}px`;

    const angle = Math.random() * Math.PI * 2;
    const distance = 9999 + Math.random() * 500;
    const xOffset = Math.cos(angle) * distance;
    const yOffset = Math.sin(angle) * distance;

    firework.style.setProperty('--x', `${xOffset}px`);
    firework.style.setProperty('--y', `${yOffset}px`);
    firework.style.animation = `firework-animation 90s forwards`;

    document.body.appendChild(firework);

    setTimeout(() => firework.remove(), 1000);
}
// ----------------- Wish countdown -----------------
function startWish() {
    birthdayScreen.style.display = 'none';
    wishScreen.style.display = 'flex';


    clearInterval(fireworksInterval);

    let timeLeft = 60; // 60 giây
    wishTimerElement.textContent = timeLeft;

    wishTimerInterval = setInterval(() => {
        timeLeft--;
        wishTimerElement.textContent = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(wishTimerInterval);
            showCard();
            createStars();
        }
    }, 1000);
}

// ----------------- Card -----------------
function showCard() {
    wishScreen.style.display = 'none';
    cardScreen.style.display = 'flex';
    music.pause();
    music.currentTime = 0;
    song.play();

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
window.addEventListener('load', showPlayButton);
