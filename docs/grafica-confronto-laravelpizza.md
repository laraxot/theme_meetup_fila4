# Confronto grafica con laravelpizza.com

## Obiettivo

Verificare se la grafica del tema Meetup è allineata a https://laravelpizza.com/ (riferimento di produzione).

## Struttura e contenuto

Dall’analisi del sito di riferimento (snapshot MCP e contenuti):

- **Header**: logo “Laravel Pizza Meetups”, nav (Events, Community Chat), dropdown lingua (English), Login, Sign Up.
- **Hero**: titolo “Laravel Developers. Pizza. Community.”, sottotitolo, due CTA (Join the Community, View Events).
- **Sezione “Why Join Our Community?”**: quattro blocchi (Regular Meetups, Growing Community, Multiple Locations, Real-time Chat).
- **CTA finale “Ready to Join?”**: titolo, descrizione, pulsante “Create Your Account”.
- **Footer**: logo, descrizione, Quick Links (Events, Community Chat, Dashboard), Community (About Us, Code of Conduct, Contact), “Made with … for the Laravel community”.

La nostra implementazione (blocchi hero, features, cta in `home.json`; header/footer in `sections/header.blade.php` e footer) replica questa struttura. Palette e stile: tema scuro, accento rosso, in linea con il riferimento. Vedi [visual-comparison-analysis](visual-comparison-analysis.md) e [homepage-visual-alignment-analysis](homepage-visual-alignment-analysis.md).

## Confronto visivo con MCP

Per un confronto pixel-per-pixel:

1. Avviare l’app locale (es. `composer dev` da `laravel/`; URL tipo `http://laravelpizza.local` o `http://127.0.0.1:8002/it`).
2. Usare l’MCP **cursor-browser-extension**:
   - `browser_navigate` → prima `https://laravelpizza.com/`, poi l’URL della nostra home.
   - `browser_take_screenshot` con `fullPage: true` per entrambe le pagine.
   - Confrontare gli screenshot (a mano o con tool di diff immagini).
3. Per struttura DOM/accessibilità: usare `browser_snapshot` su entrambe le pagine.

Dettaglio passi e tool: [mcp-configuration](mcp-configuration.md#confronto-grafica-con-laravelpizzacom-cursor-browser-extension).

## Conclusione

Struttura e contenuti sono allineati al sito di riferimento; eventuali differenze minori (font, spaziature, dettagli SVG) si verificano con screenshot e snapshot MCP. La grafica va considerata **sostanzialmente uguale**; per parity perfetta usare il workflow MCP sopra e aggiornare i blocchi/layout in base agli screenshot.
