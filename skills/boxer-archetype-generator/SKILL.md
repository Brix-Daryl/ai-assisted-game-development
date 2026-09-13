
---
name: boxer-archetype-generator
description: Generates balanced opponent boxer archetypes, fighting stats, and behavioral timing configurations for 2D web arcade boxing games. Use when designing new game levels, boss encounters, or difficulty curves.
---

# Boxer Archetype Generator

## Purpose
Produce numerically balanced fighter definitions for browser-based boxing games. Generates combat attributes, telegraph timings, and behavioral logic consumable by client-side JavaScript game loops.

## Workflow
1. Accept an archetype style: `brawler`, `outfighter`, `counter-puncher`, or `slugger`.
2. Accept a target difficulty level: `easy`, `medium`, or `hard`.
3. Compute balanced attributes ensuring reaction windows stay within human mobile-touch limits (300ms–800ms).
4. Output a strict JSON configuration block without markdown decoration inside the payload.

## Parameter Constraints
- `health`: Total damage the boxer can sustain (Range: 60 - 200).
- `punchPower`: Damage inflicted on unblocked hit (Range: 5 - 25).
- `telegraphDurationMs`: Visual warning time before punch connects (Range: 350 - 900 ms).
- `attackCooldownMs`: Interval between punch attempts (Range: 800 - 2200 ms).
- `blockProbability`: Likelihood to block incoming player jabs [0.0 - 0.7].
- `roundDurationSec`: Round countdown timer (Default: 30).

## Required Output Schema
Every generation must include:
1. **Fighter Profile**: Name, stance, and brief combat behavior summary.
2. **Game Loop JSON**: Valid, copy-pasteable JSON object matching this structure:

```json
{
  "fighterId": "string",
  "name": "string",
  "archetype": "brawler | outfighter | counter-puncher | slugger",
  "difficulty": "easy | medium | hard",
  "stats": {
    "health": 100,
    "punchPower": 10,
    "telegraphDurationMs": 600,
    "attackCooldownMs": 1400,
    "blockProbability": 0.25,
    "roundDurationSec": 30
  },
  "visuals": {
    "gloveColor": "#ef4444",
    "shortsColor": "#1e293b"
  }
}
