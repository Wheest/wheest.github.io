---
layout: post
title:  "Building an old version of gcc, a journey of errors and solutions"
date:   2019-08-08 10:15:08 +0200
categories: tools
tags: gcc compilers devops tools build
excerpt_separator: <!--more-->
---

<img src="/assets/gnu.png" width="1024">

Hello neighbours.  Another dry one today, intended first and foremost for myself before I wrote this post, and secondly for anyone coming after me in a similar boat.

Due to working on a reproducibility study, it was necessary for me to build some old compiler versions, that no longer existed on package repositories.

I encountered a number of build errors during this time, and have documented how I solved them.  As a post, it isn't bringing many insights, and serves as a curation of disparate Stack Overflow and other sources that I used to solve my issues.

<!--more-->

This guide was created via a Debian-based distribution, but you should be able to apply it to others.  I'm running on an x86 system, and due to some errors was forced to use the configure flag `--disable-multilib`.  Only use this if you encounter the relevant error described below.

First, you need to download the gcc source code using svn.  For example, to get version 4.5.1, use

`svn co svn://gcc.gnu.org/svn/gcc/tags/gcc_4_5_1_release gcc`

For other versions, see [the gcc docs](https://gcc.gnu.org/svn.html).  The SVN tag for GCC X.Y.Z is of the form gcc_X_Y_Z_release.

Make the gcc directory your working directory, and run

`./configure --prefix=$(pwd) --enable-languages=c,c++,fortran --disable-werror`

When this suceeds, you can then run:

`make bootstrap-lean -j4`

Ultimately, I wanted an installable `.deb` package, so once compiling was finsihed, I ran `checkinstall`.  Make sure to set a version number during configuration.

Now, here are the errors I encountered, and how I fixed them.  Solutions were discovered via search-engine-fu, and trial & error.

## The errors and their solutions

### Error:

`configure: error: Building GCC requires GMP 4.2+, MPFR 2.3.1+ and MPC 0.8.0+.`

### Solution:

Install these packages from your package manager:

```
apt-get install libmpfr-dev libmpfr-doc libmpfr4
apt-get install libgmp-dev
apt-get install libmpc3 libmpc-dev
```

### Error:

`gcc: error: gengtype-lex.c: No such file or directory`

### Solution:

Install the flex program, which "Generates programs that perform pattern-matching on text."  Something something flexing on these mfs.

`apt-get install flex`

The error may occur again.  If so, rerun the `./configure` stage, but dropping the `--disable-werror` flag.

`./configure --prefix=$(pwd) --enable-languages=c,c++,fortran --disable-werror`

Then compile again.

`make bootstrap-lean -j4`

To me, this was just a magic heuristic I guessed, trying to figure out why it works was not productive for me.

### Error:

`/usr/include/features.h:364:25: fatal error: sys/cdefs.h: No such file or directory`

### Solution:

Install the package

`apt-get install g++-multilib`

Packaged with it is some tool which is includes `sys/cdefs.h`.

### Error:

```
In file included from ../../.././libgcc/../gcc/unwind-dw2.c:333:0:
../../.././libgcc/../gcc/config/i386/linux-unwind.h: In function 'x86_fallback_frame_state':
../../.././libgcc/../gcc/config/i386/linux-unwind.h:138:17: error: field 'info' has incomplete type
```

### Solution:

In the file `gcc/config/i386/linux-unwind.h`, line 138, replace `struct siginfo info;` with `siginfo_t info;`.

Or, more easily, you could run the `patch` command, with a diff I promise isn't malicious!

I can only guarantee this will work for 4.5.1 (_not a guarantee_).

```
wget https://gist.githubusercontent.com/Wheest/bdd5bc7d487061e5c973f0fba4b96c47/raw/31033a6c5e8d7811ae0a81c2e4c9adea2359a822/unwind.patch -O /tmp/unwind.patch

patch -p0 -b --ignore-whitespace --fuzz 3   < /tmp/unwind.patch
```

### Error:

`/usr/bin/ld: cannot find crti.o: No such file or directory`

### Solution:

Disable multi-lib support.  Defintely think about whether or not this solution is right for you.

`./configure --prefix=$(pwd) --enable-languages=c,c++,fortran --disable-werror --disable-multilib`

You may also need to run:

```
LIBRARY_PATH=/usr/lib/x86_64-linux-gnu:$LIBRARY_PATH
export LIBRARY_PATH
```

### Error:

`../.././gcc/double-int.h:24:17: fatal error: gmp.h: No such file or directory`

`../.././gcc/real.h:26:17: fatal error: gmp.h: No such file or directory`

### Solution:

Install the following packages:

`apt-get install libgmp3-dev libgmp-dev`

Make a symbolic link to the header file:

`ln -s /usr/include/x86_64-linux-gnu/gmp.h /usr/include/gmp.h`

You may also need to rerun `./configure`

## Conclusion

Hopefully this solved all of the issues you had, but I'm sure are that weren't listed here could be corrected through other means.

I was finally able to get my `.deb` package and continue on my merry way.

## Update 2021-09

I was recently contacted by a reader [Ali Abdul-Kareem](https://github.com/Haiderahandali) who experienced some of these issues, even on the latest version of `gcc`.  They shared some additional steps that were necessary for their success, which I got permission to paraphrase here:

> When you fix an error like: `gcc: error: gengtype-lex.c: No such file or directory`, or any other error really, and you run `make` again, it will (probably) report an error with something along the lines of: `make recipe failed`,
and it will exit the program.
> I encountered it multiple times and the easiest solution for me was remove everything and start again.
> Or you can simply remove the cached files (it will report which cached files, but it will be much earlier in the terminal output).
> I simply removed the build directory and started again.
> I experienced an error `recipe for target bootstrab lean failed`, if you read the output there is almost nothing but scrolling way up will read (`error cached files doesn't match for gmp` or something similar).
> Removing the cached files seemed to fix this.
