# Shifter - Arkádová hra

**Shifter** je minimalistická arkádová hra inspirovaná neonovým stylem, kde hráči sbírají padající tvary různých barev a tvarů.

## 🎮 Jak hrát

### Ovládání
- **WASD** nebo **šipky** = pohyb ve všech směrech
- **A** = změna barvy hráče (cyklicky)
- **S** = změna tvaru hráče (cyklicky)
- **SPACE** = start/restart hry

### Cíl hry
- Sbírejte padající tvary se správnou barvou a tvarem
- Získejte co nejvíce bodů
- Vyhněte se chybným shodám - hra končí!

### Mechanika
- Na obrazovce padá několik tvarů současně
- Hráč se může pohybovat ve všech směrech
- Musíte změnit svůj tvar a barvu tak, aby odpovídaly padajícímu tvaru
- Rychlost padání se postupně zvyšuje
- Game over při propadnutí tvaru nebo chybné shodě

## 🎨 Vlastnosti

- **Neon styl**: Minimalistický design s glow efekty
- **4 barvy**: Růžová, zelená, modrá, žlutá
- **3 tvary**: Kruh, čtverec, trojúhelník
- **Postupné zrychlování**: Obtížnost se zvyšuje s časem
- **Plný pohyb**: Hráč se může pohybovat ve všech směrech

## 🚀 Spuštění

### Lokální spuštění
1. Otevřete `index.html` v webovém prohlížeči
2. Stiskněte **SPACE** pro začátek hry
3. Užívejte si hraní!

### Deployment na Vercel
1. Pushněte kód na GitHub
2. Připojte repository k Vercel
3. Nastavte environment variables v Vercel dashboard:
   - `JSONBIN_API_KEY` = váš JSONBin.io API klíč
   - `JSONBIN_BIN_ID` = váš JSONBin.io Bin ID
4. Deployujte a užívejte si online verzi!

## 🛠️ Technologie

- **HTML5 Canvas** pro rendering
- **Vanilla JavaScript** pro herní logiku
- **CSS3** pro styling a neon efekty
- **Responsive design** pro různé velikosti obrazovek

## 📁 Struktura projektu

```
shifter/
├── index.html          # Hlavní HTML soubor
├── game.js            # Herní logika a třídy
├── README.md          # Dokumentace
└── .gitignore         # Git ignore soubor
```

## 🎯 Herní třídy

- **Game**: Hlavní herní třída s game loop
- **Player**: Hráčský objekt s pohybem a změnami
- **Collectible**: Padající tvary k sebrání

## 🔧 Vývoj

Hra je vyvinuta v čistém JavaScriptu bez externích závislostí. Pro úpravy stačí editovat `game.js` soubor.

## 📄 Licence

Tento projekt je open source a dostupný pod MIT licencí.

---

**Vytvořeno s ❤️ pro zábavu a učení**
