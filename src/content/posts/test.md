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

:::framechart{max=80 legend="right"}
:icon{name="^X"} | startup=3 active=18 recovery=5 | inv=4-15 | mark=Landing@air
:::

:::framechart{max=120 caption="Multi-hit levels" legend="false"}
LV1 | startup=1-3,16-27 active=4-15,28-57 air=58-75 land=76-81 | inv=1-25 | mark=着地@air
LV2 | startup=1-3,16-27 active=4-15,28-59 air=60-81 land=82-87 | inv=1-58 | mark=着地@air
LV3 | startup=1-3,14-23,36-47 active=4-13,24-35 air=48-77 land=78-83 | inv=1-72 | mark=着地@air
:::

:::frametable{caption="Standing normals"}
| Move |  Damage | Chain<br>Cancel | Special<br>Cancel | Super<br>Cancel | Meter on <br> Whiff/Hit | Block<br>Stun | Hit<br>Stun | Counter<br>Hit Stun | Frame Data |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|
| :icon{name="_CLOSE"} :icon{name="^LP"} | 6 | ○ | ○ | ○ | 0/1 | +3 | +4 | +9 | startup=3 active=9 recovery=10 |
| :icon{name="_CLOSE"} :icon{name="^MP"} | 13 | ○ | ○ | ○ | 0/1 | +3 | -4 | -9 |  startup=4 active=5 recovery=24 |
| :icon{name="_CLOSE"} :icon{name="^HP"} | 9+8 | ○ | ○ | ○ | 0/1 | +3 | -4 | +9 |  startup=5 active=6-11,12-18 recovery=27 ; inv=1-4 |
| :icon{name="_FAR"} :icon{name="^MK"} | 9 | ○ | ○ | ○ | 0/1 | +3 | +4 | +9 |  startup=10 active=3 recovery=21 |
| :icon{name="_CROUCH"} :icon{name="^HK"} | 14 | × | ○ | ○ | 0/1 | +3 | +4 | +9 |  startup=8 active=13 recovery=25 |
:::
