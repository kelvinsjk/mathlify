<script lang="ts">
  import Content from '$lib/components/Content/Content.svelte';
  import BottomNav from '$lib/components/Nav/BottomNav.svelte';
	import NavAccordion from '$lib/components/Nav/NavAccordion.svelte';
  
  const {data} = $props();

  import {practices} from '$content/learn/practices';
  
  const practice = $derived(practices[data.syllabus][data.chapter][data.section][data.subsection]);
  const {qn,answer} = $derived(practice.generateQn(data.state));
</script>
<svelte:head>
  <title>{data.title}</title>
</svelte:head>

<Content title={data.title}>
  {#snippet content()}
  <div class="static-content learn">
  {@html qn}
  <BottomNav prev={data.prev} next={data.next} />
  </div>
  {/snippet}
  {#snippet desktopExtraNav()}
  <div>
    <hr />
    <BottomNav prev={data.prev} next={data.next} />
    <hr />
    <div class="chapter-nav">
      Chapter navigation
    </div>
    <NavAccordion sections={data.sections} section={data.section} subsection={data.subsection}>
    </NavAccordion>
  </div>
  {/snippet}
</Content>

<style>
  .chapter-nav {
    font-weight: bold;
    font-size: 1.25rem;
    margin-block-start: 2rem;
  }
</style>