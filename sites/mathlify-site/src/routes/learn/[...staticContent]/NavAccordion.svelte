<script lang="ts">
  import * as Accordion from "$lib/components/ui/accordion/index";
  import type {Section} from "$lib/types/sections";

  export let sections: Section[];
  export let section: string|undefined;
  export let subsection: string|undefined;
</script>

<Accordion.Root class="mt-4" value={section}>
  <slot />
  {#each sections as sectionObj}
    <Accordion.Item value={sectionObj.slug}>
      <Accordion.Trigger class="text-left">{sectionObj.title}</Accordion.Trigger>
      <Accordion.Content>
        <ul>
          {#each sectionObj.subsections as subsectionObj}
          <li class:active={subsectionObj.slug === subsection}><a href={`../${sectionObj.slug}/${subsectionObj.slug}`}>{subsectionObj.title}</a></li>
          {/each}
        </ul>
      </Accordion.Content>
    </Accordion.Item>
  {/each}
</Accordion.Root>

<style>
  .active {
    color: var(--active);
  }
</style>