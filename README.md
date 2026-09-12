# two4teezee's Ikemen + Mugen Page
![Node.js >= 20](https://img.shields.io/badge/node.js-%3E%3D20-brightgreen) 
![pnpm >= 9](https://img.shields.io/badge/pnpm-%3E%3D9-blue) 
[![DeepWiki](https://img.shields.io/badge/DeepWiki-saicaca%2Ffuwari-blue.svg?logo=data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAyCAYAAAAnWDnqAAAAAXNSR0IArs4c6QAAA05JREFUaEPtmUtyEzEQhtWTQyQLHNak2AB7ZnyXZMEjXMGeK/AIi+QuHrMnbChYY7MIh8g01fJoopFb0uhhEqqcbWTp06/uv1saEDv4O3n3dV60RfP947Mm9/SQc0ICFQgzfc4CYZoTPAswgSJCCUJUnAAoRHOAUOcATwbmVLWdGoH//PB8mnKqScAhsD0kYP3j/Yt5LPQe2KvcXmGvRHcDnpxfL2zOYJ1mFwrryWTz0advv1Ut4CJgf5uhDuDj5eUcAUoahrdY/56ebRWeraTjMt/00Sh3UDtjgHtQNHwcRGOC98BJEAEymycmYcWwOprTgcB6VZ5JK5TAJ+fXGLBm3FDAmn6oPPjR4rKCAoJCal2eAiQp2x0vxTPB3ALO2CRkwmDy5WohzBDwSEFKRwPbknEggCPB/imwrycgxX2NzoMCHhPkDwqYMr9tRcP5qNrMZHkVnOjRMWwLCcr8ohBVb1OMjxLwGCvjTikrsBOiA6fNyCrm8V1rP93iVPpwaE+gO0SsWmPiXB+jikdf6SizrT5qKasx5j8ABbHpFTx+vFXp9EnYQmLx02h1QTTrl6eDqxLnGjporxl3NL3agEvXdT0WmEost648sQOYAeJS9Q7bfUVoMGnjo4AZdUMQku50McDcMWcBPvr0SzbTAFDfvJqwLzgxwATnCgnp4wDl6Aa+Ax283gghmj+vj7feE2KBBRMW3FzOpLOADl0Isb5587h/U4gGvkt5v60Z1VLG8BhYjbzRwyQZemwAd6cCR5/XFWLYZRIMpX39AR0tjaGGiGzLVyhse5C9RKC6ai42ppWPKiBagOvaYk8lO7DajerabOZP46Lby5wKjw1HCRx7p9sVMOWGzb/vA1hwiWc6jm3MvQDTogQkiqIhJV0nBQBTU+3okKCFDy9WwferkHjtxib7t3xIUQtHxnIwtx4mpg26/HfwVNVDb4oI9RHmx5WGelRVlrtiw43zboCLaxv46AZeB3IlTkwouebTr1y2NjSpHz68WNFjHvupy3q8TFn3Hos2IAk4Ju5dCo8B3wP7VPr/FGaKiG+T+v+TQqIrOqMTL1VdWV1DdmcbO8KXBz6esmYWYKPwDL5b5FA1a0hwapHiom0r/cKaoqr+27/XcrS5UwSMbQAAAABJRU5ErkJggg==)](https://deepwiki.com/saicaca/fuwari)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari.svg?type=shield&issueType=license)](https://app.fossa.com/projects/git%2Bgithub.com%2Fsaicaca%2Ffuwari?ref=badge_shield&issueType=license)


Where I post about random stuff I'm working on, Ikemen or MUGEN stuff I'm checking out, and more.

---

Using the excellent [🍥Fuwari](https://github.com/saicaca/fuwari/) template, a static blog template built with [Astro](https://astro.build).
Augmented by the Portfolio functionality found in [pawarherschel](https://github.com/pawarherschel/personal-website-v5) Fuwari-forked website.

---

## Glyphs

`:icon{name="..."}` drops one of the input glyphs in `public/icons/` inline -
buttons, directions, motions and modifiers - so a command reads the way it looks
on a command list instead of being spelled out in words.

```markdown
`Gohadoken` :icon{name="_QCF"}:icon{name="_++"}:icon{name="^P"}
```

Glyphs butt straight up against each other with no separator; `_++` is the plus
sign that joins a motion to a button. They are inline images, so they work
anywhere markdown does - prose, table cells, headings, and frame-chart labels.

A `name` is a file in `public/icons/` without its extension, and the first
character says which family it belongs to:

| Prefix | Family |
|---|---|
| `^` | Buttons |
| `_` | Directions, motions, modifiers and punctuation |
| `~` | Charge - hold the direction, then release |

### Names

**Buttons** - six-button: `^LP` `^MP` `^HP` `^LK` `^MK` `^HK`. Lettered:
`^X` `^Y` `^Z` `^A` `^B` `^C` `^D` `^W` `^M` `^S`. Grouped: `^P` `^K`
`^2P` `^2K` `^3P` `^3K`. The six-button and lettered names - `^M` and `^S`
aside - each also come in a `press` variant (`^LPpress`) and a `blank` variant
(`^LPblank`); of the grouped ones only `^P` and `^K` have a `press`.

**Directions** - `_U` `_D` `_B` `_F` `_UB` `_UF` `_DB` `_DF`

**Motions** - `_QCF` `_QCB` `_HCF` `_HCB` `_DSF` `_DSB` `_BF` `_DU`,
quarter-circles from the other starts `_QBD` `_QBU` `_QFD` `_QFU` `_QUB` `_QUF`,
half-circles up `_HUB` `_HUF`, full circles `_FDB` `_FDF` `_FUB` `_FUF`, and the
dashes `_XFF` `_XBB`

**Charge** - `~B` `~D` `~F` `~U` `~DB` `~DF` `~UB` `~UF`, plus `~(` `~)` `~=`
`~^`

**Modifiers and markers** - `_AIR` `_AIRalt` `_AIROK` `_CLOSE` `_NEAR` `_FAR`
`_FARalt` `_CR` `_CROUCH` `_CHARGE` `_HOLD` `_RELEASE` `_TAP` `_MASH` `_THROW`
`_THROWalt` `_COUNTER` `_COUNTERalt` `_EX` `_MAX` `_!`

**Punctuation** - `_+` `_++` `_-` `_=` `_.` `_(` `_)` `_^` `` _` ``

The `alt` names are second drawings of the same idea, for when the first one
doesn't sit well next to its neighbours.

### Attributes

| Attribute | Default | Effect |
|---|---|---|
| `name` | - | Glyph in `public/icons/`, without the extension |
| `src` | - | An explicit URL instead of `name`; wins if both are given |
| `ext` | `png` | Extension used with `name` |
| `size` | - | Width and height in px |
| `width` / `w`, `height` / `h` | - | Set one axis; bare numbers are px, anything else passes through as CSS |
| `alt` | `""` | Alt text - glyphs are decorative by default |
| `inline` | `true` | `false` drops the inline-block and baseline alignment |
| `class`, `style` | - | Appended to the image's own |

Glyphs are 20x20 except for fourteen double-width ones (`_AIRalt` `_AIROK`
`_CHARGE` `_CLOSE` `_COUNTER` `_COUNTERalt` `_CROUCH` `_FARalt` `_HOLD` `_MASH`
`_MAX` `_RELEASE` `_THROW` `_THROWalt`), which are 40x20 - so `size` squashes
those and `height` is the one to reach for. With neither `name` nor `src` the
directive renders a hidden note rather than a broken image.

## Frame charts

`:::framechart` draws a stacked frame-data timeline in a post - one bar per
version of a move, on a shared frame scale.

```markdown
:::framechart{max=120 caption="Tornado Kick"}
Light  | startup=3 active=18 air=14 land=5 | inv=15 | mark=Landing@air
Medium | startup=3 active=25 air=21 land=5 | inv=15 | mark=Landing@air
Heavy  | startup=3 active=30 air=26 land=5 | inv=15 | mark=Landing@air
:::
```

Each line is one bar, with `|`-separated fields:

1. **Label** for the row (`Light`, or leave it empty).
2. **The bar** - `phase=frames` tokens drawn left to right in the order written,
   so a move can skip a phase or repeat one.
3. **Anything after that** is either another, thinner track under the bar
   (`inv=15`) or a field of annotations (`mark=Landing@air`).

A phase written as a count (`active=18`) carries on from the one before it.
Written as a range (`inv=6-20`) it pins itself to those frames instead - inclusive
and 1-based - which is how a window that opens partway through a move gets
placed:

```markdown
:::framechart{caption="Shoryuken"}
Light | startup=3 active=14 recovery=22 | inv=1-5
Heavy | startup=3 active=16 recovery=30 | inv=4-12
:::
```

Ranges work on the main bar too (`startup=1-3 active=4-21`), so frame data can
be transcribed as spans rather than durations. A phase can take a
comma-separated list of them, which is how a move that hits, recovers and hits
again is written - each window keeps its own place on the bar:

```markdown
:::framechart{max=120 caption="Multi-hit levels"}
LV1 | startup=1-3,16-27 active=4-15,28-57 air=58-75 land=76-81 | inv=1-25
LV2 | startup=1-3,16-27 active=4-15,28-59 air=60-81 land=82-87 | inv=1-58
:::
```

The number drawn on each segment is its length, so the bar above reads
3, 12, 12, 30, 18, 6. A comma only continues a phase's list when a number
follows it, so `inv=1-9,armor=10-20` still reads as two separate phases. A track's own scale grows to fit
whatever a range reaches, and a segment with nothing touching its edges is
rounded on both ends rather than sitting square against a baseline it doesn't
start from.

A `mark` is `label@where`, where `where` is either a frame number
(`mark=Whiff@36`) or the name of a phase, meaning the frame that phase ends on
(`mark=Landing@air`). Several marks go in one field, comma-separated.

### Glyphs in labels

A row label takes the site's glyph directive, so a bar can be labelled with the
button that performs it:

```markdown
:::framechart[:icon{name="^X"} Shoryuken]
:icon{name="^LP"} | startup=3 active=14 recovery=22 | inv=1-5
:icon{name="^HP"} | startup=3 active=16 recovery=30 | inv=4-12
:::
```

Glyphs and words mix freely - `:icon{name="_BF"}:icon{name="^X"} far` - and the
same works in a `:::framechart[...]` caption. Glyphs are drawn at their own
size; pass `:icon{name="^LP" size=16}` to bring one down to the bar height.

The label is the only field that takes them: everything after the first `|` is
read as frame data, so a glyph there is reported at build time rather than
quietly dropped.

### Phases

| Phase | Aliases | Drawn as |
|---|---|---|
| `startup` | `su`, `start` | theme hue, darkest |
| `recovery` | `rec` | theme hue, mid |
| `active` | `act`, `hit` | theme hue, lightest |
| `air` | `airborne`, `juggle` | outline only |
| `land` | `landing` | grey |
| `inv` | `invuln`, `invincible` | darkest step, hatched in black |
| `armor` | | mid step, hatched in black |
| `counter` | `cs` | lightest step, upright hatch |
| `gap` | `space` | nothing (blank run) |

Charts follow the site's colour picker. The three phases that carry colour are
three steps of one ramp in the chosen hue rather than three different colours,
so what separates them is lightness - which holds at every hue the picker can
reach, and for colourblind readers, in a way that hues picked by a slider could
not. Airborne and landing recovery stay hue-free.

Any other phase name still works - it is drawn grey and named in the legend -
and `map="whiff=recovery"` lends it an existing phase's colour while keeping
your name in the legend (so don't map onto a phase the same chart already
uses). The steps live in `src/styles/variables.styl` as `--fc-startup`,
`--fc-recovery` and `--fc-active`; their chroma is capped at what stays inside
sRGB for the worst-case hue, so raising it would make some hues clip and
flatten the ramp.

### Options

| Attribute | Default | Effect |
|---|---|---|
| `max` | fits the longest bar | End of the scale, in frames |
| `step` | picked from `max` | Gap between axis ticks |
| `caption` | - | Title above the chart; `:::framechart[Title]` also works |
| `unit` | `frames` | Label beside the axis |
| `legend` | `true` | `false` hides the legend |
| `labels` | `auto` | `off` hides the numbers on the bars |

Anything on a line that isn't a `phase=frames` token is reported at build time
rather than dropped silently, so a typo shows up in the build log.

Values sit inside their segment when they fit and just above it when they do
not. A thin track's value sits beside the end of its bar, so a second track
costs only its own height. Every segment also names itself on hover.

## Table layouts

A markdown table in a post is an ordinary table until it is wrapped in a `div`
directive carrying a layout class. Two exist, both in `src/styles/markdown.css`.

### `md-table-movelist`

The command list: three columns - name, input, notes - at a fixed 30/30/40
split, with row line-height tightened so rows of glyphs sit close together.

```markdown
:::div{class="md-table-movelist"}
| Movelist Overview |  |  |
| --- | --- | --- |
| **Special Moves** |  |  |
| `Gohadoken`   | :icon{name="_QCF"}:icon{name="_++"}:icon{name="^P"} | :icon{name="_EX"} available |
| `Senkugoshoha`| :icon{name="_DSF"}:icon{name="_++"}:icon{name="^P"} | :icon{name="_EX"} available |
:::
```

The header row holds the list's title and leaves the other two cells empty. A
row whose first cell is bold and whose others are empty (`**Special Moves**`)
reads as a divider inside the list.

### `md-table-move`

The per-move write-up: a fixed-layout table whose column widths come from
`--col1` through `--col4` on the wrapper, so each move can split itself between
prose and clip however it wants to.

```markdown
:::div{class="md-table-move" style="--col1:75%; --col2:25%;"}
| Jumping Strong Kick | :icon{name="_AIR"}:icon{name="^HK"} |
|--|--:|
| Prose about the move. | <video width="100%" autoplay muted loop style="margin:0;display:block;border-radius:10px"><source src="/posts/.../clip.webm" type="video/webm"></video> |
:::
```

Header row is the move's name and its input, body row the write-up and the clip -
in either order, which is why the widths are per-table. `--col1` defaults to
85% and `--col2` to 15%; the third and fourth stay `auto` until set. A third
column gives a move two clips (`--col1:60%; --col2:20%; --col3:20%`).

`|--|--:|` right-aligns the second column, which also shoves an image or video
in it against the right edge. Both classes strip the margin from paragraphs
inside cells, so a cell with several lines in it doesn't pick up the usual
paragraph spacing.
