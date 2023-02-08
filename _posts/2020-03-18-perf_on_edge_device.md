---
layout: post
title:  "Installing perf on a development board (e.g. RPi4)"
date:   2020-03-18 09:00:00 +0000
categories: systems
tags: raspberry-pi systems linux perf
excerpt_separator: <!--more-->
---
<img src="/assets/rpi3/rpi_perf_header.png" width="1024">

I recently had a colleague encounter some troubles using `perf` on a new Raspberry Pi 4 device.

Normally you would install it from a package repository (e.g. using apt, and the package name `linux-tools`).

However, when you're on a non-x86 platform, you cannot always rely that there will be packages for you device, and even if there are, they might be broken in subtle and frustrating ways.  This was the case for my colleague.

Luckily, I had encountered a similar issue on an ODROID device, and had kept my notes.  I've adapted the notes into an email to the colleague, and thought I might as well post it here.

<!--more-->

The solution is to build `perf` yourself.

Don't worry though, through trial and error a long-dead version of me has some commands for you, and it shouldn't take too long.

First, make sure we've got all the dependencies to build `perf` properly:

```
sudo apt-get -y install flex bison libdw-dev libnewt-dev binutils-dev libaudit-dev libgtk2.0-dev binutils-dev libssl-dev python-dev systemtap-sdt-dev libiberty-dev libperl-dev liblzma-dev libpython-dev libunwind-* asciidoc xmlto
sudo apt-get -y install flex bison
```

Next, get the source code for `perf`.  It is part of the Linux kernel source tree, thus the full git history is massive.  Therefore we'll use the `git clone` flag `depth` to ensure that we only get one commit, and reduce our download size.

```
git clone --depth=1 --branch rpi-4.19.y https://github.com/raspberrypi/linux
```

Note we're also using the Raspberry Pi fork of the Linux kernel.  idk yet what is different about it, but my journal says to use this, and who am I to question my past self?  This should work on other devices, though some development boards might need to use the developer's kernel fork, e.g. Hikey or ODROID.  Be sure to get the correct branch for the kernel version of your device.  Here, we use `rpi-4.19.y`.  To double check, run `uname -a`.  On the Raspberry Pi 4 I got `4.19.97-v7l+`, thus we are using kernel version 4.19.

Next, let's build only `perf`, rather than the whole kernel:

```
cd linux
make -C tools/perf/
```

Now, let's test if that worked:
```
cd tools/perf
sudo ./perf list
sudo ./perf stat  -e L1-dcache-load-misses sleep 10
```

Those last two commands should have given output.  If it did, copy the binaries to if it works, `/usr/bin`, and you can now use `perf` for whatever activities you desire!

On the Raspberry Pi 4, you might find that the counter is not available.  In fact, running `sudo ./perf stat -a sleep ` you might only get very simple counters.  A hot fix might be to edit the file `/boot/config.txt`, and set `arm_64bit=1`.  Reboot your device, and you should get more counters.

If not, I'm sorry...
