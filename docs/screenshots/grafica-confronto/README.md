# Screenshot confronto grafica con laravelpizza.com

Questa cartella contiene gli screenshot per il confronto visivo tra **produzione** (https://laravelpizza.com/) e **nostra implementazione** (es. http://laravelpizza.local/it o http://127.0.0.1:8002/it).

## File attesi

| File | Descrizione |
|------|-------------|
| `laravelpizza-com-home.png` | Homepage produzione (full page) |
| `nostra-home.png` | Homepage nostra (full page) |
| `laravelpizza-com-header.png` | Solo header/nav produzione (opzionale) |
| `nostra-header.png` | Solo header/nav nostra (opzionale) |
| `differenze-hero.png` | Evidenziazione differenze hero (opzionale) |

Screenshot “nostra” home in light/dark (1440px) sono anche in [../2026-02-02/](../2026-02-02/): `local-home-light-1440.png`, `local-home-dark-1440.png`.

## Come generare gli screenshot

### Con script (Playwright)

Dalla cartella del tema (`laravel/Themes/Meetup`):

```bash
npm install
npx playwright install chromium
npm run screenshots
```

Lo script salva `laravelpizza-com-home.png` (produzione) e `nostra-home.png` (locale) in questa cartella. Per la nostra home l’app deve essere avviata (es. `composer dev` da `laravel/`). URL locale di default: `http://127.0.0.1:8002/it`; per cambiarlo: `LOCAL_URL=http://laravelpizza.local/it npm run screenshots`.

### Con MCP cursor-browser-extension

1. **Produzione**: `browser_navigate` → `https://laravelpizza.com/`  
   Poi `browser_take_screenshot` con `fullPage: true`, `filename: "laravelpizza-com-home.png"`.  
   Il file viene salvato in una cartella temp del browser; **copia** il file nella cartella corrente con il nome `laravelpizza-com-home.png`.

2. **Nostra home**: avvia l’app (es. `composer dev` da `laravel/`).  
   `browser_navigate` → `http://laravelpizza.local/it` (o l’URL della tua istanza).  
   Poi `browser_take_screenshot` con `fullPage: true`, `filename: "nostra-home.png"`.  
   Copia il file dalla cartella temp in questa cartella come `nostra-home.png`.

### Manuale (browser + DevTools o estensione)

1. Apri la pagina in Chrome/Firefox.
2. Usa un’estensione “Full Page Screen Capture” o DevTools (screenshot area).
3. Salva con i nomi indicati nella tabella sopra in questa cartella.

## Documentazione differenze

Vedi il documento principale: [Differenze grafica e miglioramenti](../differenze-grafica-e-miglioramenti.md).
