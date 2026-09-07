---
title: 'Release: Ikemen GO Trials Mode v1.0'
published: 2026-09-06
description: 'Trials Mode Reaches 1.0 - tons of new features and ready for Ikemen GO 1.0'
image: 'trials_logo_web.webp'
tags: [Trials Mode, Ikemen GO, Module]
category: 'Release'
draft: false 
lang: ''
---
::github{repo="two4teezee/Ikemen-GO-Trials-Mode"}

If 0.99.5 was one of the most important updates since the initial release, 1.0 is THE most important update since initial release.
Version 1.0 brings compatibility with Ikemen GO 1.0, as well as several new features to make Trials Mode truly feature complete.
Please note that this release has only been tested with Ikemen GO 1.0 RC3 and newer - I suggest using the latest stable release candidate.
New feature highlights include the following:
- Trials Progress: your progress and times are now tracked for each character.
- Trials Difficulty: use `trial.difficulty` to optionally categorize your character's trials by difficulty, which can make them easier to navigate in...
- Trials Select: configurable menu so that the player can browse and select the trials either from the select screen, from the fight screen, or simply from the pause menu, all presented and filtered by difficulty if specified.
- Speedrun Mode: where the player can race the timer to complete all trials for a single character - these times are also tracked.
- Revamped Projectile Handling: changes in Ikemen GO 1.0 necessitated this change and `trialstep.X.projID` was introduced to better handle projectiles.
- Fully Modular: fully-baked support for module-specific `trials.sff` and `trials.snd`.
- Layering and Anchoring: all UI elements in the module's `system.def` now support `layerno` (layers only Trials Mode UI elements) and `anchor` (for players that have aspect ratios that change from stage-to-stage).
- Ready for 1.0: module brought to parity with Ikemen GO 1.0 conventions.

To go along with this release, the [Wiki](https://github.com/two4teezee/Ikemen-GO-Trials-Mode/wiki) has been completely updated and the [Sample Trials Definition Files](https://github.com/two4teezee/Ikemen-GO-Sample-Trials-Definition-Files) have been updated as well.
As always, I recommend you consult the Wiki to get the best info, but the post below summarizes wiki entries for the biggest new changes.

::github{repo="two4teezee/Ikemen-GO-Sample-Trials-Definition-Files"}

## Trials Progress

Progress is saved per character to `save/trials.json`, next to the engine's own save data. For each trial it records whether it has been cleared and the best time; for each character it also records the best full-run time from Speedrun. It is written the moment a trial is cleared.

```json
{
  "version": 1,
  "chars": {
    "chars/kfm_zss/kfm_zss.def": {
      "trials": {
        "KFM's First Trial": { "cleared": true, "besttime": 214 }
      },
      "speedrun": { "cleared": true, "besttime": 4820 }
    }
  }
}
```

- Characters are keyed by their **def path**, so renaming a character's display name keeps its progress.
- Trials are keyed by the name in `[TrialDef, <name>]`, so trials can be reordered, added or removed without losing anything. Renaming a trial starts a fresh record and leaves the old one orphaned, which is harmless.
- Times are in **ticks** (60 to the second).
- Deleting `save/trials.json` resets all progress. **Clear This Character's Progress** and **Clear All Progress** in the pause menu do the same from in-game, each behind a confirmation step.

## trial.difficulty
> Sorts the trial into a difficulty tier.
>> trial.difficulty = *difficulty* (string) <br>
>
> Valid options for *difficulty* are `Beginner`, `Intermediate`, `Advanced`, and `Expert` (case-insensitive).
> When at least one trial in the file declares a difficulty, the [Trial Select](system.def-Options.md#trial-select-menu-trialsmenu-options) screen presents the trials behind a difficulty filter that the player cycles with left and right, and each filter keeps its own "cleared" tally.
> Trials that do not declare a difficulty are collected under the **Other** filter.
> If **no** trial in the file declares a difficulty, there is nothing to filter by: the list stays flat and in def order, exactly as it did before this feature existed.
> An unrecognised value is ignored (the trial is treated as uncategorised) and a warning is printed to the console.
> Defaults to uncategorised ("Other") if unspecified.

Example:

```ini
[TrialDef, KFM's First Trial]
trial.difficulty = Beginner
trialstep.1.text = Strong Kung Fu Palm
trialstep.1.glyphs = _QDF^Y
trialstep.1.stateno = 1010
```

### trialslistdisplay
> Decides when, if ever, the player is asked which trial to start from.
>> trialslistdisplay = *mode* (string)<br>
>
> Valid values are `select`, `start`, and `off` (default: `start`).
> - `select` shows the [Trial Select](#trial-select-menu-trialsmenu-options) menu between stage select and the fight loading.
> - `start` shows it once the match is up, over the frozen pair.
> - `off` never asks and starts on the first trial.
>
> The pause menu's **Trials List** works the same regardless of this setting.

> [!NOTE]
> `select` falls back to the `start` menu for any character whose trials use [`trial.showforvarvalpairs`](Creating-A-Trials-Definition-File.md#trialshowforvarvalpairs). Those trials are chosen by the player's groove or mode, and the variables holding it do not exist until the match is up, so asking before the fight would list every groove's trials.

Example:
```ini
trialslistdisplay = select
```

## Trial Select Menu (`trialsmenu` options)
The Trial Select menu is the character's list of trials, drawn by the module. It is shown when the match loads (per [`trialslistdisplay`](#trialslistdisplay)) and again whenever the player picks **Trials List** from the pause menu. Because the module draws it, everything about it is configured here rather than in the screenpack's `[Trials Pause Menu]` section.

Rows are laid out from `trialsmenu.pos`, `trialsmenu.spacing` apart, `trialsmenu.visibleitems` at a time. A row is one of three kinds, each with its own text and background:
- **header** - the difficulty filter, shown only when the character has more than one to cycle
- **item** - a trial. Uses `.active` when the cursor is on it, `.selected` for the trial in play
- the section's own tail items (**Back** among them) are drawn as plain items

Every `bg` / `front` / `cursor` / `status` element takes the usual `spr`, `anim`, `offset`, `scale`, `facing`, `displaytime` and `layerno` parameters. Leave `spr` empty and `anim` at `-1` to draw nothing.

> [!TIP]
> When no trial in the character's `trials.def` declares a [`trial.difficulty`](Creating-A-Trials-Definition-File.md#trialdifficulty), there is nothing to filter by - the header is hidden and the list is flat and in def order.

### trialsmenu.layerno / trialsmenu.anchor
>> trialsmenu.layerno = *layer* (int)<br>
>> trialsmenu.anchor = *anchor* (string)<br>
>
> `trialsmenu.layerno` is the layer every element in this block sits on unless it names its own. The menu covers a live match, so it defaults to `2` rather than sharing layer `0` with the HUD.
> `trialsmenu.anchor` moves the whole menu as one unit (see [Element Anchors](#element-anchors)); `center` is usual for a centred block.
### trialsmenu.pos / trialsmenu.spacing / trialsmenu.visibleitems / trialsmenu.window
>> trialsmenu.pos = *pos_x, pos_y* (int, int)<br>
>> trialsmenu.spacing = *space_x, space_y* (int, int)<br>
>> trialsmenu.visibleitems = *count* (int)<br>
>> trialsmenu.window = *x1, y1, x2, y2* (int, int, int, int)<br>
>
> `trialsmenu.window` clips every row's text to this rectangle. Leave it unset for no clipping.
### trialsmenu.bg / trialsmenu.front / trialsmenu.overlay
>> trialsmenu.bg.offset / .spr / .anim / .scale / .facing / .displaytime / .layerno<br>
>> trialsmenu.front.offset / .spr / .anim / .scale / .facing / .displaytime / .layerno<br>
>> trialsmenu.overlay.visible = *bool* (bool)<br>
>> trialsmenu.overlay.window = *x1, y1, x2, y2* (int, int, int, int)<br>
>> trialsmenu.overlay.col = *r, g, b* (int, int, int)<br>
>> trialsmenu.overlay.alpha = *source_alpha, dest_alpha* (int, int)<br>
>> trialsmenu.overlay.layerno = *layer* (int)<br>
>
> `trialsmenu.overlay` dims whatever is behind the menu. Set `visible` to `false` to leave the match visible. `alpha` is source,destination, as with every other overlay in the engine: `0,128` halves what is behind it; raising the first number adds `col` to the picture rather than dimming it.
> The overlay `window` is authored in canvas space and is **not** anchored (see [Element Anchors](#element-anchors)).
### trialsmenu.title
>> trialsmenu.title.offset = *offset_x, offset_y* (int, int)<br>
>> trialsmenu.title.font = *font_no, bank, align, r, g, b* (int, int, int, int, int, int)<br>
>> trialsmenu.title.scale = *scale_x, scale_y* (int, int)<br>
>> trialsmenu.title.font.height = *font_height* (int)<br>
>> trialsmenu.title.text = *string* (string)<br>
### trialsmenu.headerdisplay
> Picks the shape of the difficulty filter header.
>> trialsmenu.headerdisplay = *shape* (string)<br>
>
> - `default` - one banner, naming the filter on show. Arrows mark that there are others.
> - `sidebyside` - every filter laid out `trialsmenu.header.spacing` apart, the one on show wearing the `trialsmenu.header.active` elements.
>
> Defaults to `default`.
### trialsmenu.header
> The difficulty filter the player cycles with left and right, and how many of it are cleared. It is pinned: `trialsmenu.header.offset` places it relative to `trialsmenu.pos` and it stays there while the rows scroll underneath.
>> trialsmenu.header.offset = *offset_x, offset_y* (int, int)<br>
>> trialsmenu.header.spacing = *space_x, space_y* (int, int)<br>
>> trialsmenu.header.text.offset / .font / .scale / .font.height<br>
>> trialsmenu.header.value.offset / .font / .scale / .font.height<br>
>> trialsmenu.header.value.text = *string* (string)<br>
>> trialsmenu.header.active.text.* / .value.*<br>
>> trialsmenu.header.bg.offset / .spr / .anim / .scale / .facing / .displaytime / .layerno<br>
>
> `trialsmenu.header.value.text` formats the cleared tally; `""` leaves it off (which `sidebyside` often wants once six filters are on one line).
> `trialsmenu.header.active.*` styles the filter on show; it inherits from the plain header elements, so declare only what should differ.
### trialsmenu.item
>> trialsmenu.item.text.offset / .font / .scale / .font.height<br>
>> trialsmenu.item.bg.offset / .spr / .anim / .scale / .facing / .displaytime / .layerno<br>
>> trialsmenu.item.active.text.* / .active.bg.*<br>
>> trialsmenu.item.selected.text.*<br>
>> trialsmenu.item.active.overlay.visible / .window / .col / .alpha / .layerno<br>
>
> `.active` is the row the cursor is on; `.selected` is the trial currently in play, whether or not the cursor is on it.
> `trialsmenu.item.active.overlay` is a rect drawn under the row the cursor is on - the highlight bar that follows it down the list. It works like `trialsmenu.overlay`, except its `window` is `x1,y1,x2,y2` taken from that row's origin rather than from the screen, so it travels with the cursor: `y1` is how far above the row's baseline the bar starts, `y2` how far below it ends. Give the window no area, or set `visible` to `false`, to highlight the row by text colour alone.
### Per-category overrides
> Any of the row and banner elements above can be respecified for a single difficulty category by putting the category name straight after `item` or `header`:
>
>> trialsmenu.item.*category*.text.* - a trial of that difficulty, at rest<br>
>> trialsmenu.item.*category*.active.text.* - ...under the cursor<br>
>> trialsmenu.item.*category*.selected.text.* - ...when it is the trial in play<br>
>> trialsmenu.item.*category*.bg.* / .active.bg.* / .active.overlay.*<br>
>> trialsmenu.header.*category*.text.* / .value.* / .bg.*<br>
>
> Categories for a row are `beginner`, `intermediate`, `advanced`, `expert` and `other` (`other` being the trials whose def declares no `trial.difficulty`). The banner adds `all`, the unfiltered view.
> Declare only what differs: anything a category leaves out is inherited from the shared element it overrides. Offsets are relative to the row, so a category can sit somewhere else on the line.

Example:
```ini
; Make Expert trials red, shift them right, give the Expert banner its own sprite:
trialsmenu.item.expert.text.font = 1,0,1, 255, 90, 90
trialsmenu.item.expert.text.offset = 12,0
trialsmenu.item.expert.active.text.font = 1,0,1, 255, 160, 160
trialsmenu.header.expert.bg.spr = 6550,0
```
### trialsmenu.cursor
> Drawn on the active row, under its text.
>> trialsmenu.cursor.offset / .spr / .anim / .scale / .facing / .displaytime / .layerno<br>
### trialsmenu.status (clear marker)
> Whether a trial has been cleared, shown at `trialsmenu.status.offset` from the row's origin.
>> trialsmenu.status.offset = *offset_x, offset_y* (int, int)<br>
>> trialsmenu.status.cleared.offset / .spr / .anim / .scale / .facing / .displaytime / .layerno<br>
>> trialsmenu.status.cleared.text = *string* (string)<br>
>> trialsmenu.status.cleared.font / .font.height<br>
>> trialsmenu.status.uncleared.offset / .spr / .anim / .scale / .facing / .displaytime / .layerno<br>
>> trialsmenu.status.uncleared.text = *string* (string)<br>
>> trialsmenu.status.uncleared.font / .font.height<br>
>
> Name a sprite or an anim and it is drawn there; leave both unset and the `.text` label is drawn instead. That is the swap: point `status.cleared.spr` at your own sprite and it replaces the `"CLEAR"` text. Set a state's `text` to `""` and leave its art unset to show nothing for that state. Only one of the two is ever drawn, so `.scale` applies to whichever it is.
### trialsmenu.besttime
> The best clear time for a cleared trial.
>> trialsmenu.besttime.offset / .font / .scale / .font.height<br>
>> trialsmenu.besttime.text = *string* (string)<br>
>
> `%s` is the best clear time. Set `text` to `""` to leave times off the menu entirely.
### trialsmenu.arrow.up / trialsmenu.arrow.down
> Shown when the list runs past `trialsmenu.visibleitems` in that direction. Offsets are relative to `trialsmenu.pos`.
>> trialsmenu.arrow.*dir*.offset / .spr / .anim / .scale / .facing / .displaytime / .layerno<br>
>> trialsmenu.arrow.*dir*.text = *string* (string)<br>
>> trialsmenu.arrow.*dir*.font / .font.height<br>
>
> Like the clear marker, each arrow takes either art or a label: name a sprite or an anim and it is drawn, leave both unset and `.text` is drawn instead. Set `.text` to `""` with no art to hide an arrow.

Example:
```ini
; TRIAL SELECT MENU
trialsmenu.layerno = 2
trialsmenu.anchor = center
trialsmenu.pos = 320,240
trialsmenu.spacing = 0,26
trialsmenu.visibleitems = 9
trialsmenu.window = 
trialsmenu.overlay.visible = true
trialsmenu.overlay.window = 0,0,1280,720
trialsmenu.overlay.col = 0,0,0
trialsmenu.overlay.alpha = 0,64
trialsmenu.overlay.layerno = 0

trialsmenu.title.offset = 320,-52
trialsmenu.title.font = 1,0,0, 255, 255, 255
trialsmenu.title.scale = 2,2
trialsmenu.title.font.height = -1
trialsmenu.title.text = "Trial Selection"

trialsmenu.headerdisplay = default
trialsmenu.header.offset = 0, -26
trialsmenu.header.spacing = 150,0
trialsmenu.header.text.offset = 0,0
trialsmenu.header.text.font = 1,0,1, 255, 220, 120
trialsmenu.header.text.scale = 2,2
trialsmenu.header.value.offset = 640,0
trialsmenu.header.value.font = 1,0,-1, 255, 220, 120
trialsmenu.header.value.scale = 2,2
trialsmenu.header.value.text = "%s"
trialsmenu.header.active.text.font = 1,0,1, 255, 255, 255
trialsmenu.header.active.value.font = 1,0,-1, 255, 255, 255

trialsmenu.item.text.offset = 0,0
trialsmenu.item.text.font = 1,0,1, 190, 190, 190
trialsmenu.item.text.scale = 2,2
trialsmenu.item.active.overlay.visible = true
trialsmenu.item.active.overlay.window = -12,-15, 652,10
trialsmenu.item.active.overlay.col = 255,255,255
trialsmenu.item.active.overlay.alpha = 48,255
trialsmenu.item.active.overlay.layerno = 2
trialsmenu.item.selected.text.font = 1,0,1, 120, 255, 160
trialsmenu.item.active.text.font = 1,0,1, 255, 255, 255

trialsmenu.status.offset = 500,0
trialsmenu.status.cleared.text = "CLEAR"
trialsmenu.status.cleared.font = 1,0,1, 120, 255, 160
trialsmenu.status.cleared.scale = 2,2
trialsmenu.status.uncleared.text = "----"
trialsmenu.status.uncleared.font = 1,0,1, 130, 130, 130
trialsmenu.status.uncleared.scale = 2,2

trialsmenu.besttime.offset = 640,0
trialsmenu.besttime.font = 1,0,-1, 190, 190, 190
trialsmenu.besttime.scale = 2,2
trialsmenu.besttime.text = "%s"

trialsmenu.arrow.up.offset = 660, 0
trialsmenu.arrow.up.anim = 65510
trialsmenu.arrow.down.offset = 660,210
trialsmenu.arrow.down.anim = 65511
```

## trialslocalcoord
> Sets the localcoord (authoring canvas) for every Trials Mode element.
>> trialslocalcoord = *width, height* (int, int)<br>
>
> Every position, offset and window on in this `system.def` is authored in this coordinate space.
> Defaults to `320,240` when unspecified.

Example:
```ini
trialslocalcoord = 1280,720
```

## Speedrun

Speedrun is a run at the whole character, in order, against the clock. Turning it on from the pause menu:

- takes **Trials List** off the pause menu, so no trial can be skipped;
- holds **Advancement** at Auto-Advance, since Repeat would stall a run;
- restarts from the first trial with the total timer running.

With Speedrun on, loading into a match skips the Trial Select view and starts on the first trial. Clearing every trial in one uninterrupted run records the total as that character's best run time; jumping to a trial invalidates the run, so a run only counts if it was played straight through. Individual clears and best times are recorded during a speedrun exactly as they are outside one.

The character's best run time is shown beside the Speedrun item in the pause menu once they have one.

Speedrun is **not saved**: it belongs to the sitting it was started in, and turns itself off whenever the player returns to the character select screen - via Character Change, the end of a match, or leaving the mode. Recorded clears and best run times are of course kept.

## How to Handle Projectiles

A projectile step passes only when the projectile actually connects with the dummy - not when it is fired. There are two ways to identify the projectile:

- **By `projid`** - the ID given to the projectile in the character's `Projectile` sctrl (`ProjID`, `projid`, or `id`). A `projid` alone marks the step as a projectile step; [`isproj`](#trialstepxisproj) is not needed alongside it.
- **By `stateno` + `isproj = true`** - the state the projectile was **fired from**. This is the legacy approach and is still fully supported.

Rules of thumb:

- Use `|` where a character fires more than one projectile for the same move, or where the ID is an expression - e.g. `projid = 3005|3006` for `ID = 3005 + (var(5) = 2)`.
- Add `stateno` alongside `projid` when a character reuses one ID across several moves. For example, CvS Sagat reuses ProjID `1000` across states `1000` / `1050` / `1070`; `projid = 1000` with `stateno = 1070` isolates the heavy Tiger Shot.
- If the `Projectile` sctrl declares no ID, it defaults to `0`, so `projid = 0` matches every ID-less projectile - pair it with `stateno` to narrow it down.
- A step with `isproj = true` and no `projid` matches on `stateno` alone and still requires a connect.
- `projid` has no effect when `hitcount = 0`.
- For a projectile fired **by way of a helper**, the `stateno` to check is the **root's** move state, not the helper's own state number.

```ini
[TrialDef, Shinku Hadoken]
trialstep.1.text = Shinku Hadoken
trialstep.1.glyphs = _QCF_QCF^P
trialstep.1.stateno = 7300
trialstep.1.projid = 7300

[TrialDef, EX Hadoken]
; ID = 7000 + (var(5) = 2) -> either 7000 or 7001
trialstep.1.text = EX Hadoken
trialstep.1.glyphs = _QCF^P^P
trialstep.1.projid = 7000|7001
```