---
name: ikemen-frametable
description: Generate :::frametable (normals, command normals) and :::framechartable (specials and supers, one per move, traced tick by tick through hops, landings, throws, super pauses and projectiles) blocks for this blog from an IKEMEN GO / M.U.G.E.N character folder (a .def with .air/.cns/.st files). Use when the user points at a character folder (e.g. M:\framdata_ikemen\chars\<name>) and wants frame data, a movelist table, or frametables for a post.
---

# Frame data from an IKEMEN character

Turns a character folder into the blocks this site's posts use (see "Frame
tables" and "Frame chart tables" in `README.md`):

- **Normals** -> one `:::frametable`, one row per move: crouching, then
  standing (close/far), then jumping. Command normals and other unique
  attacks get a second table.
- **Specials and supers** -> one `:::framechartable` per move, one row per
  version (L/M/H, EX, MAX).

A script does the mechanical part; you do the parts that need reading the
character's code.

**The character files are the source of truth.** Never fill a cell from memory,
another game's frame data, or a guess. If a value can't be established, write
`?` and list it in your report to the user.

## 1. Orient

Read, in the character folder:

- the `.def` (`[Files]` lists every state file; `movelist =` names the movelist)
- the movelist (`*.dat`) - move names, inputs, and which moves have EX/MAX versions
- the `README.txt` if there is one - authors often note cancel rules and
  version changes there

Pick the state ranges from the `;===<NAME>===` headers above each `[Statedef]`
rather than assuming. Common layout: normals 200-699, specials 1000-2999,
supers 3000-4999, but authors vary.

**Check for modes.** Some characters have movesets switched by palette or a
variable (Cammy POTS: `palno <= 6` is Cammy mode, `>= 7` Doll mode). Grep the
command file's `triggerall` lines for `palno` or `var(`/`map(` gates and note
which commands belong to which mode; label rows or sections accordingly.

**Find each command's first state.** The command file's `changestate` names
where a move starts. If that state has no HitDef (a hop, a dash, a stance)
the script won't list it, and the attack state it leads to counts its startup
from its own start, not from the input. Say so in a footnote - and if the
lead-in ends on landing or a timer, the startup from input is unknown.

The script doesn't parse `.zss` files. Grep them for the state numbers you're
covering and for `gethitvarset`: global rules such as "the sweep is a hard
knockdown on counter hit" often live there.

## 2. Extract

```
node .claude/skills/ikemen-frametable/scripts/extract.mjs <char dir> --states 200-699 --refs
```

Options: `--states a-b,c,d-e`, `--set map=value` (repeatable), `--refs` (cancel
and chain references), `--json` (everything, machine-readable), `--markdown`
(a rough table to start from).

What it reports per state that has a HitDef or Projectile:

- `startup / active / recovery` from the animation: startup counts up to and
  including the first frame with a Clsn1. Several active windows come out
  in order with the frames between them as recovery -
  `startup=13 active=2 recovery=6 active=2 recovery=13` - and the real frame
  numbers are printed alongside as `real active frames`. Never leave the gap
  undrawn.
- **Jumping normals** end on landing. They go in the same table as the other
  normals: Frame Data gives startup and active only, and the Block/Hit Stun
  cells hold the stun dealt in frames, unsigned (`11`, `13`), rather than
  advantage, which depends on how late the jump-in hits. Mark them with a
  Notes footnote that says so.
- each hit: contact frame, damage, guard (high/low/mid), hitstun, blockstun,
  knockdown and its type (soft: victim can air-recover; medium: can't, but can
  get up early; hard: neither). Labels:
  - `ALTERNATE` - fires only if an earlier hit *missed* (`!movecontact`): a
    different hitbox (late/sour spot), not an extra hit; damage not added.
  - `NEVER LANDS` / `REPLACES` - an alternate switched on before the earlier
    HitDef's hitbox appears replaces it first, so the alternate is the real hit.
  - `ONLY WHEN prevstateno = …` - the move used from another state (a sidestep
    attack, a follow-up); not part of the normal version. Mention it in Notes
    if it matters, but don't add its damage.
  - `FOLLOW-UP` - fires only after an earlier hit connected.
- advantage on block/hit: `stun - frames from contact to the end of the
  animation`, from the last non-alternate hit. `KD` when it knocks down.
- `!` warnings: anything it could not establish. Take these seriously.

**Variants.** When a state picks its anim or damage with `ifelse(map(x) = n, ...)`
(L/M/H strength, EX, a mode), run once per value: `--set strength=0`,
`--set strength=1`, `--set strength=2`. Find the map's name and values in the
state's `ChangeAnim`/`HitDef` and where it is set (`mapset` at time 0).

**Check one move by hand** before trusting a run on a new character: read its
`[Begin Action]` in the `.air` and its HitDef, and confirm the numbers. Authors
differ (e.g. this script assumes the state ends when the animation does).

## 3. Trace specials and supers

`extract.mjs` reads one state and its animation, so it stops wherever a move
hands off to physics or another state - most specials and supers. For those,
trace the move: `trace.mjs` runs the character tick by tick from the state
the command enters until she has control again, through hops, landings,
follow-up states, super pauses and the helpers she spawns.

```
node .claude/skills/ikemen-frametable/scripts/trace.mjs <char dir> <state> --pin strength=0 --set palno=1
```

It runs three scenarios and prints each: **whiff** (nothing connects - use
its `frame data` line for the Frame Data cell), **block** (each HitDef is
guarded on its first active frame - the last hit's `on block` is the Block
Stun cell) and **hit** (damage per hit; add them up; `KD`/`HKD` from the last
hit). Contact is point-blank unless `--distance` says otherwise. The `frame
data` line is already in the site's phase syntax (`startup … flash … active …
air … land …`, `; inv=a-b`, `; counter=a-b`); startup counts the first active
frame, as everywhere else, and the frames between two active windows are
`recovery` (`air` while she's airborne).

Picking the version:

- **Strength / EX / MAX.** Find the map the state picks its version from
  (`map(strength)`, set by a `mapset` at time 0 from the command) and
  `--pin` it: `--pin strength=0|1|2`. EX and MAX are usually their own
  states - trace those directly. `--set palno=N` selects a palette mode.
- **Air specials.** Read the command's height rule (`pos y <= -80`) and trace
  from there with `--height 80`; say which height in a footnote (the lowest
  allowed is the usual convention, the apex of a neutral jump the other).
- **Follow-ups chosen by a button** (`command = "a"` in a ChangeState):
  `--command a` holds it from the start, the earliest version. In Git Bash set
  `MSYS_NO_PATHCONV=1` first, or `/x`-style hold commands become file paths.
- **Mash moves**: no `--command` for the floor, the mash command held every
  frame for the ceiling; give the range.
- **Counters**: the stance's trace gives the catch window (`counter=`); trace
  the state its ReversalDef/HitOverride goes to (`p1stateno`) for the attack.
- **Throws**: the hit run follows `p1stateno` into the throw states and
  totals their `TargetLifeAdd`. Grabs gated on the opponent take `--p2 A`
  (airborne) / `--p2 C`, and `--distance` when a hop carries her past.
- **Projectiles**: startup is the helper's first active frame reaching the
  opponent - point-blank by default, `--distance` for a set range. Draw P1's
  bar as `startup=` up to that frame and `recovery=` after.
- **Moves keyed to the screen** (`screenpos y`): `--screen-ground 220` puts
  the floor at that screen height, camera still. Footnote the assumption.

Read every `?` line - a controller whose trigger couldn't be evaluated and
was treated as false - and the `maps read but never set` list. Either can
change the path. If the trace takes a path that looks wrong, `--ticks` prints
state, time, position and hitbox per frame.

What the trace still doesn't model, so say so where it matters:

- **Hitpause** isn't simulated; frame counts exclude it, as frame data does.
  State timers freeze in hitpause too, so hit counts still come out right.
- **The opponent** is a stand-in: standing (or `--p2`), idle, in hitstun after
  a hit, with this character's constants (a mirror match). Rules that read
  more of them (`p2, stateno`, `target, …`) show as `?`.
- **Order of operations** within a tick (controllers, then movement and
  gravity, then the landing check, then the animation) matches the normals the
  static extractor already agrees with, but hasn't been checked against the
  engine for landings and super pauses: treat those boundaries as ±1.
- **Explods** aren't simulated (`numexplod` is 0); **states -3/-2** run every
  tick (pass `--no-negstates` to compare) but their opponent checks are skipped.
- **Knockdown advantage.** `KD` unless the user wants a number; it depends on
  wake-up timing in the common states.
- **Stage-dependent rushes** (bounces off the screen edges) - give the opening
  and put `?` for the rest.

## 4. Cancels (Chain / Special / Super columns)

Run with `--refs`. For each move it lists the triggers elsewhere that name
that state - in the command file (`[Statedef -1]`) and system states
(`-2`/`-3`). Read them; this is judgement, not pattern-matching:

- **Chain** - a `changestate` into a normal whose trigger allows coming from
  this state (e.g. `stateno = 400 && time >= 5`). Chains into what? Usually
  the light normals; say so in the legend if it's specific.
- **Special / Super** - a `mapset` of the character's cancel flag (names vary:
  `specialcancel`, `supercancel`, `var(…)`) naming this state. Note its
  condition: `movecontact` = on hit or block only; `animelemtime(5) < 0` =
  only before element 5 (an early window).
- **Range rules** (`stateno = [200, 699]`) are listed separately. Check what
  gates them: if it's a system mode (custom combo, a meter state), it doesn't
  belong in a normal table cell.
- A cancel with a condition worth knowing gets `○` plus a footnote marker
  (`○*1`) and a footnote in the legend row.

Use `○` for yes and `×` for no (`×` renders red automatically).

## 5. Write the table

Match the layout already used in the post being edited. If there is none, use:

```
:::frametable{caption="Normals"}
| Move | Damage | Chain<br>Cancel | Special<br>Cancel | Super<br>Cancel | Block<br>Stun | Hit<br>Stun | Notes | Frame Data |
|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|
| :icon{name="_CROUCH"} :icon{name="^LP"} | 20 | ○ | ○ | ○ | +4 | +6 | - | startup=3 active=3 recovery=4 |

- KD = Knockdown
:::
```

- **Move icons** (`public/icons/`): position `_CLOSE`, `_FAR`, `_CROUCH`,
  `_AIR`; button `^LP ^MP ^HP ^LK ^MK ^HK` (or `^P`/`^K` for any strength).
  A plain standing normal with no close/far version gets no position icon.
  For specials, the movelist's input string already uses the same names:
  `_D_DF_F^K` -> `:icon{name="_D"}:icon{name="_DF"}:icon{name="_F"}:icon{name="^K"}`.
- **Advantage** keeps its sign (`+4`, `-7`, `+0`) so it colours.
- **Notes** holds short codes (`KD`, `HKD`, `LX`, `OH`, `alt`); every code
  used gets a `CODE = meaning` line in the legend row under the table, and
  every footnote marker gets its footnote.
- **Specials and supers** go in a `:::framechartable` per move instead: the
  caption is the move name and its input glyphs, the first column is
  `Version` with the strength icon (`^LK`, `^MK`, `^HK`, `_EX`, `_MAX`), and
  Cancel columns usually drop out. Use `land=` for landing recovery, `air=`
  for airborne frames, and `; mark=Lands@active` style marks where the move
  changes state. Example:

  ```
  :::framechartable[Cannon Drill :icon{name="_D"}:icon{name="_DF"}:icon{name="_F"}:icon{name="^K"}]
  | Version | Damage | Block<br>Stun | Hit<br>Stun | Notes | Frame Data |
  |:-:|:-:|:-:|:-:|:-:|---|
  | :icon{name="^LK"} | 70 | -19 | KD | - | startup=8 active=16 land=20 |
  :::
  ```
- **Frame Data** takes the script's `startup=… active=… recovery=…`; append
  `; inv=a-b` for invulnerability if the state has a `NotHitBy`/`HitBy` with a
  clear frame range.

## 6. Report

After writing, tell the user briefly:

- which states you covered, and any you skipped and why
- every `?` and every number you couldn't verify, with the reason
- where your numbers differ from what's already in the post, and why the
  files say otherwise
- the assumptions behind traced numbers (height, distance, held buttons, the
  stage floor) and anything the trace couldn't follow
