---
layout: post
title: "How We Survived Mac and Even Laughed"
date: 2025-10-12 12:20:08 +0200
categories: blog
tags: linux mac emacs dev workflow
excerpt_separator: <!--more-->
---

<img src="{{site.url}}/assets/headers/2025-10-mac.png" width="1024">

At work, we recently transitioned everyone to MacBooks.
I've never used one before, and had spent the past decade on Linux laptops
which I've gradually refined to my liking.

Here's an inconvenient truth --- these machines are not designed to meet my needs.
Being able to modify them to meet those needs has been a challenge.
In an attempt to not alienate my readers, this doesn't mean that folk with
other needs are wrong. Apple clearly has a particular set of users in mind; I'm
just not one of them.

My philosophy is that the tools I use should behave the way I tell them to.
This post describes some of the issues I've encountered trying to achieve that, and how I've worked around them.
Overall, I've been able to get a workable setup.

<!--more-->

# Windows and Workspace Management

One of the most important aspects of my workflow is the ability to manage
windows and workspaces efficiently.

I typically have 10 workspaces, with a relatively strict purpose for each one,
and map each to a keyboard shortcut, usually `super+[0-9]`.
That way I can quickly switch between different tasks and contexts (e.g., text
editor is in `super+1`, email in `super+9`, etc).
I can also move windows between workspaces using `super+shift+[0-9]`.

macOS has a concept of 'Spaces', which are virtual desktops, but the behaviour I
required of sending windows to specific spaces and switching between them with
keyboard shortcuts wasn't available out of the box.
I had to install a third-party window manager called [yabai](https://github.com/koekeishiya/yabai).

Yabai is a tiling window manager, which means that it automatically arranges windows in a grid-like layout.
This isn't something I've bothered with before, but I've gotten used to it, and
I've ended up liking it.
I've even enabled tiling windows on my Debian laptop, through KDE Plasma.
It also helps to deal with the limited memory of the MacBook, since it pushes me to not have too many windows open at once.

Alas, Yabai and some other tools had some issues when the macOS Tahoe update came
out in September 2025.
This initially broke my setup, and made me feel like there was a small-calibre
bullet in my skull, as it made everything much harder to use.
Some patches have been released since then, and things are mostly working now.

Example Yabai configuration:

```sh
#!/bin/bash

# Re-inject scripting addition if Dock restarts
yabai -m signal --add event=dock_did_restart action="sudo yabai --load-sa"
sudo yabai --load-sa

# Update workspace number in SketchyBar
yabai -m signal --add event=space_changed action="$HOME/.config/sketchybar/plugins/space_display.sh"

# Set default layout to tiling (bsp)
yabai -m config layout bsp

# Window padding and gap between tiles
yabai -m config top_padding         0
yabai -m config bottom_padding      0
yabai -m config left_padding        0
yabai -m config right_padding       0
yabai -m config window_gap          0

# Focus behavior
yabai -m config mouse_follows_focus on
yabai -m config focus_follows_mouse autofocus

# Automatically rebalance split tree when windows are closed
yabai -m config auto_balance on

# Warp new windows into the tree (default tiling behavior)
yabai -m config window_placement second_child

# Enable window shadows and blur for floating windows (optional)
yabai -m config window_shadow on

# Make full-screen toggle (green button) act like regular zoom
yabai -m config window_opacity off

# Optional: float certain system apps (you can add more)
yabai -m rule --add app="System Preferences" manage=off
yabai -m rule --add app="System Settings" manage=off
yabai -m rule --add app="Software Update" manage=off
yabai -m rule --add app="App Store" manage=off
yabai -m rule --add title="Preferences" manage=off

# Optional: make the Dock not steal space if it's visible
yabai -m config window_shadow               off
yabai -m config window_opacity              off
```

You may wish to add spacing between windows, but I prefer to have none.

## Keyboard shortcuts

I used [skhd](https://github.com/koekeishiya/skhd) to manage the keyboard shortcuts for Yabai.

For example,

```sh
ctrl - 1 : yabai -m space --focus 1

ctrl - m : yabai -m window --toggle zoom-parent
ctrl + shift - c : yabai -m window --close

ctrl + shift - 1 : yabai -m window --space 1
```

I became frustrated with additional Mac keyboard issues and made further changes.

# The Keyboard

The Mac keyboard is a bit different from a standard PC keyboard.
And the keycaps are labelled differently.
That layout doesn't fit my needs, so I've had to make some changes.

First thing I did was remap the modifier keys in System Settings -> Keyboard ->
Modifier Keys.
I set `Caps Lock` to `Command` (to avoid [Emacs pinky](https://news.ycombinator.com/item?id=14370017)),
and `Command` to `Option` (aka `Alt`).
And the `Option` to `Control` (aka the `Super` key).
You may want to swap the `Command` and `Control` keys instead, if you're used to
the classic `Ctrl-c` and `Ctrl-v` shortcuts for copy and paste.

The Mac keyboard is also missing a delete key, so I used an app called
[Karabiner-Elements](https://karabiner-elements.pqrs.org/) to map
`Shift+Backspace` to `Delete`. It has a GUI for remapping, and also has a JSON
config file.

So for that example we can have:

```json
{
    "profiles": [
        {
            "complex_modifications": {
                "rules": [
                    {
                        "description": "Shift + Delete = Forward Delete",
                        "manipulators": [
                            {
                                "from": {
                                    "key_code": "delete_or_backspace",
                                    "modifiers": { "mandatory": ["shift"] }
                                },
                                "to": [{ "key_code": "delete_forward" }],
                                "type": "basic"
                            }
                        ]
                    },
```

Other remaps worth considering include tilde (`~`), quote (`"`), at
(`@`), and backslash (`\`).

# External Monitor Issues

One of the most surprising issues was connecting to an external monitor.
I like to connect the laptop to an external monitor, and I want the external monitor to be my _only_ display (i.e., turn off the laptop screen). One monitor is sufficient for my workflow.
It turns out, for some reason, this isn't possible in Mac out of the box.

One _can_ use "clamshell mode", where if you close the laptop lid, the external monitor will become the only display.
However, this means that you cannot use the laptop keyboard, and I prefer to use
the laptop keyboard for consistency.

I had to install third-party software to achieve this, called [BetterDisplay](https://github.com/waydabber/BetterDisplay).
In its settings, I then navigated to Displays->Overview->Connection Management
Settings->Disconnect built-in display when an external display is connected.
This capability should be built into the OS; it exists in most other systems.

# SketchyBar

As part of using Yabai, I wanted a status bar that could show me the current
workspace I'm using. However, out of the box, I couldn't find a way to do this.

Therefore I used a third-party status bar called
[SketchyBar](https://github.com/FelixKratz/SketchyBar), which is highly
customizable.

I opted to keep it simple, with the current workspace number, to the right of
the battery level.

<img src="{{site.url}}/assets/pics/2025-10-screenshot.png" alt="Screenshot of
desktop" width="1024">

The default macOS status bar remains accessible with this configuration:

```sh
sketchybar --add item hide left \
           --set hide script="sketchybar --bar hidden=on; sleep 5; sketchybar --bar hidden=off" \
           --subscribe hide mouse.entered.global
```

But I'm grateful that SketchyBar exists, since there's a lot of unnecessary
menus and icons in the default Mac status bar.

# Hiding the Mouse Pointer

I haven't fully reached the point of never using the mouse, especially when much
of the web is still designed for mouse interaction.
However, I tend to use the mouse a lot less than most people.
Therefore, I want the mouse pointer to disappear when I'm not using it.
To achieve this, I used a third-party app called [cursorcerer](https://doomlaser.com/cursorcerer-hide-your-cursor-at-will/).

# Emacs

The [Emacs Plus formula](https://github.com/d12frosted/homebrew-emacs-plus) from Homebrew is pretty good, but it doesn't install a `.app` file into `/Applications` by default.

I had to copy the `.app` file into `/Applications` for the shortcuts to work.

```sh
sudo cp -R /opt/homebrew/opt/emacs-plus/Emacs.app /Applications
```

I also had to add `(add-to-list 'default-frame-alist '(undecorated . t))` to my
`~/.config/emacs/early-init.el` file to remove the title bar, and rounded
corners, which I consider unnecessary.

# Terminal

Alas, I'm not so deep in the Emacs bucket that I use it as my terminal emulator.
I prefer to use a separate terminal emulator, with tabs, and an extra level of
nesting with tmux.

The default terminal on Mac had strange keybindings, and the app `iTerm2` had
similar issues.

I ended up using `kitty`, which allowed me to configure the keybindings to match
my needs with a simple config file.

# Conclusion

There are many more issues I've encountered, but these are the main ones that
have got in the way of my workflow.
There is a large community of third-party tools that may be better suited to meet
the needs of your workflow, and I'm sure folk out there
have even better setups.
For me, this was the minimum viable setup to get my work done.

On the bright side, the experience of setting up a new environment has
allowed me to feed back some improvements into my normal workflow on Linux as well.
For example, Shift+Backspace to Delete, and tiling window management.
Also, missing the Trackpoint on the Mac keyboard has pushed me to use the
keyboard more, which feels like a win (in the most meaningless sense).
