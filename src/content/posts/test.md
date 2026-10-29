---
title: test
published: 2026-09-11
description: ''
image: ''
tags: []
category: ''
draft: true 
lang: ''
---

## Normals

:::frametable{caption="Normals"}
|                  Move                   | Damage | Chain<br>Cancel | Special<br>Cancel | Super<br>Cancel | Block<br>Stun | Hit<br>Stun | Notes  | Frame Data                     |
| :-------------------------------------: | :----: | :-------------: | :---------------: | :-------------: | :-----------: | :---------: | :----: | ------------------------------ |
| :icon{name="_CROUCH"} :icon{name="^LP"} |   20   |        ○        |        ○*1        |        ○        |      +4       |     +6      |   -    | startup=3 active=3 recovery=4  |
| :icon{name="_CROUCH"} :icon{name="^MP"} |   50   |        ×        |         ○         |        ○        |      +4       |     +6      |   -    | startup=4 active=4 recovery=6  |
| :icon{name="_CROUCH"} :icon{name="^HP"} |   70   |        ×        |         ×         |        ○        |      +2       |     +4      |   -    | startup=5 active=6 recovery=9  |
| :icon{name="_CROUCH"} :icon{name="^LK"} |   25   |        ○        |        ○*1        |        ○        |      +2       |     +4      |   -    | startup=4 active=3 recovery=6  |
| :icon{name="_CROUCH"} :icon{name="^MK"} |   50   |        ×        |         ○         |        ○        |      +0       |     +2      |   -    | startup=4 active=5 recovery=9  |
| :icon{name="_CROUCH"} :icon{name="^HK"} |   70   |        ×        |         ×         |        ×        |      -7       |     KD      | HKD*2  | startup=7 active=4 recovery=20 |
| :icon{name="_CLOSE"} :icon{name="^LP"}  |   25   |        ○        |        ○*1        |        ○        |      +4       |     +6      |   -    | startup=3 active=3 recovery=4  |
| :icon{name="_CLOSE"} :icon{name="^MP"}  |   50   |        ×        |         ○         |        ○        |      -1       |     +1      |   *3   | startup=4 active=6 recovery=9  |
| :icon{name="_CLOSE"} :icon{name="^HP"}  |   70   |        ×        |         ○         |        ○        |      +4       |     +6      |   -    | startup=4 active=3 recovery=10 |
| :icon{name="_CLOSE"} :icon{name="^LK"}  |   25   |        ×        |         ○         |        ○        |      +1       |     +3      |   -    | startup=3 active=5 recovery=5  |
| :icon{name="_CLOSE"} :icon{name="^MK"}  |   55   |        ×        |         ○         |        ○        |      +2       |     +4      |   -    | startup=4 active=6 recovery=6  |
| :icon{name="_CLOSE"} :icon{name="^HK"}  |   80   |        ×        |         ×         |        ×        |      -2       |     KD      | LX, JX | startup=7 active=2 recovery=17 |
|            :icon{name="^LP"}            |   20   |        ○        |        ○*1        |        ○        |      +3       |     +5      |   -    | startup=4 active=3 recovery=5  |
|            :icon{name="^MP"}            |   55   |        ×        |         ○         |        ○        |      +3       |     +5      |   -    | startup=5 active=3 recovery=8  |
|            :icon{name="^HP"}            |   75   |        ×        |         ×         |        ○        |      +1       |     +3      |   -    | startup=6 active=3 recovery=13 |
|            :icon{name="^LK"}            |   30   |        ×        |         ○         |        ○        |      -1       |     +1      |   -    | startup=4 active=6 recovery=6  |
|            :icon{name="^MK"}            |   55   |        ×        |         ×         |        ○        |      -1       |     +1      |   -    | startup=6 active=7 recovery=8  |
|            :icon{name="^HK"}            |   70   |        ×        |         ×         |        ○        |      -5       |     -3      |   -    | startup=8 active=2 recovery=20 |
|  :icon{name="_AIR"} :icon{name="^LP"}   |   35   |        ×        |        ○*4        |        ×        |      11       |     13      |   *5   | startup=3 active=18            |
|  :icon{name="_AIR"} :icon{name="^MP"}   |   50   |        ×        |        ○*4        |        ×        |      14       |     13      |   *5   | startup=5 active=6             |
|  :icon{name="_AIR"} :icon{name="^HP"}   |   75   |        ×        |         ×         |        ×        |      17       |     13      |   *5   | startup=5 active=6             |
|  :icon{name="_AIR"} :icon{name="^LK"}   |   30   |        ×        |         ×         |        ×        |      11       |     13      |   *5   | startup=4 active=18            |
|  :icon{name="_AIR"} :icon{name="^MK"}   |   55   |        ×        |         ×         |        ×        |      14       |     13      |   *5   | startup=6 active=6             |
|  :icon{name="_AIR"} :icon{name="^HK"}   |   70   |        ×        |         ×         |        ×        |      17       |     13      |   *5   | startup=5 active=6             |

- ○ = Cancelable on hit or block
- × = Not cancelable
- KD = Knockdown
- HKD = Hard knockdown
- LX = Launches on hit
- JX = Jump cancelable on hit

\*1 = Also cancelable on whiff.
\*2 = Only on counter hit; otherwise a recoverable knockdown.
\*3 = The late part of the move does 40 damage instead.
\*4 = Into air specials, early in the move only.
\*5 = Jumping normals: the stun columns are frames of stun dealt, not advantage, which depends on how late the jump-in hits. Recovery runs until landing.
:::

:::frametable{caption="Unique attacks"}
|                             Move                             | Mode | Damage | Block<br>Stun | Hit<br>Stun | Notes | Frame Data                                |
| :----------------------------------------------------------: | :--: | :----: | :-----------: | :---------: | :---: | ----------------------------------------- |
| Knee Bullet :icon{name="_F"}:icon{name="_+"}:icon{name="^C"} |  C   | 40+40  |      +2       |     +4      |   -   | startup=13 active=2 recovery=6 active=2 recovery=13 |
| Falling Arc :icon{name="_F"}:icon{name="_+"}:icon{name="^B"} |  D   | 50+30  |      +2       |     +4      |  OH   | startup=22 active=4 recovery=10           |

- C = Cammy mode (palettes 1-6)
- D = Doll mode (palettes 7-12)
- OH = Overhead

Both also work with back instead of forward. Neither cancels into anything.
:::

## Specials - Cammy mode

:::framechartable[Cannon Drill :icon{name="_D"}:icon{name="_DF"}:icon{name="_F"}:icon{name="^K"}]
|      Version      | Damage | Block<br>Stun | Hit<br>Stun | Notes | Frame Data                   |
| :---------------: | :----: | :-----------: | :---------: | :---: | ---------------------------- |
| :icon{name="^LK"} |   70   |      -19      |     KD      |   -   | startup=8 active=16 land=20  |
| :icon{name="^MK"} |   80   |      -21      |     KD      |   -   | startup=9 active=16 land=22  |
| :icon{name="^HK"} |   90   |      -23      |     KD      |   -   | startup=10 active=16 land=24 |
| :icon{name="_EX"} | 40+100 |      -19      |     KD      |   -   | startup=8 active=16 land=22  |

Block advantage is point-blank; from further out the drill hits later in its slide and is safer.
:::

:::framechartable[Cannon Spike :icon{name="_F"}:icon{name="_D"}:icon{name="_DF"}:icon{name="^K"}]
|      Version      | Damage | Block<br>Stun | Hit<br>Stun | Notes | Frame Data                                  |
| :---------------: | :----: | :-----------: | :---------: | :---: | ------------------------------------------- |
| :icon{name="^LK"} |  100   |      -18      |     KD      |  *1   | startup=5 active=18 air=10 land=4 ; inv=1-4 |
| :icon{name="^MK"} |  110   |      -18      |     KD      |  *1   | startup=5 active=21 air=15 land=4 ; inv=1-4 |
| :icon{name="^HK"} |  120   |      -18      |     KD      |  *1   | startup=5 active=24 air=20 land=4 ; inv=1-4 |
| :icon{name="_EX"} | 80+60  |      -28      |     KD      |   -   | startup=5 active=24 air=19 land=4 ; inv=1-8 |

\*1 = The late part of the move does 60 damage instead.
Bars are the whiff; on contact every strength cuts to the same 39-frame finish, hence the same block advantage.
Available in both modes.
:::

:::framechartable[Axle Spin Knuckle :icon{name="_F"}:icon{name="_DF"}:icon{name="_D"}:icon{name="_DB"}:icon{name="_B"}:icon{name="^P"}]
|      Version      | Damage | Block<br>Stun | Hit<br>Stun | Notes | Frame Data                               |
| :---------------: | :----: | :-----------: | :---------: | :---: | ---------------------------------------- |
| :icon{name="^LP"} | 40+40  |      +2       |     +4      |   -   | startup=25 active=8 recovery=9 ; inv=1-3 |
| :icon{name="^MP"} | 40+40  |      +2       |     +4      |   -   | startup=27 active=8 recovery=9 ; inv=1-3 |
| :icon{name="^HP"} | 40+40  |      +2       |     +4      |   -   | startup=29 active=8 recovery=9 ; inv=1-3 |
| :icon{name="_EX"} | 40+60  |      +2       |     +4      |   -   | startup=26 active=8 recovery=9 ; inv=1-3 |

Startup includes the hop before the spin. Strength changes the hop's length.
:::

:::framechartable[Hooligan Combination :icon{name="_F"}:icon{name="_D"}:icon{name="_DF"}:icon{name="^P"}]
|                      Version                      | Damage | Guard | Block<br>Stun | Hit<br>Stun | Notes | Frame Data                        |
| :-----------------------------------------------: | :----: | :---: | :-----------: | :---------: | :---: | --------------------------------- |
|        Razor Edge Slicer :icon{name="^LP"}        |   76   |  Low  |      -7       |     KD      |  *1   | startup=52 active=9 recovery=15   |
|        Razor Edge Slicer :icon{name="^MP"}        |   83   |  Low  |      -7       |     KD      |  *1   | startup=49 active=11 recovery=13  |
|        Razor Edge Slicer :icon{name="^HP"}        |   90   |  Low  |      -14      |     KD      |  *1   | startup=47 active=11 recovery=20  |
| Hooligan Sting :icon{name="^LP"} :icon{name="^K"} |   60   |  OH   |      -13      |     -11     |  *2   | startup=38 active=9 air=5 land=16 |
| Hooligan Sting :icon{name="^MP"} :icon{name="^K"} |   60   |  OH   |      -11      |     -9      |  *2   | startup=36 active=9 air=3 land=16 |
| Hooligan Sting :icon{name="^HP"} :icon{name="^K"} |   60   |  OH   |      -9       |     -7      |  *2   | startup=34 active=9 air=1 land=16 |
|  Fatal Leg Twister :icon{name="_F"}:icon{name="^P"}  |  130   | Throw |       -       |     KD      |  *3   |                                   |
| Cross Scissor Pressure :icon{name="_F"}:icon{name="^P"} |  140   | Throw |       -       |     KD      |  *3   |                                   |

- OH = Overhead

\*1 = No follow-up: the jump lands into the slide. Startup counts from the motion input.
\*2 = Kick held from the start, so the earliest kick. Startup counts from the motion input.
\*3 = Fatal Leg Twister grabs a grounded opponent, Cross Scissor Pressure an airborne one. Needs the right spacing; the same damage at every strength.
:::

:::framechartable[Cannon Strike :icon{name="_AIR"} :icon{name="_D"}:icon{name="_DB"}:icon{name="_B"}:icon{name="^K"}]
|      Version      | Damage | Guard | Block<br>Stun | Hit<br>Stun | Notes | Frame Data                  |
| :---------------: | :----: | :---: | :-----------: | :---------: | :---: | --------------------------- |
| :icon{name="^K"}  |   60   |  OH   |      -4       |     +2      |  *1   | startup=10 active=10 land=7 |
| :icon{name="_EX"} |   80   |  OH   |      +3       |     KD      |  *2   | startup=9 active=9 land=5   |

- OH = Overhead

\*1 = Input at the lowest height allowed (80 px). From the top of a neutral jump (102 px) it's -6 on block and +0 on hit. Strength only changes the angle.
\*2 = Input at the lowest height allowed (64 px).
:::

## Specials - Doll mode

:::framechartable[Sniping Arrow :icon{name="_D"}:icon{name="_DF"}:icon{name="_F"}:icon{name="^K"}]
|      Version      | Damage | Block<br>Stun | Hit<br>Stun | Notes | Frame Data                  |
| :---------------: | :----: | :-----------: | :---------: | :---: | --------------------------- |
| :icon{name="^LK"} |   90   |      -11      |     KD      |   -   | startup=12 active=19 land=9 |
| :icon{name="^MK"} |  100   |      -11      |     KD      |   -   | startup=14 active=19 land=9 |
| :icon{name="^HK"} |  110   |      -11      |     KD      |   -   | startup=16 active=19 land=9 |
| :icon{name="_EX"} | 35+90  |      -11      |     KD      |   -   | startup=11 active=22 land=9 |
:::

:::framechartable[Air Cannon Drill :icon{name="_AIR"} :icon{name="_D"}:icon{name="_DF"}:icon{name="_F"}:icon{name="^K"}]
|      Version      | Damage | Block<br>Stun | Hit<br>Stun | Notes | Frame Data                         |
| :---------------: | :----: | :-----------: | :---------: | :---: | ---------------------------------- |
| :icon{name="^LK"} | 50+50  |      -13      |     KD      |  *1   | startup=4 active=14 air=10 land=10 |
| :icon{name="^MK"} | 50+50  |      -15      |     KD      |  *1   | startup=4 active=17 air=9 land=10  |
| :icon{name="^HK"} | 50+50  |      -16      |     KD      |  *1   | startup=4 active=20 air=7 land=10  |
| :icon{name="_EX"} | 60+60  |      -18      |     KD      |  *1   | startup=4 active=23 air=6 land=10  |

\*1 = Input at the lowest height allowed (48 px). Higher up, the dive lasts longer.
:::

:::framechartable[Earth Direct :icon{name="_FUB"}:icon{name="^P"}]
|      Version      | Damage | Guard | Notes | Frame Data                     |
| :---------------: | :----: | :---: | :---: | ------------------------------ |
| :icon{name="^LP"} |  140   | Throw |  *1   | startup=5 active=2 recovery=27 |
| :icon{name="^MP"} |  150   | Throw |  *1   | startup=5 active=2 recovery=27 |
| :icon{name="^HP"} |  160   | Throw |  *1   | startup=5 active=2 recovery=27 |
| :icon{name="_EX"} |  160   | Throw |  *1   | startup=5 active=2 recovery=27 |

\*1 = Frame data is the whiff. Strength trades range for damage: L grabs from furthest away.
:::

:::framechartable[Cannon Revenge :icon{name="_D"}:icon{name="_DB"}:icon{name="_B"}]
|        Version        | Damage | Block<br>Stun | Hit<br>Stun | Notes | Frame Data                                          |
| :-------------------: | :----: | :-----------: | :---------: | :---: | --------------------------------------------------- |
|        Counter        |   -    |       -       |      -      |  *1   | startup=56 ; counter=3-24                           |
| High :icon{name="^P"} | 50+50  |      +6       |     KD      |  *2   | startup=17 active=2 recovery=15 active=5 recovery=6  |
| Low :icon{name="^K"}  | 35+35  |      +1       |     KD      |  *2   | startup=19 active=3 recovery=14 active=6 recovery=10 |

\*1 = The stance: catches an attack on frames 3-24 and is 56 frames in all if nothing comes.
\*2 = Counted from the moment it catches an attack.
:::

## Supers

:::framechartable[Spin Drive Smasher :icon{name="_D"}:icon{name="_DF"}:icon{name="_F"}:icon{name="_D"}:icon{name="_DF"}:icon{name="_F"}:icon{name="^K"}]
|      Version       | Damage | Block<br>Stun | Hit<br>Stun | Notes | Frame Data                                                                           |
| :----------------: | :----: | :-----------: | :---------: | :---: | ------------------------------------------------------------------------------------ |
|  :icon{name="^K"}  |  210   |      -24      |     KD      |  *1   | startup=4 flash=41 startup=2 active=10 recovery=13 active=15 air=19 land=7 ; inv=1-46 |
| :icon{name="_MAX"} |  310   |      -26      |     HKD     |  *2   | startup=4 flash=43 active=12 recovery=13 active=25 air=18 land=5 ; inv=1-49           |

- KD = Knockdown (no air recovery)
- HKD = Hard knockdown

\*1 = 6 hits on hit, 7 on block.
\*2 = 9 hits. Its first hit comes out on the last frame of the flash.
Both modes.
:::

:::framechartable[Reverse Shaft Breaker :icon{name="_D"}:icon{name="_DB"}:icon{name="_B"}:icon{name="_D"}:icon{name="_DB"}:icon{name="_B"}:icon{name="^K"}:icon{name="_MASH"}]
|      Version       |  Damage   | Block<br>Stun | Hit<br>Stun | Notes | Frame Data                                                      |
| :----------------: | :-------: | :-----------: | :---------: | :---: | --------------------------------------------------------------- |
|  :icon{name="^K"}  | 190 - 240 |      -3       |     KD      |  *1   | startup=4 flash=41 startup=2 active=24 air=16 land=2 ; inv=1-46 |
| :icon{name="_MAX"} | 230 - 310 |      -9       |     HKD     |  *1   | startup=4 flash=43 active=29 air=21 land=2 ; inv=1-50           |

- KD = Knockdown (no air recovery)
- HKD = Hard knockdown

\*1 = Three hits, then a rush of 10-damage hits: 4 without mashing (5 on MAX), up to 9 (13 on MAX) mashing every frame.
Both modes.
:::

:::framechartable[Sniping Heel :icon{name="_D"}:icon{name="_DF"}:icon{name="_F"}:icon{name="_D"}:icon{name="_DF"}:icon{name="_F"}:icon{name="^P"}]{inset="70% 30%"}
| Her best tool for closing distance. Point-blank it's very unsafe, but spaced out it hits late in the slide. | <video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px"><source src="/posts/25-09-02-ryo2005-tung-fu-rue/double-dragon-kick-3by4.webm" type="video/webm">Sorry, video not supported.</video> |
|--|--:|

|                 Version                  | Damage |  Guard   | Block<br>Stun | Hit<br>Stun | Notes | Frame Data                                                                       |
| :--------------------------------------: | :----: | :------: | :-----------: | :---------: | :---: | -------------------------------------------------------------------------------- |
|          High :icon{name="^P"}           |  210   |    OH    |      -4       |     KD      |  *1   | startup=5 flash=41 startup=8 active=4 air=6 active=4 air=3 land=14 ; inv=1-47    |
| :icon{name="_MAX"} High :icon{name="^P"} |  340   |    OH    |      -4       |      ?      |  *2   | startup=5 flash=43 startup=6 active=4 air=6 active=4 air=3 land=14 ; inv=1-51    |
|           Low :icon{name="^K"}           |   90   |   Low    |      -12      |     KD      |  *3   | startup=5 flash=41 startup=16 active=9 recovery=20 ; inv=1-47                    |
| :icon{name="_MAX"} Low :icon{name="^K"}  |  180   | Low, mid |      -5       |     HKD     |  *3   | startup=5 flash=43 startup=14 active=9 recovery=7 active=8 recovery=14 ; inv=1-51 |

- OH = Overhead
- KD = Knockdown (no air recovery)
- HKD = Hard knockdown

\*1 = A two-kick hop; if the second kick hits, a third follows. Block advantage and the bar are without it.
\*2 = The hop's kicks, a 9-hit rush and a throw finish (40). The rush ends in a throw, so its hit advantage isn't a stun count.
\*3 = The follow-up button held from the start, so the earliest version.
Cammy mode.
:::

:::framechartable[Psycho Streak :icon{name="_D"}:icon{name="_DF"}:icon{name="_F"}:icon{name="_D"}:icon{name="_DF"}:icon{name="_F"}:icon{name="^P"}]
|      Version       | Damage | Block<br>Stun | Hit<br>Stun | Notes | Frame Data                                          |
| :----------------: | :----: | :-----------: | :---------: | :---: | --------------------------------------------------- |
|  :icon{name="^P"}  |  180   |      -36      |     KD      |  *1   | startup=5 flash=41 startup=7 recovery=62 ; inv=1-48 |
| :icon{name="_MAX"} |  275   |      -7       |     KD      |  *1   | startup=5 flash=43 startup=5 recovery=43 ; inv=1-51 |

- KD = Knockdown (no air recovery)

\*1 = A projectile (3 hits, 5 on MAX). Startup is when it reaches a point-blank opponent; it travels on while she recovers.
Doll mode.
:::

:::framechartable[Killer Bee Assault :icon{name="_D"}:icon{name="_DB"}:icon{name="_B"}:icon{name="_D"}:icon{name="_DB"}:icon{name="_B"}:icon{name="^2P"}]
|      Version      | Damage | Block<br>Stun | Hit<br>Stun | Notes | Frame Data                                              |
| :---------------: | :----: | :-----------: | :---------: | :---: | ------------------------------------------------------- |
| :icon{name="^2P"} |   ?    |      -35      |      ?      |  *1   | startup=29 flash=45 active=5 air=34 land=10 ; inv=27-72 |

\*1 = Level 3. She jumps until she's near the top of the screen, then the flash and the dive, so the numbers assume a stage floor at screen height 220. The rush that follows a hit bounces off the screen edges: its damage depends on the stage.
:::
