# Zama On-chain Riddle Challenge - Technical Report

## Defining the target experience

The challenge description was intentionally open-ended, so I first defined the core features to implement:

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

I chose Next.js and Wagmi for the front-end:

- **Next.js**: Modern React framework with SSR, routing, and strong ecosystem. Its wide use makes it easy to onboard new engineers on the project.
- **Wagmi**: Simplifies EVM blockchain interactions (wallet, contract calls, syncing). Fully typed, declarative, and reactive. My go-to dependency on any dApp project (React or Vue).

Supporting libraries:

- **Jotai**: Minimal, flexible state management for React. Used with **jotai-effect** for state-level side effects.
- **Immer**: Simplifies immutable state updates, especially useful for actions (write only actions).
- **ts-pattern** (+ PattyCake): Type-safe, expressive pattern matching with zero runtime overhead.
- **Tailwind CSS v4** and **Shadcn**: Utility-first styling and prebuilt components for a modern UI. **Framer Motion** for animations.
- **TanStack Query**: (via Wagmi) Efficient async data fetching and state management.
- **TanStack Form**: Manages the guess riddle form with declarative validation and state.
- **TanStack Virtual**: Virtualizes the activity feed for performance with large event lists.

I configured a **Turborepo monorepo** to efficiently manage the front-end, bots, and smart contracts, making it easy to share ABIs and logic. While a shared domain layer isn’t critical for this project, creating such a layer is important for larger apps. This approach ensures isomorphism with the deployed contracts and different application components is made easier and more maintainable.

## Implementation challenges

### Handling reactive state

My primary success metric for this project was delivering a smooth and predictable user experience. Good UX requires that every interaction with the app feels frictionless and results in consistent, expected outcomes. To accomplish this, a state manager is almost essential for coordinating and synchronizing the application's state across different components. Since state managers handle the most complex aspects, it becomes much easier to ensure that UI updates and user actions remain consistent and predictable, even as the underlying data changes in real time.

I selected **Jotai** as the state manager due to its simple mental model and suitability for a project of this scale. This also provided a personal opportunity to evaluate Jotai in a dApp context. Initially, I experimented with a **reducer pattern** (inspired by Redux) to enforce pure state transitions, as showcased on [Jotai's docs](https://jotai.org/docs/utilities/reducer). While this approach is in fact robust, I found it conflicting with Jotai’s idioms and added unnecessary complexity.

Ultimately, I moved away from the reducer pattern and embraced Jotai’s native approach. This change improved code clarity, enhanced the developer experience, and made it easier to reason about state and reactivity. Introducing **Immer** also made my state layer much easier to read and understand, eliminating boilerplate code for immutable state updates.

> Note: I also evaluated [Valtio](https://valtio.dev/) as a state manager. I chose to stick with Jotai because I tend to avoid "magic" internals and JavaScript proxies - from experience, they often lead to debugging nightmares. If I had chosen Nuxt instead of Next, [Pinia](https://pinia.vuejs.org/) would have been a perfect choice, as it's developed alongside Vue and is truly designed to integrate with it.

### Read the contract and watch events in real-time

Synchronizing state between the deployed smart contract and the local application requires a mechanism for reacting to on-chain changes. In this case, this involves two primary tasks:

- **Reading Contract State**: The application must fetch contract state variables (`isActive`, `winner`, `riddle`) to determine the current phase of the game (Waiting for a new riddle, Guessing, Solved).

- **Listening to Contract Events**: The app must listen to smart contract events and handle them as they occur, ensuring the UI and local state remain up-to-date with on-chain activity.

These responsibilities are encapsulated in the `useRiddleState` hook. It currently serves two purposes:
- It reads the contract state variables to establish the initial and current game state.
- It sets up an event listener (using Wagmi) to watch for contract events while the component is mounted. When events are received, they are dispatched to the application's state layer via write-only Jotai atoms.

> Note: The riddle state itself is not stored in Jotai. Instead, React Query (via Wagmi) manages contract state fetching and provides features like refetching, which are sufficient for our needs. Integrating this with Jotai would have added an unnecessary layer. However, handling contract events is more complex: raw events must be translated into high-level actions and dispatched to the state layer as business-modeled events, ensuring the application's state remains consistent with the blockchain. This approach keeps business logic out of the event handler and instead places it within the state layer.

### Do not sent already sent submissions

Initially, the application was set up to track only the submissions made by the current player. This was because the original smart contract did not make all player submissions available - apart from being present as calldata within transaction data, which is not easily accessible from the front-end.

However, in order to verify and display submissions from all players, **the front-end needed a way to access every submitted answer**. If the contract had already been deployed and was immutable, the only viable approach would have been to rely on an off-chain indexing service (such as The Graph or a custom-built indexer, using [Ponder](https://ponder.sh/) for example) to parse transaction calldata and extract the answers. Implementing such an indexing layer, though, was I believe way outside the intended scope and timeline for this project.

Fortunately, since the contract was not used in any mainnet, I was able to address this limitation directly. I modified the contract so that **the `AnswerRiddle` and `Winner` events now includes the submitted answer** as an explicit event argument. With this change, the front-end can listen for these events and immediately merge submissions from all players into the local state, eliminating the need for any off-chain indexing infrastructure.

### Activity feed and virtualization

While testing the bot with the maximum number of fake players and a high submission rate, I quickly noticed that render times increased dramatically as the activity feed filled up. Although this is an extreme scenario, it highlighted a **real scalability concern** for longer or more active sessions in production. To address this, I decided to implement **list virtualization** - a feature I hadn’t expected to need for a technical interview, but one that proved valuable here.

I chose **TanStack Virtual** for this purpose, as I was already leveraging the TanStack ecosystem and appreciate its flexibility. Crucially, TanStack Virtual supports **virtualized lists with dynamic item sizes**, which was essential because activity feed events can vary in height. This kept the activity feed to remain performant and responsive, regardless of the number of events.
