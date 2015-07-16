---
layout: page
title: Archives
---

Blog Posts

<div class="posts">
	<ul class="post">
		{% for post in site.posts %}
		  {% capture currentyear %}{{post.date | date: "%B %Y"}}{% endcapture %}
		  {% if currentyear != year %}
		    {% unless forloop.first %}</ul>{% endunless %}
		    <h3>{{ currentyear }}</h3>
		    <ul>
		    {% capture year %}{{currentyear}}{% endcapture %} 
		  {% endif %}
		    <li class="post-title"><a href="{{ post.url }}">{{ post.title }}</a></li>
		{% endfor %}
	</ul>
</div>