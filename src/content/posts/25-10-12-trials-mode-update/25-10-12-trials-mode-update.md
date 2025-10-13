---
title: 'Release: Ikemen GO Trials Mode v0.99.5'
published: 2025-10-12
description: 'Multiple new features and bug fixes'
image: '0995.webp'
tags: [Trials Mode, Ikemen GO, Module]
category: 'Release'
draft: false 
lang: ''
---
::github{repo="two4teezee/Ikemen-GO-Trials-Mode"}

This is one of the more important updates since the initial release.
Version 0.99.5 introduces several new features to make Trials Mode even more feature complete.
Please note that this release is only compatible with Ikemen GO Nightly builds 10/10/25 or newer.
New feature highlights include the following:
- Multi-Language Support: enables multi-language textboxes and trial step text
- `trial.playerlife` and `trial.dummylife`: enables trials with set player and/or dummy life, useful for desperation moves etc.
- `trial.playerpos` and `trial.dummypos`: enables trials positioning, and for the player to reset trials position by hitting d and w simultaneously.
- Multiple bug fixes introduced in previous releases, and through a recent Nightly build release

## Multi-Language Support
### trial.textbox
> Optionally specified field for textbox to be displayed for the trial.
> Textboxes can be toggled on and off in the pause menu, or in the screenpack definition file.
> You can use these textboxes to give the player hints, or teach them about the trial they are performing.
> Note that `trial.textbox` also has multilingual support.
>> trial.textbox = *textbox_text* (string) <br>
>> (optional) trial.textbox.*language_code* = *language_textbox_text* (string) <br>
>
> You can use `\n` inside of *textbox_text* to have a line return in the text box.
> *language_code* uses [ISO 639 language codes](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) such as `en` for English, `ja` for Japanese and `es` for Spanish.
> If a language is specified in the config for Ikemen GO, or if the language is changed through the Options Menu, Trials Mode will look for a `trials.textbox.*language_code*` that matches the selected language.
> If a match cannot be found, it will default to `trial.textbox.en`, if found, or `trial.textbox`, if found.

Example:

```ini
[TrialDef, KFM's First Trial]
trial.textbox = 'This is KFM's first trial. Good luck!'
trial.textbox.en = 'This is KFM's first trial. Good luck!'
trial.textbox.es = 'Este es el primer trial de Kung Fu Man. Buena Suerte!`
```

### trialstep.X.text
> Optional field for text to be displayed for the trial step.
> Note that `trialstep.X.text` has optional multilingual support.
>> trialstep.X.text = *trialstep_text* (string) <br>
> trialste.X.text.*language_code* = *trialstep_lang_text* (string) <br>
>
> Only displayed in vertical trials layout.
> *language_code* uses [ISO 639 language codes](https://en.wikipedia.org/wiki/List_of_ISO_639_language_codes) such as `en` for English, `ja` for Japanese and `es` for Spanish.
> If a language is specified in the config for Ikemen GO, or if the language is changed through the Options Menu, Trials Mode will look for a `trialstep.X.text.*language_code*` that matches the selected language.
> If a match cannot be found, it will default to `trialstep.X.text.en`, if found, or `trialstep.X.text`, if found.

Example:

```ini
[TrialDef, Shoryuken]
trialstep.1.text.en = Shoryuken ;English text
trialstep.1.text.ja = 昇龍拳 ;Japanese text
trialstep.1.glyphs = _DSF^P		
trialstep.1.stateno = 1200|1210|1220 ;'OR' operand example
```

## trial.playerlife and trial.dummylife
> Optionally specified field to set the player's and/or dummy's life to a desired value for that trial.
> This is particularly useful for characters that have access to special moves or features with low life totals, or to demonstrate the damage potential of certain combos.
>> trial.playerlife = *player_life_value* (integer)
> trial.dummylife = *dummy_life_value* (integer)
>
> *player_life_value* and *dummy_life_value* are integer values for the life points that should be set.
> This is an absolute value, not a percentage.
> When these optional fields are not specified, player and dummy life are set to their max life values.

Example:

```ini
[TrialDef, KFM's Critical Life Super]
trial.playerlife = 100
trial.dummylife = 250
```

## trial.playerpos and trial.dummypos
> Optionally specified field to set player's and/or dummy's position respective to the stage (and each other) to a desired value for that trial.
> This is particularly useful for trials that have specific conditions for success, such as starting from a corner.
> Note that the player can also hit :icon{name="^D"}:icon{name="_+"}:icon{name="^W"} to reset the trial to the specified position (or back to center stage).
>> trial.playerpos = *player_pos* (string)
> trial.dummypos = *dummy_pos* (string)
>
> Valid values for *player_pos* and *dummy_pos* are `left-corner`, `right-corner`, `far`, `medium`, and `close`.
> One or both of *player_pos* and *dummy_pos* can be specified.
> For instance, setting *dummy_pos* to `far` but not specifying *player_pos* will move the player and dummy to center stage and set them far apart.
> If one of *player_pos* or *dummy_pos* are specified as `left-corner`, `right-corner` but the other is left blank, it will default to `medium`.

Example:

```ini
[TrialDef, Corner Carry Custom Combo]
trial.playerpos = left-corner
trial.dummypos = close

trialstep.1.text = Custom Combo Activation
trialstep.1.glyphs = ^HP_+^HK
trialstep.1.stateno = 760
trialstep.1.hitcount = 0
trialstep.1.validfortickcount = 300
```

<video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px">
    <source src="/posts/25-10-12-trials-mode-update/reposition.webm" type="video/webm">
    Sorry, video not supported.
</video>

## New Options in `system.def`
### trialresetenabled
> Sets whether the user can reset the trial position by hitting the d and w keys simultaneously.
>> trialresetenalbed = *reset_bool* (bool) <br>
>
> *reset_bool* is either `true` or `false`.
> Defaults to `true` when unspecified.
### trialresetreminder
> Sets the string to be displayed to remind the player they can reset trial position with some key input.
>> trialresetreminder.pos = *pos_x, pos_y* (int, int) <br>
>> trialresetreminder.font = *font_no, bank, align, r, g, b* (int, int, int, int, int, int)<br>
>> trialresetreminder.scale = *scale_x, scale_y* (int, int) <br>
>> trialresetreminder.font.height = *font_height* (int)<br>
>> trialresetreminder.text = *trr_string* (string)<br>
>
> Only displayed when `trialresetenabled` is set to `true`.
> Can be left unspecified if not needed.

## Bugfixes
- Fixes a bug where any trial with trialstep.X.hitcount = 0 did not register
- Fixes a box where if one trial.textbox was created, all other trials would have a textbox that said nil.
- Fixes a bug introduced in 10-10-25 Nightly re: localcoord

::github{repo="two4teezee/Ikemen-GO-Trials-Mode"}
