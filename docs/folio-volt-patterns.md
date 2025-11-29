# Folio + Volt Patterns - Meetup Theme

## Panoramica

Questo documento descrive i pattern comuni utilizzati nel tema Meetup per implementare pagine con Folio e componenti Volt.

## Pattern Comuni

### Pattern 1: Lista con Filtri

**Uso**: Pagine che mostrano liste di elementi con filtri

**Esempio**: `events.blade.php`

```blade
<x-layouts.app>
    @volt('events')
        @php
            $category = request()->query('category', 'all');
            $events = app(EventService::class)->getFilteredEvents($category);
        @endphp

        <div class="filters">
            <a href="?category=all">All</a>
            <a href="?category=meetups">Meetups</a>
            <a href="?category=workshops">Workshops</a>
        </div>

        <div class="events-list">
            @foreach($events as $event)
                <x-event-card :event="$event" />
            @endforeach
        </div>
    @endvolt
</x-layouts.app>
```

### Pattern 2: Dettaglio con Azioni

**Uso**: Pagine di dettaglio con azioni interattive

**Esempio**: `events/[event].blade.php`

```blade
<x-layouts.app>
    @volt('event-detail')
        <h1>{{ $event->title }}</h1>
        
        @volt('event-actions')
            @if(auth()->check())
                <button wire:click="register">Register</button>
            @else
                <a href="/login">Login to Register</a>
            @endif
        @endvolt
        
        function register()
        {
            app(RegisterEventAction::class)->execute($this->event, auth()->user());
        }
    @endvolt
</x-layouts.app>
```

### Pattern 3: Form con Validazione

**Uso**: Form di registrazione, login, modifica profilo

**Esempio**: `auth/register.blade.php`

```blade
<x-layouts.auth>
    @volt('register')
        <form wire:submit="register">
            <input type="text" wire:model="name" />
            @error('name') <span>{{ $message }}</span> @enderror
            
            <input type="email" wire:model="email" />
            @error('email') <span>{{ $message }}</span> @enderror
            
            <input type="password" wire:model="password" />
            @error('password') <span>{{ $message }}</span> @enderror
            
            <button type="submit">Register</button>
        </form>
    @endvolt
    
    function register()
    {
        $this->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8',
        ]);
        
        app(RegisterUserAction::class)->execute([
            'name' => $this->name,
            'email' => $this->email,
            'password' => $this->password,
        ]);
        
        return redirect('/dashboard');
    }
</x-layouts.auth>
```

### Pattern 4: Dashboard con Statistiche

**Uso**: Dashboard con dati aggregati e liste

**Esempio**: `dashboard.blade.php`

```blade
<x-layouts.app>
    @volt('dashboard')
        @php
            $stats = app(UserStatsService::class)->getUserStats(auth()->user());
        @endphp

        <div class="stats-grid">
            <x-stat-card label="Events" :value="$stats['events']" />
            <x-stat-card label="Messages" :value="$stats['messages']" />
        </div>
        
        @volt('recent-activity')
            @php
                $activities = auth()->user()->activities()->latest()->limit(10)->get();
            @endphp
            
            <div class="activity-list">
                @foreach($activities as $activity)
                    <x-activity-item :activity="$activity" />
                @endforeach
            </div>
        @endvolt
    @endvolt
</x-layouts.app>
```

### Pattern 5: Chat Real-time

**Uso**: Chat community con aggiornamenti real-time

**Esempio**: `chat.blade.php`

```blade
<x-layouts.app>
    @volt('chat')
        @php
            $channel = request()->query('channel', 'general');
            $messages = app(ChatService::class)->getChannelMessages($channel);
        @endphp

        <div class="chat-container">
            <div class="channels">
                <a href="?channel=general">General</a>
                <a href="?channel=laravel">Laravel</a>
            </div>
            
            @volt('chat-messages')
                <div class="messages" wire:poll.2s>
                    @foreach($messages as $message)
                        <x-chat-message :message="$message" />
                    @endforeach
                </div>
                
                <form wire:submit="sendMessage">
                    <input type="text" wire:model="messageText" />
                    <button type="submit">Send</button>
                </form>
            @endvolt
            
            function sendMessage()
            {
                app(SendChatMessageAction::class)->execute(
                    $this->channel,
                    auth()->user(),
                    $this->messageText
                );
                
                $this->messageText = '';
            }
        </div>
    @endvolt
</x-layouts.app>
```

## Componenti Riutilizzabili

### Event Card Component

**File**: `components/event-card.blade.php`

```blade
@props(['event'])

<div class="event-card">
    <h3>{{ $event->title }}</h3>
    <p>{{ $event->description }}</p>
    <p>{{ $event->start_date->format('F j, Y') }}</p>
    <a href="/events/{{ $event->id }}">View Details</a>
</div>
```

### Statistics Card Component

**File**: `components/statistics-card.blade.php`

```blade
@props(['label', 'value', 'icon'])

<div class="stat-card">
    <div class="icon">{{ $icon }}</div>
    <div class="value">{{ $value }}</div>
    <div class="label">{{ $label }}</div>
</div>
```

## Layout Structure

### Layout App

**File**: `layouts/app.blade.php`

```blade
<!DOCTYPE html>
<html>
<head>
    <title>{{ $title ?? 'Laravel Pizza Meetups' }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <x-navigation />
    
    <main>
        {{ $slot }}
    </main>
    
    <x-footer />
</body>
</html>
```

### Layout Auth

**File**: `layouts/auth.blade.php`

```blade
<!DOCTYPE html>
<html>
<head>
    <title>{{ $title ?? 'Authentication' }}</title>
    @vite(['resources/css/app.css'])
</head>
<body class="auth-page">
    <div class="auth-container">
        {{ $slot }}
    </div>
</body>
</html>
```

## Best Practices per il Tema

### 1. Organizzazione File

```
Themes/Meetup/resources/views/
├── layouts/
│   ├── app.blade.php
│   └── auth.blade.php
├── components/
│   ├── navigation.blade.php
│   ├── footer.blade.php
│   ├── event-card.blade.php
│   └── statistics-card.blade.php
└── pages/
    ├── index.blade.php
    ├── events.blade.php
    ├── events/
    │   └── [event].blade.php
    ├── dashboard.blade.php
    ├── profile.blade.php
    ├── chat.blade.php
    └── auth/
        ├── login.blade.php
        └── register.blade.php
```

### 2. Naming Conventions

- **Pagine**: `kebab-case.blade.php` (es: `event-detail.blade.php`)
- **Componenti**: `kebab-case.blade.php` (es: `event-card.blade.php`)
- **Volt Components**: `snake_case` (es: `@volt('event_detail')`)

### 3. Type Safety

Sempre usare type hints nelle funzioni Volt:

```blade
@volt('example')
    function register(Event $event, User $user): void
    {
        // Type-safe!
    }
@endvolt
```

### 4. Error Handling

```blade
@volt('example')
    function register()
    {
        try {
            app(RegisterEventAction::class)->execute($this->event, auth()->user());
            $this->dispatch('success', 'Registered successfully!');
        } catch (\Exception $e) {
            $this->dispatch('error', $e->getMessage());
        }
    }
@endvolt
```

## Riferimenti

- [Folio + Volt Best Practices](../Modules/Meetup/docs/folio-volt-best-practices.md)
- [Architecture Overview](../Modules/Meetup/docs/architecture.md)

---

**Versione**: 1.0  
**Ultimo Aggiornamento**: 2025-01-27

