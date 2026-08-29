# Dream Realm — Devpost submission draft

## One-line positioning

**Dream Realm is an AI-native playable creator world where humans and AI agents can participate together in gameplay and creation.**

## Inspiration and product idea

Most agent integrations sit beside an experience: they explain a game, fill a form, or automate a separate dashboard. Dream Realm explores a more interesting possibility. A human and an AI agent share one living creator world, see the same mission state, and contribute to the same result.

The broader Dream Realm concept includes Dance, Music, and Fashion creator rooms. This challenge submission deliberately focuses on one reliable end-to-end Dance loop so judges can experience the complete human-agent relationship rather than a wide but fragile demo.

## Why Dream Realm is a strong WebMCP use case

Dream Realm combines real-time game state, sequential mission rules, creative choices, visible consequences, and a human-controlled media export. Those are difficult for a general agent to operate reliably by guessing at buttons or interpreting screenshots. WebMCP gives the live site a small, explicit vocabulary for collaboration: read the current state, start a route, restore a Dance signal, resolve Murk's doubt, compose Naya's performance, prepare the output, update Trending Tower, and return to the HUB.

The tools do not create a parallel simulation. They operate the same state and controller used by the visible mouse/touch interface, so every agent action is immediately visible to the person and every human action changes what the agent reads next.

## How WebMCP improves the player experience

The player keeps agency over the parts that should feel personal and consent-driven. They activate the portal, can play every interaction normally, and retain visible control of recording and downloading the final WebM video. An agent can help interpret the current mission, submit structured signal choices, preserve a chosen creative combination, and move the shared experience forward without brittle UI automation.

This creates a cooperative rhythm:

1. A person enters Dream Realm and chooses a Gateway Mission or Direct Creator route.
2. The agent reads the live state and valid next actions.
3. Human and agent repair Noiz corruption and resolve Murk's doubt in the same mission.
4. They choose Naya's outfit, scene, movement, and effect together.
5. The agent prepares the exact performance while the person explicitly records/downloads the video.
6. The shared output updates Trending Tower and changes the HUB.

## What people and agents can now do together

Before WebMCP, an agent would have to infer screen state, locate transient controls, and imitate clicks. That is slow, fragile, and disconnected from the game's meaning. With WebMCP, the agent understands named game actions and validated transitions while the player watches the same world react.

The result is not “AI plays the game for you.” It is a mixed-initiative creator loop: the agent can assist with stateful gameplay and composition, while the human keeps control of entry, interpretation, media recording, download, and final creative judgment.

## How WebMCP was implemented

The pre-existing browser slice was meaningfully extended during the challenge with a thin shared controller, `window.DreamRealmChallenge`, over the existing application state and functions. Eight tools are registered with `document.modelContext.registerTool()`:

- `get_dream_realm_state`
- `start_dream_realm_route`
- `submit_dance_signal`
- `resolve_murk_doubt`
- `set_creator_choices`
- `prepare_performance`
- `send_output_to_tower`
- `return_to_hub`

Each tool has a narrow JSON schema and validates both input and current game state. The read tool never mutates. Mutating tools reject invalid transitions with explicit error codes. The adapter uses feature detection, so browsers without WebMCP continue to run the ordinary mouse, touch, and keyboard experience. No tool fakes DOM clicks, and no second game state is maintained.

The final Naya performance is rendered from the selected outfit, background, movement, mission result, and outcome effect. Recording and download remain a visible human action using `MediaRecorder`. Sending the finished output to Trending Tower is blocked until that human-controlled recording exists.

## Pre-existing versus challenge-added

The private-access entrance, HUB, Gateway/Creator routes, Dance gameplay, Murk/Noiz logic, creator selections, performance rendering, MediaRecorder export, Tower response, unlock, and HUB return predate the challenge. The challenge-added work is the shared controller, WebMCP tools, validation, tests, provenance documentation, and minimal distributable challenge repository. `BASELINE.md` records source timestamps, checksums, and dated Git history.

## Built with

HTML, CSS, JavaScript, Canvas, MediaRecorder, Web Audio, and WebMCP Site tools.
