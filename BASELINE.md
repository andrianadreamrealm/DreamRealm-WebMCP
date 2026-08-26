# Dream Realm WebMCP Challenge baseline

Baseline recorded: 2026-08-26 (Europe/Belgrade)

## Provenance and date boundary

The browser application copied into this repository is a pre-existing Dream Realm prototype. Its source files were last modified on 2026-07-23, before the OpenAI WebMCP Challenge start boundary of 2026-08-25.

Source directory (not part of this repository):

`C:\Users\Andriana\Documents\Codex\2026-07-22\o\prototypes\dream-realm-integrated-slice`

Challenge working copy:

`C:\Users\Andriana\Documents\Codex\2026-07-22\o\challenge\DreamRealm-WebMCP`

The source directory is not modified by challenge work. Construct, Unreal, and Dream Realm marketing-site sources are also outside this repository.

## Pre-existing source files

| Source file | Last modified | Bytes | SHA-256 |
| --- | --- | ---: | --- |
| `index.html` | 2026-07-23 15:53:52 | 8,946 | `EF01BE60BEABC21ED38BD5F13481E897FB567DF3A13BEFA44668ABDC75548228` |
| `app.js` | 2026-07-23 15:53:54 | 29,980 | `B14A29F341449238D8BBA5BD4458EDA3AF41DCBE9A60A88401E71F7288A2C9E4` |
| `styles.css` | 2026-07-23 15:52:17 | 16,688 | `36B274E2F7106D695E100C6A88A49A23BE6943150932E2663ACE630440114687` |
| `serve.mjs` | 2026-07-23 15:42:56 | 1,057 | `556660C657BEB985BE1FEB46D891FDF4F6929C6756D39DCCCCC589C1B27B69D9` |

The application identifies itself as build `creator-slice-0.2.0`.

## Selected pre-existing media baseline

Only media referenced by the browser application was copied:

- one Option C HUB plate;
- eight Naya HUB walking frames;
- one Naya HUB idle frame;
- three creator background images;
- nine Naya performance sequences (3 outfits × 3 movements), each containing 145 frames.

Selected media total: 1,318 files, 138,293,862 bytes.

Combined SHA-256 of a sorted UTF-8 manifest containing each selected media file's SHA-256 and repository-relative path:

`9D7086959992F00F9A25F3610D9CE47D682D8F8656F87F88C407DD9A837310EF`

The following source material was intentionally excluded because it is not required by the application:

- `checkpoints/**`;
- `assets/performance/test/sample.png`;
- nine unused HUB idle frames.

## PRE-EXISTING functionality

The baseline already provides:

- private-access portal and animated HUB entrance;
- Gateway Mission and Direct Creator entry routes;
- Dance Signal Sync tutorial, clean pattern, and Noiz-corrupted pattern;
- score, strong/remix/noiz result categories, and Murk doubt choice;
- three outfits, three backgrounds, and three movements;
- prepared Naya canvas performance matching the selected combination;
- human-controlled MediaRecorder video generation and download;
- Trending Tower response, one local unlock, and return to HUB;
- mouse, touch, and keyboard controls;
- local in-memory event tracking and JSON export.

## CHALLENGE-ADDED functionality

No WebMCP functionality exists in this baseline commit. Later challenge commits will add:

- a shared `DreamRealmChallenge` controller over the existing live state;
- WebMCP tool registration through `document.modelContext.registerTool()`;
- tool schemas, state-transition validation, and structured results;
- WebMCP-specific tests and documentation.

Challenge work must preserve the normal human interface and must not replace or duplicate the pre-existing game logic.

## Media ownership boundary

All Dream Realm visual media is treated as proprietary media, separate from the software license. The local filenames and project context suggest that it is Dream Realm/user-provided artwork, but publication rights have not been independently verified. No media may be published until the owner confirms that each included category is cleared for public challenge use.
