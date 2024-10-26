---
layout: post
title:  "Cheesing the Railcard System for Fun and Discounts"
date:   2024-10-26 11:00:00 +0000
categories: blog
tags: hack rail disclosure
excerpt_separator: <!--more-->
---

<img src="{{site.url}}/assets/headers/2024-10-rail_cheese.png" width="1024">

I recently applied for a Railcard for a friend visiting the UK.
They were eligible for a 25-30 Railcard, which offers a discount on train journeys.
However, they were from Belgium, which I found caused an edge case in the sign up form, making it appear impossible to apply for the Railcard.

This is the story of how I cheesed the system, and was able to get the discount for them despite this.

<!--more-->

For those unfamiliar, a Railcard is a discount card for the UK rail network. It’s especially beneficial for students, senior citizens, and frequent travellers looking to save on train fares.
It has an annual fee, but if you're going to be making a few journeys, it's worth it, since it gives you a third off the price of your ticket.
The discount on this journey alone covered the cost of the Railcard, making it a worthwhile investment for future trips.

### The Problem

One of the requirements was a form of ID, such as a UK driver’s license or passport. The passport was the obvious choice, so I was presented with the following prompt:

<img src="{{site.url}}/assets/pics/2024-10-railcard.jpg">

Having to type out 30 characters is a little verbose, but sure.
You might recognise the "machine readable" part of the passport, which is the two lines of text at the bottom of the passport.
An example from [wikimedia](https://commons.wikimedia.org/wiki/File:Argentine_Passport_for_Argentinian-Foreigners_citizens.png) is below:

<img src="{{site.url}}/assets/pics/2024-10-passport_example.png ">

I used OCR software to extract the text from my friend's passport and pasted in the relevant characters.
However it refused to validate because I only had 29 characters rather than 30.
What's going on?

### The Hunt

I inspected the relevant components which made up the number, and noticed that the first section before the country code was only 9 characters, whereas in the example given it was 10.

<img src="{{site.url}}/assets/pics/2024-10-railcard_2.jpg">

Odd.  As a test, I tried adding a 0 in there, but it didn't work.
I then realised that the first part was the passport number and the final character was a validity checksum.
So, I couldn’t just add zeros without making the checksum fail.

I then realised that the Belgian passport number was 8 characters long, instead of the 9 characters of pretty much every other country I polled.  I guess the Belgian government thought there wasn't enough Belgians to warrant the extra digit?

> Later, when doing this writeup, I checked what this checksum is, and it is the [Luhn algorithm](https://en.wikipedia.org/wiki/Luhn_algorithm) (aka "mod 10").  It's widely used in credit cards and other ID systems. It helps ensure that the number is entered correctly.

So, now I understood the issue, but I was still left with the problem of the Railcard registration form, which did not account for this edge case.

One approach could be to see if the validity check was client side.
In that way I could simply edit the code running on my browser.
However, before I went that far, I recalled a niche piece of knowledge I picked up a few years ago.

### The Cheese

Anecdote time!
In 2018, when the Dutch [added a third sex indicator to their passports](https://www.independent.co.uk/travel/netherlands-gender-neutral-passport-sex-dutch-leonne-zeegers-a8592091.html) (beyond just M or F, namely X), they implemented in a particular way.

I remember reading about this at the time, as well as some info of how they handled the machine readable part of the passport.
You can imagine that over the decades a lot of code has been written to handle passport data, before this X marker was added.
It's possible and likely that X was not considered in the schema of the machine readable passport data, and a lot of software might break.

This sounds similar to how lazy programmers of the 20th century encoded the year as a 2 digit number, exposing us to the [Y2K problem](https://en.wikipedia.org/wiki/Year_2000_problem).
Similarly, it's safe to assume that all sorts of systems across the world that handle passport data assumed that sex was binary (rather than bimodal).
Robust schema design is an art!

Therefore, to try and reduce these problems, although "X" is what is written on the main part of the Dutch passport,
instead of adding X explicitly as a third choice, if you read where the marker would be in a Dutch passport with an X you'll see... nothing.

Well, not which nothing.
Instead, you’ll see just another <, which serves as a filler (or empty) character in the [machine readable passport format](https://en.wikipedia.org/wiki/Machine-readable_passport).
So "X" sex actually represents "undefined" sex, which is probably more accurate anyway.
Most systems that read the machine readable part of the passport would just skip over this character, and continue as normal.
And existing databases should be able to handle missing data gracefully, since it's a common enough occurrence.

For our purposes, perhaps you can see how we can use this.
`<` is essentially a skip character --- could we use this to pad our short Belgian passport number without failing the checksum?
Will the Railcard website validation handle this okay?
It doesn't document this as an option, but it's worth a try.

And... it worked, and all it took was some knowledge of the machine readable passport number format.
Something that I'm sure any Belgian would have known (😉).

### Conclusion

As you can imagine, I've contacted the UK Railcard operator about this issue.
Belgians are edge cases, but that doesn't mean they're don't deserve the same things as the rest of us.

Overall, this was a fun little "exploit", as it gave me the satisfaction of using somewhat obscure trivia I'd remembered.
The underlying validation system _was_ able to handle the workaround, but really it should have been documented, or ideally the form should have been more flexible.
For example, it could have asked for the different parts separately.
I'm glad I was able to help my friend get a discount on their train journey.
