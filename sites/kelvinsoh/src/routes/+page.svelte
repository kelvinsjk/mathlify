<div class="prose">
  <h1>About me</h1>
  <p>
    Hi 👋 I am Kelvin Soh from Singapore.
  </p>
  <blockquote>
    <p>
      I am most interested in the intersection of 
      <em>mathematics</em>,
      mathematics <em>education</em> and <em>web development</em>.
    </p>
  </blockquote>
  <p>
    The blog will track the journey of my experiments in these areas. I am currently working on building
    the Mathlified framework for building next generation mathematical content. Current efforts are focused on
  </p>
  <ul>
    <li>Mathlify, a computer algebra system that enables idiomatic content creation by combining calculation and typesetting</li>
    <li>Mathlifier, a typesetting system that can produce both LaTeX and HTML markup at the same time</li>
  </ul>
  <p>
    I then hope to tie everything together with a series of Svelte(Kit) based projects that will allow for
    easy creation of mathematical content on both print and the web. 
  </p>
  <p>
    Interactive components and/or
    CMS/LMS work are also possible in the future.
  </p>
</div>

<style>
  blockquote p:before {
    content: '';
  }
  blockquote {
    font-weight: 400;
  }
  blockquote {
    border-left-color: oklch(var(--a));
  }
  blockquote em {
    font-weight: 600;
    color: oklch(var(--p))
  }
</style>