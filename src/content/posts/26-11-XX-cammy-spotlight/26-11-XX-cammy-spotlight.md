---
title: 'Spotlight: Cammy by PotS'
published: 2026-11-01
description: 'About time I really dive deep into a PotS character...'
image: ''
tags: [Character, Karma, Spotlight]
category: 'Spotlight: Character'
draft: false 
lang: ''
---


| Creation Spotlight Information |                                                                                |                 |                              |
| ------------------------------ | ------------------------------------------------------------------------------ | --------------- | ---------------------------- |
| `creation`                     | Cammy                                                                          | `author`        | Phantom of the Server (PotS) |
| `creation type`                | Character                                                                      | `compatibility` | Ikemen GO 1.0                |
| `download link`                | [PotS's Webpage](https://network.mugenguild.com/pots/index.html)               | `latest update` | 2026                         |
| `discord or forum link`        | [Discord](https://discord.com/channels/233345562261323776/1514866752717062245) | `my thoughts`   |                              |

In the Mugen and Ikemen community, PotS requires no introduction - an entire subgenre of character creation is named after him and it is arguably the most popular style of character creation in the community. 
After a short hiatus, PotS came back to the community around COVID.
Like many others (myself included), COVID reconnected people with their old hobbies and for PotS that meant embracing the Ikemen GO community and driving engine development forward with his many contributions.
Along the way, PotS has maintained and updated his characters.
While his Cammy is not his most recognizable creation, it is my favorite by a long shot.
Join me as we dive into this character creation and really put apart what makes this Cammy, and the PotS gameplay system tick.

### About Cammy
Cammy made her Super Street Fighter II, which was my first real foray into a Street Fighter title..
She was one of four new fighters added in that version, alongside Fei Long, T. Hawk and Dee Jay.
She later appeared in Street Fighter Alpha 2 Gold, then Alpha 3, where she plays as her younger “Killer Bee” self.
These are the sprites PotS used for his Cammy interpretation.

M. Bison’s Shadaloo created Cammy through genetic engineering. 
She was grown as a possible spare body for Bison and conditioned as an assassin under the codename Killer Bee. 
She was one of the “Shadaloo Dolls,” his group of brainwashed female agents.
In the SFA3 era, she starts to break free of Bison’s control, partly through meeting other fighters who show her kindness. 
When Shadaloo’s Psycho Drive is destroyed, she loses her memory.

I mention all of this because interestingly PotS's Cammy has two modes - Cammy proper, and "Doll Mode" which is inspired by Juni and Juli from SFA3.
I'll cover both in-depth in this spotlight.

### Gameplay Systems Overview
As I stated in my spotlight for Karma's Gouken, PotS style isn't about balance, it's about allowing the user access to whatever systems they enjoy, and in a way that is one of the truest tenets of the Mugen community.
While PotS style could be seen as lacking cohesion, in reality it includes features that allows a hot topic in the FGC at the moment: player expression.
Of course, Mugen/Ikemen isn't played competitively, but the systems in PotS' characters are balanced in such a way that none of them are mandatory for a character to be played effectively.
And perhaps most importantly, the balance that has been reached over the many years of iteration results in a fun, expressive collection of systems that is many things at once, yet its own thing all the same; especially if you care to dig deep enough.

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


Gouken is a six-button character and has similar gameplay to his SSF4 incarnation, but supercharged by the gameplay systems afforded to him through PotS style.
Short Hop and Super Short Hop are extremely strong and allow Gouken to make use of his strong air attacks like :icon{name="_AIR"}:icon{name="^HK"}.
The Parry options are strong, but some might feel they are in tension with his counter move specials.
The Zero Counter (:icon{name="_QBD"}:icon{name="_++"}:icon{name="^P"} or :icon{name="^K"}) options are quite good and can get an enemy off your back with reasonable confidence you won't be hit out of the counter attack.

In SSF4, Gouken struggled when he was on the defensive, particularly in wake-up.
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
| `MAX Cancels`      | Some Level 1 Supers can be cancelled into MAX (Level 2) Supers.                                                                                                                                                                                                                              |
| `Custom Combos`    | Activating Custom allows all moves to be cancelled, removes limitations on the juggle system, and gives a short invulnerability window at the start. Additionally, when Gouken flashes towards the end of the Custom, Gouken can use an EX Special or Level 1 Super to end the Custom Combo. |
:::

And just like in SF4, this version of Gouken shines when he is on the offensive.
Gouken's EX Specials are incredibly important to his gameplay and they will be covered later.
With just one power bar he can output obscene damage if he lands a Standing or Crouching Fierce.
Gouken has the ability to cancel Level 1 Supers into Level 2 Supers, a reverse of CVS2's C-Groove mechanic. 
For Gouken, this isn't a useful gameplay system as his supers don't really work well together, and you're better off using your meter for a Level 3 or simply using EX Specials.
Finally, Custom Combos - these can be quite strong.
The main reason to use these is for the invulnerability window.
You can't use the CC activation to blow up an opponent like in SFA2, this implementation is closer to the A-Groove Customs but they are capped to one power bar, which makes them a bit less risky (and less potent).

<video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px">
    <source src="/posts/25-11-13-gouken-spotlight/goukenblender-16by9.webm" type="video/webm">
    Sorry, video not supported.
</video>

### Movelist

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
|                             Move                             | Mode  | Damage | Block<br>Stun | Hit<br>Stun | Notes | Frame Data                                          |
| :----------------------------------------------------------: | :---: | :----: | :-----------: | :---------: | :---: | --------------------------------------------------- |
| Knee Bullet :icon{name="_F"}:icon{name="_+"}:icon{name="^C"} |   C   | 40+40  |      +2       |     +4      |   -   | startup=13 active=2 recovery=6 active=2 recovery=13 |
| Falling Arc :icon{name="_F"}:icon{name="_+"}:icon{name="^B"} |   D   | 50+30  |      +2       |     +4      |  OH   | startup=22 active=4 recovery=10                     |

- C = Cammy mode (palettes 1-6)
- D = Doll mode (palettes 7-12)
- OH = Overhead

Both also work with back instead of forward. Neither cancels into anything.
:::

#### Movelist Highlights

:::div{class="md-table-move" style="--col1:85%; --col2:15%;"}
| Standing Light Punch, Far Standing Light Kick                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |                                                                                                                                                               :icon{name="^LP"}, :icon{name="_FAR"}:icon{name="^LK"} |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Gouken's normals are definitely a mixed bag. His Standing Light attacks can chain into themselves. Unlike in SF4, Gouken can actually capitalize on this to use it as a hit confirm, but you need to be quick. :icon{name="^LP"}, :icon{name="^LP"}, :icon{name="^LP"}, :icon{name="_FAR"}:icon{name="^LK"} can be cancelled into light Tatsu, while :icon{name="^LP"}, :icon{name="^LP"}, :icon{name="_FAR"}:icon{name="^LK"} can be cancelled into Senkugoshoha, leading to big damage potential. Gouken's Crouching Light Punch is now 3f, addressing one of his big weaknesses in neutral, but his Crouching Light Kick is still not super useful. | <video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px"><source src="/posts/25-11-13-gouken-spotlight/chainlights-2by3.webm" type="video/webm">Sorry, video not supported.</video> |
:::

:::div{class="md-table-move" style="--col1:25%; --col2:75%;"}
| Crouching Heavy Punch                                                                                                                                                                                        |                                                                                                                                                                                                                                                                                                                                                                                                                                                                      :icon{name="_D"}:icon{name="_++"}:icon{name="^HP"} |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px"><source src="/posts/25-11-13-gouken-spotlight/chp-3by2.webm" type="video/webm">Sorry, video not supported.</video> | In SF4 this was one of Gouken's strongest normals. In SF4 it was a 6f normal that dealt heavy damage and also led to strong follow-on damage. That holds true in this implementation, either as a follow-up to a jump-in or as a ground punish that can lead to a strong combo. It's now a 5f normal that deals great damage and can actually be linked after Gohadoken, or used as a ground starter as a relatively safe punish. It's unsafe on block but you can follow it up with a Light Gohadoken to make it safe. |
:::

:::div{class="md-table-move" style="--col1:59%; --col2:26%; --col3:15%"}
| Senkugoshoha                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |                                                                                                                                                                                                                  |                                                                                                                                                                :icon{name="_DSF"}:icon{name="_++"}:icon{name="^P"} |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Increasing punch strengths result in greater travel distance and hit delay. For that reason you'll typically combo into the Light or EX versions. The Medium, Heavy and EX versions all have an afterimage - Gouken can pass through projectiles while the afterimage is active. The EX version is a primary source of damage for Gouken. Mid-screen, Gouken can combo into his Tatsu or go for a reset, while in the corner it leads to big damage - Karma gave Senkugoshoha more utility than in SF4! | <video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px"><source src="/posts/25-11-13-gouken-spotlight/sengoFB-3by2.webm" type="video/webm">Sorry, video not supported.</video> | <video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px"><source src="/posts/25-11-13-gouken-spotlight/Corner2EX-2by3.webm" type="video/webm">Sorry, video not supported.</video> |
:::

:::div{class="md-table-move" style="--col1:25%; --col2:75%;"}
| Kyakkishu                                                                                                                                                                                                               |                                                                                                                                                                                                                                                                                                                                                                                                                                    :icon{name="_DSF"}:icon{name="_++"}:icon{name="^K"} |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px"><source src="/posts/25-11-13-gouken-spotlight/goukenblender-16by9.webm" type="video/webm">Sorry, video not supported.</video> | Also known as the Demon Flip, this special has four follow-ups: press nothing to get a sweep (unsafe on block), press :icon{name="^P"} to turn it into an empty jump, press :icon{name="^K"} to do a diving kick that is positive on block, and finally :icon{name="^2K"} or :icon{name="^2P"} when near to get a grab. This special allows Gouken to really keep up the pressure in the corner when used effectively. The EX version has some tracking but frankly I wouldn't bother. |
:::

:::div{class="md-table-move" style="--col1:50%; --col2:25%; --col3:25%"}
| Kongoshin                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |                                                                                                                                                                                                                  |                                                                                                                                                                  :icon{name="_DSB"}:icon{name="_++"}:icon{name="^P"} |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| You might think Kongoshin is a redundant option for a character that has access to parries AND Zero Counter, but Kongoshin is a very interesting move. The counter window is a lot more forgiving than the parry window and it doesn't require meter. It deals good damage and is a decent option against characters that primarily rely on single hit moves. Beware, the counter will fail against counter hit moves. Interestingly, Kongoshin can be super cancelled out of, so if your reads are really good you can actually get a ton of damage out of this. | <video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px"><source src="/posts/25-11-13-gouken-spotlight/counter-1by1.webm" type="video/webm">Sorry, video not supported.</video> | <video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px"><source src="/posts/25-11-13-gouken-spotlight/counterfail-1by1.webm" type="video/webm">Sorry, video not supported.</video> |
:::

:::div{class="md-table-move" style="--col1:27%; --col2:73%;"}
| Shinku Tatsumaki Senpukyaku                                                                                                                                                                                          |                                                                                                                                                                                                                                                                                                                                                                                                                                                              :icon{name="_QCB"}:icon{name="_QCB"}:icon{name="_++"}:icon{name="^K"} |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| <video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px"><source src="/posts/25-11-13-gouken-spotlight/shinkutatsu-3by2.webm" type="video/webm">Sorry, video not supported.</video> | Gouken has several supers at his disposal but Shinku Tatsumaki Senpukyaku stands out. While Kinjite Shoryuken can be a good reversal super, its damage is lower than Shinku Tatsumaki Senpukyaku. This super has great damage potential and combos well off Tatsumaki Gorasen. Generally you're better off saving your meter for EX moves or Shin Shoryuken, but if you need damage now, this is your best option. The MAX version (with :icon{name="^2K"}) is also very strong and the ender to one of Gouken's strongest combos. |
:::

:::div{class="md-table-move" style="--col1:60%; --col2:40%;"}
| Shin Shoryuken                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |                                                                                                                                                   :icon{name="_QCF"}:icon{name="_QCF"}:icon{name="_++"}:icon{name="^2K"} |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| Karma did an amazing job of bringing Gouken's iconic Ultra to life in Mugen. This move deals a TON of damage, especially if you land the first hit deep. The classic setup off Amaoroshi (:icon{name="_NEAR"}:icon{name="_F"} or :icon{name="_B"}:icon{name="_++"}:icon{name="^2K"}) is still the preferred way of landing this super due to reduced scaling, but you can cancel specials into this as well. If you get the toss, wait for them to come back down to get the first hit deep. Just like in SF4, if you don't land that first hit deep you get a weaker version of the super that does substantially less damage. If you're a Gouken player, you live to land this super. | <video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px"><source src="/posts/25-11-13-gouken-spotlight/ShinShoryuToss-16by9.webm" type="video/webm">Sorry, video not supported.</video> |
:::

### Trials
As a way of giving back, every character creation spotlight on my website will be accompanied by a Trials definition file to be used with the [Ikemen GO Trials Mode module](https://github.com/two4teezee/Ikemen-GO-Trials-Mode).
I'll do this no matter how new or old the character I'm spotlighting is. 
Gouken hits like a truck and his combos aren't too difficult to pull off, but he has some pretty advanced stuff - check out that last combo!
If you want to give it Trials Mode a go with Karma's Gouken, take a look [here](https://github.com/two4teezee/Ikemen-GO-Sample-Trials-Definition-Files).
You can watch me struggle through Tung's Trials (that I created, mind you) below.

<iframe width="100%" height="450" src="https://www.youtube.com/embed/LqEtLRi0CrE?si=05seC2XISFfgmIiT" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

### Final Thoughts
Despite Gouken being a weak character in SF4, he is one of my all-time favorite Street Fighter roster entries.
This creation pays homage to a fighting game character in ways few other Mugen creations have.
The sprite work is incredible, the gameplay systems are awesome, the input system is on point, and the overall attention to detail is simply unmatched.
This is easily one of my favorite Mugen creations of all time.

There isn't much more to say.
If you run PotS-style characters in your roster and you don't have Gouken in it... you should change that.