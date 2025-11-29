# Recensioni siti/app Folio + Volt (Tema Meetup)

## Scopo

Questo documento raccoglie **case study reali** di applicazioni costruite con **Laravel Folio + Livewire Volt** e li guarda dal punto di vista **UI/UX e tema** per Laravel Pizza Meetups.

---

## 1. Todo Application (Nuno Maduro / thinkverse)

- **Cosa è**: semplice app TODO (lista + aggiunta task) costruita con Folio + Volt.
- **Perché è interessante per il tema**:
  - Layout minimale, focus sui contenuti → perfetto per pagine funzionali (dashboard, settings).
  - Struttura molto chiara di pagina unica con componente Volt interno.

### Pattern UI rilevanti

- Lista centrale con card/todo molto semplici.
- Form inline per aggiungere un elemento (input + bottone) sopra la lista.
- Stato visivo immediato (todo completato/non completato) con piccole variazioni di stile.

### Idee riusabili per il tema Meetup

- Layout della sezione "Quick Actions" o "My Tasks" nella dashboard.
- Gestione di piccole liste personali (es. interessi, note, to‑do community) senza complicare l'interfaccia.

---

## 2. Multi‑Step Form (Neon – Volt + Folio + Postgres)

- **Cosa è**: form di candidatura multi‑step con più pagine Folio e componenti Volt per ogni step.
- **Focus UI/UX**:
  - Layout pulito, centrato, con progress indicator chiaro.
  - Ogni step concentra l'attenzione su pochi campi.

### Pattern UI rilevanti

- Barra o breadcrumb degli step (Personal → Education → Work → Review).
- Bottoni "Next"/"Back" sempre nella stessa posizione, con stato disabilitato se il form non è valido.
- Messaggi di validazione vicini al campo, integrati nello stile.

### Idee riusabili per il tema Meetup

- Wizard di **registrazione avanzata** (step su profilo, interessi, città, stack).
- Wizard per **creare un evento** con esperienza guidata e coerente con il design dark del tema.

---

## 3. Podcast / Episodi (Jason Beggs – Laravel News Example)

- **Cosa è**: sito demo con lista episodi, pagina dettaglio e player audio.
- **Perché è interessante**:
  - Organizza molto bene contenuto "a lista" (episodi) + dettaglio.
  - Mostra come integrare componenti JS (player) in un layout Folio + Volt.

### Pattern UI rilevanti

- Listing di card episodi con:
  - titolo
  - durata / numero episodio
  - breve descrizione
- Pagina dettaglio con player principale in alto e contenuto testuale sotto.

### Idee riusabili per il tema Meetup

- Pagina **Event Detail** con hero in alto (titolo evento, data, CTA "Register"), e dettagli/descrizione sotto.
- Possibile futura pagina "Talks/Recordings" per meetup passati, con player audio/video.

---

## 4. Product Management App (Pedro Souza – Medium)

- **Cosa è**: CRUD prodotti con lista e form nella stessa pagina Folio.
- **Aspetti di UI interessanti**:
  - Tabella simple, con colonne chiare e pulsante "Add" evidenziato.
  - Form semplice posizionato sopra o a lato della lista.

### Pattern UI rilevanti

- Layout a due sezioni: form + tabella.
- Feedback immediato dopo l'azione (aggiunta prodotto) senza ricaricare la pagina.

### Idee riusabili per il tema Meetup

- Gestione/elenco di **luoghi** dei meetup o **categorie** nel backoffice UI/Filament, con pattern visivo simile.
- Pagine "profilo organizzatore" con tabella eventi organizzati.

---

## 5. Considerazioni generali per il tema Laravel Pizza Meetups

- Gli esempi confermano che **Folio + Volt** funzionano molto bene con layout:
  - semplici
  - fortemente orientati ai contenuti
  - con uno o pochi componenti reattivi ben visibili (form, player, lista dinamica).
- Per il **tema Meetup** questo significa:
  - mantenere Blade + Tailwind per la struttura di base (hero, sezioni, footer, nav).
  - usare Volt dove servono **azioni dell'utente in tempo reale** (login, registrazione evento, chat, dashboard, multi‑step forms).

Queste recensioni completano le linee guida tecniche in `folio-volt-best-practices.md` e aiutano a prendere decisioni di design concrete per le pagine future (dashboard, profile, event detail, forms guidati).
