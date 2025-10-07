---
layout: post
title:  "Simple Workflow for Scientific Python Projects"
date:   2025-10-05 16:20:08 +0200
categories: python
tags: python science reproducibility testing github-actions pre-commit
excerpt_separator: <!--more-->
---

I've recently been chatting with a couple of mates who are doing scientific research using Python.
I've found that found in my own experience of writing and reviewing research
code using Python, Jupyter notebooks are invaluable tools, however can be
difficult to reuse, reproduce, or collaborate with.

Research code is often different from production software. It doesn't always need to be industrial-strength, but a few simple practices can make it far more reproducible and maintainable.

In this post, I’ll show a lightweight workflow for scientific Python projects
that improves **reproducibility, collaboration, and confidence in your
results** - without overcomplicating your code.

This workflow assumes you’re using GitHub (or a similar platform like GitLab or Gitea) for version control. If you're not yet using a VCS, I highly recommend starting there.

We'll go through a few simple steps:

- Creating a Python package with a reproducible environment.
- Writing tests with `pytest` to catch bugs early.
- Using pre-commit hooks to maintain code quality automatically.
- Setting up GitHub Actions to run tests on every push.

<!--more-->

## The Project

Let's say we're using Astropy and SciPy to do some cosmology calculations.  This
isn't my area of expertise, I've just made some bullshit code that shows the
development practices, apologies if it offends your sensibilities!

Initially, we explored these calculations in a Jupyter notebook. While notebooks are great for experimentation, they aren’t ideal for **sharing, testing, or reusing code**.

Our goal is to take some commonly used functions from the notebook and turn them into a **small, reusable Python package** that we can import into any notebook or script.

## Common Package

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

Now, from any notebook or script in the project, you can do:

```python
from cosmole import redshift_to_distance, angular_separation, convert_equatorial_to_galactic
```

### Requirements

In scientific projects, it's easy for code to stop working later if dependencies change.
To avoid "it worked on my machine" problems, we can specify exact package versions using a `requirements.txt` file.

For our `cosmole` project, the `requirements.txt` might look like this:

```
astropy==7.1.0
scipy==1.16.2
```

You can install these dependencies with:

```bash
pip install -r requirements.txt
```

Or with conda:

```bash
conda install --file requirements.txt
```

This ensures anyone cloning the repository can reproduce your environment and run your code without surprises.

To help with this, we can use a `requirements.txt` file to specify the exact
versions of packages we want to use.





### Setting up the package

To make Python aware of your `cosmole` package, we need a **`setup.py`** file at
the root of the project. This file tells Python how to install your package and
its dependencies. You can see an example here.

To make the package immediately usable while you continue developing it, install
it in editable mode:

```sh
pip install -e .
```

- The `-e` flag means editable — any changes you make to the source code are reflected immediately when you import the package.
- This is especially handy when working interactively in notebooks.

Adding these lines at the top of your notebook will also mean you automatically reload the package whenever you run a cell:

```python
# Enable autoreload so that changes in imported modules are reflected automatically
%load_ext autoreload
%autoreload 2
```

## Testing Your Code

Once you have shared functions in your package, it's a good idea to write tests.
Tests help ensure that your code behaves as expected, which is especially useful when making changes or refactoring.

Even if your research code is exploratory, having a few **basic automated tests** can catch obvious bugs early and give you confidence that updates don’t break existing functionality.

We can use `pytest` to write and run tests. For example, let’s test our `convert_equatorial_to_galactic` function:

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

Running the Tests

From your project root, run:

``` sh
pytest
```

You should see output like this:

``` sh
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

You can install pre-commit and set it up with:

```bash
pip install pre-commit
pre-commit install
```

Now, every time you make a commit, the hooks defined in your configuration file
will run automatically.

#### Editor Integration

If you use VSCode, GitHub Desktop, or other modern editors, there are extensions to run pre-commit hooks automatically or provide feedback inline.
This makes it easier to catch issues as you code, rather than waiting until
commit time.

### GitHub Actions

Now, we have tests and pre-commit hooks, which is great for local development. However, we also want to make sure that our code is tested when we push changes,
especially if we're collaborating with others.

GitHub offers a feature called GitHub Actions, which allows us to run workflows
on machines hosted by GitHub. These are limited in terms of compute power, but can handle running basic tests and whatnot.

For our example, we can create a workflow that runs our tests and pre-commit
hooks on every push to the repository.

Let's do this by creating a file `.github/workflows/ci.yml` as shown here.

Now, every time you push changes or create a pull request, GitHub Actions will automatically run your tests and hooks.
This adds an extra layer of confidence and helps maintain a reliable, reproducible scientific codebase.
