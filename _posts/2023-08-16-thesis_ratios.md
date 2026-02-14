---
layout: post
title: "Thesis Analysis: Gender Ratios"
date: 2023-08-16 10:00:00 +0000
categories: blog
tags: thesis python open-source llm
excerpt_separator: <!--more-->
---

<img src="/assets/pics/thesis_investigation.png" width="1024">

I recently submitted my PhD thesis, in which I cited 1741 authors (1392 unique
authors) over 319 papers. I was interested in the composition of my
bibliography; therefore I've cobbled together
[some code](https://github.com/Wheest/bib-boi/blob/main/bib_stats.py) to analyse
it. The first analysis I have run estimates the gender ratio of the authors I
cite. The most reliable estimate of my gender ratio is 11.6-to-1 for
men-to-women. I discuss my methodology more below.

<!--more-->

Let's talk methodology! The code guesses the authors’ gender based on first
names. This has a number of limitations. On an individual basis, a first name is
not a reliable estimate of gender for a variety of reasons. The most reliable
method of determining someone’s gender is self-identification. Further, for the
purposes of this basic analysis, I will be only considering male, female,
ambiguous, and unknown. This leaves out a variety of other designations across a
range of cultures — as any C programmer can tell you, you can fit a lot more
than two values in a boolean. That said, for the sake of this casual project, I
will assume that on average, first names tend to be associated with gender, and
that a majority of the authors cited fall into the aforementioned categories.
This is an estimate, and not a definitive measurement!

My first technique uses the
[`gender-guesser` Python library](https://pypi.org/project/gender-guesser/),
which does a lookup from a predefined list. However, I found that it didn't
handle names from colleagues with South or East Asian names reliably (European
names appear to be reliable, though I am unsure of other regions).

Overall, here are the results of the `gender-guesser` approach:

| **Stat**                  | **Number** |
| ------------------------- | ---------- |
| Number of authors         | 1741       |
| Number of men (est)       | 951        |
| Number of women (est)     | 103        |
| Number of ambiguous (est) | 336        |
| Number of unknown (est)   | 348        |
| Male-Female ratio (est)   | 9.2330     |

Overall, the ratio is 9.2 men for every woman. There are 336 unknown names of
ambiguous gender and 348 names of unknown gender.

As an alternative, I also made a version which uses an LLM (large language
model). My hope is that a neural network trained using recent web data will be
able to draw from a wider cultural base of data. For this purpose I use OpenAI's
[`gpt-3.5-turbo-16k` model](https://community.openai.com/t/gpt-3-5-turbo-0613-function-calling-16k-context-window-and-lower-prices/263263),
which has a large enough context window for my purposes, as well as what is
considered good performance on other language tasks. Note that many LLMs are not
deterministic, and although I set the temperature value to 0, I still observe
differences using the LLM between runs. Therefore, I run the model 5 times and
take the average, rounded to the nearest integer.

You can see the results for the LLM approach below:

| **Stat**                  | **Number** |
| ------------------------- | ---------- |
| Number of authors         | 1741       |
| Number of men (est)       | 1509       |
| Number of women (est)     | 130        |
| Number of ambiguous (est) | 8          |
| Number of unknown (est)   | 85         |
| Male-Female ratio (est)   | 11.6077    |

As you can see, we have significantly fewer unknown and ambiguous names, however
most of these names have been filed as men, thus our male-female ratio has
increased. I cannot say definitely that this is more accurate, however it
correctly guesses names which I know the `gender-guesser` method got wrong.
Therefore, I consider this method to be the more reliable one, even if this
designation is not based on solid metrics.

Now, let's compare against my field, to see if I beat the average. According to
the British Computer Society, the gender ratio of people starting computer
science degrees in the UK was 4.3-to-1 in 2022
[[source]](https://www.bcs.org/articles-opinion-and-research/women-choosing-computing-degrees-in-record-numbers/),
which is significantly lower from the ratio of my thesis bibliography.

However, I am working in a specific research field, and current undergrad
statistics may not reflect the current research community. Therefore, I also
downloaded the papers from the four previous
[PACT conferences](https://dl.acm.org/conference/pact) (download in bulk from
the IEEE/ACM websites), where my work on
[transfer-tuning](https://gibsonic.org/blog/2022/10/12/transfer-tuning.html) was
accepted in 2022. Both the ACM and IEEE collect gender statistics, but I was not
able to find them published for my area of interest. I found that across the
1112 authors in my list for PACT, the ratios were 8.17 and 10.73 for the
`gender-guesser` and LLM-based approaches respectively. Therefore, I am still
citing relatively fewer women than there are in my research community, at least
according to this analysis.

Overall, it appears that the authors which I cite in my thesis bibliography are
by-and-large male. It is outwith my area of expertise to say why this is, both
in terms of the composition of the research community I operate in, and my own
selection of papers. My literature review strategies tend to target popular
conferences, and I choose papers based on the relevance of their titles and
abstracts. I rarely read the names. I also look at papers that cite papers I am
interested in using
[Google Scholar](https://scholar.google.com/citations?user=Bf-bR_UAAAAJ&hl=en&oi=ao).

While writing my thesis, I generated a lot of data, and I am simply analysing
what I have. This particular analysis could be improved by doing comparisons
between the `gender-guesser` and LLM approach to see where they disagree, as
well as validating the information by confirming the genders of the authors
included. Given most papers include contact details for the author, I could, for
example, automatically parse email addresses and send out a survey to ask the
authors directly. However, I am unsure if 1) this would be at all
appropriate, 2) what the response rate would be, and 3) if this would create a
GDPR headache for me. Overall, I am satisfied with my basic analysis, and I
encourage others to use and adapt my code, as part of my wider
[bib-boi bibliography toolkit](https://github.com/Wheest/bib-boi/blob/main/bib_stats.py).
