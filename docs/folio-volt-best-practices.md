# Laravel Folio & Volt Best Practices

This document summarizes best practices for utilizing Laravel Folio for file-based routing and Laravel Volt for reactive frontend components, ensuring maintainable, reusable, and efficient front-office development.

## Laravel Folio Best Practices (File-Based Routing)

1.  **Logical File Structure:**
    *   **Description:** Organize Folio pages in a way that directly mirrors your application's desired URL structure.
    *   **Benefit:** Improves route discoverability and keeps your codebase intuitive.
    *   **Example:** `pages/products/[ProductId].blade.php` automatically creates a route `/products/{ProductId}`.

2.  **Explicit Naming:**
    *   **Description:** Use clear and descriptive file and folder names for your routes and dynamic URL segments.
    *   **Benefit:** Enhances readability and makes the purpose of each route immediately clear.

3.  **Route Model Binding:**
    *   **Description:** Leverage Folio's ability to automatically inject Eloquent model instances based on URL segments.
    *   **Benefit:** Reduces boilerplate code for fetching model data within your pages or components.
    *   **How:** Name dynamic segments like `[Post].blade.php` to automatically bind a `Post` model.

4.  **Middleware Application:**
    *   **Description:** Apply HTTP middleware directly within your Folio pages.
    *   **Benefit:** Encapsulates route-specific logic (e.g., authentication, authorization) directly with the page that needs it.
    *   **How:** Use the `@middleware` directive within the Folio page or configure middleware in `routes/web.php` for broader application.

5.  **Small, Focused Pages:**
    *   **Description:** Keep individual Folio pages concise. Delegate complex UI or business logic to dedicated Volt components or service classes.
    *   **Benefit:** Promotes single responsibility and easier debugging.

## Laravel Volt Best Practices (Reactive Frontend Components)

1.  **Component-Based Architecture:**
    *   **Description:** Break down complex UI sections into smaller, self-contained, and reusable Volt components.
    *   **Benefit:** Promotes modularity, reusability, and easier maintenance of your user interface.

2.  **Single Responsibility Principle:**
    *   **Description:** Each Volt component should ideally have one clear, well-defined responsibility.
    *   **Benefit:** Components become easier to understand, test, and reuse without unexpected side effects.
    *   **Example:** A `ProductCard` component handles product display, a `CommentForm` component handles comment submission.

3.  **Clear Data Flow:**
    *   **Description:** Explicitly define how data enters (props) and leaves (events) your Volt components.
    *   **Benefit:** Creates predictable interactions and simplifies debugging state changes.

4.  **Integrated Validation:**
    *   **Description:** Perform form validation directly within your Volt component's methods.
    *   **Benefit:** Leverages Laravel's powerful validation capabilities seamlessly within your frontend components.
    *   **How:** Use `$this->validate([...])` in a method that handles form submission.

5.  **Avoid "Fat Components":**
    *   **Description:** Refrain from embedding excessive business logic directly within your Volt component classes.
    *   **Benefit:** Keeps components focused on UI and interaction. Extract complex logic into dedicated service classes, actions, or separate Livewire components that the Volt component then orchestrates.

6.  **Layout Definition with `#[Layout()]`:**
    *   **Description:** Define the layout for your Folio pages using the `#[Layout()]` attribute on your Volt component classes.
    *   **Benefit:** Clearly specifies the Blade layout file that wraps the component, improving clarity and organization.
    *   **Example:** `#[Layout('layouts.app')]`

7.  **Blade-First Mentality:**
    *   **Description:** For simpler UI elements or static content without significant interactivity, prefer plain Blade templates over Volt components.
    *   **Benefit:** Avoids unnecessary overhead. Introduce Volt only when interactivity, complex state management, or backend communication is genuinely required.

8.  **Comprehensive Testing:**
    *   **Description:** Write unit and feature tests for your Volt components.
    *   **Benefit:** Ensures the component's logic, data interactions, and reactive behavior work as expected, contributing to a robust application.

## Pattern osservati da progetti reali Folio + Volt

- **Wizard multi‑step**  
  I casi studio (es. multi‑step form con Neon) usano una serie di pagine Folio (`/apply/personal`, `/apply/education`, …) con Volt che gestisce validazione, avanzamento e salvataggio stato (sessione o tabella dedicata).
- **Listing + dettaglio**  
  Struttura tipica `pages/items/index.blade.php` + `pages/items/[item].blade.php`, con Folio che si occupa delle rotte e Volt che gestisce ricerca, filtri e azioni CRUD leggere.
- **Landing page Blade‑first**  
  Le homepage/marketing page restano Blade + Tailwind; Volt viene introdotto solo per blocchi interattivi (form contatto, iscrizione newsletter, piccoli widget dinamici).
- **Uso costante dei comandi artisan**  
  I progetti esaminati usano `php artisan folio:page` e `php artisan make:volt` per generare file con naming e posizionamento corretti invece di crearli manualmente.

## Real-World Examples & Patterns from Public Projects

### 1. Laravel News Site with Folio + Volt
**Source**: [jasonlbeggs/laravel-news-volt-folio-example](https://github.com/jasonlbeggs/laravel-news-volt-folio-example)

**Key Patterns**:
- Uses computed properties for efficient data loading with search functionality
- Implements live search with `wire:model.live.debounce.500ms` for performance
- Leverages Eloquent relationships with proper eager loading in computed properties

**Example**:
```blade
<?php
use App\Models\Article;
use function Livewire\Volt\{computed, state};

state(['search' => '']);

$articles = computed(function () {
    $query = Article::query()->with(['user', 'category']);
    
    if (!empty($this->search)) {
        $query->where('title', 'like', '%' . $this->search . '%')
              ->orWhere('content', 'like', '%' . $this->search . '%');
    }
    
    return $query->orderBy('published_at', 'desc')->paginate(10);
});
?>
```

### 2. E-commerce Store with Cart Functionality
**Source**: [thedevdojo/genesis](https://github.com/thedevdojo/genesis)

**Key Patterns**:
- Uses session storage for cart persistence across page loads
- Implements cross-component communication via Livewire events
- Combines Folio routing with Volt components for shopping cart operations

**Example**:
```blade
@volt('cart')
    function addToCart($productId, $productName, $price) 
    {
        $cart = session()->get('cart', []);
        
        if (isset($cart[$productId])) {
            $cart[$productId]['quantity']++;
        } else {
            $cart[$productId] = [
                'name' => $productName,
                'price' => $price,
                'quantity' => 1
            ];
        }
        
        session()->put('cart', $cart);
        $this->dispatch('cart-updated');
    }
@endvolt
```

### 3. Multi-Step Form Implementation
**Source**: [benjamincrozat/dummy-store](https://github.com/benjamincrozat/dummy-store)

**Key Patterns**:
- Uses session to maintain form state across multiple Folio pages
- Implements validation for each step of the form
- Provides navigation between form steps with prev/next functionality

**Example**:
```blade
@volt('checkout')
    function nextStep()
    {
        $currentStep = session('checkout_step', 1);
        
        // Validate current step
        $this->validateStep($currentStep);
        
        session(['checkout_step' => $currentStep + 1]);
    }
    
    function validateStep($step)
    {
        if ($step === 1) {
            $this->validate([
                'billingName' => 'required|string|max:255',
                'billingEmail' => 'required|email',
                'billingAddress' => 'required|string|max:255',
            ]);
        }
    }
@endvolt
```

### 4. Real-time Chat Implementation
**Source**: [Laravel Breeze Inertia Volt](https://github.com/laravel/breeze-inertia-volt)

**Key Patterns**:
- Combines polling with event broadcasting for real-time updates
- Uses computed properties for efficient message loading
- Implements proper error handling and user feedback

**Example**:
```blade
@volt('chat')
    $messages = computed(function () {
        return ChatMessage::latest()->take(50)->get();
    });
    
    function sendMessage()
    {
        if (empty(trim($this->newMessage))) {
            return;
        }
        
        ChatMessage::create([
            'user_id' => auth()->id(),
            'message' => $this->newMessage,
        ]);
        
        $this->newMessage = '';
        
        broadcast(new NewChatMessage($this->newMessage))->toOthers();
    }
@endvolt
```

## Performance Optimization Strategies

### 1. Efficient Data Loading
```blade
@volt('optimized-list')
    $items = computed(function () {
        return \Modules\Meetup\Models\Event::query()
            ->with(['organizer', 'location']) // Eager load relationships
            ->orderBy('start_date', 'desc')
            ->paginate(20);
    });
@endvolt
```

### 2. Search with Debouncing
```blade
@volt('search-component')
    $searchQuery = '';
    $results = computed(function () {
        if (strlen($this->searchQuery) < 3) {
            return collect();
        }
        
        return \Modules\Meetup\Models\Event::where('title', 'like', '%' . $this->searchQuery . '%')
            ->limit(10)
            ->get();
    });
@endvolt

<input 
    type="text" 
    wire:model.live.debounce.300ms="searchQuery" 
    placeholder="Search events..."
/>
```

## Security Best Practices from Real-World Examples

### 1. Authorization Checks
```blade
@volt('protected-content')
    if (!auth()->check()) {
        return redirect()->route('login');
    }
    
    // Additional policy checks
    $this->authorize('view', $event);
@endvolt
```

### 2. Input Sanitization
```blade
@volt('form-component')
    $processData = function () {
        $cleanInput = strip_tags($this->userInput);
        $this->userInput = e($cleanInput); // Escape for output
    };
@endvolt
```

## Integration with Laraxot Architecture

### 1. Action Pattern Implementation
```blade
@volt('event-creation')
    $createEvent = function () {
        $validated = $this->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
        ]);

        $action = app(Modules\Meetup\Actions\Event\CreateEventAction::class);
        $result = $action->execute($validated + ['user_id' => auth()->id()]);

        if ($result->success) {
            return redirect()->route('events.show', $result->event->id);
        } else {
            $this->addError('general', $result->message);
        }
    };
@endvolt
```

### 2. Service Integration
```blade
@volt('dashboard-stats')
    $analytics = app(Modules\Meetup\Services\AnalyticsService::class);
    $monthlyEvents = computed(fn() => $this->analytics->getMonthlyEventCounts());
@endvolt
```

## Testing Strategies

### 1. Unit Testing Volt Components
```php
// tests/Feature/Volt/EventRegistrationTest.php
public function test_user_can_register_for_event(): void
{
    $user = User::factory()->create();
    $event = Event::factory()->create();

    Livewire::actingAs($user)
        ->test('event-registration', ['event' => $event])
        ->call('register')
        ->assertDispatched('event-registered');
}
```

### 2. Feature Testing Folio Pages
```php
// tests/Feature/Pages/EventsPageTest.php
public function test_events_page_shows_events(): void
{
    $event = Event::factory()->create();

    $response = $this->get('/events');

    $response->assertStatus(200);
    $response->assertSee($event->title);
}
```

## Laravel Pizza Meetups Specific Implementation Patterns

### 1. Event Registration System
```blade
@volt('event-registration')
    $isRegistered = computed(function () {
        return $this->user && $this->event->attendees()
            ->where('user_id', $this->user->id)
            ->exists();
    });
    
    $registerForEvent = function () {
        if (!$this->user) {
            return redirect('/login?redirect=' . request()->url());
        }
        
        if ($this->event->attendees()->count() >= $this->event->max_attendees) {
            $this->addError('registration', 'Event is fully booked');
            return;
        }
        
        $this->event->attendees()->attach($this->user->id);
        $this->dispatch('event-registered', $this->event->id);
    };
@endvolt
```

### 2. Event Search and Filtering
```blade
@volt('events-search')
    $search = '';
    $category = 'all';
    $dateRange = 'upcoming';
    
    $events = computed(function () {
        $query = \Modules\Meetup\Models\Event::query()
            ->with(['organizer', 'venue'])
            ->where('published', true);
        
        if (!empty($this->search)) {
            $query->where('title', 'like', '%' . $this->search . '%')
                  ->orWhere('description', 'like', '%' . $this->search . '%');
        }
        
        if ($this->category !== 'all') {
            $query->where('category', $this->category);
        }
        
        if ($this->dateRange === 'upcoming') {
            $query->where('start_date', '>', now());
        } elseif ($this->dateRange === 'past') {
            $query->where('start_date', '<', now());
        }
        
        return $query->orderBy('start_date', 'asc')->paginate(12);
    });
@endvolt
```

### 3. User Dashboard with Statistics
```blade
@volt('user-dashboard')
    $stats = computed(function () {
        return [
            'eventsAttended' => $this->user->events()->count(),
            'eventsRegistered' => $this->user->registeredEvents()
                ->where('start_date', '>', now())
                ->count(),
            'recentEvents' => $this->user->registeredEvents()
                ->where('start_date', '>', now())
                ->orderBy('start_date', 'asc')
                ->take(5)
                ->get(),
        ];
    });
@endvolt
```

## Conclusion

These real-world implementation patterns demonstrate that Folio + Volt provide a robust foundation for building modern Laravel applications. The Laravel Pizza Meetups project can leverage these patterns to create:

- Efficient, maintainable code structures
- Responsive, interactive user interfaces
- Secure and performant applications
- Scalable systems that follow DRY, KISS, SOLID, and Laraxot principles

By following these proven patterns, the project will benefit from the collective experience of the Laravel community while maintaining its unique identity as a Laravel-focused community platform with pizza.

---

**Document Version**: 1.0  
**Last Updated**: November 29, 2025
