---
title: 'Release: Ikemen GO Trials Mode v0.99.4'
published: 2025-09-19
description: 'Introduces the "or" operand for animno and stateno.'
image: 'ryu_question.webp'
tags: [Trials Mode, Ikemen GO, Module]
category: 'Release'
draft: false 
lang: ''
---

This small but important update introduces the "or" operand for `animno` and `stateno` to Trials Mode.
This allows a user to define trial steps that have multiple valid state or animation values.
This is especially handy for a trial step that uses a special move that the creator might have implemented with different state numbers for different strengths, for instance.
An example is provided below:

```def
[TrialDef, KFM Kung Fu Palm]
; In this trial, we use the "or" operand, specified by using the | character, to let the user specify multiple different stateno or animno for which the trialstep or microstep is valid.

trialstep.1.text = Kung Fu Palm
trialstep.1.glyphs = _QDF^P
trialstep.1.stateno = 1000|1010
```

::github{repo="two4teezee/Ikemen-GO-Trials-Mode"}