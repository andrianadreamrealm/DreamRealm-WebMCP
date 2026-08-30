# Dream Realm WebMCP smoke-test matrix

Primary target: <https://spectacular-madeleine-6256db.netlify.app/>

Local fallback: `http://127.0.0.1:4180/`

Run every route from a fresh page/session where noted. Record browser, viewport, console output, and pass/fail evidence. WebMCP calls must visibly change the same page used for mouse/touch testing.

## Static and loading checks

- [ ] `node tests/verify-static.mjs` passes.
- [ ] The page loads without JavaScript errors in an ordinary browser with no `document.modelContext`.
- [ ] Exactly eight tools register when `document.modelContext.registerTool()` is available.
- [ ] `get_dream_realm_state` is annotated read-only.
- [ ] No WebMCP action calls `.click()` or maintains a second game-state object.

## Normal human flow—Gateway

- [ ] Activate portal using the visible button.
- [ ] Entrance animation completes and HUB route controls appear.
- [ ] Enter Gateway with mouse/touch.
- [ ] Complete tutorial cue `1`.
- [ ] Complete clean pattern `1, 3, 2`.
- [ ] Complete repaired Noiz pattern `1, 3, 2, 4`.
- [ ] Trust the evidence at Murk.
- [ ] Set Glamour outfit, Street background, and Power Finish.
- [ ] Prepare Performance; the visible canvas uses those choices.
- [ ] Generate the video using the visible human control.
- [ ] Download link appears and produces a non-empty WebM file.
- [ ] Send to Tower and verify the Restored Pulse unlock.
- [ ] Return to HUB and verify Tower remains active.

## Normal human flow—Direct Creator

- [ ] Reload, activate the portal, and enter Create Now with mouse/touch.
- [ ] Select a different valid outfit/background/movement combination.
- [ ] Prepare Performance and verify the visible canvas changes.
- [ ] Generate a non-empty video using the visible human control.
- [ ] Send to Tower and return to HUB.

## Tool-by-tool valid-state tests

- [ ] `get_dream_realm_state {}` returns the live screen and does not alter it.
- [ ] `start_dream_realm_route {"route":"gateway"}` opens the mission from ready HUB.
- [ ] `submit_dance_signal {"signal":1}` advances an accepting mission input.
- [ ] `resolve_murk_doubt {"choice":"evidence"}` opens Creator Tools.
- [ ] `set_creator_choices {"outfit":"glamour","background":"street","movement":"power_finish","effect":"creator"}` visibly updates the preview.
- [ ] `prepare_performance {}` opens and loads the matching Performance Preview without recording a file.
- [ ] After human recording, `send_output_to_tower {}` opens Tower and applies the correct response.
- [ ] `return_to_hub {}` opens the updated HUB.

## Invalid-state and invalid-input rejection

- [ ] Starting a route on the access screen is rejected with `INVALID_STATE`.
- [ ] Starting a route during the HUB entrance is rejected with `HUB_NOT_READY`.
- [ ] `submit_dance_signal` outside the mission is rejected with `INVALID_STATE`.
- [ ] Signal `0`, `5`, and non-integers are rejected with `INVALID_INPUT`.
- [ ] A signal submitted while cues are playing is rejected with `INPUT_NOT_READY`.
- [ ] Murk resolution outside the Murk screen is rejected with `INVALID_STATE`.
- [ ] Unsupported choice values are rejected before any creator selection changes.
- [ ] Restored Pulse is rejected with `LOCKED_CHOICE` before it has been unlocked.
- [ ] Performance preparation outside Creator is rejected with `INVALID_STATE`.
- [ ] Tower submission before human video recording is rejected with `VIDEO_NOT_READY`.
- [ ] HUB return outside Tower is rejected with `INVALID_STATE`.

## Security and publication scan

- [ ] No API keys, tokens, passwords, cookies, private URLs, or credentials are present.
- [ ] No `.c3p`, `.uproject`, `.uasset`, `.umap`, archive, or checkpoint is present.
- [ ] No partner names, partner logos, private pitch material, or unrelated media is present.
- [ ] Every included media category appears in `NOTICE.md` and is covered by the recorded owner clearance while remaining outside the MIT grant.
- [ ] The public repository contains only the audited challenge folder and the live app is a separate Netlify project.
- [ ] The live URL returns without credentials in a logged-out/private browser session.
