---
layout: page
title: Open Source Contributions
permalink: /oss
exclude: true
---

<style>
.sidebar__right {
  text-align: left;
}
.page__content {
  text-align: justify;
}
</style>

This page tracks open source contributions I've made over the years.
It is incomplete, but should paint a picture.
For open source projects which I have made myself, see the "Own Projects" heading below.

### 2024

#### **MLIR/LLVM**:  [mlir] Fix remove-dead-values pass throws error when module has a name

[GitHub PR #109990](https://github.com/llvm/llvm-project/pull/109990).
Encountered a bug when using [OpenXLA's StableHLO](https://openxla.org/stablehlo), which gives MLIR modules names (`module @IrToHlo.6443`).
This caused the `remove-dead-values` pass to throw an error, since it was expecting a module without a name.  Could not find a good reason for this, so I fixed it, providing a test case to ensure it doesn't regress.

#### **Docker Suno API**:  Improved docker compose integration
[GitHub PR #115](https://github.com/gcui-art/suno-api/pull/115).
This repo provides an API to the [Suno AI music generation tool](https://suno.com/).
I used it as part of another project I was working on.
However, this project used a containerised approach (for better modularity and security controls/clear trust boundaries).
This PR made the project more amenable to this goal.

#### **MLIR/LLVM**: [mlir] Retain original identifier names for debugging

[GitHub PR #79704](https://github.com/llvm/llvm-project/pull/77820).
Currently under active development, with a [high volume of discussion on the LLVM developer forums](https://discourse.llvm.org/t/retain-original-identifier-names-for-debugging/76417/23).
This feature aims to add a flag to `mlir-opt` to keep the original names, which can be helpful for debugging compiler pipelines.
Right now, identifier names are made anonymous, e.g., `%my_input` becomes `%arg0`.  Meaningful variable names can make it easy to reason about behaviour, hence why this feature is valuable.
[Three designs are under consideration](https://discourse.llvm.org/t/retain-original-identifier-names-for-debugging/76417/24?u=wheest), although since this touches the core of MLIR, it is key that caution and careful consideration is used before merging.

<!-- #### **MLIR/LLVM**: [mlir][docs] Clarified Dialect creation tutorial + fixed typos -->

<!-- [GitHub PR #77820](https://github.com/llvm/llvm-project/pull/77820). -->
<!-- This PR adds clarification to the ["Creating a Dialect" tutorial](https://mlir.llvm.org/docs/Tutorials/CreatingADialect/) regarding how to register a dialect (especially globally). -->
<!--  The motivation for this came from trying to add my own dialect, and experiencing some friction since it had been a while. -->
<!--  [This forum post](https://discourse.llvm.org/t/how-to-register-a-dialect/66848/2) discusses the issue, but doesn't talk about the global reigstration approach. -->

<!--  [I created my own blogpost](https://gibsonic.org/blog/2024/01/11/new_mlir_dialect.html) which goes through a minimum working example in more detail, with stripped down TableGen files, but this level of detail might be overkill for the docs tutorial. -->

<!--  This PR also includes some spelling corrections across the `mlir` directory.  The methodology for this was conservative, using the [codespell tool](https://github.com/codespell-project/codespell), and using my own discretion for correction.  Corrections were only on comments and docs.  To keep the PR small, only a fraction of the identified errors were corrected -->

#### **Triton**:  [TESTING] Added precision option to benchmark CSV data saving

[GitHub PR #2933](https://github.com/openai/triton/pull/2933).
Triton has a built in benchmarking suite, however I discovered that it was saving data with an unusually low level of precision (`.1f`).
In this patch, I made the precision user-configurable, and set the default to 6.
I do not think the downsides of higher precision, namely larger file sizes for the CSVs, is relevant compared to the downsides of losing data.
By making the value configurable, this gives us the best of both worlds.

#### **Triton**: [CLEANUP] Fix typos across the project

[GitHub PR #2876](https://github.com/openai/triton/pull/2876).
This PR came from my initial reading of the documentation, and identification of a few spelling errors that impacted readability.
After a suggestion from one of the maintainers, I used the automated spell checking tool [`codespell`](https://github.com/codespell-project/codespell) to do a more general cleanup of the codebase.

I was conservative in my correction criteria:

- codespell provided suggestions, but I used my own discretion when applying them
- I ignored anything in the third-party directory
- Corrections were only on comments and docs, no code (even if a variable name was clearly a typo). Exceptions to this include:
  - An error message string in `AxisInfo.cpp`
  - An error message string in `hip.c`
  - An error message string in `WSPipeline.cpp`
  - Docstrings in tablegen files (still documentation, but is compiled)

### 2023

####  **Apache TVM** [fix][relay][qnn] Bug fix for 8-bit quantized mul

[GitHub PR #14286](https://github.com/apache/tvm/pull/14286).
I identified that there was a case where operations within quantized CNN models were not being supported adequately.
I reproduced the error with [this gist](https://gist.github.com/Wheest/bd4fd601a15d6813e45c9ed5cdbae64f).
Upon closer inspection, I identified that the issue is related to the "Squeeze-and-Excitation block", where we multiply the output of a sigmoid with an earlier output, found in models such as [EfficientNet](https://arxiv.org/abs/1905.11946).
This broke some of the assumptions of how quantization mul operations were implemented in TVM.
I fixed the bug.

### 2022

#### **Apache TVM**:  [docs] Update debugger.rst

[GitHub PR #11231](https://github.com/apache/tvm/pull/11231).
TVM's debugger and profiler is a very powerful tool, but was/is quite new and underutilised.
The documentation did not reflect its correct usage, and I [had to reverse engineer how it was implemented](https://discuss.tvm.apache.org/t/runnig-a-model-with-tvm-debugger/9869/8?u=wheest).
My PR updated the documentation to reflect how the debugger can actually be used.


#### **MLIR/LLVM**: [mlir][docs] Broken link in MLIR Toy docs

[Phabricator #D133977](https://reviews.llvm.org/D133977)
A minor documentation fix, such that the Toy tutorial (many user's first experience of MLIR, and a common reference point for MLIR developers) correctly linked to the correct location.


### 2021

#### **Apache TVM**:  Better grouped convolution for CPU targets

[GitHub PR #6137](https://github.com/apache/tvm/pull/6137).
This pull request replaced the original grouped convolution algorithm in TVM for x86 and Arm targets, with the faster Grouped Spatial Pack Convolutions (GSPC) algorithm.
I developed this algorithm in my ASAP'2020 paper ["Optimizing Grouped Convolutions on Edge Devices"](https://www.computer.org/csdl/proceedings-article/asap/2020/09153227/1lUFnVBpKzC).
This is now the default algorithm used in TVM for all CPU code for grouped convolutions.

#### **pypylon**: Update setup.py to fix #296 (deprecate version)

[GitHub PR #314](https://github.com/basler/pypylon/pull/314).
This PR officially deprecated support for an old version of Pylon (5), since it was no longer supported in other parts of the system.
This ensured that users with the old version installed would not encounter issues.

### 2020

#### **Apache TVM**: Asymmetric padding and dilation in conv2d workload

[GitHub PR #7142](https://github.com/apache/tvm/pull/7142).
The goal of this pull request was to make asymmetric padding and dilation a first-class citizen in 2D convolution.
The previous workload description had `hpad` and `wpad`, however this is not representative of all of the possible configurations. Most conv2d implementations in TVM already support asymmetric padding in their algorithm, so by allowing workload description to reflect this, it could be exploited.

The process of developing this PR also uncovered a bug, where the output dimensions were not being properly calculated for `fallback_schedules`. Both asymmetric padding and dilation were not being considered properly, which was leading to some untested incorrect behaviour. For some cases, this could perhaps result in a schedule with a performance regression, but this has not been tested.
I fixed the bug, and added a test case.

### Own Projects

#### 2024

[Triton Samples](https://github.com/Wheest/triton_samples):  Some home-brewed Triton kernels, with varying degrees of optimisation

#### 2023
- [Desk Cheese](https://github.com/Wheest/desk-cheese)
- [bib-boi](https://github.com/Wheest/bib-boi)
- [thesis-o-meter](https://github.com/Wheest/thesis-o-meter)
- [Glasgow-Thesis-Template](https://github.com/Wheest/Glasgow-Thesis-Template)

#### 2022

- [pytorch-lightning-cifar](https://github.com/Wheest/pytorch-lightning-cifar)
- [transfer-tuning](https://github.com/gicLAB/transfer-tuning)
- [StyleGAN2-ADA](https://github.com/Wheest/stylegan2-ada-pytorch)
