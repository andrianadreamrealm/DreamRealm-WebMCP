# OpenAI WebMCP Challenge compliance audit — 2026-08-29

This audit uses the current OpenAI challenge page and Devpost Official Rules as the controlling sources:

- <https://openai.com/webmcp-challenge/>
- <https://webmcp.devpost.com/>
- <https://webmcp.devpost.com/rules>
- <https://learn.chatgpt.com/docs/webmcp>

Current official deadline: **September 3, 2026 at 1:00 pm Pacific Time**. The rules require an existing project to be meaningfully extended with WebMCP during the submission period and clearly document prior versus challenge work. They also require a judge-accessible live URL, an English description, a public open-source repository containing the necessary source/assets/instructions, and a public YouTube demo under three minutes with audio.

## Requirement matrix

| # | Requirement | Status | Evidence / remaining gate |
| ---: | --- | --- | --- |
| 1 | Working WebMCP-enabled web app | **PASS locally** | `site/` runs at `http://127.0.0.1:4180/`; full routes and recording pass. Public availability is covered separately by #9. |
| 2 | `document.modelContext.registerTool()` tools use the same live state/UI | **PASS** | Eight tools register in `site/webmcp.js`; UI handlers and tools use `window.DreamRealmChallenge`; no duplicate game state and no tool-driven DOM clicks. In-app calls visibly changed the open page. |
| 3 | Normal mouse/touch gameplay remains usable without WebMCP | **PASS locally** | Full human Gateway and Direct Creator routes pass with visible controls. Feature detection exits safely when WebMCP is unavailable. Portrait/landscape touch-sized checks expose and accept controls. |
| 4 | Public challenge repository contains all required source/assets/instructions | **READY locally; NOT PUBLIC** | The candidate repository contains the minimal functional `site/`, server/config, README, provenance, tests, license, notice, and submission docs. No remote exists. Publication needs #7 clearance and explicit approval. |
| 5 | Visible open-source license | **PASS locally** | Standard MIT `LICENSE` is at repository root for code/docs. On GitHub, confirm license detection and set the repository About license field if necessary. Media remains outside the MIT grant under `NOTICE.md`. |
| 6 | Clear pre-existing/challenge-added separation | **PASS** | `BASELINE.md` records source paths, pre-August-25 timestamps, build version, SHA-256 hashes, selected-media manifest hash, and exact scope. Dated Git commits separate baseline/controller/tools/fix/docs. |
| 7 | No secrets/private source/partner material/unauthorized assets | **PASS** | Technical scan passes: no credentials, private URLs, Construct/Unreal source, archives, checkpoints, executables, partner names, or pitch material. The owner confirmed public-use and redistribution rights for the 1,318 inventoried media files on 2026-08-29. Dream Realm media remains proprietary and outside the MIT license. |
| 8 | README install/test instructions | **PASS** | `README.md` includes provenance, local run, route/tool behavior, static tests, deployment boundary, and licensing boundary. Smoke matrix and dated results are linked. |
| 9 | Working public deployment accessible to judges | **NOT DONE BY INSTRUCTION** | `netlify.toml` is ready, but no production site is connected or deployed. After clearance/approval, deploy, verify HTTPS/assets/headers, and keep it free and accessible through the judging period. |
| 10 | Successful ChatGPT in-app browser or WebMCP Chrome test | **PASS locally; PUBLIC RETEST REQUIRED** | ChatGPT/Codex in-app browser discovered all eight tools and completed valid/invalid state tests against localhost. Repeat the complete test on the final public URL before submission. |
| 11 | English Devpost description covers four required questions | **PASS as draft** | `submission/DEVPOST_DESCRIPTION.md` covers fit, user experience, new human-agent collaboration, and implementation using the approved positioning. Final form submission remains manual/public. |
| 12 | Under-three-minute YouTube demo plan with audio | **PASS as plan; VIDEO NOT RECORDED** | `submission/DEMO_PLAN.md` is a 2:48 shot/narration/audio plan. Recording, rights review, public YouTube upload, and final URL remain. |

## Release decision

**RELEASE AUTHORIZED, ACCOUNT ACCESS PENDING.** The software, local tests, and media clearance are ready. The remaining gates are GitHub/Netlify authentication, public deployment verification, YouTube upload authorization, and the entrant's final Devpost legal confirmation/Submit.

## Shortest compliant path after approval

1. Create a public GitHub repository from this exact local history; verify all assets are present, MIT is detected, no large-file limit is exceeded, and no private files enter the commit.
2. Deploy `site/` using `netlify.toml`; do not alter the existing Dream Realm marketing site or production Netlify project.
3. Run the full local matrix against the public HTTPS URL in ChatGPT's in-app browser; repeat MediaRecorder/download and check console/network errors.
4. Record and rights-review the 2:48 English demo, upload it publicly to YouTube after upload authorization, and verify audio/captions.
5. Fill the Devpost form in English with the live URL, public repository, public YouTube URL, testing instructions, and the final description; stop before the entrant's legal confirmation and final Submit.
