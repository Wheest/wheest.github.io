---
layout: post
title:  "Flashing a Hikey 970 in 2020"
date:   2020-07-11 16:20:00 +0000
categories: blog
tags: linux hikey edge
excerpt_separator: <!--more-->
---

I recently had to flash a Hikey 970 from scratch, as I did not get any response from `fastboot`.
However, the official documentation does not appear to have been updated since 2018.
Hence, this post documents the steps of how far I got.
Unfortunately I was not able to get the whole thing working, but I will update this post if I do.
If you found this post, and did get it working, please feel free to contact me so it can be updated.

<!--more-->

I started by following the official ["Getting Started" guide](https://www.96boards.org/documentation/consumer/hikey/hikey970/getting-started/).
I downloaded the [Lebuntu For HiKey970](http://www.lemaker.org/product-hikey970-download-84.html) OS image, which was released on 2018/07/04.
I tried to flash this image with `fastboot`, however when running `sudo fastboot devices`, my device did not appear.

Thus, according to the guide I had to reflash the firmware.
The guide for reflashing the firmware is [here](https://www.96boards.org/documentation/consumer/hikey/hikey970/installation/board-recovery.md.html).

I cloned the repositories:

```sh
git clone https://github.com/96boards-hikey/arm-trusted-firmware -b hikey970_v1.0
git clone https://github.com/96boards-hikey/edk2 -b hikey970_v1.0
git clone https://github.com/96boards-hikey/OpenPlatformPkg -b hikey970_v1.0
git clone https://github.com/96boards-hikey/l-loader -b hikey970_v1.0
git clone https://github.com/Mani-Sadhasivam/uefi-tools -b hikey970_v1.0
git clone https://github.com/96boards-hikey/tools-images-hikey970
```

and I prepared the shell script to build `build_bootloader.sh`.
The first problem was that I had to link `/usr/bin/python` to `/usr/bin/python2`, since the build process was only defined for `python2`, and assumed that `/usr/bin/python` was Python 2.

Next, running the build failed with the following error:

```sh
GenVtf.c:1532:3: error: ‘strncpy’ output truncated before terminating nul copying 8 bytes from a string of the same length [-Werror=stringop-truncation]
 1532 |   strncpy ((CHAR8 *) &FitStartPtr->CompAddress, FIT_SIGNATURE, 8);  // "_FIT_   "
      |   ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
GenVtf.c: In function ‘ConvertVersionInfo’:
GenVtf.c:132:7: error: ‘strncpy’ output truncated before terminating nul copying as many bytes from a string as its length [-Werror=stringop-truncation]
  132 |       strncpy (TemStr + 4 - Length, Str, Length);
      |       ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
GenVtf.c:130:14: note: length computed here
  130 |     Length = strlen(Str);
      |              ^~~~~~~~~~~
cc1: all warnings being treated as errors
```

To fix this, I removed the `-Wall` and `-Werror` flags from the `BUILD_CFLAGS` of `./edk2/BaseTools/Source/C/Makefiles/header.makefile`.
Next, the build failed with `aarch64-linux-gnu-gcc not found!`
Obviously, though it was not listed as a dependency in the guide, we need the cross-compiler for 64 bit Arm architectures installed.
For Debian based distributions the required packages can be installed with `sudo apt install gcc make gcc-aarch64-linux-gnu binutils-aarch64-linux-gnu`.

Rerunning `build_bootloader.sh`, the process got a lot further.
However, building `edk2` failed with:

```sh
GenFw: ERROR 3000: Invalid
  WriteSections64(): /tmp/hikey/edk2/Build/HiKey970/DEBUG_GCC5/AARCH64/ArmPlatformPkg/PrePi/PeiUniCore/DEBUG/ArmPlatformPrePiUniCore.dll AARCH64 small code model requires identical ELF and PE/COFF section offsets modulo 4 KB.
GenFw: ERROR 3000: Invalid
  WriteSections64(): /tmp/hikey/edk2/Build/HiKey970/DEBUG_GCC5/AARCH64/ArmPlatformPkg/PrePi/PeiUniCore/DEBUG/ArmPlatformPrePiUniCore.dll unsupported ELF EM_AARCH64 relocation 0x137.
GenFw: ERROR 3000: Invalid
  WriteSections64(): /tmp/hikey/edk2/Build/HiKey970/DEBUG_GCC5/AARCH64/ArmPlatformPkg/PrePi/PeiUniCore/DEBUG/ArmPlatformPrePiUniCore.dll unsupported ELF EM_AARCH64 relocation 0x138.
GenFw: ERROR 3000: Invalid
  WriteSections64(): /tmp/hikey/edk2/Build/HiKey970/DEBUG_GCC5/AARCH64/ArmPlatformPkg/PrePi/PeiUniCore/DEBUG/ArmPlatformPrePiUniCore.dll unsupported ELF EM_AARCH64 relocation 0x137.
```

I found [this mailing list post](https://edk2-devel.narkive.com/V1bNsa5l/edk2-patch-basetools-aarch64-add-fno-asynchronous-unwind-tables-to-cflags) about the issue, however the patch of adding `-fno-asynchronous-unwind-tables` to `GCC_AARCH64_CC_FLAGS` appears to already by present in upstream.

Therefore, beyond this point I'm not sure of the solution.
Fortunately I had another Hikey available that did work, so I was able to continue with my work.
As said at the start of this post, if you did manage to get it working, please get in touch so I can update this guide.

#### Update

I came back to this after a while, and tried to flash Lebuntu.
Instead of the original instructions, I tried following the instructions inside the `.rar` file, `lebuntu-rfs_flashing_guide.txt`.
There appear to be some errors in the instructurions.
For me, I had to turn switches 1 and 3 on, and then `cd binaries`.
Then I could run `./recovery-flash.sh`.
Note the you need to connect the USB-C connection inbetween the USB and HDMI ports (there are two, only one can be used for flashing).
It still did not work, but I got further this time.
