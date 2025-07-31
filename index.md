---
layout: default
title: "Home"
---

<div class="max-w-4xl mx-auto">
  <!-- Hero Section -->
  <section class="text-center py-16">
    <h1 class="text-5xl font-bold text-gray-900 mb-6">
      Welcome to My Digital Space
    </h1>
    <p class="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
      I'm a passionate creator, technologist, and writer exploring the intersection of technology, creativity, and human experience. Here you'll find my thoughts, projects, and professional journey.
    </p>
    
    <div class="flex flex-wrap justify-center gap-4">
      <a href="/essays" class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        Read My Essays
      </a>
      
      <a href="/projects" class="inline-flex items-center px-6 py-3 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
        </svg>
        View My Projects
      </a>
    </div>
  </section>
  
  <!-- Recent Essays -->
  {% if site.essays.size > 0 %}
    <section class="mb-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Latest Essays</h2>
        <a href="/essays" class="text-blue-600 hover:text-blue-800 font-medium transition-colors">
          View all essays →
        </a>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {% assign recent_essays = site.essays | sort: 'date' | reverse | limit: 4 %}
        {% for essay in recent_essays %}
          <article class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              <a href="{{ essay.url | relative_url }}" class="hover:text-blue-600 transition-colors">
                {{ essay.title }}
              </a>
            </h3>
            
            <div class="text-sm text-gray-500 mb-3">
              {{ essay.date | date: "%B %d, %Y" }}
              {% if essay.read_time %} • {{ essay.read_time }} min read{% endif %}
            </div>
            
            {% if essay.excerpt %}
              <p class="text-gray-600 mb-4 leading-relaxed">
                {{ essay.excerpt | truncate: 120 }}
              </p>
            {% endif %}
            
            {% if essay.tags %}
              <div class="flex flex-wrap gap-2 mb-3">
                {% for tag in essay.tags limit: 3 %}
                  <span class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                    {{ tag }}
                  </span>
                {% endfor %}
              </div>
            {% endif %}
            
            <a href="{{ essay.url | relative_url }}" class="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
              Read more →
            </a>
          </article>
        {% endfor %}
      </div>
    </section>
  {% endif %}
  
  <!-- Featured Projects -->
  {% if site.projects.size > 0 %}
    <section class="mb-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-900">Featured Projects</h2>
        <a href="/projects" class="text-blue-600 hover:text-blue-800 font-medium transition-colors">
          View all projects →
        </a>
      </div>
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {% assign featured_projects = site.projects | sort: 'date' | reverse | limit: 2 %}
        {% for project in featured_projects %}
          <article class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border-l-4 border-blue-500">
            <h3 class="text-xl font-semibold text-gray-900 mb-3">
              <a href="{{ project.url | relative_url }}" class="hover:text-blue-600 transition-colors">
                {{ project.title }}
              </a>
            </h3>
            
            {% if project.technologies %}
              <div class="flex flex-wrap gap-2 mb-3">
                {% for tech in project.technologies limit: 4 %}
                  <span class="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">
                    {{ tech }}
                  </span>
                {% endfor %}
              </div>
            {% endif %}
            
            {% if project.excerpt %}
              <p class="text-gray-600 mb-4 leading-relaxed">
                {{ project.excerpt }}
              </p>
            {% endif %}
            
            <div class="flex items-center justify-between">
              <div class="flex gap-3">
                {% if project.github_url %}
                  <a href="{{ project.github_url }}" class="text-gray-600 hover:text-gray-900 text-sm transition-colors" target="_blank" rel="noopener">
                    GitHub
                  </a>
                {% endif %}
                {% if project.demo_url %}
                  <a href="{{ project.demo_url }}" class="text-blue-600 hover:text-blue-800 text-sm transition-colors" target="_blank" rel="noopener">
                    Live Demo
                  </a>
                {% endif %}
              </div>
              
              <a href="{{ project.url | relative_url }}" class="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                Learn more →
              </a>
            </div>
          </article>
        {% endfor %}
      </div>
    </section>
  {% endif %}
  
  <!-- About Preview -->
  <section class="bg-gray-100 rounded-lg p-8 text-center">
    <h2 class="text-3xl font-bold text-gray-900 mb-4">About Me</h2>
    <p class="text-gray-600 mb-6 max-w-2xl mx-auto leading-relaxed">
      I'm passionate about building technology that makes a difference. When I'm not coding, you'll find me writing about the intersection of technology and humanity, exploring new ideas, and sharing insights with the community.
    </p>
    
    <div class="flex justify-center gap-4">
      <a href="/cv" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
        View My CV
      </a>
      
      {% if site.author.email %}
        <a href="mailto:{{ site.author.email }}" class="inline-flex items-center px-4 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
          Get In Touch
        </a>
      {% endif %}
    </div>
  </section>
</div>