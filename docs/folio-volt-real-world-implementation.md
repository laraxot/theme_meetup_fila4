# Folio + Volt Real-World Implementation Guide

## Overview

This document provides practical guidance for implementing Laravel Folio and Livewire Volt based on real-world examples and best practices. The Laravel Pizza Meetups project follows these patterns to ensure maintainability, scalability, and developer productivity.

## Real-World Implementation Patterns

### 1. Event Management System

Based on analysis of community platforms like Laravel News and event management systems:

#### Event Listing with Dynamic Filtering
```blade
@volt('events-list')
    @php
        use Modules\Meetup\Services\EventService;
        
        $filter = [
            'category' => request()->query('category', 'all'),
            'location' => request()->query('location', 'all'),
            'date_range' => request()->query('date', 'upcoming'),
            'search' => request()->query('q', ''),
        ];
        
        $events = app(EventService::class)->getFilteredEvents($filter);
    @endphp

    <div class="filter-controls">
        <input 
            type="text" 
            wire:model.live.debounce.500ms="search" 
            placeholder="Search events..."
            class="search-input"
        />
        
        <select wire:model.live="category" class="category-select">
            <option value="all">All Categories</option>
            <option value="laravel">Laravel</option>
            <option value="filament">Filament</option>
            <option value="livewire">Livewire</option>
        </select>
    </div>

    <div class="events-grid">
        @foreach($events as $event)
            <x-event-card 
                :event="$event" 
                :show-registration-status="auth()->check()" 
            />
        @endforeach
    </div>
@endvolt
```

#### Event Detail with Registration
```blade
@volt('event-detail')
    @php
        use Modules\Meetup\Actions\Event\RegisterForEventAction;
        use Modules\Meetup\Actions\Event\CancelRegistrationAction;
        
        $event = $event; // Passed via Folio route model binding
        $user = auth()->user();
    @endphp

    $isRegistered = computed(fn() => $this->user && $this->event->attendees()->where('user_id', $this->user->id)->exists());

    $register = function () {
        if (!$this->user) {
            return redirect()->route('login', ['redirect' => request()->fullUrl()]);
        }
        
        $action = app(RegisterForEventAction::class);
        $result = $action->execute($this->event, $this->user);
        
        if ($result->success) {
            $this->dispatch('event-registered', eventId: $this->event->id);
        } else {
            $this->addError('registration', $result->message);
        }
    };

    $cancel = function () {
        $action = app(CancelRegistrationAction::class);
        $result = $action->execute($this->event, $this->user);
        
        if ($result->success) {
            $this->dispatch('registration-cancelled', eventId: $this->event->id);
        }
    };
@endvolt
```

### 2. User Authentication & Profile Management

Based on Laravel Breeze and Spark implementations:

#### Login Component
```blade
@volt('login')
    @php
        $email = '';
        $password = '';
        $remember = false;
        $error = '';
    @endphp

    $login = function () {
        $credentials = $this->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (auth()->attempt($credentials, $this->remember)) {
            // Redirect to intended page or dashboard
            $intended = session()->get('url.intended', '/dashboard');
            session()->forget('url.intended');
            return redirect($intended);
        }

        $this->addError('email', __('auth.failed'));
    };
@endvolt
```

#### User Profile Component
```blade
@volt('user-profile')
    @php
        use Modules\Meetup\Actions\User\UpdateUserProfileAction;
        
        $user = auth()->user();
        $name = $user->name;
        $email = $user->email;
        $bio = $user->profile->bio ?? '';
        $location = $user->profile->location ?? '';
    @endphp

    $updateProfile = function () {
        $validated = $this->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $this->user->id,
            'bio' => 'nullable|string|max:1000',
            'location' => 'nullable|string|max:255',
        ]);

        $action = app(UpdateUserProfileAction::class);
        $result = $action->execute($this->user, $validated);

        if ($result->success) {
            $this->dispatch('profile-updated');
        }
    };
@endvolt
```

### 3. Real-Time Community Features

Based on implementations in Laravel.io and community platforms:

#### Live Chat Component
```blade
@volt('community-chat')
    @php
        use Modules\Meetup\Models\ChatMessage;
        
        $channel = request()->query('channel', 'general');
        $messageText = '';
    @endphp

    $messages = computed(function () {
        return ChatMessage::with('user')
            ->where('channel', $this->channel)
            ->orderBy('created_at', 'desc')
            ->take(50)
            ->get()
            ->reverse(); // Show newest last
    });

    $sendMessage = function () {
        if (trim($this->messageText) === '') {
            return;
        }

        $message = ChatMessage::create([
            'user_id' => auth()->id(),
            'channel' => $this->channel,
            'message' => $this->messageText,
        ]);

        broadcast(new \Modules\Meetup\Events\NewChatMessage($message))->toOthers();
        $this->messageText = '';
    };
@endvolt

<div class="chat-container">
    <div class="chat-messages" @poll.2s="loadMessages">
        @foreach($this->messages as $message)
            <x-chat-message :message="$message" />
        @endforeach
    </div>
    
    @volt('send-message')
        <form wire:submit="sendMessage" class="chat-form">
            <input 
                type="text" 
                wire:model="messageText" 
                placeholder="Type your message..."
                class="message-input"
            />
            <button type="submit" class="send-button">Send</button>
        </form>
    @endvolt
</div>
```

### 4. Dashboard with Analytics

Based on dashboard implementations in Laravel apps:

#### User Dashboard Component
```blade
@volt('user-dashboard')
    @php
        use Modules\Meetup\Services\UserStatsService;
        
        $user = auth()->user();
    @endphp

    $stats = computed(function () {
        $service = app(UserStatsService::class);
        return $service->getUserStats($this->user);
    });

    $recentActivity = computed(function () {
        return $this->user->activities()
            ->with('subject')
            ->latest()
            ->take(10)
            ->get();
    });
@endvolt

<div class="dashboard-container">
    <div class="stats-grid">
        <x-stat-card 
            label="Events Attended" 
            :value="$this->stats['events_attended']" 
            icon="calendar"
        />
        <x-stat-card 
            label="Pizza Slices Shared" 
            :value="$this->stats['pizza_slices_shared']" 
            icon="pizza"
        />
        <x-stat-card 
            label="Community Points" 
            :value="$this->stats['community_points']" 
            icon="trophy"
        />
    </div>
    
    <div class="dashboard-sections">
        <x-recent-activity :activities="$this->recentActivity" />
        <x-upcoming-events :user="$this->user" />
    </div>
</div>
```

## Performance Optimization Patterns

### 1. Efficient Data Loading
```blade
@volt('optimized-list')
    @php
        $page = request()->query('page', 1);
        $limit = 20;
    @endphp

    $items = computed(function () {
        return \Modules\Meetup\Models\Event::query()
            ->with(['organizer', 'location']) // Eager load relationships
            ->orderBy('start_date', 'desc')
            ->paginate($this->limit, ['*'], 'page', $this->page);
    });
@endvolt
```

### 2. Search with Debouncing
```blade
@volt('search-component')
    @php
        $searchQuery = '';
    @endphp

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

### 3. Lazy Loading Components
```blade
@volt('lazy-content')
    @php
        $showContent = false;
    @endphp

    $loadContent = function () {
        $this->showContent = true;
    };
@endvolt

@if($showContent)
    <x-heavy-component :data="$computedData" />
@else
    <button wire:click="loadContent">Load Content</button>
@endif
```

## Security Best Practices from Real-World Examples

### 1. Authorization Checks
```blade
@volt('protected-content')
    @php
        if (!auth()->check()) {
            return redirect()->route('login');
        }
        
        // Additional policy checks
        $this->authorize('view', $event);
    @endphp
@endvolt
```

### 2. Input Sanitization
```blade
@volt('form-component')
    $processData = function () {
        $cleanInput = strip_tags($this->userInput);
        $this->userInput = e($cleanInput); // Escape for output
        
        // Or use Laravel's built-in sanitization
        $this->userInput = clean($this->userInput); // If using mews/purifier
    };
@endvolt
```

## Integration with Laraxot Architecture

### 1. Action Pattern Implementation
```blade
// In Volt component
@volt('event-creation')
    @php
        use Modules\Meetup\Actions\Event\CreateEventAction;
        
        $title = '';
        $description = '';
        $date = '';
    @endphp

    $createEvent = function () {
        $validated = $this->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
        ]);

        $action = app(CreateEventAction::class);
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
    @php
        use Modules\Meetup\Services\AnalyticsService;
        
        $analytics = app(AnalyticsService::class);
    @endphp

    $monthlyEvents = computed(fn() => $this->analytics->getMonthlyEventCounts());
    $userEngagement = computed(fn() => $this->analytics->getUserEngagementStats());
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