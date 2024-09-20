<script lang="ts">
	const links = [
		{
			title: 'Learn',
			slug: '/h2/learn',
			text: `<p>Learn the key techniques for each topic.</p>
				<p>Each technique comes with interactive practices to help you master the concepts.</p>`,
			links: [
				{ title: 'Functions', slug: '/h2/learn/functions/concepts/intervals/theory' },
				{
					title: 'Graphs',
					slug: '/h2/learn/graphs-and-transformations/standard-graphs/asymptotes/theory'
				}
			]
		},
		{
			title: 'Solutions',
			slug: '/h2/solutions/2023/p1/q7',
			text: `<p>Answers and solutions to past examination questions.</p>
			<p>Navigate either yearly, or topically.</p>`,
			links: [
				{ title: '2023', slug: '/h2/solutions/2023/p1/q7' },
				{ title: '2022', slug: '/h2/solutions/2022/p1/q6' },
				{ title: '2021', slug: '/h2/solutions/2021/p1/q6' },
				{ title: '2020', slug: '/h2/solutions/2020/p1/q6' },
				{ title: '2019', slug: '/h2/solutions/2019/p1/q5' },
				{ title: '2018', slug: '/h2/solutions/2018/p1/q5' },
				{ title: '2017', slug: '/h2/solutions/2017/p2/q3' },
				{ title: '2016', slug: '/h2/solutions/2016/p1/q10' },
				{ title: '2015', slug: '/h2/solutions/2015/p2/q3' },
				{ title: '2014', slug: '/h2/solutions/2014/p1/q1' },
				{ title: '2013', slug: '/h2/solutions/2013/p2/q1' },
				{ title: '2012', slug: '/h2/solutions/2012/p1/q7' },
				{ title: '2011', slug: '/h2/solutions/2011/p2/q3' },
				{ title: '2010', slug: '/h2/solutions/2010/p2/q4' },
				{ title: '2009', slug: '/h2/solutions/2009/p2/q3' },
				{ title: '2008', slug: '/h2/solutions/2008/p2/q4' },
				{ title: '2007', slug: '/h2/solutions/2007/p1/q2' }
			],
			links2: [
				{ title: 'Functions', slug: '/h2/solutions/2021/p2/q3' },
				{ title: 'Graphs', slug: '/h2/solutions/2021/p1/q6' }
			]
		},
		{
			title: 'Questions',
			slug: '/h2/questions/tys/2007/p1/q2',
			text: `<p>Archive of older examination questions, in a convenient digital format.</p>
			<p>Blue links will require registration (free), while green links require a premium membership.</p>`,
			links: [
				{ title: '2007', slug: '/h2/questions/tys/2007/p1/q2' },
				{ title: '2008', slug: '/h2/questions/tys/2008/p2/q4', color: 'green' },
				{ title: '2009', slug: '/h2/questions/tys/2009/p1/q4', color: 'blue' },
				{ title: '2010', slug: '/h2/questions/tys/2010/p2/q4', color: 'green' },
				{ title: '2011', slug: '/h2/questions/tys/2011/p2/q3', color: 'blue' },
				{ title: '2012', slug: '/h2/questions/tys/2012/p1/q7', color: 'green' },
				{ title: '2013', slug: '/h2/questions/tys/2013/p2/q1', color: 'blue' }
			]
		}
	];
	import Card from '$lib/components/ui/Card.svelte';
</script>

<svelte:head>
	<title>Mathlify</title>
</svelte:head>

<main>
	{#each links as link}
		<div class="card-container">
			<Card>
				{#snippet title()}
					{link.title}
				{/snippet}
				<div>{@html link.text ?? ''}</div>
				{#snippet end()}
					<div class="links" class:topical-links={link.title === 'Learn'}>
						{#each link.links ?? [] as child}
							<a
								class="btn sm"
								class:green={'color' in child && child.color === 'green'}
								class:blue={'color' in child && child.color === 'blue'}
								href={child.slug}
							>
								{child.title}
							</a>
						{/each}
					</div>
					{#if link.links2}
						<div class="links topical-links">
							{#each link.links2 ?? [] as child}
								<a class="btn sm" href={child.slug}>
									{child.title}
								</a>
							{/each}
						</div>
					{/if}
				{/snippet}
			</Card>
		</div>
	{/each}
</main>

<style>
	main {
		margin: 1.5rem;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 1rem;
	}
	.card-container {
		display: grid;
	}
	.links {
		list-style-type: none;
		padding-inline: 0;
		display: grid;
		gap: 1px;
		grid-template-columns: repeat(auto-fill, minmax(6ch, 1fr));
		margin-block-end: 1rem;
	}
	.topical-links {
		grid-template-columns: repeat(auto-fill, minmax(8ch, 1fr));
	}
	a {
		text-decoration: none;
		color: inherit;
		display: flex;
		justify-content: center;
	}
	.sm {
		font-size: 0.75rem;
		border-radius: 0.25rem;
	}
	.sm:hover {
		background-color: var(--primary, midnightblue);
		color: var(--primary-content, white);
	}
	.green {
		color: green;
	}
	.blue {
		color: blue;
	}
</style>
