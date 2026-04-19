---
layout: home
---

<section class="hero-stage spotlight" data-reveal>
  <div class="container-narrow">
    <span class="hero-eyebrow">
      <span class="dot" aria-hidden="true"></span>
      Available for new work
    </span>
    <h1 class="hero-title">
      Building thoughtful <span class="accent">software &amp; data</span> systems.
    </h1>
    <p class="hero-subtitle">
      I'm Zac — a full-stack developer and data scientist. I founded a research-annotation platform, ship production ML pipelines, and write about the messy intersection of code, ideas, and craft.
    </p>
    <div class="hero-cta">
      <a href="/projects" class="btn btn-primary">
        See projects
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M5 12h14M13 5l7 7-7 7" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </a>
      <a href="/essays" class="btn btn-glass">Read essays</a>
    </div>
  </div>
</section>

<section class="container" style="margin-top: 4rem;">
  <div class="content-list">
    {% assign featured_projects = site.projects | where: 'published', true | where_exp: 'item', 'item.sort_order' | sort: 'sort_order' | slice: 0, 4 %}
    {% for project in featured_projects %}
      <article class="glass-card" data-tilt data-reveal data-delay="{{ forloop.index0 }}">
        <div class="content-item">
          <div class="content-item-header">
            <h2 class="content-item-title">
              <a href="{{ project.url | relative_url }}">{{ project.title }}</a>
            </h2>
            {% if project.technologies %}
              <div class="content-item-tags">
                {% for tech in project.technologies limit: 4 %}
                  <span class="tag tag-success">{{ tech }}</span>
                {% endfor %}
              </div>
            {% endif %}
          </div>
          {% if project.excerpt %}
            <p class="content-item-excerpt">{{ project.excerpt }}</p>
          {% endif %}
          <div class="content-item-footer">
            <a href="{{ project.url | relative_url }}" class="link">Open →</a>
          </div>
        </div>
      </article>
    {% endfor %}
  </div>
</section>
