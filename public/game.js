// Shifter - Arkádová hra
// Základní herní třídy a logika

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        // Herní stav
        this.gameState = 'menu'; // 'menu', 'playing', 'gameOver'
        this.score = 0;
        this.speed = 2;
        
        // JSONBin.io API - skutečné klíče pro fungující žebříček
        this.apiKey = '$2a$10$WrMBljUhANFS39i2XwHfH.9.V8AkViUkOp81Bn51ouKwvbmzG2M7m';
        this.binId = '68de3f24ae596e708f0352a3';
        this.leaderboard = [];
        
        // Hráč
        this.player = new Player(this.width / 2, this.height - 100);
        
        // Padající tvary
        this.collectibles = [];
        this.shapeSpeed = 0.5; // Rychlost zůstává stejná
        this.shapeSpawnTimer = 0;
        this.shapeSpawnInterval = 200; // frames - delší interval mezi tvary
        this.maxConcurrentObjects = 1; // Počáteční počet současných objektů
        
        // Ovládání
        this.keys = {};
        
        this.init();
        this.loadLeaderboard();
    }
    
    init() {
        this.setupEventListeners();
        this.gameLoop();
    }
    
    setupEventListeners() {
        // Klávesnice
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
            
            if (e.key === ' ') {
                e.preventDefault();
                if (this.gameState === 'menu' || this.gameState === 'gameOver') {
                    this.startGame();
                }
            }
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
        
        // Restart tlačítko
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Uložení skóre
        document.getElementById('saveScoreBtn').addEventListener('click', () => {
            const playerName = document.getElementById('playerNameInput').value.trim();
            if (playerName) {
                this.saveScore(playerName, this.score);
                this.hideNameInput();
            }
        });
        
        // Obnovení žebříčku
        document.getElementById('refreshLeaderboardBtn').addEventListener('click', () => {
            this.loadLeaderboard();
        });
        
        // Enter pro uložení skóre
        document.getElementById('playerNameInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const playerName = document.getElementById('playerNameInput').value.trim();
                if (playerName) {
                    this.saveScore(playerName, this.score);
                    this.hideNameInput();
                }
            }
        });
        
        // Mobilní ovládání
        this.setupMobileControls();
        
        // Start tlačítko pro mobil
        document.getElementById('startBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (this.gameState === 'menu' || this.gameState === 'gameOver') {
                this.startGame();
            }
        });
        
        document.getElementById('startBtn').addEventListener('mousedown', (e) => {
            e.preventDefault();
            if (this.gameState === 'menu' || this.gameState === 'gameOver') {
                this.startGame();
            }
        });
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.shapeSpeed = 0.5; // Začínáme velmi pomalu
        this.collectibles = [];
        this.shapeSpawnTimer = 0;
        this.player.reset();
        document.getElementById('gameOver').style.display = 'none';
        this.updateUI();
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        // Aktualizace hráče s pohybem
        this.player.update(this.keys, this.width);
        
        // Spawn nových tvarů - pouze pokud máme méně než maximum
        this.shapeSpawnTimer++;
        if (this.shapeSpawnTimer >= this.shapeSpawnInterval && this.collectibles.length < this.maxConcurrentObjects) {
            this.spawnShape();
            this.shapeSpawnTimer = 0;
        }
        
        // Aktualizace všech padajících tvarů
        for (let i = this.collectibles.length - 1; i >= 0; i--) {
            const collectible = this.collectibles[i];
            collectible.update(this.shapeSpeed);
            
            // Game over při propadnutí tvaru
            if (collectible.y > this.height) {
                this.collectibles.splice(i, 1);
                this.gameOver();
            }
            
            // Sbírání tvaru - kontrola shody tvaru a barvy
            if (this.checkCollection(this.player, collectible)) {
                this.collectibles.splice(i, 1);
                this.score++;
                this.updateUI();
            }
        }
        
        // Zvyšování obtížnosti - pouze přidávání objektů, rychlost zůstává stejná
        if (this.score > 0 && this.score % 10 === 0) {
            // Zvyšujeme pouze počet současných objektů, ne rychlost
            this.maxConcurrentObjects = Math.min(this.maxConcurrentObjects + 1, 8);
        }
    }
    
    spawnShape() {
        const colors = ['#ff0088', '#00ff88', '#0088ff', '#ffff00'];
        const shapes = ['square', 'circle', 'triangle'];
        
        const color = colors[Math.floor(Math.random() * colors.length)];
        const shape = shapes[Math.floor(Math.random() * shapes.length)];
        const x = Math.random() * (this.width - 60) + 30;
        
        this.collectibles.push(new Collectible(x, -50, color, shape));
    }
    
    checkCollection(player, collectible) {
        // Detekce sbírání - hráč musí být dostatečně blízko
        const dx = player.x - collectible.x;
        const dy = player.y - collectible.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < (player.size + collectible.size) / 2) {
            // Kontrola shody tvaru a barvy
            if (player.shape === collectible.shape && player.color === collectible.color) {
                return true; // Správná shoda - získává body
            } else {
                this.gameOver(); // Nesprávná shoda - game over
                return false;
            }
        }
        
        return false;
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        document.getElementById('finalScore').textContent = `Skóre: ${this.score}`;
        document.getElementById('gameOver').style.display = 'block';
        
        // Zobrazit formulář pro zadání jména
        this.showNameInput();
    }
    
    updateUI() {
        document.getElementById('score').textContent = `Skóre: ${this.score}`;
        
        // Zobrazení počtu padajících tvarů
        document.getElementById('currentShape').textContent = `Padající tvary: ${this.collectibles.length}`;
    }
    
    render() {
        // Vymazání canvasu
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        if (this.gameState === 'playing') {
            // Vykreslení hráče
            this.player.render(this.ctx);
            
            // Vykreslení všech padajících tvarů
            this.collectibles.forEach(collectible => collectible.render(this.ctx));
        }
        
        // Vykreslení menu
        if (this.gameState === 'menu') {
            this.renderMenu();
        }
    }
    
    renderMenu() {
        this.ctx.fillStyle = '#00ff88';
        this.ctx.font = '48px Courier New';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('SHIFTER', this.width / 2, this.height / 2 - 50);
        
        this.ctx.font = '24px Courier New';
        this.ctx.fillText('Stiskni SPACE pro start', this.width / 2, this.height / 2 + 20);
        
        this.ctx.font = '18px Courier New';
        this.ctx.fillText('Šipky = pohyb | A = barva | S = tvar', this.width / 2, this.height / 2 + 60);
    }
    
    // JSONBin.io API funkce
    async loadLeaderboard() {
        // Pro localhost s demo hodnotami - přeskočit načítání
        if (this.apiKey === 'demo-key' || this.binId === 'demo-bin-id') {
            console.log('Demo režim - žebříček není dostupný');
            this.leaderboard = [
                { player: 'Demo Hráč 1', score: 150, date: new Date().toISOString() },
                { player: 'Demo Hráč 2', score: 120, date: new Date().toISOString() },
                { player: 'Demo Hráč 3', score: 100, date: new Date().toISOString() }
            ];
            this.updateLeaderboardDisplay();
            return;
        }
        
        try {
            const response = await fetch(`https://api.jsonbin.io/v3/b/${this.binId}`, {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.apiKey
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                this.leaderboard = data.record.leaderboard || [];
                this.updateLeaderboardDisplay();
            }
        } catch (error) {
            console.error('Chyba při načítání žebříčku:', error);
            // Fallback demo data
            this.leaderboard = [
                { player: 'Demo Hráč 1', score: 150, date: new Date().toISOString() },
                { player: 'Demo Hráč 2', score: 120, date: new Date().toISOString() },
                { player: 'Demo Hráč 3', score: 100, date: new Date().toISOString() }
            ];
            this.updateLeaderboardDisplay();
        }
    }
    
    async saveScore(playerName, score) {
        // Pro localhost s demo hodnotami - pouze lokální uložení
        if (this.apiKey === 'demo-key' || this.binId === 'demo-bin-id') {
            const newScore = {
                player: playerName,
                score: score,
                date: new Date().toISOString()
            };
            
            this.leaderboard.push(newScore);
            this.leaderboard.sort((a, b) => b.score - a.score);
            this.leaderboard = this.leaderboard.slice(0, 10);
            this.updateLeaderboardDisplay();
            console.log('Skóre uloženo lokálně (demo režim)');
            return;
        }
        
        try {
            // Přidej nové skóre
            const newScore = {
                player: playerName,
                score: score,
                date: new Date().toISOString()
            };
            
            this.leaderboard.push(newScore);
            
            // Seřaď podle skóre sestupně
            this.leaderboard.sort((a, b) => b.score - a.score);
            
            // Zachovej pouze top 10
            this.leaderboard = this.leaderboard.slice(0, 10);
            
            // Ulož na JSONBin.io
            const response = await fetch(`https://api.jsonbin.io/v3/b/${this.binId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey
                },
                body: JSON.stringify({ leaderboard: this.leaderboard })
            });
            
            if (response.ok) {
                this.updateLeaderboardDisplay();
                console.log('Skóre uloženo!');
            }
        } catch (error) {
            console.error('Chyba při ukládání skóre:', error);
        }
    }
    
    showNameInput() {
        const nameInputContainer = document.getElementById('nameInputContainer');
        
        if (nameInputContainer) {
            nameInputContainer.style.display = 'block';
            const nameInput = document.getElementById('playerNameInput');
            if (nameInput) {
                nameInput.focus();
            }
        }
    }
    
    hideNameInput() {
        const nameInputContainer = document.getElementById('nameInputContainer');
        
        if (nameInputContainer) {
            nameInputContainer.style.display = 'none';
        }
    }
    
    updateLeaderboardDisplay() {
        const leaderboardList = document.getElementById('leaderboardList');
        if (leaderboardList) {
            leaderboardList.innerHTML = '';
            
            this.leaderboard.forEach((entry, index) => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="rank">${index + 1}.</span>
                    <span class="player">${entry.player}</span>
                    <span class="score">${entry.score}</span>
                `;
                leaderboardList.appendChild(li);
            });
        }
    }
    
    setupMobileControls() {
        // D-pad ovládání
        document.getElementById('upBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys['arrowup'] = true;
        });
        
        document.getElementById('upBtn').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['arrowup'] = false;
        });
        
        document.getElementById('downBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys['arrowdown'] = true;
        });
        
        document.getElementById('downBtn').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['arrowdown'] = false;
        });
        
        document.getElementById('leftBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys['arrowleft'] = true;
        });
        
        document.getElementById('leftBtn').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['arrowleft'] = false;
        });
        
        document.getElementById('rightBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys['arrowright'] = true;
        });
        
        document.getElementById('rightBtn').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['arrowright'] = false;
        });
        
        // Akční tlačítka
        document.getElementById('colorBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys['a'] = true;
        });
        
        document.getElementById('colorBtn').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['a'] = false;
        });
        
        document.getElementById('shapeBtn').addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.keys['s'] = true;
        });
        
        document.getElementById('shapeBtn').addEventListener('touchend', (e) => {
            e.preventDefault();
            this.keys['s'] = false;
        });
        
        // Mouse events pro desktop testování
        document.getElementById('upBtn').addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.keys['arrowup'] = true;
        });
        
        document.getElementById('upBtn').addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.keys['arrowup'] = false;
        });
        
        document.getElementById('downBtn').addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.keys['arrowdown'] = true;
        });
        
        document.getElementById('downBtn').addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.keys['arrowdown'] = false;
        });
        
        document.getElementById('leftBtn').addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.keys['arrowleft'] = true;
        });
        
        document.getElementById('leftBtn').addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.keys['arrowleft'] = false;
        });
        
        document.getElementById('rightBtn').addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.keys['arrowright'] = true;
        });
        
        document.getElementById('rightBtn').addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.keys['arrowright'] = false;
        });
        
        document.getElementById('colorBtn').addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.keys['a'] = true;
        });
        
        document.getElementById('colorBtn').addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.keys['a'] = false;
        });
        
        document.getElementById('shapeBtn').addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.keys['s'] = true;
        });
        
        document.getElementById('shapeBtn').addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.keys['s'] = false;
        });
    }
}

// Třída hráče
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.color = '#00ff88';
        this.shape = 'circle';
        this.colors = ['#ff0088', '#00ff88', '#0088ff', '#ffff00'];
        this.shapes = ['circle', 'square', 'triangle'];
        this.colorIndex = 1; // Začínáme s druhou barvou
        this.shapeIndex = 0;
    }
    
    update(keys, canvasWidth) {
        // Pohyb pouze šipkami
        if (keys['arrowleft']) {
            this.x = Math.max(this.size / 2, this.x - 5);
        }
        
        if (keys['arrowright']) {
            this.x = Math.min(canvasWidth - this.size / 2, this.x + 5);
        }
        
        if (keys['arrowup']) {
            this.y = Math.max(this.size / 2, this.y - 5);
        }
        
        if (keys['arrowdown']) {
            this.y = Math.min(600 - this.size / 2, this.y + 5);
        }
        
        // Změna barvy pouze A
        if (keys['a']) {
            this.colorIndex = (this.colorIndex + 1) % this.colors.length;
            this.color = this.colors[this.colorIndex];
            keys['a'] = false; // Zabránění opakovanému stisknutí
        }
        
        // Změna tvaru pouze S
        if (keys['s']) {
            this.shapeIndex = (this.shapeIndex + 1) % this.shapes.length;
            this.shape = this.shapes[this.shapeIndex];
            keys['s'] = false; // Zabránění opakovanému stisknutí
        }
    }
    
    render(ctx) {
        ctx.save();
        
        // Neon efekt
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        
        ctx.fillStyle = this.color;
        
        // Hráč může měnit tvar
        if (this.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.shape === 'square') {
            ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        } else if (this.shape === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.size / 2);
            ctx.lineTo(this.x - this.size / 2, this.y + this.size / 2);
            ctx.lineTo(this.x + this.size / 2, this.y + this.size / 2);
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    reset() {
        this.x = 400;
        this.y = 500;
        this.colorIndex = 1;
        this.shapeIndex = 0;
        this.color = this.colors[this.colorIndex];
        this.shape = this.shapes[this.shapeIndex];
    }
}

// Třída sbíratelného tvaru
class Collectible {
    constructor(x, y, color, shape) {
        this.x = x;
        this.y = y;
        this.size = 30;
        this.color = color;
        this.shape = shape;
    }
    
    update(speed) {
        this.y += speed;
    }
    
    render(ctx) {
        ctx.save();
        
        // Neon efekt
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 10;
        
        ctx.fillStyle = this.color;
        
        if (this.shape === 'circle') {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
        } else if (this.shape === 'square') {
            ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        } else if (this.shape === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(this.x, this.y - this.size / 2);
            ctx.lineTo(this.x - this.size / 2, this.y + this.size / 2);
            ctx.lineTo(this.x + this.size / 2, this.y + this.size / 2);
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.restore();
    }
}

// Spuštění hry
window.addEventListener('load', () => {
    new Game();
});
