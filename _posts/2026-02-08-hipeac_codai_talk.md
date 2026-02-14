---
layout: post
title: "Invited talk at CODAI, HiPEAC 2026"
date: 2026-02-08 12:20:08 +0200
categories: blog
tags: talks compilers hipeac
excerpt_separator: <!--more-->
---

<img src="{{site.url}}/assets/headers/2026-02-hipeac.png" width="1024">

I was delighted to be invited to both give a talk, and participate in the panel
discussion at the [CODAI workshop](https://www.codai-workshop.com/home)
(Workshop on Compilers, Deployment, and Tooling for AI) at HiPEAC 2026 (Kraków,
Poland).

My talk, titled “The Compiler Before the Horse: Design Space Exploration at
Fractile,” focused on how investing in compiler development early in our
hardware design process has been essential for effective design space
exploration and for making well-informed architectural decisions.

<!--more-->

The stream was recorded, and is available from the
[CODAI website](https://www.codai-workshop.com/2026-recording).

I tried to keep the tone light, and may have overdone it with my extended
metaphor. Beating a dead horse, if you will.

In an age of easy, high-quality generative images, I had some fun old-school
editing together my own images.

<figure style="width:66%; margin: 1em auto; text-align: center;">
  <img src="{{ site.url }}/assets/pics/2026-01-one_trick_pony.png"
       alt="Not a one trick pony"
       style="width:100%; height:auto;">
  <figcaption>not a one trick pony!</figcaption>
</figure>

The first part of the talk mirrored a lot of the themes in my [C4ML talk in
Vegas]({% post_url 2025-03-02-c4ml_vegas %}) in 2025, namely that we found a lot
of success developing quick and dirty prototypes of the compiler using the MLIR
Python bindings. We even got an end-to-end compilation and functional simulation
of Llama2-7B, which was a great validation of our team, our design, and our
high-level architecture.

I then discussed how the organisation has changed, and how as we approach
tape-out, we have been nailing down the minutiae of our programming model, and
how that interacts with our architecture.

The message I was trying to sell was that the compiler team, and staff at
Fractile in general, have been empowered to make functional software early, to
better understand the shape of our design space, and use that to inform our
conversations with architects.
