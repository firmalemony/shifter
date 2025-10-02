# Vercel Deployment Guide

## 🚀 Krok za krokem deployment na Vercel

### 1. Příprava na GitHub
```bash
git add .
git commit -m "Add leaderboard functionality with JSONBin.io integration"
git push origin main
```

### 2. Vercel Setup
1. Jděte na [https://vercel.com](https://vercel.com)
2. Přihlaste se pomocí GitHub účtu
3. Klikněte "New Project"
4. Vyberte váš `shifter` repository
5. Klikněte "Import"

### 3. Environment Variables
V Vercel dashboard:
1. Jděte do **Settings** → **Environment Variables**
2. Přidejte tyto proměnné:

| Name | Value | Environment |
|------|-------|-------------|
| `JSONBIN_API_KEY` | Váš JSONBin.io API klíč | Production, Preview, Development |
| `JSONBIN_BIN_ID` | Váš JSONBin.io Bin ID | Production, Preview, Development |

### 4. JSONBin.io Setup
1. Jděte na [https://jsonbin.io](https://jsonbin.io)
2. Zaregistrujte se a získejte API klíč
3. Vytvořte nový bin:

```javascript
const apiKey = 'VÁŠ_API_KLÍČ';
const url = 'https://api.jsonbin.io/v3/b';

fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': apiKey,
        'X-Bin-Private': 'false'
    },
    body: JSON.stringify({ leaderboard: [] })
})
.then(response => response.json())
.then(data => {
    console.log('Bin ID:', data.metadata.id);
});
```

### 5. Deploy
1. V Vercel klikněte "Deploy"
2. Počkejte na dokončení buildu
3. Otevřete URL a otestujte hru

## 🔧 Troubleshooting

### CORS Issues
- JSONBin.io podporuje CORS
- Pokud máte problémy, zkontrolujte konzoli prohlížeče

### Environment Variables
- Ujistěte se, že jsou nastaveny pro všechny prostředí
- Po změně environment variables redeployujte

### API Limits
- JSONBin.io má bezplatný limit
- Pro produkci zvažte upgrade

## 📱 Features po deploymentu

- ✅ Veřejný žebříček
- ✅ Ukládání skóre
- ✅ Real-time aktualizace
- ✅ Responsive design
- ✅ HTTPS podpora

## 🔒 Bezpečnost

- API klíče jsou skryté v environment variables
- Žádné citlivé údaje v kódu
- Veřejný bin pro čtení, privátní pro zápis
