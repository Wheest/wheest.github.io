---
layout: post
title: "Simple Workflow Tweaks for Scientific Python Projects"
date: 2025-10-05 16:20:08 +0200
categories: python
tags: python science reproducibility testing github-actions pre-commit
excerpt_separator: <!--more-->
---

I've recently been chatting with a couple of mates who are doing scientific
research using Python.
Answering specific code questions is a lot of fun, as I try and figure out
enough of their domain to see how if/how I can help.

However, there are some general workflow improvements which I
In this post, I’ll share a lightweight workflow for scientific Python projects.

<!--more-->

Research code is often different from production software. It doesn't need to be
as robust or maintainable, because we have different needs, goals, and priorities.
However, a few simple practices can make it far more reproducible and
maintainable.

I've found that found in my own experience of writing and reviewing research
code using Python, Jupyter notebooks are invaluable tools, however can be
difficult to reuse, reproduce, or collaborate with.

Here, we're going to see what steps we can do to improve **reproducibility, collaboration, and confidence in your
results** - without overcomplicating your code.

This post assumes you're using GitHub (or a similar platform like GitLab or Gitea) for version control. If you're not yet using a VCS, I highly recommend starting there.

We'll go through a few simple steps:

- Creating a Python package with a reproducible environment.
- Writing tests with `pytest` to catch bugs early.
- Using pre-commit hooks to maintain code quality automatically.
- Setting up GitHub Actions to run tests on every push.

## The Project

Let's say we're using [Astropy](https://www.astropy.org/) to do some cosmology calculations. This
isn't my area of expertise, I've just made some bullshit code that shows the
development practices: apologies if it offends your sensibilities!

Initially, we explored these calculations in a Jupyter notebook. While notebooks
are great for experimentation, they aren't ideal for **sharing, testing, or
reusing code**. I've seen people have functions they copy between every
notebook, making slight changes each time, and then lose track of which version
is "the good one".

Our first goal is to take some commonly used functions from the notebook and turn them into a **small, reusable Python package** that we can import into any notebook or script.

## Common Package

This outcome of this section can be seen on commit `ed941a` of the [this
repository](https://github.com/Wheest/cosmole-example/tree/ed941aee1683f3be44d3a497437f221986b86acd).
I'll walk through the steps below.

When you have functions that you want to reuse across multiple notebooks or scripts, it’s best to put them in a **common package** rather than copying and pasting.
Copying code can quickly lead to inconsistencies and bugs as your code evolves.

For this project, we'll create a small package called `cosmole` that contains
three scripts:

```
.
├── cosmole
│   ├── __init__.py
│   ├── angular_separation.py
│   ├── convert_equatorial_to_galactic.py
│   └── redshift_to_distance.py
└── notebooks
    └── 2025-10-07-exploration.ipynb
```

The `__init__.py` file defines what is accessible when someone imports the package:

```python
# cosmole/__init__.py
from .redshift_to_distance import redshift_to_distance
from .angular_separation import angular_separation
from .convert_equatorial_to_galactic import convert_equatorial_to_galactic
```

Now (once we've finished the following steps), from any notebook or script in the project, you can do:

```python
from cosmole import redshift_to_distance, angular_separation, convert_equatorial_to_galactic
```

### Requirements

In scientific projects, it's easy for code to stop working later if dependencies
change.
I remember when writing up my PhD, I had to regenerate some plots I'd made in
first year, and had issues because the `matplotlib` had changed in the meantime,
I wasn't sure which version I'd used originally.

To avoid "it worked on my machine" problems, we can specify exact package
versions using a `requirements.txt` file.

This is a simple text file listing all the Python packages your project depends
on, along with their versions. For our project, you can see it [here](https://github.com/Wheest/cosmole-example/blob/main/requirements.txt).

You can install these dependencies with:

```bash
pip install -r requirements.txt
```

Or with conda:

```bash
conda install --file requirements.txt
```

This ensures anyone cloning the repository can reproduce your environment and
run your code without surprises.

### Setting up the package

To make Python aware of your `cosmole` package, we need a **`setup.py`** file at
the root of the project. This file tells Python how to install your package and
its dependencies. In our example project, [you can see it here](https://github.com/Wheest/cosmole-example/blob/ed941aee1683f3be44d3a497437f221986b86acd/setup.py).

To make the package immediately usable while you continue developing it, install
it in editable mode:

```sh
pip install -e .
```

- The `-e` flag means editable — any changes you make to the source code are reflected immediately when you import the package.
- This is especially handy when working interactively in notebooks.

Additionally, adding and executing these lines at the top of your notebooks will
also mean you automatically reload your package whenever you edit any of your
`.py` files:

```python
# Enable autoreload so that changes in imported modules are reflected automatically
%load_ext autoreload
%autoreload 2
```

## Testing Your Code

This outcome of this section can be seen on commit `9905048` of the [the
repository](https://github.com/Wheest/cosmole-example/tree/99050481d5165109625f5c3f18eef9442d1ea4ab).

Once you have refactored your functions into your package, it's a good idea to
write tests.
Actually, often we might want to write the tests _first_ as we're making our
initial implementation of our functions (a practice known as test-driven
development).

Tests help ensure that your code behaves as expected, which is especially useful when making changes or refactoring.

Even if your research code is exploratory, having a few **basic automated
tests** can catch obvious bugs early and give you confidence that updates don't
break existing functionality.

You might find that a test you wrote was incorrect, or you have changed the
intended functionality of a function.
In which case, update the test --- make them work for you!

We can use the `pytest` package to write and run tests. For example, let's test our `convert_equatorial_to_galactic` function:

```python
import pytest
from astropy.coordinates import SkyCoord
import astropy.units as u
from cosmole import convert_equatorial_to_galactic

def test_convert_equatorial_to_galactic():
    ra, dec = 83.82208, -5.39111  # Approx location of Orion Nebula
    l, b = convert_equatorial_to_galactic(ra, dec)
    coord = SkyCoord(ra=ra*u.deg, dec=dec*u.deg, frame='icrs').galactic
    assert pytest.approx(l, rel=1e-6) == coord.l.degree
    assert pytest.approx(b, rel=1e-6) == coord.b.degree
```

Those `assert pytest.approx` lines are checking that our function we're testing
is giving the expected results, and will raise an error if it doesn't.

From your project root, run:

```sh
pytest
```

You should see output like this:

```sh
tests/test_angular_separation.py .                                                               [ 33%]
tests/test_convert_equatorial_to_galactic.py .                                                   [ 66%]
tests/test_redshift_to_distance.py .
[100%]
```

### Pre-commit Hooks

To help maintain consistent code quality, we can use **pre-commit hooks**.
These are scripts that automatically run **before each commit** to check for common issues like code formatting, linting, or missing documentation.

The key benefits of pre-commit hooks are:

- **Catch issues early** — errors or style violations are flagged before they enter your repository.
- **Automatic fixes** — many hooks, like code formatters, can fix problems automatically, saving time.
- **Consistency across contributors** — ensures everyone on the project follows the same style and quality rules.

#### Configuration

Pre-commit hooks are configured in a `.pre-commit-config.yaml` file at the root of your project.
For example, a simple configuration might include:

- **Ruff** — a fast Python linter and code formatter.
- **Prettier** — for formatting notebooks, Markdown, and JSON.

In our example project, you can see the configuration file [here](https://github.com/Wheest/cosmole-example/blob/main/.pre-commit-config.yaml).

You can install pre-commit and set it up with:

```bash
pip install pre-commit
pre-commit install
```

Now, every time you make a commit, the hooks defined in your configuration file
will run automatically on any files that have changed.
You can also run them manually on all files with:

```bash
pre-commit run --all-files
```

In our existing code, there are a multiple automatic refomatting steps that were
applied: none of which should change our functionality, only the neatness of our
code. For example, removing unused `import`s, making sure lines don't get too
long, being consistent with the use of whitespace, etc.

However, there are also some issues that need manual review. For example, Ruff complained that
we had an ambiguous variable name `l` (lowercase L).

```
tests/test_convert_equatorial_to_galactic.py:8:5: E741 Ambiguous variable name: `l`
   |
 6 | def test_convert_equatorial_to_galactic():
 7 |     ra, dec = 83.82208, -5.39111  # Approx location of Orion Nebula
 8 |     l, b = convert_equatorial_to_galactic(ra, dec)
   |     ^ E741
 9 |     coord = SkyCoord(ra=ra*u.deg, dec=dec*u.deg, frame='icrs').galactic
10 |     assert pytest.approx(l, rel=1e-6) == coord.l.degree
   |
```

Normally, I'd recommend following whatever the rules suggest. They're
opinionated, but are usually sensible.

However, we can tell Ruff to ignore this specific warning by adding a comment to the
end of the line.

```python
l, b = convert_equatorial_to_galactic(ra, dec)  # noqa: E741
```

#### Editor Integration

If you use VSCode, GitHub Desktop, or other modern editors, there are extensions to run pre-commit hooks automatically or provide feedback inline.
This makes it easier to catch issues as you code, rather than waiting until
commit time.

### GitHub Actions

Now, we have tests and pre-commit hooks, which are great for local development. However, we also want to make sure that our code is tested when we push changes,
especially if we're collaborating with others.

GitHub offers a feature called GitHub Actions, which allows us to run workflows
on machines hosted by GitHub. These are limited in terms of compute power, but can handle running basic tests and whatnot.

For our example, we can create a workflow that runs our tests and pre-commit
hooks on every push to the repository.

Let's do this by creating a file `.github/workflows/ci.yml` as shown here.

Now, every time you push changes or create a pull request, GitHub Actions will automatically run your tests and hooks.
This adds an extra layer of confidence and helps maintain a reliable,
reproducible scientific codebase.

## Conclusion

Ultimately, our goal in research code is to make systems that help us explore
and answer our research questions.
However, small software engineering standards can pay dividends if applied in a
sensible way.

There are more things you may want to explore, for example Ruff can more you to
add documentation to all of your functions.
There are also similar workflows if you work with other programming languages.
