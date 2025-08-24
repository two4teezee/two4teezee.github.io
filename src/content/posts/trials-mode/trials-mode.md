---
title: What I learned By Creating the Ikemen GO Trials Mode
published: 2025-08-23
description: 'Random thoughts on best practices for creating Ikemen GO modules'
image: './trials.png'
tags: [Trials, Ikemen GO, Module]
category: 'Rant'
draft: false 
lang: ''
---

# Background
In February of 2021, I released a [video](https://www.youtube.com/watch?v=PoMTlgYuUNw) of brokenIKEMEN and an Ikemen GO Trials Mode based off the Ikemen 0.98.2 release.
This video was the culmination of a few months of work porting over what I was calling brokenMUGEN 1.0, a project which had been dormant for several years, into Ikemen GO.
But what happened between 2021 and 2024?
Why was the project dormant for so long?
## Coming Back to the Scene
Like many others, I came back to the scene in mid-to-late 2020, during peak COVID, wondering what had happened in the 6+ years since I had left it.
While Mugen in general seemed to be in decline, the influx of top content creators into Ikemen GO motivated me to get involved.
The Ikemen GO scene had been superpowered by COVID - many of us came back looking for a way to reinvigorate one of our favorite pasttimes, and it turned out that the small community that was being built up by key Ikemen GO contributors was alive and well.
## Motivation
I had always wanted a Trials Mode in Mugen, and Ikemen GO provided the right structure for it. 
I made a lot of progress in 2021, but ended up being blocked by a few bugs that I couldn't resolve, specifically tied to the way some characters used helpers in certain moves.
Of course this was an elementary thing so I couldn't release without this functionatlity!
Then, real life got in the way.
I switched jobs, and I was quite busy.
I kept tabs on what was happening in the Ikemen GO scene, but Trials Mode was unfinished and unreleased.

In 2024, I felt energized to see this project to completion.
A lot of the friction I encountered was tied to the fact that my implementation was written in Go - it relied on core engine modifications.
The path I had taken made sense because the motivations were clear - I wanted the most performant way of reading in files - but it flew in the face of Ikemen GO's modularity.
I polled the Ikemen GO developer community, and we all agreed that although Trials Mode is in high demand, it should be developed and released as a module.
This made even more sense when I started thinking of ways in which Trials Mode could serve as the basis for other game modes, like a Tutorials Mode.
So, over the course of many months, I took the implementation I had written almost exclusively in Go and refactored it to be released as a Lua Ikemen GO module.
# Best Practices for Creating an Ikemen GO Module
Let's start with saying that creating an Ikemen GO module was quite a bit harder than I expected it to be.
This was caused by two separate factors:
1. The Lua codebase that modules hook into for Ikemen GO is a tangled mess and the documentation is at best incomplete, at worst non-existent, with a complete refactor now teased for several years (no judgement here, look at my timelines!).
2. The total scope of my Trials Mode implementation was significant enough that I needed to have a very complete understanding of all aspects of the Lua codebase (read: picking a smaller project as a first module might have been better 😂).
In this blog entry I'll pass on some lessons I learned along the way.
This might be a useful resource for someone attempting to develop an Ikemen GO module.
## Initializing a Module
The first thing necessary for initializing a module is to have the right hooks added in.
```lua
hook.add("loop#trials", "f_trialsMode", start.f_trialsMode)
hook.add("start.f_selectScreen", "f_trialsSelectScreen", start.f_trialsSelectScreen)
```
In my case, I needed to make sure Trials Mode was initialized in the `start` function.
I also wanted to hook into the `start.f_selectScreen` function to modify what happens on the Select Screen.
The bottom line is that `hook` is what's required to inject code in functions that are already running in the Lua codebase - look for the right ones, then assess whether you are simply trying to add or completely supplant what's happening there.
Ironically, these lines will usually be at the very end of your module file.
:::tip
Perform a careful review of the existing Lua functions and use the `hook` function the inject your code in the right place.
:::
## Keeping the Code Organized
Because the Trials Mode touched so many different Lua files, keeping everything organized by *which* file the function in question was touching was key.
The [module templates](https://github.com/ikemen-engine/modules) do a good job of highlighting this, but I can't stress how important this really is to keeping yourself organized as you navigate the complex relationship between all of these functions.
:::tip
Try to keep the code that interacts with Lua files in `/external/script/` grouped in your module's code.
:::
## Loading in External Files and Establishing Semantics
For Trials Mode, I wanted to make the implementation feel like it was baked into the engine.
That meant keeping similar syntax for writing Trials Mode definition files for each character, and making it easy for the user to get them loaded in.
```
[TrialDef, Gohadoken]
trialstep.1.glyphs = _QCF^P
```
It also meant that the module would be responsible for parsing these Trials Mode definition files, storing the data in memory alongside other character information, and more.
The most straightforward way of doing this was to check each character whether they had a `trials` file pointer in the `def` file, then pumping that data into the `main.t_selChars` table.
The parsing itself was pretty easy, and it was an opportunity to make the module as flexible as possible by provisioning for the quick addition or deletion of parameters in the definition files during development.
There is, however, a shortcoming to doing this in Lua - it means you're re-opening files that had been previously been read in by the Go engine. 
It's not the end of the world, but if you're creating a module that requires reading in files, keep this tip in mind:
:::tip
Keep external files associated with the module you are developing as lean as possible; open them, read them, and close them right away.

Additionally, if your module require the end-user to create external files, try to keep the syntax simple and familiar.
:::
## Creating Screenpack Elements and Tie-Ins
This is partially explored in the module templates, but if you are creating a module that has significant screenpack tie-in's because you want folks to be able to fully customize the graphic aspects of your module, there are several things to keep in mind.
1. **Your defaults should work with a "default" screenpack.**
By that, I mean one of the screenpacks that ships in the [Ikemen GO Screenpack Assets](https://github.com/ikemen-engine/Ikemen_GO-Elecbyte-Screenpack).
Even if you are developing your module for your own game that has its own screenpack, making sure your defaults work with a screenpack anyone has access to will make testing infinitely easier.
```lua
local t_base = {
    ...
    trialtitle_vertical_text_font = {'f-6x9.def', 0, 0, 255, 255, 255, -1}, 
    --leveraging a "default" font
    ...
```
2. **Use existing norms and syntax to the maximum extent possible.**
Make sure you study how screenpack elements are specified, and following the syntax.
Even if you have a ton of parameters to specify, it will help folks keep them straight and understandable.
```lua
local t_base = {
    ...
    trialsteps_vertical_window = {0, 0, main.SP_Localcoord[1], main.SP_Localcoord[2]},
    --reusing window-specifying syntax
    ...
```
3. **If you have a custom pause menu, make sure you specify defaults for that as well.**
We'll talk more about pause menus later, but this is really important - every aspect of your custom pause menu should be defined in your defaults.
```lua
function motif.setBaseTrialsInfo()
```
## Consciouly Breaking Out Functionality
Now this isn't to say you want a crazy number of function calls (as a matter of fact, if you have stuff running at each timestep, you should shy away from that).
However, you'll find that in some instances, you only need to run a specific aspect of your module once to initialize something.

For instance, the Trials Mode has a `start.f_inittrialsData()` function to create an initial table for the Trials definition files it will read in, and a `start.f_trialsBuilder()` function that runs only once to pre-position all graphical elements, populate all tables to track status of the trials, set windows, etc.
There are two functions that runs at every timestep when the user is actively in trials mode, `start.f_trialsDrawer()` to draw the graphical elements, and `start.f_trialsChecker()` to identify whether the desired trials condition has been met.
The latter contains all of the logic that increments through the trial's steps, statuses things, and so on.

To put it into perspective, at the time of writing, `trials.lua` is 2009 lines of code, and `start.f_trialsChecker()` accounts for only 150 of those 2009.
It's better to have that stuff carved out and making the function call when you need it than having a bunch of `if` statements in your code.
:::tip
Be mindful of initialization functions being carved out of the functions doing the heavy lifting for your module.
:::
## Carefully Considering Dependencies
When I first started the transition to a Lua module, I was leveraging `training.zss` to do things like reset life, set the power bar to max, etc.
Halfway through the project, `training.zss` was revamped in a big way.
This was not a huge problem, but it did break the module.
Breakage will occur as the engine evolves, that's just the nature of things; however, you should do your best to minimize that, even if it means your module requires a bit more setup to work (like specifying a new common state file!).
This led me to create my own `trials.zss` which minimized code duplication by culling out what was no longer needed, creating in the new functions necessary, and minimizing dependencies on files that are likely to change in the future.
:::tip
Try to make your module as self-contained as possible.
That means minimizing dependencies on other files that can be changed.
:::
## Get Other People to Test Your Module