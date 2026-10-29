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
| `legend` | `bottom` | `right` puts it beside the chart, `false` hides it |
| `labels` | `auto` | `off` hides the numbers on the bars |

`legend=right` sets the legend down the right-hand side and lets the plot
scroll on its own beside it; below 40rem of viewport it drops back under the
chart, since at that width the column costs more than it is worth.

Anything on a line that isn't a `phase=frames` token is reported at build time
rather than dropped silently, so a typo shows up in the build log.

Values always sit inside their segment, centred on it - one too short to hold
its number lets it spill over the edges instead of moving it off the bar. A
thin track's value sits beside the end of its bar, so a second track costs
only its own height. Every segment also names itself on hover. The same goes
for frame tables.

## Frame tables

`:::frametable` is a frame-data sheet: a plain markdown table whose last column
is drawn as a bar, one per row.

```markdown
:::frametable{caption="Standing normals"}
| Move | ISM | Damage | Stun | Frame Data |
|---|---|--:|--:|---|
| :icon{name="_CLOSE"} :icon{name="^LP"} | :icon{name="^X"}:icon{name="^Z"} | 6 | 2 | startup=3 active=9 recovery=10 |
| :icon{name="_CLOSE"} :icon{name="^HP"} | :icon{name="^X"}:icon{name="^Z"} | 9+8 | 4+3 | startup=5 active=6-11,12-18 recovery=27 ; inv=1-4 |
| :icon{name="_CROUCH"} :icon{name="^HK"} | :icon{name="^X"}:icon{name="^Z"} | 14 | 6 | startup=8 active=13 recovery=25 |
:::
```

- **Columns** - as many or as few as you like. Every column but the last is
  passed through as written, so glyphs, bold and `--:` alignment all work.
  Cells never wrap on their own; `\n` (or `<br>`) breaks one where you want,
  which is how a long header like `Meter on \n Whiff/Hit` keeps its column
  narrow. A cell that starts with `+` is green and one that starts with `-` is
  red (`+3`, `-6`), in light and dark; a lone `-` stays uncoloured.
- **The last column** is always headed "Frame Data", whatever the header row
  says, and takes the same `phase=frames` tokens as a framechart bar - counts,
  ranges, multi-hit lists and the phase names in [Phases](#phases). A `|` would
  end the cell, so `;` starts another field instead: `; inv=1-4` adds a thin
  track and `; mark=Landing@air` a mark. A row can leave it empty.
- **No axis.** Every bar is drawn against the longest move in that table, so
  the longest one fills its cell and the rest are in proportion to it. The
  column takes 40% of the table's width; the others share the rest.

`caption` (or `:::frametable[Title]`), `legend`, `labels` and `map` work as they
do on a framechart. The table scrolls sideways below about 30rem rather than
squeezing the bars.

### Legend row

Anything written after the table, inside the `:::frametable`, becomes a legend
row across the foot of the table, ruled off from the body the way the header
is.

```markdown
:::frametable{caption="Crouching normals"}
| Move | Damage | Chain<br>Cancel | Block<br>Stun | Frame Data |
|---|:-:|:-:|:-:|---|
| :icon{name="_CROUCH"} :icon{name="^LP"} | 20 | ○ | +4 | startup=3 active=3 recovery=4 |
| :icon{name="_CROUCH"} :icon{name="^HK"} | 80 | ×*1 | -7 | startup=6 active=4 recovery=20 |

- ○ = Cancelable
- × = Not cancelable

\*1 = Special cancelable on hit only.
Damage is listed against a standing opponent.
:::
```

- **Leave a blank line** after the table, or markdown reads the next line as
  another row.
- **A list is a legend** - its items run side by side and wrap as needed.
- **A paragraph is footnotes** - each source line is its own note, and a long
  one wraps under its own text rather than under its key.
- **`key = text`** sets the key (bold, full-strength ink) apart from what it
  explains. It works in both, and the key can be a glyph (`:icon{...} = Crouching`)
  or anything inline. The spaces around `=` are required; a line without them is
  plain text. Escape a leading `*` (`\*1`) so markdown can't pair it with
  another `*` as emphasis.

## Frame chart tables

`:::framechartable` is a frame table built for one move at several strengths -
a special, say, with a row each for light, medium, heavy and EX. It takes the
same table, but its bars share a framechart's axis: ticks along the foot of the
bar column and gridlines through every row, so each version can be read
against absolute frame numbers ("active until frame 22") rather than only
against the others.

```markdown
:::framechartable[Cannon Drill :icon{name="_D"}:icon{name="_DF"}:icon{name="_F"}:icon{name="^K"}]
| Version | Damage | Block<br>Stun | Hit<br>Stun | Notes | Frame Data |
|:-:|:-:|:-:|:-:|:-:|---|
| :icon{name="^LK"} | 70 | -12 | KD | - | startup=8 active=14 land=9 |
| :icon{name="^HK"} | 90 | -8 | KD | - | startup=10 active=18 land=9 |
| :icon{name="_EX"} | 40+100 | +2 | KD | *1 | startup=8 active=6 land=9 ; inv=1-8 |

\*1 = Air-blockable once airborne.
:::
```

- **The caption is the move** - its name and input, glyphs and all, in
  `:::framechartable[...]` - which leaves the first column free to name each
  version.
- **The axis** runs to a round number of ticks past the longest bar, as on a
  framechart; `max`, `step` and `unit` set it the same way. Its unit sits at
  the right-hand end of the columns before it, level with the ticks.
- **The bar column** takes 55% of the width rather than 40%, since a single
  move needs fewer columns than a sheet of normals.

Everything else - columns, `\n` breaks, `+`/`-`/`×` colouring, the `;` fields,
the legend row, `legend`, `labels` and `map` - works as it does on a frame
table.

### Inset

A table written before the frame data becomes an inset: the write-up and
clips for the move, drawn between the caption and the data. It has no header
row - markdown still wants the `|--|--:|` line under the first row, but that
row is drawn as an ordinary one - and `inset` sets its column widths, in
order:

```markdown
:::framechartable[Cannon Drill :icon{name="_D"}:icon{name="_DF"}:icon{name="_F"}:icon{name="^K"}]{inset="70% 30%"}
| Her best tool for closing distance. Point-blank it's very unsafe, but spaced out it hits late in the slide. | <video autoplay muted loop><source src="/posts/.../drill.webm" type="video/webm"></video> |
|--|--:|

| Version | Damage | Block<br>Stun | Hit<br>Stun | Notes | Frame Data |
|:-:|:-:|:-:|:-:|:-:|--- |
| :icon{name="^LK"} | 70 | -19 | KD | - | startup=8 active=16 land=20 |
:::
```

- **Any number of columns and rows** - text in one, clips or stills in the
  others, in whatever order. `inset="60% 20% 20%"` gives a move two clips; a
  column the list leaves out shares whatever width is left, and with no
  `inset` at all the columns split evenly.
- **Media fills its column**: an `img` or `video` is sized to the column's
  width and gets the figure's rounded corners, so it needs no `width` or
  `style` of its own. Glyphs stay glyph-sized.
- **The text** is set in the post's body size and wraps; markdown, glyphs and
  `<br>` work in it as in any table cell. `|--|--:|` still right-aligns a
  column.
- The frame table is always the **last** table in the directive, so a
  `:::frametable` takes an inset the same way.

## Table layouts

A markdown table in a post is an ordinary table until it is wrapped in a `div`
directive carrying a layout class. Two exist, both in `src/styles/markdown.css`.

### `md-table-movelist`

The command list: three columns - name, input, notes - at a fixed 30/30/40
split, with row line-height tightened so rows of glyphs sit close together.

```markdown
:::div{class="md-table-movelist"}
| Movelist Overview |  |   |
| --- | --- | ---  |
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
