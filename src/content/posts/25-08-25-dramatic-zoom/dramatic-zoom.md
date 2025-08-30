---
title: Dramatic Zoom Ikemen GO Module by PotS
published: 2025-08-25
description: 'A review of the Dramatic Zoom Ikemen GO Module by PotS'
image: '/posts/dramatic-zoom/drama-thumb.webp'
tags: [Review, Ikemen GO, zss]
category: 'Module Review'
draft: true 
lang: ''
---

| Creation Information |                                                                 |                        |                         |
| -------------------- | --------------------------------------------------------------- | ---------------------- | ----------------------- |
| `creation`           | Dramatic Zoom for Ikemen GO                                     | `author`               | PotS                    |
| `creation type`      | Common State Add-On                                             | `compatibility`        | Ikemen GO Nightly Build |
| `download link`      | [PotS's Mugen and Ikemen](https://network.mugenguild.com/pots/) | `initial release date` | 28 April 2024           |
| `discord link`       | N/A                                                             | `forum thread`         | [MFG]()                 |

PotS is one of the most talented and prolific creators in the Mugen and Ikemen scene.
He is known for his custom character styles and his overall attention to detail.
Since joining the Ikemen scene, PotS has been very involved with developing engine features but also exploring the realm of what's possible through common state add-ons and the modules system.
PotS has created many add-ons that I'm interested in reviewing, but the first one I'll be looking at is **Dramatic Zoom**. 

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
    <source src="/posts/dramatic-zoom/drama2.webm" type="video/webm">
    Sorry, video not supported.
</video>

At first glance without diving into the code (we will do that later in this article!) it feels like the effect gets triggered when a counter hit is imminent.
However, the effect sometimes triggers when two characters swing at each other but both whiff, which is also really neat.

<video controls width="100%" autoplay muted loop>
    <source src="/posts/dramatic-zoom/drama1.webm" type="video/webm">
    Sorry, video not supported.
</video>

### Diving Into the Code
At the time of writing, PotS' Dramatic Zoom module is a lean 247 lines.
The fact that automatic slow motion and camera zoom can be triggered universally through a common state add-on is a testament to how powerful the Ikemen GO engine can be.
Let's take a look at some of the decisions PotS made when he developed this add-on.

#### Usage of maps

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

```zss
[StateDef -4]

ignorehitpause if !ishelper {

	# Run config
	if roundState = 0 {
		call F_PotS_DramaticZoom_Config();
	}

	# Check attack attributes for both players
	if movetype = A || p2movetype = A {
		let p1_attr_normal = stateno = [200, 999] || hitdefattr = SCA, NA, NT, NP;
		let p2_attr_normal = p2stateno = [200, 999] || p2, hitdefattr = SCA, NA, NT, NP;
		let p1_attr_special = stateno = [1000, 2999] || hitdefattr = SCA, SA, ST, SP;
		let p2_attr_special = p2stateno = [1000, 2999] || p2, hitdefattr = SCA, SA, ST, SP;
		let p1_attr_super = stateno = [3000, 4999] || hitdefattr = SCA, HA, HT, HP;
		let p2_attr_super = p2stateno = [3000, 4999] || p2, hitdefattr = SCA, HA, HT, HP;
	}
```