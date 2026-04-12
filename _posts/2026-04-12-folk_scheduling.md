---
layout: post
title: "Scheduling Folk"
date: 2026-04-12 08:00:00 +0000
categories: blog
tags: emacs orgmode folk
excerpt_separator: <!--more-->
---

Keeping in touch with people is something I care about, but there's plenty of
folk that I care about that I wouldn't stay in contact with the regularity that
I want _without_ proper scheduling. Unless it's more than once a week, the habit
just doesn't form, and life gets in the way.

A few years ago, I started treating it like a systems problem and built a
scheduling layer around it. Motivated by a recent chat with some interested
parties, this post briefly documents that system, how it broke, and where I've
landed.

<!--more-->

## Some philosophy

I dinnae want to turn this post into a pontification on humans as social
creatures, and compare and contrast (possibly outmoded) models of evolutionary
psychology vs contemporary and future-facing aesthetics of the woven nets of
relationships that we want to build. Buy me a coffee and yap on that one-on-one.

However, keeping up with folk is something I like to do, and I believe in the
power of my own agency: that I can decide the things I want to do, and have some
understanding of why I want to do it.

Once I've exercised the agency of choice, I'm keen to minimise the number of
low-agency steps required to achieve that. This is why I like having keyboard
shortcuts for common tasks: intent, action, and result should all be closely
linked.

Given that, exercising the agency of "I want to maintain this relationship with
someone that I'm not constantly thinking about" (e.g., not a partner or
immediate family member) can be thought of as a systems problem, intersecting
with the social dynamics of it all. Understanding what stage a relationship is
at, if you or the other person just isn't feeling it and you should back off,
and what you should be talking about is all something I want to be using my own
judgement for.

Or put simply, I want to be the one actually living my relationships, any
tooling around it should just make that easier.

We _can_ automate the other parts, but that seems a bit grim. Born, push a
button to do all the things in your life, die.

In typical tech person fashion, let's quickly make the evil thing, because it
_can_ be done. I beg you **not** to use the following script:

```python
import anthropic
from people import Person, is_due


def build_prompt(person: Person) -> str:
    history_block = "\n".join(f"- {m}" for m in person.message_history[-3:]) or "None"
    return f"""
You are helping someone maintain their relationships. Draft a short, warm, natural message to send to:

Name: {person.name}
Relationship: {person.relationship}
Contact frequency goal: {person.frequency}
Last contacted: {person.last_contacted}
Recent message history:
{history_block}

Keep it brief (2–4 sentences). Don't be generic or sycophantic. Match the tone to the relationship.
Make it genuine, witty, and not weird.  The feeling of living in an alienated dystopia where even the
connections between friends has melted away to tokenisation should *not* come across.
""".strip()


def generate_message(client: anthropic.Anthropic, person: Person) -> str:
    response = client.messages.create(
        model="claude-opus-4-5",
        max_tokens=256,
        messages=[{"role": "user", "content": build_prompt(person)}],
    )
    return response.content[0].text.strip()


def run(people: list[Person]) -> None:
    client = anthropic.Anthropic()

    for person in people:
        if not is_due(person):
            print(f"⏭ Skipping {person.name} — not due yet\n")
            continue

        print(f"✉ Generating message for {person.name} ({person.relationship})")
        msg = generate_message(client, person)
        print(f" → {msg}\n")
```

## The original system: Emacs org-mode

My first serious attempt was back in late undergrad, and used
[org-mode](https://orgmode.org/) in Emacs.

Emacs is a family of text editors that traces its roots back to the 1970s,
originally developed at MIT. The GNU Emacs branch, maintained by Richard
Stallman — of the Free Software Foundation and GNU Project fame — has been the
dominant strain since the 1980s and remains actively developed today. It's less
a text editor than a Lisp runtime that happens to be very good at editing text.

[![Richard Stallman at FOSDEM 2005](https://upload.wikimedia.org/wikipedia/commons/4/46/Richard_Stallman_2005_%28chrys%29.jpg)](<https://commons.wikimedia.org/wiki/File:Richard_Stallman_2005_(chrys).jpg>)
_Stallman at FOSDEM 2005. Photo by chrys,
[CC BY 2.0](https://creativecommons.org/licenses/by/2.0/)._

Org-mode has a built-in scheduling syntax that lets you attach dates and
recurrence patterns to any heading. The agenda view then collects everything due
today across all your files — a kind of personal dashboard.

A contact entry might look like this:

```org
* Vangelis Ogunkunle
  SCHEDULED: <2026-01-15 Thu +4w>
  :PROPERTIES:
  :CATEGORY: folk
  :END:
```

The `+4w` suffix is a repeat interval: once you mark the task done, it
reschedules itself four weeks forward. You can also use `++` (shift by interval
from today, not from the original date) or `.+` (shift from today, but only
forward) depending on how strict you want to be about drift:

```org
SCHEDULED: <2026-01-15 Thu ++4w>   ; always lands on a fixed cadence
SCHEDULED: <2026-01-15 Thu .+4w>   ; 4 weeks from whenever you actually did it, my preferred approach for this
```

Running my shortcut for `M-x org-agenda` and pressing `a` gave me a daily/weekly
view of everyone I was due to speak to. It was great. The system lived in a
single `folk.org` file, was version-controlled with the rest of my config, and
required zero internet access.

I would take a look at my agenda, see who I felt like messaging that day, and
adjust the schedule frequency if I felt it needed to be made more or less
frequent.

A typical day might look something like:

```
Sunday     12 April 2024
================================================================================
 Folk
  folk:                      Lorna Rauf
  folk:                      Aunt Redacted
  folk:                      Akshil Wierzbicki

 General Tasks
  agenda:                    Watch Welder talk
  agenda:                    libclang exploration
  agenda:                    ALIFE conference review
```

Crucially, I'm not obliged to message a person on that day, they will roll over
until I actually check them off.

The [agenda view](https://orgmode.org/manual/Agenda-Views.html) is just one
piece of it — org-mode and Emacs more broadly are very configurable through
their
[built-in customisation system](https://www.gnu.org/software/emacs/manual/html_node/emacs/Easy-Customization.html)
and
[init file](https://www.gnu.org/software/emacs/manual/html_node/emacs/Init-File.html).
Want custom agenda commands that filter by tag, show only people you haven't
contacted in over a month, or group by city? All doable. The price of admission
is a willingness to spend time in the parenthesis mines of Lisp.

## How it fell apart

I moved to London in 2024, and suddenly found myself with a tube commute, and a
corpo laptop. I didn't feel comfortable putting my social web on something that
could ostensibly come out in discovery or the whims of company IT.

I also found I wasn't using my personal laptop daily, I was out and about doing
stuff in my off-hours. As a result, I found a few months in "hey, I've not been
maintaining some of the relationships that I care about, why is that?".

I realised that my system was reliant on daily use of my personal laptop, and
the time that I was free to message and catch up with people was on an
underground train, on mobile, with minimal internet connection.

Alas, Emacs as I use it is not well suited to the mobile experience, so I needed
a stop-gap solution.

## Google Calendar Tasks: a workable compromise

Google Tasks (built into Google Calendar, and also as a standalone app) turned
out to be a reasonable middle ground. It syncs to my phone, works offline on the
underground, and supports due dates with recurrence. I've given social tasks
their own colour, to make them distinct from other tasks and calendar events.

The workflow is simple: each person gets a task, set to repeat on whatever
cadence makes sense. When I'm on the tube, I can take a look at my Google
calendar for the day, and see who's up.

![Google Calendar day view showing folk tasks highlighted in yellow among other events](/assets/folk-scheduling/google-calendar-day-view.jpg)
_Day view — folk tasks show up in yellow alongside regular calendar events._

Adding a new contact task is just a tap on the + button, then selecting "Task":

![Google Calendar new item menu showing options including Task](/assets/folk-scheduling/google-calendar-new-task-menu.jpg)
_The new item menu — Task sits alongside Event and other options._

Each task gets a repeat interval, set at creation:

![Google Calendar task creation screen showing "Message bofa" repeating every 6 weeks](/assets/folk-scheduling/google-calendar-task-recurrence.jpg)
_Setting a 6-week repeat on a contact task._

It doesn't have org-mode's expressive repeat syntax, and the wide scope of
additional configuration I'd like to have. But it's good enough, and critically,
it's always with me.

## The future: getting back to org-mode

The org-mode approach is still the one I'd prefer. The plain-text format, the
expressive scheduling syntax, increased privacy, the dork creds, and the
composability with the rest of my Emacs workflow are hard to replicate. The
question is just whether I can get it onto my phone reliably enough to replace
Google Tasks for the commute use case.

In an era of agentic coding, sure it will be way easier, however the question is
how arsed I can be, given this approach seems to be "good enough" for how my
life is going right now.
