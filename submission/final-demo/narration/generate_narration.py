import asyncio
from pathlib import Path

import edge_tts


VOICE = "en-US-JennyNeural"
RATE = "-2%"
OUTPUT = Path(__file__).resolve().parent
SEGMENTS = [
    "Dream Realm is an AI-native playable creator world where people enter missions, make creative choices, and publish results back into the world.",
    "Dream Realm, Naya, the Hub, and this playable creator foundation existed before the challenge. The challenge work is the Web M C P extension layered onto that existing experience.",
    "The deployed page registers eight structured Web M C P tools. The agent reads the same live state as the player, validates every transition, and never fakes interface clicks.",
    "Here the agent starts the Dance Gateway mission and restores Signal Sync. Noise corrupts the pattern; structured signal actions repair it while the visible score and mission react immediately.",
    "Murk introduces doubt. The agent chooses the evidence earned in gameplay, advancing the same shared state into Creator Tools.",
    "Now the agent sets Naya's outfit, background, movement, and outcome effect. These choices prepare the exact one hundred forty-five frame performance visible on screen.",
    "Naya performs the selected Glamour look, Street scene, and Power Finish. The human keeps the meaningful consent boundary: video recording and download remain an explicit human action.",
    "Only after the real Web M export is ready can the agent send the output to Trending Tower. Invalid or premature actions are rejected by the live controller.",
    "The Tower ranks the restored Dance signal, grants the unlock, and the agent returns to the Hub. The activated Tower persists: one world, one live state, shared by human and agent.",
]


async def main() -> None:
    for index, text in enumerate(SEGMENTS, start=1):
        output = OUTPUT / f"segment-{index:02d}.mp3"
        await edge_tts.Communicate(text=text, voice=VOICE, rate=RATE).save(str(output))
        print(output.name)


if __name__ == "__main__":
    asyncio.run(main())
