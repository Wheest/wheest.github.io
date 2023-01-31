---
layout: post
title:  "PACT Paper: Transfer-Tuning"
date:   2022-10-12 20:20:08 +0000
categories: blog
tags: ai dnns cnns tvm compilers auto-scheduling tuning
excerpt_separator: <!--more-->
---

![](/assets/transfer-tuning.png)

I was delighted to have our paper "Transfer-Tuning: Reusing Auto-Schedules for Efficient Tensor Program Code Generation" accepted in the [PACT 2022](https://pact22.cs.illinois.edu/) conference in Chicago, where I was first author.
You can view the paper on [arXiv here](https://arxiv.org/abs/2201.05587), or from [ACM](https://dl.acm.org/doi/10.1145/3559009.3569682).

I presented a 25 minute presentation on the paper in person, as well as a poster.
We also submitted an artifact for review, the code for which you can find [here on GitHub](https://github.com/gicLAB/transfer-tuning).  Our paper received all 3 [artifact evaluation stamps](https://www.acm.org/publications/policies/artifact-review-and-badging-current).

In short, transfer-tuning is an approach which allows us to achieve some of the speedups from auto-scheduling systems like [Ansor](https://www.usenix.org/conference/osdi20/presentation/zheng), in a fraction of the search time.

For more details, please check out the [full paper](https://arxiv.org/abs/2201.05587)!

<!--more-->
