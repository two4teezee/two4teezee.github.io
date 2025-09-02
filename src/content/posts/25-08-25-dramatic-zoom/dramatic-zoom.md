---
title: Spotlight - Dramatic Zoom Add-On by PotS
published: 2025-08-25
description: 'Dramatic slow motion and zoom make for some epic moments.'
image: './drama-thumb.webp'
tags: [Add-on, Ikemen GO, zss]
category: 'Spotlight - Add-on'
draft: false 
lang: ''
---

| Creation Information    |                                                                 |                        |                         |
| ----------------------- | --------------------------------------------------------------- | ---------------------- | ----------------------- |
| `creation`              | Dramatic Zoom Add-On                                            | `author`               | PotS                    |
| `creation type`         | Common State Add-On                                             | `compatibility`        | Ikemen GO Nightly Build |
| `download link`         | [PotS's Mugen and Ikemen](https://network.mugenguild.com/pots/) | `initial release date` | 28 April 2024           |
| `discord or forum link` | [MFG]()                                                         | `my thoughts`          | 😍                      |

PotS is one of the most talented and prolific creators in the Mugen and Ikemen scene.
He is known for his custom character styles and his overall attention to detail.
Since joining the Ikemen scene, PotS has been very involved with developing engine features but also exploring the realm of what's possible through common state add-ons and the modules system.
PotS has created many add-ons that I'm interested in highlighting, but the first one I'll be looking at is **Dramatic Zoom**. 

The basic premise of the Dramatic Zoom common state add-on is to emulate the slow motion and camera zoom when characters hit each other under certain conditions, like in Teken 7 and Tekken 8.
Spoiler alert: this module is awesome, especially if you have characters that lend themselves well to this!

### Installation
As usual with anything PotS releases, the instructions in the readme are straightforward.
All you have to do is find `./save/config.ini` and add `dramaticzoom.zss` to `States` under `[Common]`.
I put all of my mods in `.external/mods/[modfolder]`, so my addition to `config.ini` looked like this:
```ini
[Common]
States = /external/mods/dramaticzoom/dramaticzoom.zss
```
That's all you need to do. 
From there on out, the common state add-on is enabled in every game mode - simple!

### Dramatic Zoom in Action
The effect is really, really cool and it can lead to some pretty epic moments.
In my testing I've found that it is best suited for characters or game-types that are more footsy-heavy, so SF or KOF-type gameplay.
It works with all characters but it can get in the way of characters with more frenetic and fast-paced gameplay, like anime or MvC-styled characters.

<video controls width="100%" autoplay muted loop>
    <source src="/posts/25-08-25-dramatic-zoom/drama2.webm" type="video/webm">
    Sorry, video not supported.
</video>

The effect gets triggered when a counter hit is imminent, or when both characters are close to one another and action is abound.
The effect sometimes triggers when two characters swing at each other but both whiff, which is also really neat.

<video controls width="100%" autoplay muted loop>
    <source src="/posts/25-08-25-dramatic-zoom/drama1.webm" type="video/webm">
    Sorry, video not supported.
</video>

PotS also included BGM effects where the pitch changes to emphasize the slow motion and zoom effect.
This is perhaps the only aspect of the add-on I didn't enjoy so much.
While I agree that an audio effect is a nice touch, I've found the pitch change on the music to be particularly jarring.
However, as we'll see in the next section, PotS did an amazing job making sure users can tailor the add-on to their liking, including the BGM effects!

### Diving Into the Code
At the time of writing, PotS' Dramatic Zoom module is a lean 247 lines.
The fact that automatic slow motion and camera zoom can be triggered universally through a common state add-on is a testament to how powerful the Ikemen GO engine can be.
Let's take a look at some of the decisions PotS made when he developed this add-on.

#### Available Customization Otions
PotS uses maps to set values that allow to customize certain properties of the add-on and exposes them at the very start of the file to allow users to adjust them to their liking.
This is a really smart way of making the add-on as accessible and customizable as possible.
The set of options PotS has exposed to users is thorough and allows extensive tailoring for any custom game being developed.
That said, my testing was with the default values as shown below, but I subsequently changed the `pitch_sound` value to `0.70` and `pitch_music` to `1.0`, which completely remedied the only qualm I had with this excellent add-on.

```zss wrap=false
#===============================================================================
# Configuration
#===============================================================================

[Function F_PotS_DramaticZoom_Config()]

mapset{map: "_pots_dramaticzoom_cfg_zoom"; value: 1.25}			# Intensity of zoom
mapset{map: "_pots_dramaticzoom_cfg_slowmo"; value: 5}			# Intensity of slow motion

mapset{map: "_pots_dramaticzoom_cfg_distx"; value: 1.0}			# Multiplier for maximum X distance between characters to trigger zoom
mapset{map: "_pots_dramaticzoom_cfg_disty"; value: 1.0}			# Multiplier for maximum Y distance between characters to trigger zoom
mapset{map: "_pots_dramaticzoom_cfg_life"; value: 100}			# Maximum life percentage of both characters at which zoom will trigger

mapset{map: "_pots_dramaticzoom_cfg_afterimage"; value: 5}		# Duration of character "afterimage" effect during slow motion
mapset{map: "_pots_dramaticzoom_cfg_pitch_sound"; value: 0.90}	# Sound pitch to use during zoom
mapset{map: "_pots_dramaticzoom_cfg_pitch_music"; value: 0.90}	# Music pitch to use during zoom
mapset{map: "_pots_dramaticzoom_cfg_music"; value: 1}			# Allow stage music during zoom

mapset{map: "_pots_dramaticzoom_cfg_normal"; value: 1}			# Allow zoom on normal attacks
mapset{map: "_pots_dramaticzoom_cfg_special"; value: 1}			# Allow zoom on special attacks
mapset{map: "_pots_dramaticzoom_cfg_super"; value: 1}			# Allow zoom on super attacks

mapset{map: "_pots_dramaticzoom_cfg_simul"; value: 1}			# Allow zoom during simul mode
```

#### Add-On Logic
The add-on separates the monitoring logic in negative states and the explod generation and manipulation in `[Statedef +1]`.
In `[Statedef -4]`, PotS deploys all of the monitoring logic for when to fire the effects, and tweak them according to the maps set at the beginning of the file.
Based on proximity and current states, the slow motion and zoom effects trigger. 

```zss wrap=false
if roundstate = 2
	&& ID > p2, ID
	&& ID = p2, p2, ID
	# && facing != p2, facing # Removed because it makes it less fun
	&& movetype = A && p2movetype = A
	# && inguarddist && p2, inguarddist # Removed because it leaves out throws
	&& movecontact = 0 && p2, movecontact = 0
	&& movereversed = 0 && p2, movereversed = 0
	# Check simul mode
	&& (map(_pots_dramaticzoom_cfg_simul) != 0 || (teammode != Simul && p2, teammode != Simul))
	# Life check
	&& (100.0 * life / lifemax) <= map(_pots_dramaticzoom_cfg_life)
	&& (100.0 * p2life / p2, lifemax) <= map(_pots_dramaticzoom_cfg_life)
	# X Distance check
	&& (abs(p2bodydist x) <= abs(const(size.head.pos.y) * map(_pots_dramaticzoom_cfg_distx))
		|| abs(p2, p2bodydist x) <= abs(p2, const(size.head.pos.y) * map(_pots_dramaticzoom_cfg_distx)))
	# Y Distance check
	&& (abs(p2dist y) <= abs(const(size.head.pos.y) * map(_pots_dramaticzoom_cfg_disty))
		|| abs(p2, p2dist y) <= abs(p2, const(size.head.pos.y) * map(_pots_dramaticzoom_cfg_disty)))
	# Attack type check
	&& (map(_pots_dramaticzoom_cfg_normal) != 0 || $p1_attr_normal = 0 || $p2_attr_normal = 0)
	&& (map(_pots_dramaticzoom_cfg_special) != 0 || $p1_attr_special = 0 || $p2_attr_special = 0)
	&& (map(_pots_dramaticzoom_cfg_super) != 0 || $p1_attr_super = 0 || $p2_attr_super = 0) {
		[...]
```
The zoom function uses new elements delivered in the nightly build.
```zss
# Zoom
zoom{
	scale: map(_pots_dramaticzoom_cfg_zoom);
	pos: (pos x + p2, pos x) / 2.0,
		max(stagevar(camera.boundhigh), (pos y + p2, pos y) / 4.0);
	lag: 0.75;
	stagebound: 1;
	camerabound: 1;
}
```
And the slow motion makes a smart use of `pause`:
```zss
# Slow motion
if map(_pots_dramaticzoom_cfg_slowmo) > 0
&& map(_pots_dramaticzoom) > 0 # No slow motion during the hit (-1) to not interfere with combo timing
&& pausetime = 0 && p2, pausetime = 0 {
	pause{time: map(_pots_dramaticzoom_cfg_slowmo)}
}
```

<video controls width="100%" autoplay muted loop>
    <source src="/posts/25-08-25-dramatic-zoom/drama3.webm" type="video/webm">
    Sorry, video not supported.
</video>

### Conclusion
Overall, Dramatic Zoom is an elegant implementation that provides consistent execution, great configurability, and delivers epic moments almost every match.
I'm definitely keeping this one in my collection, kudos to PotS!