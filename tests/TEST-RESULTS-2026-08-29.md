# Dream Realm WebMCP local test results — 2026-08-29

Target: `http://127.0.0.1:4180/` served locally from this repository. Browser: ChatGPT/Codex in-app browser with WebMCP support. No remote repository, deployment, or upload was created.

## Passed

- Static verification: eight exact tool registrations, feature detection, no fake `.click()` calls in the adapter, script order, 1,318 inventoried media files, and no private project extensions.
- JavaScript syntax: `site/app.js`, `site/webmcp.js`, and `serve.mjs` pass `node --check`.
- `get_dream_realm_state` returned the live access state twice with byte-for-byte equivalent state and no mutation.
- All seven mutating tools rejected calls from the access screen with explicit `INVALID_STATE` errors.
- Invalid Dance signals `0`, `5`, `1.5`, and string `"1"` were rejected with `INVALID_INPUT`.
- Restored Pulse was rejected with `LOCKED_CHOICE` before a Gateway unlock existed.
- Tower submission before human recording was rejected with `VIDEO_NOT_READY`.
- All eight WebMCP tools completed in valid states against the same visible UI.
- Full WebMCP-assisted Gateway route passed: HUB → tutorial → clean pattern → Noiz repair → Murk/evidence → creator choices → prepared performance → human recording → Tower → unlock → HUB.
- Full Direct Creator WebMCP route passed with Street / Glamour / Arc Turn; the visible preview and returned state matched the choices.
- Full ordinary human Gateway route passed using only visible controls, including all signal inputs, Murk, Glamour / Street / Power Finish, WebM recording, Tower, unlock, and HUB return.
- Full ordinary human Direct Creator route passed using visible controls, including earned Restored Pulse, WebM recording, Tower, and HUB return.
- Post-fix MediaRecorder regression run loaded 145/145 frames, produced a 2.5 MB VP9/Opus WebM link with a `.webm` download filename, enabled Tower submission, and logged no warning/error.
- A separate Gateway recording produced a 2.6 MB WebM matching Glamour / Street / Power Finish and strong result metadata.
- Touch-sized portrait and landscape viewport overrides loaded the page, exposed all controls, and accepted portal/route interactions. Controls are native buttons and retain mouse/touch behavior.
- Fresh post-fix browser tabs reported no console warnings or errors through completed recording and through the full human Gateway route.
- Local privacy scan found no secret filenames, API-key/password/private-key patterns, partner names, Construct sources, Unreal sources, archives, executables, checkpoints, or private pitch files.
- `git remote -v` is empty. No deployment, push, public repository, or upload was performed.

## Fixed during testing

An overlapping performance preview/recording animation could let an old animation callback read from a replaced frame array, producing `TypeError: Cannot read properties of undefined (reading 'width')`. Commit `7243ca9` added immutable performance snapshots and playback tokens, stopped superseded audio/animation work, and made preview, recorder, and Tower playback use the same verified 145-frame snapshot. Multiple fresh recording runs now complete without console errors.

## Verified by code path but not timing-forced through the in-app tool review

- `HUB_NOT_READY` during the short entrance animation.
- `INPUT_NOT_READY` while a cue animation is actively playing.

Both guards are present in the shared controller and covered by the documented manual matrix. The in-app browser's tool review latency is longer than the accelerated local animation window, so those two transient states were not forced with a live tool call in this run.

## Intentionally not run / release blockers

- Public repository check: not run because publishing is not authorized.
- Public deployment and remote judge access: not run because deployment is not authorized.
- Public-deployment WebMCP test: not run; local ChatGPT in-app browser test passed.
- YouTube upload and Devpost submission: not run because publication is not authorized.
- Legal media clearance: not passed. `NOTICE.md` inventories all 1,318 media files, but written publication rights/chain of title were not found beside the assets. Rights-holder approval or replacement with cleared media is required before anything public.
