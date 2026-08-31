# Dream Realm WebMCP Challenge

A browser-first Dream Realm vertical slice extended with WebMCP Site tools. The extension lets a person and an agent operate the same live game state while preserving the existing mouse, touch, and keyboard experience.

**Dream Realm is an AI-native playable creator world where humans and AI agents can participate together in gameplay and creation.**

Public challenge repository: <https://github.com/andrianadreamrealm/DreamRealm-WebMCP>

Live challenge build: <https://spectacular-madeleine-6256db.netlify.app/>

## Provenance

The Dream Realm browser slice and all gameplay/creator functionality predate the challenge. See [BASELINE.md](BASELINE.md) for timestamps, checksums, and the exact pre-existing/challenge-added boundary.

### PRE-EXISTING Dream Realm work

- Dream Realm IP, visual identity, characters, Naya, the Option C HUB, and the playable creator-world concept;
- the private-access entrance, Gateway and Direct Creator paths, Dance gameplay, Murk/Noiz story mechanics, creator selections, Naya performance renderer, human MediaRecorder export, Trending Tower response, unlock, and HUB return;
- the original browser-playable foundation and its mouse, touch, and keyboard interface.

### BUILT / MEANINGFULLY EXTENDED DURING THE WEBMCP CHALLENGE

- `window.DreamRealmChallenge`, a validated controller over the existing application functions and state;
- `site/webmcp.js`, which registers eight tools with `document.modelContext.registerTool()`;
- structured agent actions, state schemas, invalid-transition rejection, and the shared human-agent Gateway/Creator/Tower/HUB flow;
- integration of the pre-existing Naya performance and Tower result into that agent flow while preserving human control of video recording/download;
- the dedicated minimal public repository and deployment, browser testing, debugging, challenge-specific stability fixes, licensing, inventory, and evidence documentation.

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

The latest completed local run is recorded in [tests/TEST-RESULTS-2026-08-29.md](tests/TEST-RESULTS-2026-08-29.md). Public release verification is recorded in [tests/PUBLIC-RELEASE-RESULTS-2026-08-30.md](tests/PUBLIC-RELEASE-RESULTS-2026-08-30.md). The final submitted Devpost story and timed demo plan are in [submission/DEVPOST_DESCRIPTION.md](submission/DEVPOST_DESCRIPTION.md) and [submission/DEMO_PLAN.md](submission/DEMO_PLAN.md).

### Fast judge path

1. Open the live build in ChatGPT's in-app browser, or Chrome 149+ with `chrome://flags/#enable-webmcp-testing` enabled.
2. Activate the portal with the visible human control and wait for the HUB paths.
3. Ask the agent to read Dream Realm state, then start the `gateway` route.
4. Restore signals `1`, then `1, 3, 2`, then repair Noiz with `1, 3, 2, 4`.
5. Resolve Murk with `evidence`, set `glamour` / `street` / `power_finish` / `creator`, and prepare the performance.
6. Use the visible **Generate video export** control. This human boundary is intentional.
7. Ask the agent to send the ready output to Trending Tower and return to the HUB. The Tower remains active and the Gateway unlock persists.

The exact call sequence and expected rejections are documented in [submission/DEMO_CAPTURE_RUNBOOK.md](submission/DEMO_CAPTURE_RUNBOOK.md).

## Deployment boundary

The challenge is published as a separate Netlify Drop project at <https://spectacular-madeleine-6256db.netlify.app/>. It is not connected to, and did not modify or redeploy, `dreamrealmvision.com`.

The rights holder cleared every inventoried media category for this challenge release on 2026-08-29. See [NOTICE.md](NOTICE.md). Dream Realm characters, brand, visual identity, and media remain proprietary and are excluded from the MIT software license.

The public repository, live challenge URL, final 2:11 narrated demo, and Devpost submission are complete. View the submitted project at <https://devpost.com/software/dream-realm-webmcp> and watch the public challenge demo at <https://youtu.be/E7YxE4GZq-4>; its render and privacy verification are documented in [submission/final-demo/FINAL_VIDEO_REPORT.md](submission/final-demo/FINAL_VIDEO_REPORT.md).

## Licensing

Challenge software code and documentation are available under the MIT terms in [LICENSE](LICENSE). Dream Realm media and brand assets are excluded from that license; see [NOTICE.md](NOTICE.md).
