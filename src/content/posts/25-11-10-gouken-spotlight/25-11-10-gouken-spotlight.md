---
title: 'Spotlight: Gouken by KarmaCharmeleon'
published: 2025-11-13
description: 'An awesome rendition of Gouken.'
image: './gouken-idle.webp'
tags: [Character, Karma, Spotlight]
category: 'Spotlight: Character'
draft: true 
lang: ''
---


| Creation Spotlight Information |                                                                     |                 |                           |
| ------------------------------ | ------------------------------------------------------------------- | --------------- | ------------------------- |
| `creation`                     | Gouken                                                              | `author`        | KarmaCharmeleon           |
| `creation type`                | Character                                                           | `compatibility` | Mugne 1.0/1.1 + Ikemen GO |
| `download link`                | [Karma's MediaFire](https://www.mediafire.com/folder/f4qxixm5h39cu) | `latest update` | 07 July 2024              |
| `discord or forum link`        | Unknown                                                             | `my thoughts`   | 👴🏻 = ❤️❤️❤️      |

KarmaCharmeleon is a relatively new creator in the Mugen scene but has managed to be very prolific.
Karma's creation are in the "PotS style", which I'm somewhat partial to - more on that later.
In SF4, Gouken was my main. I liked his playstyle, even if he was a low tier character.
Of all of Karma's creations to date, this is my favorite.
The combination of systems, the exquisite sprite work of benhazard and C.V.S.N.B., a great buffering system, and Karma's attention to detail really come together in this one.

### About Gouken
The Gouken lore runs deep.
He is Akuma's younger brother, and they were both Goutetsu's pupils.
Gouken and Akuma went down different paths, with Akuma embracing Satsui no Hado, while Gouken practiced the Power of Nothingness.
Gouken took Dan Hibiki as his first pupil but soon thereafter rejected him because Dan was driven by revenge.
Later, Gouken took on Ryu and Ken - the rest is more or less Street Fighter history.

Gouken only appeared as a playable character in the Street Fighter 4 series. 
Karma certainly deserves a lot of credit for the solid adaptation, but I want to highlight the amazing sprite work of [benhazard](https://www.deviantart.com/benhazard/gallery?deviationid=446000671#content) - see MFG thread [here](https://mugenguild.com/forum/topics/benhazard-wip-projects-and-other-stuff-191179.0.html) - and [C.V.S.N.B.](https://www.deviantart.com/cvsnb).
It is their incredible work that brings Gouken to life in ways few original Mugen creations have.

### Gameplay Systems Overview
Most of KarmaChameleon's characters, to include Gouken, are in the "PotS style" which (in the Mugen community) is a popular collection of gameplay systems loosely pulled from CvS2.
I typically favor more limited and coherent gameplay systems that drive interesting gameplay decisions, but PotS style isn't about balance, it's about allowing the user access to whatever systems they enjoy, and in a way that is one of the truest tenets of the Mugen community.
That said, there is no denying that PotS, JMorphman and many others like Karma have honed this style to a point where it is compelling and fun.

:::div{class="md-table-movelist"}
| Gameplay Systems Overview       |                                                                          |                                                             |
| ------------------------------- | ------------------------------------------------------------------------ | ----------------------------------------------------------- |
| `Light Punch`                   | :icon{name="^X"}                                                         |                                                             |
| `Medium Punch`                  | :icon{name="^Y"}                                                         |                                                             |
| `Heavy Punch`                   | :icon{name="^Z"}                                                         |                                                             |
| `Light Kick`                    | :icon{name="^A"}                                                         |                                                             |
| `Medium Kick`                   | :icon{name="^B"}                                                         |                                                             |
| `Heavy Kick`                    | :icon{name="^C"}                                                         |                                                             |
| `Forward Dash`                  | :icon{name="_XFF"}                                                       | Like C, A, P-Grooves                                        |
| `Run`                           | :icon{name="_XFF"}:icon{name="_HOLD"}                                    | Like S, N, K-Grooves                                        |
| `Backdash`                      | :icon{name="_XBB"}                                                       |                                                             |
| `Short Hop`                     | :icon{name="_TAP"}:icon{name="_U"}                                       | Like S, N, K-Grooves                                        |
| `Super Jump`                    | :icon{name="_TAP"}:icon{name="_D"}:icon{name="_U"}                       |                                                             |
| `Super Short Hop`               | :icon{name="_TAP"}:icon{name="_D"}:icon{name="_TAP"}:icon{name="_U"}     |                                                             |
| `Dodge`                         | :icon{name="^LP"}:icon{name="_++"}:icon{name="^LK"}                      | Like S-Groove                                               |
| :icon{name="_!"} `Dodge Attack` | :icon{name="_!"}:icon{name="^P"} or :icon{name="^K"}                     | Like S-Groove                                               |
| `Forward Roll`                  | :icon{name="_F"}:icon{name="_++"}:icon{name="^LP"} or :icon{name="^LK"}  |                                                             |
| `Backward Roll`                 | :icon{name="_B"}:icon{name="_++"}:icon{name="^LP"} or :icon{name="^LK"}  |                                                             |
| `Parry`                         | :icon{name="_F"}                                                         | Within 4 frames of being hit, like P-Groove                 |
| `Low Parry`                     | :icon{name="_D"}                                                         | Within 4 frames of being hit, like P-Groove                 |
| `Air Parry`                     | :icon{name="_AIR"}:icon{name="_F"}                                       | Within 4 frames of being hit, like P-Groove                 |
| `Power Charge`                  | :icon{name="_HOLD"}:icon{name="^MP"}:icon{name="_++"}:icon{name="^MK"}   | Like K-Groove                                               |
| `Zero Counter`                  | :icon{name="_QBD"}:icon{name="_++"}:icon{name="^P"} or :icon{name="^K"}  | Like C-Groove                                               |
| `Custom Combo`                  | :icon{name="^HP"}:icon{name="_++"}:icon{name="^HK"}                      | Like A-Groove, can be triggered on the ground or in the air |
| `Fall Recovery`                 | :icon{name="^2P"} or :icon{name="^LP"}:icon{name="_++"}:icon{name="^LK"} |                                                             |
:::

<table style="margin:0;display:block;">
    <tr>
        <td style="width=28.5%">
            <video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px">
                <source src="/posts/25-11-13-gouken-spotlight/parrytothrow-2by3.webm" type="video/webm"> Sorry, video not supported.
            </video>
        </td>
        <td style="width=28.5%">
            <video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px">
                <source src="/posts/25-11-13-gouken-spotlight/zerocounter-2by3.webm" type="video/webm"> Sorry, video not supported.
            </video>
        </td>
        <td style="width=43%">
            <video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px">
                <source src="/posts/25-11-13-gouken-spotlight/shorthop-3by2.webm" type="video/webm"> Sorry, video not supported.
            </video>
        </td>
    </tr>
    <tr>
        <td colspan="3">
            <p style="color:gray; font-style:italic; margin:0px; justify-self:center">Examples of Parry, Zero Counter and Short Hop mechanics.</p>
        </td>
    </tr>
</table>

Gouken is a six-button character and has similar gameplay to his SSF4 incarnation, but supercharged by the gameplay systems afforded to him through PotS style.
Short Hop and Super Short Hop are extremely strong and allow Gouken to make use of his strong air attacks like :icon{name="_AIR"}:icon{name="^HK"}.
The Parry options are strong, but are in tension with his counter move specials.
The Zero Counter (:icon{name="_QBD"}:icon{name="_++"}:icon{name="^P"} or :icon{name="^K"}) options are quite good and can get an enemy off your back with reasonable confidence you won't be hit out of the counter attack.

In SSF4, Gouken struggled when he was on the defensive.
He had poor anti-air options, and Focus Attacks (nearly every single one in the game) were a problem for him.
This version of Gouken still has very poor anti-air - your options are risky at best.
Tatsumaki Gorasen (:icon{name="_QCB"}:icon{name="_++"}:icon{name="^K"}) is available but if you miss, you'll be in trouble.
The hitbox on the EX version isn't much more forgiving.
Otherwise, you have access to Standing Medium Kick, Crouching Heavy Punch, and Kongoshin (:icon{name="_DCB"}:icon{name="_++"}:icon{name="^P"}), all of which have clear disadvantages.
In light of this, Gouken's PotS-provided Forward and Backward Rolls are really useful as options to disengage when pressured.

<table style="margin:0;display:block;">
    <tr>
        <td style="width=50%">
            <video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px">
                <source src="/posts/25-11-13-gouken-spotlight/counterairtatsu-16by9.webm" type="video/webm"> Sorry, video not supported.
            </video>
        </td>
        <td style="width=50%">
            <video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px">
                <source src="/posts/25-11-13-gouken-spotlight/stmkaa-16by9.webm" type="video/webm"> Sorry, video not supported.
            </video>
        </td>
    </tr>
    <tr>
        <td colspan="3">
            <p style="color:gray; font-style:italic; margin:0px; justify-self:center">Gouken continues to struggle when pressured due to poor anti-air but he has some options.</p>
        </td>
    </tr>
</table>

:::div{class="md-table-move" style="--col1:20%; --col2:80%;"}
| Other System Notes |                                                                                                                                                                                                                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EX Specials`      | Gouken can spend half a power bar to execute an EX version of the special. Gouken have several notable EX Specials that unnlock significant damage potential.                                                                                                                                |
| `Special Cancels`  | All of Gouken's Special moves can be cancelled into super moves if meter is available.                                                                                                                                                                                                       |
| `MAX Cancels`      | Some Level 1 Supers can be cancelled into MAX (Level 2) Supers.                                                                                                                                                                                                                                        |
| `Custom Combos`    | Activating Custom allows all moves to be cancelled, removes limitations on the juggle system, and gives a short invulnerability window at the start. Additionally, when Gouken flashes towards the end of the Custom, Gouken can use an EX Special or Level 1 Super to end the Custom Combo. |
:::

And just like in SSF4, this version of Gouken shines when he is on the offensive.
Gouken's EX Specials are incredibly important to his gameplay and they will be covered later.
With just one power bar he can output obscene damage if he lands a Standing or Crouching Fierce.
Gouken has the ability to cancel Level 1 Supers into Level 2 Supers, a reverse of CVS2's C-Groove mechanic. 
For Gouken, this isn't a useful gameplay system as his supers don't really work well together, and you're better off using your meter for a Level 3 or simply using EX Specials.
Finally, Custom Combos - these can be quite strong.
The main reason to use these is for the invulnerability window.
You can't use the CC activation to blow up an opponent like in SFA2, this implementation is closer to the A-Groove Customs but they are capped to one power bar, which makes them a bit less risky (and less potent).

<video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px">
    <source src="/posts/25-11-13-gouken-spotlight/crossup-16by9.webm" type="video/webm">
    Sorry, video not supported.
</video>

### Movelist

:::div{class="md-table-movelist"}
| Movelist Overview                 |                                                                                           |                                                                                             |
| --------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **Command Normals**               |                                                                                           |                                                                                             |
| `Sakotsu Wari`                    | :icon{name="_F"}:icon{name="_++"}:icon{name="^MP"}                                        | Overhead attack.                                                                            |
| `Tenmakujinkyaku`                 | :icon{name="_AIR"}:icon{name="_DF"}:icon{name="_++"}:icon{name="^MK"}                     |                                                                                             |
| `Raikotokyaku`                    | :icon{name="_NEAR"}:icon{name="_F"} or :icon{name="_B"}:icon{name="_++"}:icon{name="^2P"} | Punch throw is good for pushing into corner. However...                                     |
| `Amaoroshi`                       | :icon{name="_NEAR"}:icon{name="_F"} or :icon{name="_B"}:icon{name="_++"}:icon{name="^2K"} | This often will be your preferred option as you can reliably land Shin Shoryuken from here. |
| **Special Moves**                 |                                                                                           |                                                                                             |
| `Gohadoken`                       | :icon{name="_QCF"}:icon{name="_++"}:icon{name="^P"}                                       | :icon{name="_EX"} available; can be charged for a two-hit fireball                          |
| `Senkugoshoha`                    | :icon{name="_DSF"}:icon{name="_++"}:icon{name="^P"}                                       | :icon{name="_EX"} available                                                                 |
| `Tatsumaki Gorasen`               | :icon{name="_QCB"}:icon{name="_++"}:icon{name="^K"}                                       | :icon{name="_EX"} available                                                                 |
| `Tatsumaki Senpukyaku`            | :icon{name="_AIR"}:icon{name="_QCB"}:icon{name="_++"}:icon{name="^K"}                     | :icon{name="_EX"} available                                                                 |
| `Kyakkishu`                       | :icon{name="_DSF"}:icon{name="_++"}:icon{name="^K"}                                       | :icon{name="_EX"} available                                                                 |
| :icon{name="_!"}`Hyakki Gozan`    | :icon{name="_!"}                                                                          |                                                                                             |
| :icon{name="_!"}`Hyakki Goheki`   | :icon{name="_!"}:icon{name="^P"}                                                          |                                                                                             |
| :icon{name="_!"}`Hyakki Gojin`    | :icon{name="_!"}:icon{name="^K"}                                                          |                                                                                             |
| :icon{name="_!"}`Hyakki Gosai`    | :icon{name="_!"}:icon{name="_NEAR"}:icon{name="^2P"} or :icon{name="^2K"}                 |                                                                                             |
| `Kongoshin`                       | :icon{name="_DSB"}:icon{name="_++"}:icon{name="^P"}                                       | :icon{name="_EX"} available                                                                 |
| **Super Moves**                   |                                                                                           |                                                                                             |
| `Kinjite Shoryuken`               | :icon{name="_QCF"}:icon{name="_QCF"}:icon{name="_++"}:icon{name="^P"}                     | Costs 1 Power Bar                                                                           |
| `Shinku Tatsumaki Senpukyaku`     | :icon{name="_QCB"}:icon{name="_QCB"}:icon{name="_++"}:icon{name="^K"}                     | Costs 1 Power Bar                                                                           |
| `MAX Kinjite Shoryuken`           | :icon{name="_QCF"}:icon{name="_QCF"}:icon{name="_++"}:icon{name="^2P"}                    | Costs 2 Power Bar                                                                           |
| `MAX Shinku Tatsumaki Senpukyaku` | :icon{name="_QCB"}:icon{name="_QCB"}:icon{name="_++"}:icon{name="^2K"}                    | Costs 2 Power Bar                                                                           |
| `Shin Shoryuken`                  | :icon{name="_QCF"}:icon{name="_QCF"}:icon{name="_++"}:icon{name="^2K"}                    | Costs 3 Power Bar                                                                           |
| `Denjin Hadoken`                  | :icon{name="_QCB"}:icon{name="_QCB"}:icon{name="_++"}:icon{name="^2P"}                    | Costs 3 Power Bar, can be charged                                                           |
:::

#### Movelist Highlights

:::div{class="md-table-move" style="--col1:75%; --col2:25%;"}
| Crouching Heavy Kick | :icon{name="_D"}:icon{name="_++"}:icon{name="^HK"}|
|--|--:|
| In line with Gouken's SF4 strengths, his Crouching Heavy Kick is actually a very strong move. It is relatively safe on block when spaced properly, and it is the best indicator of Gouken's preferred range in neutral. He typically wants to be practically glued to his opponent, and Gouken can use his sweep as a tool to set the right spacing. | <video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px"><source src="/posts/25-09-02-ryo2005-tung-fu-rue/c.lk-1by1.webm" type="video/webm">Sorry, video not supported.</video> |
:::