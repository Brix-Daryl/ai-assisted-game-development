# Agent Skill Test — Run 2 (Refined Instruction)

## Refinement Applied
Updated the skill with strict constraints:
1. Mandated numeric millisecond ranges for `telegraphDurationMs` (preventing unfair instant hits).
2. Enforced a machine-readable JSON schema with explicit typing.
3. Added styling metadata (`gloveColor`, `shortsColor`) for dynamic canvas rendering.

## Input Prompt Given to Refined Skill
> "Generate a 'slugger' archetype on 'medium' difficulty using the boxer-archetype-generator schema."

## Output Received
```json
{
  "fighterId": "iron_slugger_01",
  "name": "Iron Slugger",
  "archetype": "slugger",
  "difficulty": "medium",
  "stats": {
    "health": 120,
    "punchPower": 15,
    "telegraphDurationMs": 650,
    "attackCooldownMs": 1600,
    "blockProbability": 0.2,
    "roundDurationSec": 30
  },
  "visuals": {
    "gloveColor": "#dc2626",
    "shortsColor": "#0f172a"
  }
}
