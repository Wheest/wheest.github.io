---
layout: post
title:  "Open Source: PyTorch Lightning CIFAR"
date:   2022-05-03 16:20:00 +0000
categories: blog
tags: ai pytorch open-source computer-vision
excerpt_separator: <!--more-->
---

![](/assets/lightning.png)


I released my code for [PyTorch Lightning CIFAR](https://github.com/Wheest/pytorch-lightning-cifar/tree/master) on GitHub, free under the MIT License.
It is a fork of the classic [PyTorch CIFAR](https://github.com/kuangliu/pytorch-cifar) codebase from [@kuangliu](https://github.com/kuangliu), adding support for the productive research tooling that [PyTorch Lightning](https://www.pytorchlightning.ai/) package brings.
I also include accuracies for the models trained using 200 epochs.

<!--more-->

**Why is this useful?**

CIFAR-10 is a small image classification dataset, which can be useful for validating research ideas (since models are smaller, and cheaper to train).
It has two key advantages over the MNIST database in that the problem is a bit harder, and the images are non-greyscale.
However, when doing research, you want to be able to have access to as much functionality as possible, without having to write a lot of boilerplate code.
That is the design philosophy of the PyTorch Lightning library, hence why combining the two together makes sense.
Note that few (if any) of these model architectures can be considered "official implementations", since the architectures have to be changed slightly to support the different data sizes.
However, I have seen these models used in research, you need merely say that the models are defined for CIFAR10 (and ideally cite this repo, see the righthand side of the GitHub page!).
