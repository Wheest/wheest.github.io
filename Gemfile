source "https://rubygems.org"

# Use latest Jekyll version
gem "jekyll", "~> 4.3.0"

# Use GitHub Pages gem for better compatibility
gem "github-pages", group: :jekyll_plugins

# Essential plugins
group :jekyll_plugins do
  gem "jekyll-feed", "~> 0.17"
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
  gem "jekyll-paginate-v2"
  gem "jekyll-compress-html"
end

# Platform-specific gems (keep your existing ones)
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", "~> 2.0"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
gem "http_parser.rb", "~> 0.8.0", :platforms => [:jruby]
gem "webrick", "~> 1.8"
