---
layout: post
title:  "Open Source: Webcam Timelapse with Human Detection"
date:   2023-05-02 12:00:00 +0000
categories: blog
tags: thesis python open-source object-detection yolo
excerpt_separator: <!--more-->
---

<img src="/assets/pics/desk_cheese.png" width="1024">

30 days of thesis writing (64% of my active working hours!), and version 1.0 is ready!

I catalogued this journey with a timelapse, produced using a tool I developed called [`desk-cheese`](https://github.com/Wheest/desk-cheese).

See more info by expanding this post.

<!--more-->

Here's what that month of thesis writing looked like:

<iframe width="560" height="315" src="https://www.youtube.com/embed/RyBp20dV-Qo" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

I've [open-sourced the tool](https://github.com/Wheest/desk-cheese) I made to produce the video under an MIT license.  `desk-cheese` takes periodic webcam photos, and uses the [YOLOv3 DNN model](https://arxiv.org/abs/1804.02767) to filter out pictures which don't have people in them.

The actual photo taking is managed by [fswebcam](https://www.sanslogic.co.uk/fswebcam/), a bash script, and a cronjob.  For filtering the generated images, YOLOv3 is running on the CPU using [OpenCV's DNN backend](https://opencv.org/).  This isn't the most performant, especially for someone who's PhD is ostensibly in accelerating deep learning workloads.  However, given the model is not going to be running a lot, this is the most portable and lowest effort solution.

The `filter_imgs.py` script processes all of the generated images, and generates a list of images that have a human in them, and those that don't.  Since we're using a slower backend, and the number of images is potentially very high, I've implemented a caching system, so if you've run the script before, it won't run inference on images that have already been processed.

There are also scripts that can generate GIFs and MP4s of the timelapse.

Anecdotally, I found that having the tool run every 20 minutes helped with my accountability and productivity for the month.  Knowing that a photograph of me was going to be taken soon added additional friction to the temptation to procrastinate.

> Why the name?

The tool is intended to run while one is working at one's desk, and "cheese" is [something people say in English to smile when they are being photographed](https://en.wikipedia.org/wiki/Say_cheese).
