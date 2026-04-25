# HackerFeed 🔥

A production-quality React Native CLI app for browsing Hacker News top stories. Built with TypeScript, Zustand, MMKV persistence, Lucide icons, and React Navigation.

![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue)
![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Table of Contents

- [Setup](#-setup)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Testing](#-testing)
- [Architecture Decisions](#-architecture-decisions)
- [Known Trade-offs](#-known-trade-offs)
- [Deep-Dive Questions](#-deep-dive-questions)

---

## 🚀 Setup

### Prerequisites

- Node.js ≥ 22.11.0
- React Native CLI
- Xcode 15+ (iOS)
- Android Studio + Android SDK (Android)
- CocoaPods (iOS)

### Installation

```bash
# 1. Clone and install dependencies
git clone https://github.com/minhaz19/hacker-feed.git
cd HackerFeed
npm install

# 2. iOS: Install native pods (required for MMKV, SVG, etc.)
cd ios && pod install && cd ..

# 3. Run the app
# iOS
npx react-native run-ios

# Android
npx react-native run-android
```

### Running Tests

```bash
npm test
```

---

## 🏗 Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────┐
│                   App.tsx                    │
│          (GestureHandlerRootView)            │
├─────────────────────────────────────────────┤
│              AppNavigator                   │
│           (Root Stack Navigator)            │
│   ┌───────────────────┐  ┌──────────────┐  │
│   │    MainTabs        │  │ArticleDetail │  │
│   │  (TabNavigator)    │  │  (no tabs)   │  │
│   │  ┌──────┐┌──────┐ │  └──────────────┘  │
│   │  │ Feed ││Marks │ │                     │
│   │  └──────┘└──────┘ │                     │
│   └───────────────────┘                     │
├─────────────────────────────────────────────┤
│              Zustand Stores                 │
│     ┌──────────┐  ┌──────────────┐         │
│     │ feedStore │  │bookmarkStore │         │
│     └──────────┘  └──────────────┘         │
│                         │                   │
│                    MMKV Persist              │
├─────────────────────────────────────────────┤
│         Hacker News Firebase API            │
└─────────────────────────────────────────────┘
```

The **ArticleDetail** screen lives at the root stack level (above the tab navigator). This means the bottom tab bar is naturally hidden when viewing an article — no visibility hacks needed.

### Data Flow

1. **API Layer** (`useHackerNewsApi.ts`): Fetches top 20 story IDs, then parallel-fetches all items via `Promise.all`. Filters to `type === 'story'` with a valid `url`.
2. **Feed Store** (`feedStore.ts`): Manages stories, sort mode, search query, and loading states. Sort and filter are derived selectors.
3. **Bookmark Store** (`bookmarkStore.ts`): Uses Zustand's `persist` middleware backed by MMKV for instant, synchronous reads on cold start.
4. **UI Components**: Subscribe to store slices via Zustand selectors — no prop drilling.

---

## 📁 Project Structure

```
src/
├── features/
│   ├── feed/
│   │   ├── ArticleListScreen.tsx   # Main feed with FlatList
│   │   ├── StoryItem.tsx           # Memoised list item
│   │   ├── SearchBar.tsx           # Debounced search
│   │   └── SortToggle.tsx          # Score/time toggle
│   ├── detail/
│   │   └── ArticleDetailScreen.tsx # Story detail + share + bookmark
│   └── bookmarks/
│       └── BookmarksScreen.tsx     # Saved stories with swipe-to-remove
├── store/
│   ├── feedStore.ts                # Feed state (Zustand)
│   ├── bookmarkStore.ts           # Bookmarks with MMKV persist
│   └── index.ts
├── navigation/
│   ├── AppNavigator.tsx            # Root stack (Tabs + ArticleDetail)
│   ├── TabNavigator.tsx            # Bottom tabs (Feed + Bookmarks)
│   └── index.ts
├── hooks/
│   ├── useHackerNewsApi.ts         # API fetch functions
│   ├── useAppHooks.ts             # useDebounce, useNetworkStatus, etc.
│   └── index.ts
├── utils/
│   ├── sort.ts                     # Pure sort function (testable)
│   ├── time.ts                     # Relative & absolute time formatting
│   └── url.ts                      # Domain extraction, favicon URLs
├── storage/
│   ├── mmkv.ts                     # MMKV singleton (createMMKV v4)
│   ├── zustandMMKVStorage.ts       # Zustand StateStorage adapter
│   └── index.ts
├── types/
│   ├── story.ts                    # HNItem, Story, SortMode, LoadingState
│   └── navigation.ts              # RootStack & Tab param lists
└── components/
    └── shared/
        ├── SkeletonLoader.tsx      # Animated skeleton UI
        ├── EmptyState.tsx          # Empty list state (Lucide icon prop)
        ├── ErrorState.tsx          # Error with retry
        ├── OfflineBanner.tsx       # Network status banner
        └── index.ts
```

---

## ✨ Features

| Feature | Status |
|---------|--------|
| Top stories feed with FlatList | ✅ |
| Favicon + domain + score + relative time | ✅ |
| Pull-to-refresh | ✅ |
| Skeleton loader on first load | ✅ |
| Empty state & error state UI | ✅ |
| Sort toggle (score / time) | ✅ |
| Article detail with metadata | ✅ |
| Share button (header) | ✅ |
| Bookmark toggle (MMKV persist) | ✅ |
| Bookmarks tab with badge | ✅ |
| Swipe-to-remove bookmarks | ✅ |
| Debounced search bar | ✅ |
| Offline connectivity banner | ✅ |
| Memoised list items | ✅ |
| Lucide icons (react-native-svg) | ✅ |
| `@/` path alias | ✅ |
| Tab bar hidden on detail screen | ✅ |
| Error alerts for share/link failures | ✅ |
| Unit tests (sort logic) | ✅ |
| Component tests (StoryItem) | ✅ |

---

## 🧪 Testing

### Test Files

1. **`__tests__/utils/sort.test.ts`** — Unit tests for `sortStories()`:
   - Sort by score (descending)
   - Sort by time (descending/newest first)
   - Immutability verification
   - Edge cases (empty, single-item, equal values)

2. **`__tests__/features/StoryItem.test.tsx`** — Component tests:
   - Renders title, domain, score
   - `onPress` fires with correct story on tap
   - Does not fire when not tapped

### Running Tests

```bash
npm test                    # Run all tests
npx jest --coverage         # With coverage report
npx jest --watch            # Watch mode
```

---

## 🎯 Architecture Decisions

| Decision | Rationale |
|----------|-----------|
| **Zustand over Redux** | Minimal boilerplate, built-in `persist` middleware, excellent TypeScript support, and tiny bundle size (~1KB). For 3 screens with simple state, Redux would be overengineered. |
| **MMKV over AsyncStorage** | JSI-based synchronous reads (~30x faster), no bridge overhead, C++ implementation. Critical for instant bookmark restoration on cold start. Uses `createMMKV()` factory (v4 API). |
| **Feature-based folders** | Co-locates related screens, components, and logic. Scales naturally — adding a new feature means adding a new folder, not touching 6 different directories. |
| **Pure utility functions** | `sortStories`, `extractDomain`, `getRelativeTime` are pure functions extracted from UI. Easy to test, easy to reason about, zero coupling. |
| **Record\<number, Story\> for bookmarks** | O(1) lookups for `isBookmarked()` checks. FlatList re-renders on every scroll; an array `.find()` would be O(n) on each render. |
| **Zustand selectors** | Each component subscribes to the minimal slice it needs. `useFeedStore(s => s.sortMode)` only re-renders when `sortMode` changes, not when `stories` updates. |
| **Root stack for detail screen** | ArticleDetail is placed above the tab navigator in a root stack. This naturally hides the bottom tab bar without any visibility hacks. |
| **Lucide icons over emojis** | `lucide-react-native` provides crisp, scalable SVG icons via `react-native-svg`. Consistent cross-platform rendering instead of platform-dependent emoji. |
| **Swipe-to-remove (Reanimated)** | `ReanimatedSwipeable` from gesture-handler provides a native-feeling swipe experience. Full-swipe auto-deletes, partial swipe reveals a delete button. |
| **`@/` path alias** | `babel-plugin-module-resolver` maps `@/` → `./src/` for cleaner imports. Configured in both `tsconfig.json` (TypeScript) and `babel.config.js` (Metro). |

---

## ⚠️ Known Trade-offs

1. **No WebView for article reading**: We open URLs via `Linking.openURL` (system browser). A WebView would keep users in-app but adds complexity and memory overhead.

2. **No pagination**: We fetch 20 stories upfront. For a production app with 500+ stories, you'd want infinite scroll with cursor-based pagination.

3. **No offline caching of stories**: Bookmarks persist but the feed doesn't cache. A production app would cache the last-fetched feed in MMKV for instant display on cold start.

4. **getItemLayout assumes fixed height**: The `ITEM_HEIGHT` constant approximates actual item height. If title text wraps to 3+ lines, scroll position calculations may be slightly off.

---

## 📝 Deep-Dive Questions

### Q1: Bridge vs JSI & The New Architecture

The traditional React Native Bridge is an asynchronous, serialized message queue between JavaScript and native code. Every cross-boundary call serializes data to JSON, sends it across the bridge, deserializes on the other side, and the response follows the same path back. This introduces latency and is inherently batched — JS and native operate on different threads with no direct memory sharing.

**JSI (JavaScript Interface)** solves this by providing a C++ layer that lets JavaScript hold direct references to native (C++) objects and call methods on them synchronously. There's no serialization, no message queue — JS can invoke a C++ function just like calling a JS function. This is what makes MMKV so fast: `mmkv.getString('key')` is a synchronous JSI call that returns immediately, whereas AsyncStorage would need to serialize the request, bridge it, wait for native I/O, bridge the result back, and deserialize it.

**Fabric** is the new rendering system built on JSI. It replaces the old "shadow tree diffing over the bridge" approach with a C++ shadow tree that both JS and native can access directly. This enables synchronous layout measurement (critical for things like `onLayout` callbacks during gesture-driven animations) and concurrent rendering support.

**TurboModules** replace the old Native Modules system. Instead of eagerly initializing all native modules at startup (the old `NativeModules.MyModule` approach), TurboModules are lazily loaded via JSI and use code-generated type-safe interfaces from a spec file. This means faster app startup (modules load on first use) and compile-time type safety between JS and native code. Together, Fabric + TurboModules + JSI form the "New Architecture" that eliminates the bridge entirely.

---

### Q2: Diagnosing a Janky FlatList Rendering 500 Items on Mid-Range Android

**Step 1 — Profile with Flipper & React DevTools**: Open Flipper's performance plugin and enable the React DevTools Profiler. Record a scroll session and look for long frame renders (> 16ms for 60fps). The Profiler's flame chart reveals which components re-render and how long each render takes. On Android, also check `adb shell dumpsys gfxinfo <package>` for janky frame counts.

**Step 2 — Audit `renderItem` complexity**: The most common cause is expensive `renderItem` functions. Check if each item does inline object/function creation (causing React.memo to fail), fetches images without caching, or renders complex nested views. Wrap the item component in `React.memo` with a custom comparator if needed. Move inline arrow functions to `useCallback` references.

**Step 3 — Implement windowing optimizations**: Add `getItemLayout` to skip async layout measurement for each item (this alone can cut jank by 50%). Set `windowSize` to a smaller value (e.g., 5 instead of default 21) to reduce the number of off-screen items rendered. Set `maxToRenderPerBatch` to 5-10 (default is 10) and `updateCellsBatchingPeriod` to 50ms to spread rendering across frames. Set `removeClippedSubviews={true}` on Android to detach off-screen views from the native hierarchy.

**Step 4 — Reduce item render cost**: Replace heavy `Image` components with a caching library like `react-native-fast-image`. Flatten the view hierarchy — Android's GPU renders nested `View` components less efficiently. Use `shouldComponentUpdate` or `React.memo` with shallow comparison. If items have fixed height, avoid `flexWrap` and complex layout calculations. Consider using `@shopify/flash-list` as a drop-in FlatList replacement — it uses cell recycling (like native UICollectionView/RecyclerView) instead of unmounting/remounting, which is dramatically faster for large lists.

---

### Q3: useCallback/useMemo — When It Helps vs When It Hurts

**Scenario where useMemo helps measurably**: In our `ArticleListScreen`, `getFilteredStories()` sorts and filters an array of stories on every render. Without `useMemo`, every keystroke in the search bar triggers a re-render of the screen, which re-computes the sort and filter of all 20 stories — even if neither `stories` nor `sortMode` changed. Wrapping this in `useMemo(() => getFilteredStories(), [stories, sortMode, searchQuery])` ensures the computation only runs when its inputs change. For 20 items this is marginal, but for 500+ items with a complex sort comparator, the difference is measurable in profiling: you'd see `sortStories` dropping from the flame chart on re-renders caused by unrelated state changes.

**Scenario where useMemo makes performance worse**: Memoizing a simple string concatenation or primitive computation, like `useMemo(() => \`Score: \${score}\`, [score])`, actually makes things slower. The overhead of `useMemo` includes: (1) allocating the dependency array on every render, (2) iterating through the deps and performing `Object.is` comparisons, and (3) storing the cached result in the fiber's hook state. For a trivial expression like string interpolation (which takes nanoseconds), this bookkeeping overhead exceeds the cost of just recomputing the value. React's own documentation warns against this — you're trading one cheap computation for a slightly more expensive memoization check on every single render, plus increased memory usage for the cached value. The rule of thumb: profile first, memoize only when the computation cost exceeds the memoization overhead.

---

### Q4: State Management — Context API vs Redux Toolkit vs Zustand

For an app with 12 screens, multiple APIs, and shared global state (auth, theme, cart), **I would choose Zustand** with clear rationale:

**Context API** falls short for this scale. Each Context triggers a re-render of *all* consumers when *any* part of the context value changes. With auth + theme + cart in a single context, updating the cart item count re-renders every component that reads the auth token. You can split into multiple contexts, but then you're manually building a state management library with worse ergonomics. Context is ideal for low-frequency updates (theme, locale) but not for frequently changing state like cart operations or API loading states.

**Redux Toolkit (RTK)** is a strong choice. RTK Query handles API caching, RTK slices reduce boilerplate, and the middleware ecosystem (persist, saga, logger) is mature. For a team of 5+ engineers, Redux's strict unidirectional data flow and DevTools time-travel debugging provide valuable guardrails. However, for a team of 1-3 engineers on a mid-complexity app, the ceremony of slices + reducers + selectors + RTK Query endpoints adds cognitive overhead that doesn't pay off until you hit ~20+ screens with complex data flows.

**Zustand** hits the sweet spot for this app. The API is minimal: create a store, use it as a hook. Selectors are just functions — `useStore(s => s.cart.items)` only re-renders when `cart.items` changes (referential equality by default). The `persist` middleware integrates with MMKV trivially. TypeScript inference works without extra boilerplate. The entire library is ~1KB gzipped vs Redux Toolkit's ~11KB.

**What would change my mind**: If the app grew to 30+ screens with complex entity relationships (normalized data), optimistic updates across multiple endpoints, or a team of 8+ developers who need strict architectural constraints, I'd switch to RTK + RTK Query. Redux's enforced patterns (actions, reducers, selectors) serve as "architectural documentation" that scales better with team size than Zustand's more flexible approach.

---

### Q5: Offline-First UX Strategy

**Connectivity Detection**: Use `@react-native-community/netinfo` with `addEventListener` for real-time network state changes. However, `isConnected: true` doesn't guarantee internet access — the device might be on WiFi with no internet. For critical operations, pair NetInfo with a lightweight health check (e.g., `HEAD` request to your API). In our app, we show an `OfflineBanner` component that subscribes to NetInfo state and displays when `isConnected === false`.

**Caching Strategy**: For a production offline-first app, the approach is layered: (1) MMKV for structured data (user preferences, bookmarks, last-fetched feed), (2) a local SQLite database (via `react-native-quick-sqlite`, also JSI-based) for normalized entity storage if the data model is complex, and (3) HTTP-level caching for images and API responses. On app launch, immediately render cached data from MMKV/SQLite while firing a background refresh. When the refresh completes, merge new data with the displayed data (optimistic UI). If the user is offline, serve stale data with a "Last updated X ago" indicator.

**Cache Invalidation**: This is the hardest part. Strategies include: time-based TTL (e.g., stories older than 30 minutes are stale), version-based (API returns a version header; if it differs from cached version, invalidate), and event-based (WebSocket push notifications trigger selective cache busting). For HN's use case, a simple TTL of 5-10 minutes per story list works well since the top stories change slowly. Individual story scores/comments change faster but are less critical.

**Why MMKV over AsyncStorage**: AsyncStorage uses SQLite under the hood on both platforms, with all operations serialized as JSON strings over the React Native bridge. Every read is: JS → Bridge (serialize) → Native thread → SQLite query → Bridge (serialize response) → JS (deserialize JSON). MMKV eliminates this entirely: it's a C++ key-value store (backed by memory-mapped files for durability) accessed directly via JSI. Reads are synchronous — `mmkv.getString('key')` returns immediately without promises, async/await, or bridge overhead. Benchmarks consistently show MMKV is ~30x faster for reads and ~20x faster for writes. For our bookmark store, this means `isBookmarked(id)` in the FlatList's render path is a synchronous hash lookup + MMKV read, not an async bridge call that would cause a flash of "not bookmarked" on mount. The synchronous nature also simplifies Zustand's persist middleware — rehydration happens before the first render, so there's no loading state needed for persisted data.

---

## 📄 License

MIT
