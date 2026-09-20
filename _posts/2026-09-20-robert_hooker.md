---
layout: post
title:
  "It Wasn't Supposed to Work: From the AI Winter to AI Agents with Robert
  Hooker"
date: 2026-09-20 12:20:08 +0200
categories: blog
tags: ai interviews history cloud agents
excerpt_separator: <!--more-->
---

<img src="{{site.url}}/assets/headers/2026-09-hooker.png" width="1024">

I was sitting in a coffee shop earlier today, when the waitress asked where I
was from. A fella over at the next table caught the accent, and we got talking.
Somewhere in the next few minutes he mentioned he'd worked in an AI lab during
the AI winter of the late 80s, and I thought, since this random conversation
seems to be happening anyway, let's capture it. I asked if he'd be comfortable
making it an interview format with transcription, so we agreed to sit down
properly.

Robert Hooker has been working in IT since 1989, starting at Northwestern
University's Institute for the Learning Sciences and ending up in London, some
thirty-odd years later, running the internal AI adoption programme at a social
care charity. He says he's watched this happen before.

<!--more-->

---

**So tell us a wee bit about yourself and how you got started.**

_My name is Robert Hooker. I'm a senior person in cloud computing. I have been
working in the field of IT since late 1989. I first worked in the United States
at Northwestern University's Institute for the Learning Sciences. This was
during the AI winter, so the Institute was actually an AI lab._

_The researcher who ran it was
[Roger Schank](https://en.wikipedia.org/wiki/Roger_Schank), a famous early AI
researcher, who I gather sadly features in the Epstein files. He was one of the
people who introduced the concept of "scripts" in early AI. An interesting
field, in a relatively failed branch of AI back then._

<aside style="border-left: 3px solid #bbb; margin: 1.5em 0; padding: 0.4em 1em; font-size: 0.92em; color: #444;">
For the record: Schank (1946-2023) founded the Institute for the
Learning Sciences in 1989 on a $30m grant from Andersen Consulting. He was a
Florida neighbour of Jeffrey Epstein and attended an AI conference Epstein
sponsored on his island in 2002, six years before Epstein's 2008 conviction for
sex offences, and publicly supported him afterwards. His name appears in the
files released in 2026. See
<a href="https://en.wikipedia.org/wiki/Roger_Schank#Personal_life_and_death">Wikipedia</a>,
which cites <a href="https://slate.com/technology/2019/08/jeffrey-epstein-science-eugenics-sexual-abuse-researchers.html">Slate</a> (2019), in which Schank himself describes that meeting, and the
<a href="https://www.post-gazette.com/news/education/2026/03/01/carnegie-mellon-roger-schank-epstein-emails/stories/202602260118">Pittsburgh Post-Gazette</a> (2026).
</aside>

_We were still in what I call the Minsky winter, when Marvin Minsky thought he
had proven that neural nets would never work. So people weren't working on them,
and they were trying to teach computers how to think in Lisp and getting
nowhere._

**Just to check, the Minsky proof, that was the XOR problem?**

_Yeah, of course._

<figure style="max-width: 32%; margin: 0 auto 1.5em;">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/ae/Marvin_Minsky_%28cropped%29.jpg" alt="Marvin Minsky" style="width: 100%;">
  <figcaption>Marvin Minsky. With Seymour Papert, his 1969 book <a href="https://en.wikipedia.org/wiki/Perceptrons_(book)">Perceptrons</a> showed a single-layer perceptron couldn't compute XOR, which was widely (if unfairly) read as a death certificate for neural nets. Via <a href="https://commons.wikimedia.org/wiki/File:Marvin_Minsky_(cropped).jpg">Wikimedia Commons</a></figcaption>
</figure>

_And so I was being trained that machine learning was just really stupid, but a
lot of our people were very interested in it. It was a nightmare._

_I do have a published academic paper, from a conference, Hooker and Slator, on
a model of AI decision-making. It didn't say AI, of course, because we were in
the AI winter. But it was about how agents make decisions in an economic role,
by the agents simulating pursuits._

_And that was where I introduced Brian Slator, who went on to North Dakota State
University to do the rest of his career research there._

<aside style="border-left: 3px solid #bbb; margin: 1.5em 0; padding: 0.4em 1em; font-size: 0.92em; color: #444;">
The paper is
<a href="https://www.semanticscholar.org/paper/A-Model-of-Consumer-Decision-Making-for-a-Mud-Based-Hooker/062dbff9c40c8ae03261f7c2e43843a4470283e4">A Model of Consumer Decision Making for a Mud Based Game</a>
(Hooker &amp; Slator, 1996), presented at the Simulation-Based Learning Technology
Workshop at ITS'96 in Montréal. The agents lived in a
<a href="https://en.wikipedia.org/wiki/Multi-user_dungeon">MUD</a>, a networked
multiplayer text world built to teach microeconomics, and the problem was getting
a simulated shopper to behave plausibly enough that students kept playing for
weeks.
<a href="https://www.ndsu.edu/computer-science/people">Slator</a> stayed on that
track for the rest of his career, building multi-user educational games for
teaching programming, geosciences, economics, and cell biology. He spent nearly 26
years at NDSU and headed its computer science department from 2007 to 2017. He
died in May 2020.
</aside>

_But I didn't stick around in academia. In the mid-90s I went to the private
sector, going from web design, to SharePoint, to cloud, to Microsoft 365, and
now Copilot. The guiding principle, which I'd recommend to all the young people
in IT: if you can't beat them, join them._

<figure style="max-width: 45%; margin: 0 auto 1.5em;">
  <img src="https://upload.wikimedia.org/wikipedia/commons/d/de/Symbolics-3600-on.jpg" alt="A Symbolics 3600 Lisp machine" style="width: 100%;">
  <figcaption>A Symbolics 3600 Lisp machine. Specialised hardware for a paradigm that was about to fall out of fashion. The collapse of the Lisp machine market in the late 80s is often given as the start of the AI winter proper. Via <a href="https://commons.wikimedia.org/wiki/File:Symbolics-3600-on.jpg">Wikimedia Commons</a></figcaption>
</figure>

<blockquote style="border-left: 4px solid #c00; margin: 1.5em 0; padding: 0.5em 1em; font-size: 1.15em; font-style: italic; background: #f9f9f9;">
"For us older guys, this wasn't supposed to have worked. And it just blew our minds."
</blockquote>

**Have you come across the idea of
[Sutton's Bitter Lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html)?
I work in the neural network space, and the idea addresses the frustrating trend
that you throw more and more compute at the problem and it just somehow works
better.**

_Oh yeah, that principle. Which wasn't supposed to work. That's what was
amazing._

_I gave an interview about 16 years ago on a podcast called
[The Future And You](https://thefutureandyou.libsyn.com/june_9_2010_episode),
and he asked me about predictions. And I did not say that. Some voice
recognition, maybe, but the way I hedged it was: "I've been surprised before."_

<aside style="border-left: 3px solid #bbb; margin: 1.5em 0; padding: 0.4em 1em; font-size: 0.92em; color: #444;">
The episode is still up. Robert was a recurring guest on Stephen Euin Cobb's
<a href="https://thefutureandyou.libsyn.com/">The Future And You</a> across 2009
and 2010, and the AI one is
<a href="https://thefutureandyou.libsyn.com/june_9_2010_episode">9 June 2010</a>,
billed as "artificial intelligence; how and when conversational AI may appear in
our lives; the semantic web as an AI platform; AI for Internet search; the money
to be made in AI; simulating AI with a brute force program which is not
intelligent at all; Wolfram Alpha". Sixteen years and three months before we sat
down. The same listing also promises the story of "why he was once presumed dead
for three days", which I did not know to ask about.
</aside>

_When you work with a small neural net, there's an optimal number of layers,
there's an optimal amount of training. But when you have a massive set of these
weighted neurons, for us older guys, this wasn't supposed to have worked. And it
just blew our minds._

_It took a while convincing. It took me several months of playing with OpenAI to
be convinced that it actually was working. And here's the thing. If you go to it
determined to show it doesn't work, it's very easy. It's very, very compliant in
not working for you._

**I suppose you get the answer you went looking for.**

---

## An interlude in Edinburgh

**The reason we got talking in the first place was you'd mentioned being in
Edinburgh for the 2014 referendum. What was that like, being in the buzz of
it?**

_Oh, it was a lot of fun. My wife and I, my late wife, if I can make a plug for
her, her name was Gail Orenstein. Just Google "female drone journalist", she
shows up. She died five years ago, which is unfortunate, but she was a very
well-respected journalist. It was always a lot of fun with her._

_I was working remote at the time, so I could go and spend a whole week in
Edinburgh while working. And to be honest, this wasn't like the Brexit
referendum. It wasn't ugly, it wasn't bitter, at least in Edinburgh. There were
some fisticuffs that we saw, and some crazy things being yelled back and forth,
but for the most part I saw it as an amazing celebration of Scottish identity,
tempered with Scottish practicality._

<figure style="max-width: 60%; margin: 0 auto 1.5em;">
  <img src="{{ '/assets/pics/2026-09-orenstein-calais.jpg' | relative_url }}" alt="Police stand among burning shelters in the Calais refugee camp" style="width: 100%;">
  <figcaption>Calais, 2016, from Gail Orenstein's own portfolio. She travelled to 84 countries over her career, covering conflict and humanitarian stories, and was the first woman to fly a drone in Kurdistan during the Mosul offensive. © Gail Orenstein, used with permission from Robert.</figcaption>
</figure>

**Ha, mind you, the fisticuffs might just have been a typical night out in
Edinburgh.**

_Or even lighter than a typical night out in Edinburgh._

_I also do art, and I found it artistically very inspiring. Edinburgh is just
inspiring to begin with, but then to see all this going on as well. I was doing
illustrations where I brought Edinburgh alive by merging the statues with the
people. My drawings included the birds on their heads taking shifts, because
that's what you actually see._

_And one of the great joys of being a journalist is that you're an observer. The
thing that really struck me, comparing it to the Brexit nightmare, was a wedding
photograph where the bride was Yes and the father was No Thanks. It was a great
photograph. Brexit was never like that. Brexit was just ugly._

**Aye, definitely a more alienating experience, at least from how I saw it.**

---

## The dot-com bubble, and who held their nerve

**You mentioned being around for the dot-com bubble. What was that like?**

_In the late 90s it was great. A lot of my friends were working as contractors
in IT, and deployment was still pretty limited and very development-focused. Two
things got the IT community involved._

_One, it was the first time something was being delivered where you didn't have
to install anything on the end machines. The same bit of work could go on an
Apple. People forget how revolutionary that is._

_Secondly, it was the introduction of lightweight languages that weren't C or
C++. You could run websites on PHP, which was a bit poor, but it was very
revolutionary at the time. Then ASP came out, and that took off too. Java Server
Pages were too heavy-handed and didn't take off. And then JavaScript, and you
could separate what was happening on the client._

_So suddenly there was an easy level of entry if you were a technical person.
And suddenly there was demand for graphic art skills, which there hadn't been
before. All of our friends in the late 90s were suddenly making a lot of money.
That's when I moved to England with my wife, because she was a photojournalist
and wanted to be in England for obvious reasons._

_But the investment was way over the line. And when that dried up, for a few
years you couldn't get any work. It was really, really hard. The bomb hit in
2000, and by late 2002 it was as much because of 9/11 as it was because of the
internet. The financial system just stopped funding. But within three years it
was back up and running._

**So what's the lesson you'd draw for what could be called the contemporary AI
bubble?**

_The people who didn't panic and stuck with the internet during the dot-com
bomb, when all the brains were saying it was bad, the Bezoses and the
Zuckerbergs, they're the richest people on the planet right now. So better to be
closer to the people who held their nerve, if you have a choice. I've been there
before._

**There's probably a good few AI Pets.com knocking about right now. But Amazon
came out the other side looking not bad at all.**

_Maybe. But there is a difference. Back in the day you could create a website on
a single server plugged into the internet. You could pay under $1,000 for the
server, run e-commerce on it, deliver solutions on a pressed CD. It's not like
that now. You've got big players who are really well-heeled. Amazon, Microsoft,
Google, and Meta all have revenue streams. Those are the big players in AI._

_I famously missed the social media wave, by the way. I had a nephew who
attended Harvard at that time, and he comes in and says "a friend of mine is
creating a social network", and I said, "Microsoft and Yahoo are dominant."_

**Auch, geezo. That's a story to tell at least.**

---

## What he's doing now

**So what is it you're doing now?**

_Right now, my wife passed away five years ago, so I kind of slowed down. But
I'm working for a not-for-profit called
[Dimensions](https://www.dimensions-uk.org/), which just won an award for being
the best workplace in social care and not-for-profit in the UK. We're the UK's
biggest not-for-profit provider of support for adults with learning disabilities
and autistic people, but we don't even have 3% of the market. So even though
we're the biggest, and we grow like crazy, we're not quite sure where to go in
the future._

<aside style="border-left: 3px solid #bbb; margin: 1.5em 0; padding: 0.4em 1em; font-size: 0.92em; color: #444;">
The award is the
<a href="https://www.greatplacetowork.co.uk/">Great Place to Work</a> Institute's
UK's Best Workplaces list, where Dimensions placed
<a href="https://www.dimensions-uk.org/news-item/a-great-place-to-work-for-eight-years-running/">18th in the Super Large (1,000+ employees) category in 2026</a>,
accredited for the eighth year running and, as they put it, "the highest-ranking
not-for-profit social care organisation". They also sit
<a href="https://www.dimensions-uk.org/news-item/were-on-the-2026-uks-best-workplaces-for-wellbeing-list/">24th on the same body's Best Workplaces for Wellbeing list</a>,
up from 43rd in 2024.
</aside>

_I was hired about four or five years ago to work with cloud computing and
architecture. But then AI got introduced, and so what I've been doing for most
of the last two years is overseeing our internal AI adoption project._

**And how's that going?**

_Very interesting, but also very challenging, especially with security teams.
They want some kind of framework to make sure their AI is compliant. And I keep
telling them: these frameworks don't work as of yet._

_I was at a conference by one of the vendors, and I kept asking, "look, I'm
building these AI agents. I've been told by security that they're concerned,
without them telling me exactly why. So how do I structure my project?" And all
they say is "buy this product." No. That's not going to fix it._

_I know from being an architect, you have your business requirements statement,
and a process that takes you from there to something you can test. That isn't
here in AI as of yet. The big problem with an agent business requirement is that
people don't know to ask for a chatbot that has cognitive skills in a certain
area. So we get people to understand LLMs, then get them to understand what
agents can do. And then suddenly the use cases come out of the roof._

**What are the concerns, especially given you're working with quite sensitive
data?**

_First of all, I'm doing it very differently from a lot of the big businesses.
I've talked to friends of mine who are concerned, in large part because the
companies are coming in and deploying it as if it's an old factory where you put
in new machinery, kick the staff out and put security guards in front of it.
That isn't how we're doing it, and I don't think that's going to work._

_Because we're a not-for-profit, almost everybody working with us could make
more money somewhere else and they choose to stay anyway. So we have a
motivation factor that isn't just the money. That gives us an opportunity,
because they actually trust us._

_So we're getting people who are overwhelmed, constantly having to file this
report and that report, keeping the news updates going, updating the web page
and the intranet page, underpaid and we can't hire new people. And I'm saying:
alright, here's Copilot, this is what it can do, ask me about it. And then we
get them to discover the uses._

**So it's grassroots? You're trusting your colleagues' expertise and seeing
where you can cut, so they can focus on what actually matters?**

_Yeah. They're focusing, and I'm out there to support them with the technology._

**And the compliance side of that?**

_We're constantly getting more and more regulations about how to work. We have
to have a person whose only job is to tell us what's GDPR compliant and what
isn't. So we have to spend money and effort on it, and keep going on it. It's
kind of a pain, but we do it._

_Mind you, the punishment for not bothering is really just your reputation. If
you're determined to keep yours, you do it properly. So it ends up being a kind
of self-imposed punishment for the people who decide to do it the right way._

_And the thing is, you can also use GDPR to annoy people. You just go on an AI
and it can write a GDPR request, and you can inundate somebody you're mad at
with them. Although I've spoken to the people who handle ours, and they don't
think they're getting many of those. Ours are mostly sincere, very often because
somebody's moved house and they just want to make sure their record is
complete._

**So the future of agents is folk flooding their competitors with GDPR requests
using agents, and then those agents responding to all of it.**

_They've been doing that with lawsuits forever._

**Aye, lawsuits, patent trolling. It's cheaper to annoy.**

_You don't have to be a rich person to make somebody's life miserable._

---

## Why the code monkey is going away

<blockquote style="border-left: 4px solid #c00; margin: 1.5em 0; padding: 0.5em 1em; font-size: 1.15em; font-style: italic; background: #f9f9f9;">
"You have to become an expert in every agent you write."
</blockquote>

**Has building agents changed how you'd approach a project?**

_One of the things you learn very quickly with agents is that the old
traditional "give me the requirements, I'll write the use cases, and I'll code
it" does not work in cognitive computing. You have to become an expert in every
agent you write. If it's a finance agent, you have to become an expert in
finance._

_There was a project manager who wanted an agent, and at first I thought I'd
just point it at all their templates and processes. And it was okay. But to get
it to work appropriately, what I had to do was write proper ontologies into the
RAG to explain how the work actually worked, and run it through, and run it
through._

_I end up having to learn, which I enjoy, but I think in the future a good
programmer in AI isn't going to be a code monkey. Code monkey is going to be a
career that goes down. It's going to be somebody who works in a certain field
and is really good at cognitive descriptions of that field. Somebody who can
understand what cognitive skills are necessary to do a particular job._

_Which pushes AI more into psychology, sociology, and literature. I have an
undergraduate degree in cognitive science, and that's been much more useful than
anything else in the current work. Particularly behavioural theory._

**Go on, what carries over?**

_One rule of cognitive theory is that it's not enough to say no. If you're
correcting a behaviour that's wrong, it's very hard to just tell someone to stop
doing it. You have to tell them the proper behaviour instead._

_So when you do a RAG design and your instructions are just "don't do this,
don't do that", it's not going to be as effective as one that says "do this
rather than that." That's solid psychology._

_Computer programmers think if-then, if-then. And it didn't matter if it was
negative or not. Nobody worries about that. But human beings don't work that
way. What works for humans is "not this, rather this."_

**Aye, rather than the strict logic of C, you're almost shaping a surface for it
to slide towards what you want.**

_I don't know what's going on in the industry side of it, but I do know from
behavioural cognitive studies that this has been established for almost two
centuries now as the right way to go._

**That resonates. Two years ago 80% of my job was writing code; now maybe it's
5%. A lot of it is managing agents, and another part is just talking to
people.**

_Mine was the same. About five years ago 80% of my job was writing documents
that nobody would read. Now I do none of that. Now I'm talking to people._

---

## Hallucination, or imagination

<blockquote style="border-left: 4px solid #c00; margin: 1.5em 0; padding: 0.5em 1em; font-size: 1.15em; font-style: italic; background: #f9f9f9;">
"In probably 10 years they'll rename hallucination to 'imagination'. Because that's really what it is."
</blockquote>

**What about the risks?**

_The back-end ones we've covered. The big risk on the front end is, of course,
hallucination. And you can lecture all you want, but people are going to have to
learn from their own negative experience. Unfortunately, if you go on social
media, people think that one negative experience proves the whole thing doesn't
work._

_But this is one of the things I've learned. I've had some agents where I put in
such guardrails that they wouldn't hallucinate. The problem was that they
couldn't generate new thinking either._

**Right, you make it so safe it can't say anything useful.**

_I just thought hallucination was bad. But look, you're a human being. I may ask
you a question about something you've never dealt with before, and you may
imagine some solution. You're going to have to test it, but you might come up
with something._

_So you need to look at the domain. Is this something that needs a precise legal
answer? Turn hallucination down. Other things, like drafting job adverts or
public announcements, those things need to hallucinate some._

_In probably 10 years they'll rename hallucination to "imagination". Because
that's really what it is. And people will just take it for granted: don't let
the thing's imagination get away with it. You've got to contain its imagination.
I think it's a better term._

**Any other experiences that have made a difference?**

_The biggest one is getting people to not write prompts, but to write prompts
that write prompts. Write a prompt to write a prompt, then review that, then run
the prompt. That's the best way to go. The AI speaks AI better than you._

---

**Cheers Robert, one of the more fruitful random coffee shop conversations I've
had.**

He had a sketchbook with him, and got me to photograph a couple of pages before
I left. Not the Edinburgh statues he'd described (from over a decade ago), but
pen studies of insects, flowers, shells, and shapes coming apart.

<figure style="max-width: 78%; margin: 0 auto 1.5em;">
  <img src="{{ '/assets/pics/2026-09-hooker-sketchbook-1.jpg' | relative_url }}" alt="Sketchbook page of pen drawings of insects, flowers, and geometric forms" style="width: 100%;">
  <figcaption>Pen studies from Robert's sketchbook. The note in the bottom right reads "simple representation becoming more complex".</figcaption>
</figure>

<figure style="max-width: 78%; margin: 0 auto 1.5em;">
  <img src="{{ '/assets/pics/2026-09-hooker-sketchbook-2.jpg' | relative_url }}" alt="Open sketchbook spread with flowing abstract pen drawings" style="width: 100%;">
  <figcaption>Another spread, in the coffee shop where we'd been talking.</figcaption>
</figure>

We chatted a bit more off the record after that, and then I finished my coffee
and carried on with my day.
