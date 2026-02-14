---
layout: post
title: "How to Instantly Open Files at Specific Positions in KDE Konsole"
date: 2024-01-21 12:00:00 +0000
categories: blog
tags: dev workflow
excerpt_separator: <!--more-->
---

<img src="/assets/pics/2024_konsole_header.png" width="1024">

I often use KDE Konsole for running terminal commands, but sometimes I'm using a
tool (e.g., a compiler) which outputs a file path, as well as a line number,
which I may want to open in my text editor. E.g.,

```sh
2 errors generated.
In file included from /home/proj/lib/AsmParser/Parser.cpp:13:
/home/proj/include/mlir/IR/MLIRContext.h:253:18: error: use of undeclared identifier 'Operation'; did you mean 'operator'?
```

Wouldn't it be handy if we could just click on/select the file in the terminal
output, and open it in our text editor in the right place? This would reduce
friction when debugging, potentially increasing productivity.

<!--more-->

This isn't default behaviour in Konsole, however with a very small amount of
configuration we can allow it. At time of writing, I'm using Konsole Version
22.12.3, so these steps may have changed slightly for you.

First thing you need to do is open your Konsole configuration panel
(Settings->Configure Konsole, or `Ctrl+Shift+,`). Our solution is configured on
a per-profile basis, so select the profile you want to edit (probably your
default profile), and click "Edit".

Next, select Mouse on the left panel, and then select Miscellaneous ribbon at
the top (see screenshot below):

<img src="/assets/pics/2024_konsole_0.png">

Next, you should select the "Underline files" option, as well as the "Open
files/links by direct click". Finally, edit the "Text Editor Command" to match
your text editor of choice.

<!-- <img src="/assets/pics/2024_konsole_1.png" alt="Configured settings"> -->

For me, it had to be Custom, as there's some additional arguments I needed to
configure. Editing the default command (which should look something like
`kate PATH:LINE:COLUMN`), we see some documentation of the variables we have
available:

> The format is e.g. 'editorExec PATH:LINE:COLUMN'
>
> PATH will be replaced by the path to the text file
>
> LINE will be replaced by the line number
>
> COLUMN (optional) will be replaced by the column number Note: you will need to
> replace 'PATH:LINE:COLUMN by the actual syntax the editor you want to use
> supports; e.g.:
>
> gedit +LINE:COLUMN PATH
>
> If PATH or LINE aren't present in the command, this setting will be ignored
> and the file will be opened by the default text editor.

For me, that is `emacsclient +LINE:COLUMN -n PATH`. Apply, and exit, and our
desired behaviour should now be available!
