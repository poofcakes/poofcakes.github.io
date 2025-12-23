# Local Development Setup

## Quick Preview (No Jekyll needed)
Since the page is mostly standalone HTML, you can simply open it in your browser:
```bash
open index.html
```

## Full Jekyll Setup (Recommended)

### Option 1: Using Homebrew Ruby (Recommended for macOS)

1. Install Homebrew Ruby:
```bash
brew install ruby
```

2. Add Ruby to your PATH (add to `~/.zshrc`):
```bash
echo 'export PATH="/opt/homebrew/opt/ruby/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

3. Install dependencies:
```bash
bundle install
```

4. Run the Jekyll server:
```bash
bundle exec jekyll serve
```

5. Open http://localhost:4000 in your browser

### Option 2: Using rbenv

1. Install rbenv:
```bash
brew install rbenv ruby-build
```

2. Install Ruby:
```bash
rbenv install 3.2.0
rbenv global 3.2.0
```

3. Install dependencies:
```bash
bundle install
```

4. Run the Jekyll server:
```bash
bundle exec jekyll serve
```

### Option 3: Manual Jekyll Install (if you have sudo access)

```bash
sudo gem install bundler jekyll
bundle install
bundle exec jekyll serve
```

## Commands

- `bundle exec jekyll serve` - Start local server (http://localhost:4000)
- `bundle exec jekyll serve --livereload` - Start with auto-reload
- `bundle exec jekyll build` - Build static site

