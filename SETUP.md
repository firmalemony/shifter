# Nastavení JSONBin.io pro žebříček

## 1. Vytvoření účtu na JSONBin.io

1. Navštivte [https://jsonbin.io](https://jsonbin.io)
2. Zaregistrujte se pomocí Google, Twitter, Facebook nebo GitHub
3. Po přihlášení získáte svůj **X-Master-Key**

## 2. Vytvoření nového "binu"

Spusťte následující kód v konzoli prohlížeče pro vytvoření nového binu:

```javascript
const apiKey = 'VÁŠ_X-MASTER-KEY'; // Nahraďte skutečným API klíčem
const url = 'https://api.jsonbin.io/v3/b';

const initialData = {
    leaderboard: []
};

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': apiKey,
        'X-Bin-Private': 'false' // Nastavení binu jako veřejného
    },
    body: JSON.stringify(initialData)
})
.then(response => response.json())
.then(data => {
    console.log('Bin ID:', data.metadata.id);
    console.log('Uložte si tento Bin ID do kódu!');
})
.catch(error => console.error('Chyba při vytváření binu:', error));
```

## 3. Aktualizace kódu

V souboru `game.js` nahraďte:

```javascript
// JSONBin.io API
this.apiKey = '$2a$10$YOUR_API_KEY_HERE'; // Nahraďte skutečným API klíčem
this.binId = 'YOUR_BIN_ID_HERE'; // Nahraďte skutečným Bin ID
```

Skutečnými hodnotami:

```javascript
// JSONBin.io API
this.apiKey = 'VÁŠ_SKUTEČNÝ_API_KLÍČ';
this.binId = 'VÁŠ_SKUTEČNÝ_BIN_ID';
```

## 4. Testování

1. Otevřete hru v prohlížeči
2. Zahrajte si a dosáhněte nějakého skóre
3. Po game over zadejte své jméno
4. Klikněte "Uložit skóre"
5. Žebříček by se měl aktualizovat

## 5. Veřejný přístup

Váš bin je nastaven jako veřejný, takže:
- Žebříček je dostupný všem hráčům
- Kdokoliv může načíst aktuální žebříček
- Pouze vy můžete ukládat nová skóre (díky API klíči)

## Bezpečnost

- **Nikdy nesdílejte svůj API klíč** ve veřejném kódu
- Pro produkční verzi použijte server-side API
- Zvažte implementaci rate limitingu

## Troubleshooting

- **CORS chyby**: JSONBin.io podporuje CORS, takže by neměly být problémy
- **API limit**: Bezplatný plán má omezení na počet požadavků
- **Chyby sítě**: Zkontrolujte konzoli prohlížeče pro chybové zprávy
