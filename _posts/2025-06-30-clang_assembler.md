---
layout: post
title:  "Calling Clang's Assembler from C++"
date:   2025-06-30 10:00:00 +0000
categories: blog
tags: c++ compilers llvm clang assembler
excerpt_separator: <!--more-->
---

<img src="{{site.url}}/assets/headers/2025-04-petit-pois.png" width="1024">

LLVM is a collection of modular and reusable compiler and toolchain technologies.
It provides a set of libraries and tools for building compilers, assemblers, linkers, and other related tools.

In a project I was working on, we were using the `clang` part of this project to compile C and LLVM IR code.
The code path for these two sources was similar enough that we could have a single `compile` function that passed all the configuration flags for our usecase.

However, for a new feature, I was generating assembly files directly and wanted to assemble them into an object file.
This post briefly explains how I got this working and how you can use you can use the `clang` libraries to assemble assembly files in C++.

<!--more-->

As a normal user of the `clang` CLI tool, the workflow is the same:

```sh
clang -c my_asm.s -o my_obj.o  # same interface for C and assembly (.s)
clang -c main.c -o my_obj.o
```

However, this approach didn't work when trying to use the `clang` libraries in C++.
I encountered several errors, with unrecognised flags.
Some were easy to fix as they were just flags that were specific to C or LLVM IR that I didn't need for assembly.
However, one recurring one I got was `Error: unknown argument: '-filetype'`.
This seemed to be inserted automatically when setting up the job, and wasn't something I could easily remove.

I thought I'd go back to basics, and think about how the `clang` toolchain works under the hood.
I was curious about what flags were being inserted under the hood, so I ran:

```sh
clang -### -c my_asm.s 2> cc1_dump.txt
```

This command printed all the flags passed to the underlying program:


```
clang version [redacted]
Target: [redacted]-linux-gnu
Thread model: posix
InstalledDir: /usr/bin
 (in-process)
 "/usr/lib/llvm-[redacted]/bin/clang" "-cc1as" "-triple" "[redacted]-linux-gnu" "-filetype" "obj" "-main-file-name" "test_tensor.s" "-target-cpu" "[redacted]" "-fdebug-compilation-dir=/tmp/[redacted]" "-dwarf-debug-producer" "clang version [redacted]" "-dwarf-version=[redacted]" "-mrelocation-model" "pic" "-o" "my_obj.o" "my_asm.s"

```

You'll note that `clang` infers from the file extension that it is an assembly file, and so passes the `-cc1as` flag.

It's worth noting that the `clang` executable isn't really a compiler, it's a compiler _driver_.
`clang -cc1` is the compiler, and `clang -cc1as` is the assembler, and these are flags that are passed to the `clang` driver to invoke the appropriate tool.
It can also infer the type of file being compiled based on the file extension, and will pass the appropriate flags to the underlying tools.
However, when we're using the `clang` libraries directly in C++, we're responsible for calling the `cc1as` program directly to assemble assembly files.

The main program that `cc1as` uses is defined under [`clang/tools/driver/cc1as_main.cpp`](https://github.com/llvm/llvm-project/blob/2e7aa7ead6808047df2b7b56bfc725ffc3685e43/clang/tools/driver/cc1as_main.cpp), and adapting this was enough to get this feature working.
