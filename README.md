# Personal Website

A modern, professional personal website built with Jekyll and Tailwind CSS, designed for GitHub Pages hosting.

## Features

- **Essays**: Write and publish essays in Markdown with tag filtering
- **Projects**: Showcase projects with GitHub/demo links and technology tags
- **CV**: Professional resume with structured data
- **Responsive Design**: Modern, mobile-first design with Tailwind CSS
- **Substack Integration**: Easy crossposting workflow
- **GitHub Pages Ready**: No unsupported plugins or features

## Quick Start

1. **Install Dependencies**
   ```bash
   bundle install
   npm install
   ```

2. **Build CSS**
   ```bash
   npm run build-css
   ```

3. **Start Development Server**
   ```bash
   bundle exec jekyll serve
   ```

4. **Visit your site**
   Open http://localhost:4000 in your browser

## Content Management

### Adding Essays

1. Create a new file in `_essays/` with the format: `YYYY-MM-DD-title.md`
2. Add front matter:
   ```yaml
   ---
   title: "Your Essay Title"
   date: 2024-01-15
   tags: [tag1, tag2, tag3]
   excerpt: "Brief description of your essay"
   read_time: 5
   substack_url: "https://yoursubstack.substack.com/p/essay-slug" # optional
   ---
   ```
3. Write your content in Markdown below the front matter

### Adding Projects

1. Create a new file in `_projects/` with the format: `project-name.md`
2. Add front matter:
   ```yaml
   ---
   title: "Project Name"
   technologies: [React, Node.js, PostgreSQL]
   github_url: "https://github.com/yourusername/project"
   demo_url: "https://project-demo.com" # optional
   excerpt: "Brief project description"
   ---
   ```
3. Write detailed project description in Markdown

### Updating CV

Edit `_data/cv.yml` with your professional information. The CV page will automatically update.

## Customization

### Site Configuration

Edit `_config.yml` to update:
- Site title and description
- Author information
- Social media links

### Styling

- Custom styles: Edit `assets/css/tailwind.css`
- Tailwind config: Edit `tailwind.config.js`
- The site uses Tailwind CSS utility classes throughout

### Adding Pages

Create new pages in the `pages/` directory with proper front matter and they'll automatically appear in navigation.

## Substack Integration

To crosspost from Substack:

1. Export your Substack post to Markdown
2. Copy the content to a new file in `_essays/`
3. Add the `substack_url` field in the front matter
4. The original publication notice will appear automatically

## Deployment

### GitHub Pages

1. Push your code to a GitHub repository
2. Enable GitHub Pages in repository settings
3. Set source to "GitHub Actions"
4. The site will build automatically on every push

### Custom Domain

Add your domain to `_config.yml`:
```yaml
url: "https://yourdomain.com"
```

Create a `CNAME` file in the root with your domain name.

## Development Scripts

- `npm run build-css`: Build Tailwind CSS (one-time)
- `npm run build-css -- --watch`: Build CSS and watch for changes
- `bundle exec jekyll serve`: Start development server
- `bundle exec jekyll build`: Build site for production

## Project Structure

```
personal-site/
├── _config.yml              # Jekyll configuration
├── _layouts/                # Page layouts
├── _includes/               # Reusable components
├── _essays/                 # Essay collection
├── _projects/               # Project collection
├── _data/cv.yml            # CV data
├── pages/                   # Site pages
├── assets/                  # CSS, JS, images
└── vendor/bundle/          # Local gem installation
```

## License

MIT License - feel free to use this template for your own personal website.