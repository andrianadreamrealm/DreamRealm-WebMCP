# Dream Realm WebMCP Challenge

A local, browser-first Dream Realm vertical slice extended with WebMCP Site tools. The extension lets a person and an agent operate the same live game state while preserving the existing mouse, touch, and keyboard experience.

**Dream Realm is an AI-native playable creator world where humans and AI agents can participate together in gameplay and creation.**

This repository is local-only at this stage. It has not been deployed, pushed, or made public.

## Provenance

The Dream Realm browser slice and all gameplay/creator functionality predate the challenge. See [BASELINE.md](BASELINE.md) for timestamps, checksums, and the exact pre-existing/challenge-added boundary.

Challenge-added code consists of:

- `window.DreamRealmChallenge`, a validated controller over the existing application functions and state;
- `site/webmcp.js`, which registers eight tools with `document.modelContext.registerTool()`;
- local hosting, licensing, inventory, and test documentation.

No second game state is created and no tool simulates DOM clicks. Existing UI handlers and WebMCP tools call the same application functions.

## Local run

Use Node.js 18 or newer:

```powershell
node serve.mjs
```

Then open `http://127.0.0.1:4180/`.

The local server publishes only `site/`. It does not access or serve the original Construct, Unreal, integrated-slice, or marketing-site directories.

## Site tools

| Tool | Type | Valid state |
| --- | --- | --- |
| `get_dream_realm_state` | Read | Any screen |
| `start_dream_realm_route` | Write | Ready HUB |
| `submit_dance_signal` | Write | Dance mission while accepting input |
| `resolve_murk_doubt` | Write | Murk screen |
| `set_creator_choices` | Write | Creator screen |
| `prepare_performance` | Write | Creator screen |
| `send_output_to_tower` | Write | Performance screen after human video generation |
| `return_to_hub` | Write | Tower screen |

In a browser without WebMCP support, `site/webmcp.js` exits safely and normal gameplay remains available.

Video recording and download are intentionally human-controlled. The agent can prepare the correct live performance but cannot silently generate or download a file.

## Existing experience

Gateway route:

`Portal → HUB → Signal Sync → Noiz repair → Murk → Creator → Performance → human video export → Tower → HUB`

Direct route:

`Portal → HUB → Create Now → Creator → Performance → human video export → Tower → HUB`

## Testing

The test matrix is in [tests/webmcp-smoke-test.md](tests/webmcp-smoke-test.md). Static verification can be run with:

```powershell
node tests/verify-static.mjs
```

The latest completed local run is recorded in [tests/TEST-RESULTS-2026-08-29.md](tests/TEST-RESULTS-2026-08-29.md). Draft submission copy and the timed demo plan are in [submission/DEVPOST_DESCRIPTION.md](submission/DEVPOST_DESCRIPTION.md) and [submission/DEMO_PLAN.md](submission/DEMO_PLAN.md).

## Deployment boundary

`netlify.toml` is configuration only. No Netlify production site or remote repository is connected by this project.

The rights holder cleared every inventoried media category for this challenge release on 2026-08-29. See [NOTICE.md](NOTICE.md). Dream Realm characters, brand, visual identity, and media remain proprietary and are excluded from the MIT software license.

The official submission also requires a public repository, a publicly reachable live URL, and a public YouTube demo. None has been created yet; those are intentional release gates requiring explicit approval.

## Licensing

Challenge software code and documentation are available under the MIT terms in [LICENSE](LICENSE). Dream Realm media and brand assets are excluded from that license; see [NOTICE.md](NOTICE.md).
