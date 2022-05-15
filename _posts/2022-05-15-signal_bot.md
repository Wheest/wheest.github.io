---
layout: post
title:  "GPT-3 based Signal bot"
date:   2022-05-15 15:20:00 +0000
categories: blog
tags: gpt3 signal python
excerpt_separator: <!--more-->
---
![Header image](/assets/signal-bot/header_image.png)


In experimenting with the OpenAI API, I developed a little bot for the Signal Messenger app.

<!--more-->

To build the bot, I leveraged the [semaphore](https://github.com/lwesterhof/semaphore) framework, and set up the `signald` system using a spare phone number (see footnote [^1]).
After testing with the [echo bot example](https://github.com/lwesterhof/semaphore/blob/main/examples/echobot.py), which replies to every message with the same message, I then developed my own test bot.
It reacts to every message with a 🌯 emoji.
You can see the code below.

```python
import os

from semaphore import Bot, ChatContext


# Connect the bot#  to number.
bot = Bot("+xxxxxx")


async def love(ctx: ChatContext) -> None:
    await ctx.message.reply(body="🌯", reaction=True)


async def main() -> None:
    """Start the bot."""
    # Connect the bot to number.
    async with bot:
        bot.register_handler("", love)

        # Set profile name.
        await bot.set_profile("PG GPT3 test bot")

        # Run the bot until you press Ctrl-C.
        await bot.start()


if __name__ == "__main__":
    import anyio

    anyio.run(main)

```

Next, I developed the GPT-3 bot, leveraging the [OpenAI Python library](https://github.com/openai/openai-python).
My code is below, however it is fairly simple.
It checks if a given message starts with the string `"!GPT"`, and if so, passes the text to the GPT-3 completion model.
I also used the `quote=True` flag to have the bot reply to the message that made the request.
I also added a $10 hard limit on API requests, since I am testing it out with friends and do not want to go broke.
I have the code running on an old Raspberry Pi 3.


```python
#!/usr/bin/env python
import anyio
from semaphore import Bot, ChatContext
import openai

# Connect the bot#  to number.
bot = Bot("+xxxxxxxxx")


@bot.handler("")  #
async def echo(ctx: ChatContext) -> None:
    msg = ctx.message.get_body()

    # check if the message starts with "!GPT", return if not
    if not msg.startswith("!GPT"):
        return

    # remove "!GPT" start from the message
    msg = msg[5:]

    # pass the message to the OpenAI API
    response = openai.Completion.create(
        engine="davinci",
        prompt=msg,
        max_tokens=50,
        temperature=0.9,
        top_p=1,
        n=1,
        stream=False,
        logprobs=None,
        stop=["\n"],
        user="signal-bot-1",
    )
    new_msg = msg + response["choices"][0]["text"]

    # reply with the text from the OpenAI API
    await ctx.message.reply(new_msg, quote=True)


async def main():
    async with bot:
        # Set profile name.
        await bot.set_profile("PG GPT3 test bot")

        # Run the bot until you press Ctrl-C.
        await bot.start()


anyio.run(main)

```

There is of course a lot more scope for these sorts of bots, but I'll leave this code for anyone that wants to get more involved.

When I undertook my project for an [AI-generated music video]({% post_url 2021-11-10-music_video %}), one of the most important things I found in getting a good output was "prompt design", i.e. passing the model text in a format that is likely to give a good response. Therefore, to get a better response, I made another bot that reads text from the user, and puts it in a format as if it is a chat log.
For example, if you message with "Hello there", the prompt could be:

```
Human: Hello there
AI:
```

Then the model has context clues that we are in an instant messaging situation, and it is to respond as if it is an AI talking to a human.
Here's some code to do this:

```python
@bot.handler("")  #
async def echo(ctx: ChatContext) -> None:
    msg = ctx.message.get_body()

    # TODO check if the message starts with "@GPT", return if not
    if not msg.startswith("@GPT"):
        return

    await ctx.message.typing_started()
    # remove "@GPT" start from the message
    msg = msg[5:]
    text = f"Human: {msg}\nAI: "

    # pass the message to the OpenAI API
    response = openai.Completion.create(
        engine="davinci",
        prompt=text,
        max_tokens=50,
        temperature=0.9,
        top_p=1,
        n=1,
        stream=False,
        logprobs=None,
        stop=["\n"],
        user="signal-bot-1",
    )
    new_msg = response["choices"][0]["text"]

    # reply with the text from the OpenAI API
    await ctx.message.reply(new_msg, quote=True)
    await ctx.message.typing_stopped()
```

Here's a sample chat:

```
Me: @GPT awright mate how ye daein'?
Bot: Very well, and you?
```

That's all for now folks.

[^1]: Note that I had to update the instructions for semaphore, so if my pull request has not been accepted at time of reading, follow [my patch](https://github.com/Wheest/semaphore/tree/patch-1).
