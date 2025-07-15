# Zama On-chain Riddle Challenge - Technical Report

## Defining the desired experience

The challenge description was intentionally broad, so I first defined the core features to implement:

- Main game page per wireframe: current riddle, input, submit button
- Form validation: no empty or known invalid answers
- Display invalid proposals under the form
- Submit answer proposals as transactions to the contract
- Real-time contract event subscription to derive game state (Waiting, Guessing, Solved)
- Real-time activity feed for contract events (desktop: sidebar, mobile: drawer)
- "Riddle solved" screen for winners
- Light/dark theme selector
- Bot to submit new riddles and simulate player interaction

## Choosing the technical stack

I chose Next.js and Wagmi for the frontend:

- **Next.js**: Modern React framework with SSR, routing, and strong ecosystem. Its wide use makes it easy to onboard new engineers on the project.
- **Wagmi**: Simplifies EVM blockchain interactions (wallet, contract calls, syncing). Fully typed, declarative, and reactive.

Supporting libraries:

- **Jotai**: Minimal, flexible state management for React. Used with **jotai-effect** for state-level side effects.
- **Immer**: Simplifies immutable state updates, especially  useful for reducers.
- **ts-pattern** (+ PattyCake): Type-safe, expressive pattern matching with zero runtime overhead.
- **Tailwind CSS v4** and **Shadcn**: Utility-first styling and prebuilt components for a modern UI. **Framer Motion** for animations.
- **TanStack Query**: (via Wagmi) Efficient async data fetching and state management.
- **TanStack Form**: Manages the guess riddle form with declarative validation and state.
- **TanStack Virtual**: Virtualizes the activity feed for performance with large event lists.

I set up a **Turborepo monorepo** to efficiently manage the frontend, bots, and smart contracts, making it easy to share ABIs and logic. While a shared domain layer isn’t critical for this project, creating such a layer is important for larger apps. That way, ensuring isomorphism with the deployed contracts and different application components is made easier and more maintainable.

## Implementation challenges

### Handling reactive state

A key measure of success for this project is delivering a smooth and predictable user experience. Achieving good UX requires that every interaction with the app feels frictionless and leads to consistent, expected outcomes.

One of the main challenges in this context is managing state that comes from multiple sources:
- **Local and synchronous state updates** (such as the submission form)
- **Remote and asynchronous state updates** (such as transaction results and contract events)

Synchronizing with the contract involves:
- **Reading state variables** (`isActive`, `winner`, `riddle`) to determine game phase
- **Listening to events** to keep UI in sync with on-chain activity

The `useRiddleState` hook handles both: fetching contract state (via React Query/Wagmi) and subscribing to events, which are dispatched to Jotai reducers. Contract state is managed by React Query; events are translated into actions for the state layer, keeping business logic centralized.

  However, I found that while reducers are powerful for managing complex state, this approach is somewhat less idiomatic in Jotai, which is designed for a simpler mental model.


### Read the contract and watch events in real-time

Synchronizing the state between the deployed smart contract and the local application requires a mechanism for reacting to on-chain changes. In our simple case, this involves two primary tasks:

- **Reading Contract State**: The application needs to fetch contract state variables (`isActive`, `winner`, `riddle`) to determine the current phase of the game (Waiting for a new riddle, Guessing, Solved).

- **Listening to Contract Events**: The app must subscribe to smart contract events and handle them as they occur, ensuring the UI and local state remain up-to-date with on-chain activity.

These responsibilities are encapsulated in the `useRiddleState` React hook. This hook currently serves two roles:
- It reads the contract state variables to establish the initial and current game state.
- It sets up an event listener (using Wagmi) to watch for contract events while the component is mounted. When events are received, they are dispatched to the application's state layer via Jotai reducers.

Note: the riddle state itself is not stored with Jotai. Instead, React Query (via Wagmi) manages contract state fetching and provides features like refetching, which are sufficient for our needs. However, handling contract events is more complex: raw events must be translated into high-level actions and dispatched to the reducer, ensuring the application's state remains consistent with the blockchain. That way, we don't keep business logic in the event handler, but at the state layer.

### Do not sent already sent submissions

Initially, the application was set up to track only the submissions made by the current player. This was because the original smart contract did not make all player submissions available - apart from being present as calldata within transaction data, which is not easily accessible from the frontend.

However, in order to verify and display submissions from all players, **the frontend needed a way to access every submitted answer**. If the contract had already been deployed and was immutable, the only viable approach would have been to rely on an off-chain indexing service (such as The Graph or a custom-built indexer, using [Ponder](https://ponder.sh/) for example) to parse transaction calldata and extract the answers. Implementing such an indexing layer, though, was I believe way outside the intended scope and timeline for this project.

Fortunately, since the contract was not used in any mainnet, I was able to address this limitation directly. I modified the contract so that **the `AnswerRiddle` and `Winner` events now includes the submitted answer** as an explicit event argument. With this change, the frontend can listen for these events and immediately merge submissions from all players into the local state, eliminating the need for any off-chain indexing infrastructure.

### Activity feed and virtualization

While testing the bot with the maximum number of fake players and a high submission rate, I quickly noticed that render times increased dramatically as the activity feed filled up. Although this is an extreme scenario, it highlighted a **real scalability concern*** for longer or more active sessions in production. To address this, I decided to implement list virtualization - a feature I hadn’t expected to need for a technical interview, but one that proved valuable here.

I chose **TanStack Virtual** for this purpose, as I was already leveraging the TanStack ecosystem and appreciate its flexibility. Crucially, TanStack Virtual supports virtualization for **lists with dynamic item sizes**, which was essential since activity feed events can vary in height. This allowed the activity feed to remain performant and responsive, regardless of the number of events.
