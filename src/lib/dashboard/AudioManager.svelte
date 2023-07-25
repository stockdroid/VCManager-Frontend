<script lang="ts">
	export let Authorization = '';
	import { makeAPIReq } from '$lib/APIManager';
	import Button from '$lib/Button.svelte';

	let filenames: string[] = [];
	let selectedAudio: string | null = null;
    let paused = false;

	(async () => {
		const data = await makeAPIReq('GET', '/play/list', Authorization);
		filenames = data.filenames;
	})();

	function selectOption(event: any) {
		selectedAudio = event.target.value;
	}

    function playAudio() {
        makeAPIReq('POST', '/play/' + selectedAudio!.replace(".audio", ""), Authorization).then((data) => {
            if (data.playing) {
                alert('Audio riprodotto!');
            }
        });
    }

    function togglePlayback() {
        makeAPIReq('PATCH', `/play/${paused ? "resume" : "pause"}`, Authorization).then((data) => {
            if (data.paused) {
                alert('Audio messo in pausa!');
            } else {
                alert('Audio riprodotto!');
            }
            paused = !paused;
        });
    }

</script>

<select style="margin-bottom: 10px;" class="select-dropdown" on:change={selectOption} >
    <option value="default" disabled selected>Seleziona un file audio</option>
    {#each filenames as filename}
        <option value={filename}>{filename.replace(".audio", "")}</option>
    {/each}
</select>
{#if selectedAudio}
    <Button content="Riproduci suono" handleClick={playAudio} />
    <div style="margin-bottom: 10px;" />
    <Button content="{paused ? "Riprendi riproduzione" : "Metti in pausa"}" handleClick={togglePlayback} />
    <!-- <Button content="Informazioni sull'audio" handleClick={audioInformation} /> -->
{/if}


<style>
	.select-dropdown {
		width: 200px;
		padding: px;
		border: 1px solid #ccc;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
