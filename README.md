# wheest.github.io

Personal blog of Perry Gibson. Live at [gibsonic.org](https://gibsonic.org).

## Local Development

Requires Ruby (system Ruby on macOS is too old). Install via Homebrew:

```bash
brew install ruby
```

Then use the Homebrew Ruby for all commands:

```bash
export PATH="/opt/homebrew/opt/ruby/bin:/opt/homebrew/lib/ruby/gems/4.0.0/bin:$PATH"
bundle install
bundle exec jekyll serve
```

Site will be available at http://localhost:4000.

## Stack

- Jekyll 4.4, Minima 2.5
- Pagination via jekyll-paginate-v2 (10 posts per page)
- Client-side search via lunr.js
- Deployed via GitHub Actions on push to `main`
