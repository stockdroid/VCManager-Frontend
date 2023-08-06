<script lang="ts">

	export let content: string;
	export let color = '#7289da';

    export let handleClick = () => {};
</script>

<button style="background-color: {color};" on:click={handleClick}>
	{content}
</button>

<style>
	button {
		align-items: center;
		appearance: none;
		border: none;
		border-radius: 8px;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
		box-sizing: border-box;
		color: #fff;
		cursor: pointer;
		display: flex;
		flex-direction: row;
		justify-content: center;
		font-size: 100%;
		line-height: 1.15;
		margin: 0;
		padding: 10px 21px;
		text-align: center;
		text-transform: none;
		transition: background 0.13s ease-in-out, box-shadow 0.13s ease-in-out;
		user-select: none;
		-webkit-user-select: none;
		touch-action: manipulation;
	}
</style>