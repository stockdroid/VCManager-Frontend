<script lang="ts">
	import { onMount } from 'svelte';

	let dots = '';

	onMount(() => {
		setInterval(() => {
			dots = '.'.repeat((dots.length + 1) % 4);
		}, 190);
	});
</script>

<figure>
	<figcaption>Caricamento{dots}</figcaption>
</figure>

<style>
	figcaption {
		font-weight: bold;
		text-align: center;
        color: white;
        font: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        font-size: 40px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

	}
</style>
