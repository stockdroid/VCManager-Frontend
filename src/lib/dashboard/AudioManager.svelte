<script lang="ts">
	export let Authorization = '';
	import { makeAPIReq } from '$lib/APIManager';
	import Button from '$lib/Button.svelte';
	import { Globals } from '$lib/Globals';
    let paused = false;

	(async () => {
		const data = await makeAPIReq('GET', '/play/list', Authorization);
		Globals.audioFiles = data.filenames;
	})();

	function selectOption(event: any) {
		Globals.selectedAudio = event.target.value.replace(".audio", "");
	}

    function playAudio() {
        makeAPIReq('POST', '/play/' + Globals.selectedAudio!, Authorization).then((data) => {
            if (data.playing) {
                alert('Audio riprodotto!');
                Globals.currentlyPlayingAudio = {
                    filename: Globals.selectedAudio!,
                    state: "PLAY",
                    seconds: 0
                }
            }
        });
    }

    function togglePlayback() {
        makeAPIReq('PATCH', `/play/${paused ? "resume" : "pause"}`, Authorization).then((data) => {
            if (data.paused) {
                alert('Audio riprodotto!');
            } else {
                alert('Audio messo in pausa!');
                Globals.currentlyPlayingAudio = {
                    filename: Globals.selectedAudio!,
                    state: "PAUSE",
                    seconds: 0
                }
            }
        });
    }

</script>

<select style="margin-bottom: 10px;" class="select-dropdown" on:change={selectOption}  >
    <option value="default" disabled selected>Seleziona un file audio</option>
    {#each Globals.audioFiles as filename}
        <option value={filename}>{filename.replace(".audio", "")}</option>
    {/each}
</select>
{#if Globals.selectedAudio}
    <Button content="Riproduci suono" handleClick={playAudio} />
    <div style="margin-bottom: 10px;"></div>
    <Button content="{Globals.currentlyPlayingAudio?.state === 'PAUSE' ? 'Riprendi riproduzione' : 'Metti in pausa'}" handleClick={togglePlayback} />
    <!-- <Button content="Informazioni sull'audio" handleClick={audioInformation} /> -->
{/if}


<style>
	.select-dropdown {
		width: 200px;
		padding: 2px;
		border: 1px solid #ccc;
		border-radius: 5px;
		cursor: pointer;
	}
</style>
