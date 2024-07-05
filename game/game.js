const socket = io();

let username;
let game;
let chatVisible = false;

function joinGame() {
    username = document.getElementById('username').value;
    if (username) {
        document.getElementById('username-form').style.display = 'none';
        document.getElementById('game-container').style.display = 'block';
        document.getElementById('chat-container').style.display = 'block';
        initGame();
        socket.emit('join', username);
    }
}

function toggleChat() {
    chatVisible = !chatVisible;
    document.getElementById('chat-box').style.display = chatVisible ? 'block' : 'none';
}

function sendMessage(event) {
    if (event.key === 'Enter') {
        const message = event.target.value;
        socket.emit('chat message', { username, message });
        event.target.value = '';
    }
}

socket.on('chat message', (data) => {
    const messages = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.textContent = `${data.username}: ${data.message}`;
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
});

function initGame() {
    game = new Phaser.Game({
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        scene: {
            preload: preload,
            create: create,
            update: update
        }
    });

    function preload() {
        this.load.image('table', 'assets/table.png');
        this.load.image('chair', 'assets/chair.png');
        this.load.image('gun', 'assets/gun.png');
    }

    function create() {
        this.add.image(400, 300, 'table');
        for (let i = 0; i < 10; i++) {
            const angle = i * (360 / 10);
            const x = 400 + 150 * Math.cos(Phaser.Math.DegToRad(angle));
            const y = 300 + 150 * Math.sin(Phaser.Math.DegToRad(angle));
            this.add.image(x, y, 'chair');
        }

        const gun = this.add.image(400, 300, 'gun');
        this.tweens.add({
            targets: gun,
            angle: 360,
            duration: 2000,
            repeat: -1
        });

        socket.on('player joined', (players) => {
            console.log('Players:', players);
            // Update player display logic here
        });

        socket.on('game start', () => {
            console.log('Game started');
            // Game start logic here
        });
    }

    function update() {
        // Game update logic here
    }
}
