<script lang="ts">
	const links = [
		{
			title: 'Learn',
			slug: '/h2/learn',
			text: 'Learn the syllabus content with out notes. Each concept comes with interactive practices focusing on the key techniques for each topic.',
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
			text: 'Answers and solutions to past examination questions. Questions are arranged both yearly as well as topically.',
			links: [
				{ title: '2023', slug: '/h2/solutions/2023/p1/q7' },
				{ title: '2022', slug: '/h2/solutions/2022/p1/q6' },
				{ title: '2021', slug: '/h2/solutions/2021/p1/q6' },
				{ title: '2020', slug: '/h2/solutions/2020/p1/q6' },
				{ title: '2019', slug: '/h2/solutions/2019/p1/q5' },
				{ title: '2018', slug: '/h2/solutions/2018/p1/q5' },
				{ title: '2017', slug: '/h2/solutions/2017/p1/q5' },
				{ title: '2016', slug: '/h2/solutions/2016/p1/q5' },
				{ title: '2015', slug: '/h2/solutions/2015/p1/q5' },
				{ title: '2014', slug: '/h2/solutions/2014/p1/q5' },
				{ title: '2013', slug: '/h2/solutions/2013/p1/q5' },
				{ title: '2012', slug: '/h2/solutions/2012/p1/q5' },
				{ title: '2011', slug: '/h2/solutions/2011/p1/q5' },
				{ title: '2010', slug: '/h2/solutions/2010/p1/q5' },
				{ title: '2009', slug: '/h2/solutions/2009/p1/q5' },
				{ title: '2008', slug: '/h2/solutions/2008/p1/q5' },
				{ title: '2007', slug: '/h2/solutions/2007/p1/q5' }
			]
		},
		{
			title: 'Questions',
			slug: '/h2/questions/tys/2007/p1/q2',
			text: 'Archive of past examination questions in a digital friendly format.',
			links: [
				{ title: '2007', slug: '/h2/questions/tys/2007/p1/q2' },
				{ title: '2008', slug: '/h2/questions/tys/2008/p2/q4' },
				{ title: '2009', slug: '/h2/questions/tys/2009/p1/q4' },
				{ title: '2010', slug: '/h2/questions/tys/2010/p1/q4' },
				{ title: '2011', slug: '/h2/questions/tys/2011/p2/q3' },
				{ title: '2012', slug: '/h2/questions/tys/2012/p1/q3' }
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
				<div>{link.text ?? ''}</div>
				<div class="btn-group">
					<div class="main-link">
						<a class="btn main-btn" href={link.slug}>{link.title}</a>
					</div>
					<ul class:learn-links={link.title === 'Learn'}>
						{#each link.links ?? [] as child}
							<li><a class="btn sm" href={child.slug}>{child.title}</a></li>
						{/each}
					</ul>
				</div>
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
	ul {
		list-style-type: none;
		padding-inline: 0;
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(6ch, 1fr));
		gap: 0.5rem;
	}
	.learn-links {
		display: flex;
		flex-wrap: wrap;
	}
	a {
		text-decoration: none;
		color: inherit;
	}
	.btn {
		border: 1px solid black;
	}
	.main-link {
		margin-block: 1em;
	}
	.main-btn {
		background-color: var(--primary, midnightblue);
		color: var(--primary-content, white);
	}
	.main-btn:hover {
		color: var(--content, black);
	}
	.sm {
		font-size: 0.75rem;
		border-radius: 1rem;
	}
	.sm:hover {
		background-color: var(--primary, midnightblue);
		color: var(--primary-content, white);
	}
	.btn-group {
		display: flex;
		flex-direction: column;
	}
</style>
