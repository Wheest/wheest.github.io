---
layout: post
title:  "Penguin eating a Tiger(lake): Fixing high battery usage on GNU/Linux+Intel"
date:   2022-05-29 14:39:00 +0000
categories: blog
tags: intel cpu laptop battery linux
excerpt_separator: <!--more-->
---

![](/assets/penguin.png)

I recently got a new laptop, a ThinkPad P14s, as part of a project I undertook at the university.
However, despite an advertised 10 hour battery life, I found that it was going from 100% to 0% charge in under an hour.
That's fine in a work-from-home situation, however I'm hoping as the world gradually opens up, I'm keen to become Mr Worldwide 😎, so an hour is not going to be enough for me.
I eventually figured out a solution, however there was not clear documentation of this online.
This post documents what I found, and how I fixed it.

<!--more-->

**Update 2022-11-08**

Recent updates to components such as the BIOS and the kernel have allowed me to control the CPU and fan pressing `Fn + l` to set the fan/CPU on energy saving mode (which lowers the noise while also throttling the CPU).
This can be reverted by pressing `Fn + h`, which sets the fan/CPU to performance mode.
I will leave my original description of the steps I took prior to this, which may be valuable if you still have issues.

**Original post**

After some searching, I found [a post from u/dathislayer](https://www.reddit.com/r/linux/comments/u7zxa0/psa_for_intel_tiger_lake_dynamic_tuning_laptops/) that discussed how the Intel Tigerlake line of CPUs have a system called "dynamic tuning".
Namely it can vary the clock speed of the CPU while it is running, which can save battery life.
However, upon checking my own CPU frequency, I saw that it was running at the so-called "Max Turbo" frequency of 4.80 GHz all the time, which explained the battery drain.
[The thread suggested](https://www.reddit.com/r/linux/comments/u7zxa0/psa_for_intel_tiger_lake_dynamic_tuning_laptops/) setting the following variable `dev.i915.perf_stream_paranoid=0` (configured via `sysctl.d`).
However, unfortunately this did not seem to have an impact.

Luckily, I now had a likely reason for the battery issue, and was free to explore other solutions myself.
I read the [Debian documentation about CPU frequency scaling](https://wiki.debian.org/CpuFrequencyScaling), which mentioned 2 tools: `cpupower` and `cpufrequtils` which are used to get information about and control the CPU frequency.
After installing these two tools, I found immediately that my battery consumption went down significantly.
However, after a few hours of use, I found that some of my activities felt more sluggish, some applications felt slower.
Running `cpupower frequency-info` showed me the issue: my CPU frequency was being set to the lowest possible value.

This led me to investigate what the "governor" is: essentially the rules used to dynamically set the CPU frequency, e.g. to focus more on saving battery, or on getting the best performance.
You can read more about governors in the [Linux Kernel documentation](https://kernel.org/doc/Documentation/cpu-freq/governors.txt).
However, I found that by default I only had two governors available: `performance` and `powersave`.
After further investigation, I discovered that this was because my driver was `intel_pstate`.
By changing the driver `acpi-cpufreq`, I now have the complete set of governors available.
I have set the governor to `ondemand`, and have found that my battery/performance trade-off is working well so far.
I set the driver by adding `intel_pstate=disable acpi=force` to the `GRUB_CMDLINE_LINUX_DEFAULT` line of `/etc/default/grub`, then running `sudo update-grub` and rebooting.
For more details on this, please refer to [this post](https://stackoverflow.com/questions/52477213/how-to-forcefully-disable-intel-pstate-intel-pstate-is-enabled-on-reboot-even-w).
