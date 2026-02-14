---
layout: post
title: "Writing practice: a rant on encryption policies"
date: 2020-12-23 09:00:00 +0000
categories: privacy
tags: privacy security policy politics
excerpt_separator: <!--more-->
---

> I originally wrote this as an email in response to a proposed EU resolution to
> ban end-to-end encryption on apps like WhatsApp, Signal, and others. The
> salient points still remain true. I am a dilettante when it comes to the finer
> points of security and cryptography, however I am always trying to learn more
> on the topic, challenge my beliefs, and influence policy decisions. If you
> want to talk to me more about this sort of thing feel free to get in touch.

<!--more-->

I write to condemn in the strongest possible terms the upcoming proposed EU
resolution to ban end-to-end encryption on apps like WhatsApp, Signal, and
others. Discussion of the proposal is
[available here](https://fm4.orf.at/stories/3008930/).

My objection to the proposal is on two grounds: the first being pragmatic, based
on my own IT expertise, and that of friends and colleagues; the second is
moral/political.

From the pragmatic perspective, while it is cryptographically possible to have
multi-key constructs, with a "master key" in escrow, the creation of a backdoor
in the personal and business communications of law abiding citizens at scale
creates multiple points of failure that can, and will, be exploited by
adversaries both foreign and domestic. The custody of so-called "master keys"
which would give intelligence agencies access to messages would be presented to
ministers as being subject to the utmost security. I can assure you that
eventually these keys will be compromised, no matter how strongly intelligence
advisers suggest the contrary. Exploitation of individuals working at these
agencies, numerous undocumented zero-days in our backbone software and hardware
infrastructure, the likelihood of _purposefully_ inserted hardware and software
backdoors from third party adversaries, and many other weaknesses exist, which
will lead to the inevitable disclosure of these master keys, and the opening up
of private messages - either exploited by unknown third party adversaries
(either criminal or state-level), or a broad public leak.

One need only look at the case
[The Shadow Brokers leak](https://en.wikipedia.org/wiki/The_Shadow_Brokers) of
2016, where key NSA assets were leaked to the public by unknown actors. These
tools will have been subject to some of the utmost security levels available at
the world-class NSA. However, they were still leaked, and the zero-days were
quickly leveraged in real-world attacks by state and criminal actors.

EU security agencies, much like the NSA, will never be immune to leaks like
this. And leaking of backdoors keys to private communications of EU businesses
and citizens would prove devastating to the economic interests, and personal
lives of innocent people.

From another pragmatic perspective, I question the effectiveness of such
collection techniques in policing. Cryptography is an open field of applied
mathematics, with infeasible-to-crack algorithms (and their implementations)
being freely available online and through countless other mediums. The following
link has some simple code, that can be printed on a tshirt, that produces an
encryption algorithm that can only be broken by as yet theoretical quantum
computers ([link](https://pastebin.com/jzC2eYiQ)). The point being, that even
mildly sophisticated terrorist organisations, whom this proposal is targeting,
will be able to easily bypass these backdoor measures with their own encryption
software. Unsophisticated organisations will be such that conventional policing
techniques will be more effective at stopping them (say by identifying when
large quantities of hazardous materials are being purchased).

From the moral/political perspective, I refer to the following:

- UN Declaration of Human Rights: Article 12
- and the more limited Article 8 of the European Convention on Human Rights

Additionally, we cannot guarantee that the organisations holding these keys will
always represent the core European ideals - our history tells us how easily
political change can happen of this nature. Backdoor encryption will be a key
tool in reinforcing the power of a bad internal actor, and make ousting them
significantly more difficult.

From a personal perspective, as someone in the 18-25 age bracket, my digital
communications are equal in value and form to my physical ones. I am exceedingly
effective in leveraging the digital tools available to me, such that there is
little difference between conversations in a private living room, versus in a
private E2E encrypted chat. Just as I would take objection to the presence of an
intelligence officer recording my conversations in a living room, so too do I
take objection to the same occurring in a digital conversation. My having no
intention to break the law, and any assurances that only terrorist related
information will be relayed is irrelevant.

In conclusion, I believe that the law enforcement gains from compelling
encryption backdoors are negligible, and the economical, social, and political
risks are significant. I implore you as my representative to ensure this
proposed resolution is stopped in its tracks, and any foundations to create more
like it are deconstructed.

Kind regards,

Perry Gibson,<br /> Scotland, EU
