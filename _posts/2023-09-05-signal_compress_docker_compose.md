---
layout: post
title:
  "Open Source: signal-compress, semi-secure LLM compression of Signal chats"
date: 2023-09-05 12:00:00 +0000
categories: blog
tags: python docker dnn signal open-source gpt llm security
excerpt_separator: <!--more-->
---

<img src="/assets/pics/signal_compress_header.png" width="1024">

This project extracts messages from the Signal messenger app, and runs an LLM
(large language model) to try and summarise what happened. This can be handy for
extensive chats, and archival purposes, and is intended to be run locally to
preserve privacy.

Signal is designed to be privacy-centric, and several other chat apps implement
[the protocol](https://en.wikipedia.org/wiki/Signal_Protocol) such as WhatsApp,
and Facebook's and Skype's "secret-mode" conversations. Therefore, I was keen to
minimise how much I compromised this security model.

This project uses Docker Compose, to make managing dependencies easier, since
Signal encrypts its database using a particular encoding that requires some tool
setup to access. Docker Compose also makes it slightly easier to control things
like file and network access. The system runs the LLM model locally, in an
attempt to preserve the privacy of your messages, compared to sending them to a
third party like OpenAI. This uses the
[`llama.cpp` project](https://github.com/ggerganov/llama.cpp). I've open sourced
my code at
[https://github.com/Wheest/signal-compress](https://github.com/Wheest/signal-compress).

See below for more technical details and design rationale.

<!--more-->

I was keen to explore the
[Llama 2 family of models](https://ai.meta.com/llama/), since I've got a keen
interest in generative models, and try to integrate them into my group chats so
my pals and I can pick and poke at them. As a first test, I considered chat log
summarization. To achieve this project, I followed 5 steps, which I expand on in
the following sections:

1. access the encrypted Signal database.
2. an environment to execute the DNN model.
3. a Docker environment to simplify the Signal data processing.
4. a container orchestration configuration to combine the two components.
5. a reasoned approach to data management.

I am not a security professional, but I have attempted to make sensible design
decisions to reduce the attack surface, and anticipate additional risks. If I
was making something production ready, further collaboration and design
refinement would be needed. Feel free to get in touch if you think of any other
security risks that I haven't covered!

### Signal Database Access

Signal encrypts its local database using
[SQLCipher](https://github.com/sqlcipher/sqlcipher), which uses 256 bit AES
encryption of SQLite database files. The Signal developers maintain an
implementation of SQLite in Node.js called
[better-sqlite3](https://github.com/signalapp/better-sqlite3), for which they
are currently using
[v4.5.2 of SQLCipher](https://github.com/signalapp/Signal-Desktop/commit/e33bcd80b7544f46abfc628c8109f7a3deaf78c0).
All of Signal's data is stored in a single database file. Depending on your OS,
you can find the database at:

- Linux: `~/.config/Signal/sql/db.sqlite`
- Mac: `~/Library/Application Support/Signal/sql/db.sqlite`
- Windows: `C:\Users\<YourName>\AppData\Roaming\Signal\sql\db.sqlite` Let's say
  the path is `$SIGNAL_DB_PATH`. I'm not sure where it is stored on iOS or
  Android, but my project is intended to work with Signal desktop.

You also need the decryption key for the database, which is stored in the Signal
directory in the `config.json` file, which will look something like this:

```json
{
  "key": "some-random-looking-key",
  "mediaPermissions": true,
  "mediaCameraPermissions": true
}
```

Let's say the path to this file is `$SIGNAL_CONFIG_PATH`. Using the correct
version of SQLCipher, we can decrypt our database with:

```sh
$ sqlcipher $SIGNAL_DB_PATH   "PRAGMA key = \"x'$(jq -r '.key' ${SIGNAL_CONFIG_PATH})'\"; select * from messages limit 1;"
```

You may see `Error: in prepare, file is not a database (26)`, which might
suggest that the version of SQLCipher that Signal uses has changed.

### LLM-containerisation

For better or worse, Docker and containerisation in general is a critical
enabling technology for developing modern applications. I've been working with
it for a number of years, for example in 2019
[when I was working at Barcelona Supercomputing Center](https://gibsonic.org/hpc/2019/08/07/containerisation_for_hpc.html),
a variety of my research projects, and the
[AIMDDE project for industrial defect detection](https://gibsonic.org/blog/2022/06/19/accml_workflows.html).
I also
[co-developed an online course](https://gibsonic.org/blog/2023/02/08/bonsapps_mooc.html)
for [BonsAPPs](https://bonsapps.eu/) about how container and codebase templates
can help improve productivity and reproducibility for developing AI
applications. Hence, it makes sense for this project.

Docker is an open-source platform that enables developers to automate the
deployment, scaling, and management of applications using containerization. It
allows for efficient and isolated packaging of software, enabling consistent and
reproducible deployments across different environments.

Key terms:

- **image**: A lightweight, standalone, executable package that includes code,
  runtime, libraries, tools, and settings needed to run an application.
- **container**: An isolated and standardized runtime environment where an image
  can be executed, with its own set of processes, memory, and hardware
  resources. An instance of an image.
- **docker**: An open-source platform that automates the deployment, scaling,
  and management of applications using containerization.
- **host**: The physical or virtual machine on which the Docker runtime is
  installed and where containers are executed.
- **quantization**: The process of reducing the precision of mathematical
  representations and storing numerical data in a more efficient format,
  typically to optimize storage or computation efficiency.

For running the LLM, I would ideally like to use something like
[Apache TVM](https://tvm.apache.org/), a machine learning compiler that I've
used a lot in my PhD. However, I've been hearing good things about the
[`llama.cpp`](https://github.com/ggerganov/llama.cpp), a community project
focused on efficient inference of transformer models such as Llama. In
particular, they support very high levels of quantization (such as 4 bits),
which can be applied with a single command. Extended quantization support in TVM
is under active development, however in its current state. Therefore,
`llama.cpp` seems like it will provide a reduced time-to-prototype, which is why
I use it in this project.

You can build `llama.cpp` from scratch for a variety of platforms (see
[its README](https://github.com/ggerganov/llama.cpp)), however there is a
pre-compiled Docker image available as `ghcr.io/ggerganov/llama.cpp`, which
encapsulates all of the dependencies required, as well as providing a simple CLI
using
[its `tools.sh` script](https://github.com/ggerganov/llama.cpp/blob/master/.devops/tools.sh).

Assuming that you have downloaded the pre-trained weights to the directory
`$MODELS_PATH`, with your target model `${TARGET_MODEL}` given its own
subdirectory, we can begin the initial conversion to the `llama.cpp` format. I
got the weights for the Llama 2 models from Meta
[here](https://github.com/facebookresearch/llama). At time of writing,
`llama.cpp` uses
[the GGUF file format](https://github.com/ggerganov/ggml/pull/302), which you
can convert to using the following command:

```sh
docker run -v $MODELS_PATH:/models ghcr.io/ggerganov/llama.cpp:full --convert "/models/${TARGET_MODEL}"
```

You can also quantize the model just as easily:

```sh
docker run -v $MODELS_PATH:/models ghcr.io/ggerganov/llama.cpp:full \
  --quantize "/models/${TARGET_MODEL}/ggml-model-f16.gguf" "/models/${TARGET_MODEL}/ggml-model-q4_0.gguf" 2
```

We can test that the conversion works by running a test prompt, which will start
generating text describing how to build a website:

```sh
docker run -v $MODELS_PATH:/models --entrypoint '/app/main' ghcr.io/ggerganov/llama.cpp:full \
  -m /models/$TARGET_MODEL/ggml-model-q4_0.gguf -n 512 -p "Building a website can be done in 10 simple steps"

```

We now have everything we need for model inference. However, since we might be
running multiple inferences, perhaps it makes sense to keep the model in memory.
Therefore, there is a `server` mode for the `llama.cpp` image. This exposes our
model via a RESTful API, meaning that we can send our prompt as a HTTP request,
which makes integration in other applications much simpler. The next section
discusses how I developed this integration.

### Signal Docker Image

Next, we want to automate the extraction of our Signal database. Therefore we
will make a 2nd Docker container which sets up the SQLCipher dependencies. Below
you can see part of our Dockerfile:

```docker
FROM python:3 # use official Python base image

# Set the working directory
WORKDIR /app

# Clone and build sqlcipher
RUN git clone --depth 1 --branch v4.5.2 https://github.com/sqlcipher/sqlcipher
RUN cd sqlcipher \
    && ./configure --enable-tempstore=yes CFLAGS="-DSQLITE_HAS_CODEC" \
    LDFLAGS="-lcrypto -lsqlite3" \
    && make && make install \
    && ldconfig

# Execute the script on container start
CMD ["python3", "extract.py"]
```

We are using the official Python base image, since it has most of the
configuration and dependencies we need (which might be overkill), and is popular
enough that we could consider it to be more trustworthy. When we execute this
container, we will execute some Python code which processes the Signal database,
and pass the prompt to the LLM. `CMD ["python3", "extract.py"]` runs our script
automatically when the container launches. You can see the Dockerfile,
`extract.py`, and the rest of the code from this project on
[my GitHub repo](https://github.com/Wheest/signal-compress).

### Container Orchestration

Now we have our LLM container workflow, as well as our Signal database extractor
in a separate image. However, how are we going to simplify and automate our
application? Docker Compose is well suited for this, at least at the scale that
we are operating at, i.e., running on a single host, which is a desirable
feature for our security model. But how are we going to connect the Signal
container and the `llama.cpp` container? This is where Docker Compose comes in.

Docker Compose allows us to run multiple Docker containers at once, and define
their configuration in a single file. This helps with reproducibility, since we
have "infrastructure-as-code", rather than having to copy-and-paste multiple
`docker run` commands for each of our containers, which can be tedious and error
prone. It also simplifies the process of cross-container communication.

This configuration of Docker Compose is defined in a
[YAML](https://en.wikipedia.org/wiki/YAML) file `docker-compose.yml`. A basic
annotated Docker Compose file is given below, to illustrate some of the core
concepts. Docker Compose calls distinct containers `services`, and here we have
two, `llama` and `signal`.

```yaml
version: "3.8" # version of Docker Compose syntax to use

services: # two services, llama and signal
  llama:
    image: ghcr.io/ggerganov/llama.cpp:full # Docker image for the Llama service
    command: "--server -m /models/$TARGET_MODEL/ggml-model-q4_0.gguf -c $SEQ_LEN
      -ngl 43 -mg 1 --port 9090 --host 0.0.0.0" # Command to run the Llama service
  signal:
    build: # Build the Signal service using the specified Dockerfile
      dockerfile: docker/Dockerfile.signal
    depends_on: # signal service will launch after the llama service
      - llama
```

If we run `docker compose up`, this will launch both containers automatically!

As part of Docker Compose, containers can access open ports from other
containers. They do this by using the service name of the target container as a
domain name. For example, from the Signal container we can access the Llama
server running on port 9090 using `http://llama:9090/completion`. As you can
imagine, this automatic network configuration can be very handy.

There are a few additional things that our Docker Compose configuration needs to
include. Namely, how do we give our container access to our Signal data, ideally
in a trust-minimised fashion?

### Data Management

In our `docker-compose.yml` file, we can add a `volumes` section, where we can
expose data on our _host_ to our running container. For example, this
configuration exposes the `./extract.py` file on the host to `/app/extract.py`
in the container.

```yaml
services:
  example:
    image: example:latest
    volumes:
      - ./extract.py:/app/extract.py
```

Normally this is sufficient, however, we want to ensure that no changes are made
to our Signal database. Therefore, when we expose our Signal data, we want to
make it read-only. We are going to be explicit that we are using a bind mount,
rather than a volume. A volume in Docker is akin to a USB stick, which exists as
a persistent file-system independent of a given container. Whereas a bind mount
simply exposes some data from the host. We prefer a bind mount here, since we do
not want any copy of our Signal data to be made. This is done with `type: bind`,
and then setting the path on the host (`source`) and container (`target`).

```yaml
services:
  signal:
    build:
      dockerfile: docker/Dockerfile.signal
    volumes:
      - type: bind
        source: ${SIGNAL_DB_PATH}
        target: /root/.config/Signal/sql/db.sqlite
        read_only: true
      - type: bind
        source: ${SIGNAL_CONFIG_PATH}
        target: /root/.config/Signal/config.json
        read_only: true
      - type: bind
        source: ./output/
        target: /output/
        read_only: false
```

Also note that we allow the container to write its output to the `output/`
directory, by setting the `read_only` parameter to `false`.

Hopefully this gives some increased security for our valuable Signal data. Of
course, the Signal container is still handling the decryption of our data,
therefore we should ensure that it deletes any data it generates.

Finally, as an additional security measure, consider the following: our
containers contain all the code required to execute our model, and our model and
data should run entirely locally. Therefore, we can disable internet access to
our containers without losing functionality. And this reduces the risk that some
untrusted code tries to send our data offsite. The way I have implemented this
in `docker-compose.yml` is by configuring a custom network that only has access
to other containers. Then, we assign this network to each service. For example:

```yml
networks: # configuration of networks
  restricted:
    internal: true
services:
  llama: # example service
    image: ghcr.io/ggerganov/llama.cpp:full
    networks: # use these network configurations
      - restricted
```

With all of this configured, `docker compose up` should configure and run
everything we need for inference, and dump our output to the `output/`
directory. The security provided by this approach is arguably better than:

- sending all of the unencrypted data to a third-party such as OpenAI
- saving copies of the unencrypted data in random places in your file system
- processing your data using semi-trusted code that may be trying to access the
  internet

Some security critiques are given below, bearing in mind I am merely a casual
enthusiast rather than a security professional.

### Security Analysis

1. Our Signal container is run as root, which is not necessary, since it gives
   the container more power than it needs, violating the principle of least
   privilege. You can see how you can create a non-root user, as well as some of
   the caveats,
   [here](https://code.visualstudio.com/remote/advancedcontainers/add-nonroot-user).

2. If the Python program `extract.py` crashes, it will not delete the
   unencrypted Signal files with `shutil.rmtree(output_dir)`. This could be
   mitigated by having the program in a `try-except` block which runs the
   clean-up code in most crash scenarios. Also, consider that it may be better
   to keep our data in memory rather than writing it to disk, since there are
   arguably more exfiltration opportunities (e.g., is file deletion secure?).
   However, since our chat logs could be very large, I am writing to disk as a
   default.

3. Our Dockerfiles do not pin the versions of the packages and base images used.
   This issue is a big "it depends". Not pinning versions can create some
   compatibility issues in future when APIs change. However, pinning old
   packages might expose us to security vulnerabilities. Alternatively, if we
   always pull the newest package, these may also introduce some new bugs
   (either accidentally or maliciously).

If you can spot anything else big, feel free to get in touch!

### Conclusion

In conclusion, Docker Compose can make it easier to configure and control how
our application is executed. Wrapping our DNN execution engine as a Docker image
with a REST API reduces a number of our integration headaches. Running locally
is desirable due to the sensitivity of our data, yet we must still be mindful of
various security concerns. This project mitigates some of them, but is by no
means a complete solution. I've open sourced my code at
[https://github.com/Wheest/signal-compress](https://github.com/Wheest/signal-compress).
Feel free to use it for your own projects, but be aware of the security issues
you may expose yourself to. In addition, it may be polite to seek consent from
the participants of the chats you are processing.
