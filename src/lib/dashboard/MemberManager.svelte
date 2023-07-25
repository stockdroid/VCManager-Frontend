<script lang="ts">
	import Button from '$lib/Button.svelte';
	import { makeAPIReq } from '$lib/APIManager';

	export let members: {
		name: string;
		surname?: string;
		id: number;
		username: string;
	}[] = [];

	export let Authorization = '';
	let selectedMember: {
		name: string;
		surname?: string;
		id: number;
		username: string;
	} | null = null;

	let whitelist: number[] = [];

	let forcedMutes: number[] = [];

	makeAPIReq('GET', '/whitelist', Authorization).then((data) => {
		whitelist = data.whitelist;
	});

	makeAPIReq('GET', '/forcedmutes', Authorization).then((data) => {
		forcedMutes = data.forcedmutes;
	});

	function selectOption(event: any) {
		selectedMember = members.find(
			(member) => member.id.toString() === event.target.value.toString()
		)!;
	}

	function MuteUser() {
		if (!selectedMember) {
			return;
		}

		makeAPIReq('POST', '/mute/' + selectedMember.id, Authorization).then((data) => {
			if (data.muted) {
				alert('Utente mutato!');
			}
		});
	}

	function UnmuteUser() {
		if (!selectedMember) {
			return;
		}

		makeAPIReq('POST', '/allow/' + selectedMember.id, Authorization).then((data) => {
			if (!data.muted) {
				alert('Utente smutato!');
			}
		});
	}

	function SetVolume() {
		const volume = prompt('Inserisci il volume da impostare (da 0 a 100)');

		if (!volume) {
			alert('Volume non impostato!');
			return;
		}

		if (!selectedMember) {
			return;
		}

		makeAPIReq('POST', '/volume/' + selectedMember.id + '?volume=' + volume, Authorization).then(
			(data) => {
				if (data.volume) {
					alert('Volume impostato!');
				}
			}
		);
	}

	function ToggleUserWhitelist() {
		const whitelistStatus = whitelist.includes(selectedMember?.id!);
		const yes = confirm(
			`Sei sicuro di voler ${whitelistStatus ? 'rimuovere' : 'aggiungere'} questo utente ${
				whitelistStatus ? 'dalla' : 'alla'
			} whitelist?`
		);

		if (!yes) {
			return;
		}

		if (!selectedMember) {
			return;
		}

		makeAPIReq(
			whitelistStatus ? 'DELETE' : 'PUT',
			'/whitelist?id=' + selectedMember.id,
			Authorization
		).then((data) => {
			whitelist = data.currwhitelist;
			alert(
				`Utente ${whitelistStatus ? 'rimosso' : 'aggiunto'} ${
					whitelistStatus ? 'dalla' : 'alla'
				} whitelist!`
			);
		});
	}

	function ToggleUserForcedmute() {
		const forcedMuteStatus = forcedMutes.includes(selectedMember?.id!);
		const yes = confirm(
			`Sei sicuro di voler ${forcedMuteStatus ? 'rimuovere' : 'aggiungere'} questo utente ${
				forcedMuteStatus ? 'dai' : 'ai'
			} mute forzati?`
		);

		if (!yes) {
			return;
		}

		if (!selectedMember) {
			return;
		}

		makeAPIReq(
			'POST',
			'/forcedmutes/action/' + selectedMember.id + '?action=' + forcedMuteStatus ? 'remove' : 'add',
			Authorization
		).then((data) => {
            alert( forcedMuteStatus ? "Rimosso dai" : "Aggiunto ai" + " mute forzati!")
        });
	}
</script>

<select style="margin-bottom: 10px;" class="select-dropdown" on:change={selectOption}>
	<option value="default" disabled selected>Seleziona un utente</option>
	{#each members as member}
		<option value={member.id}>{member.name} ({'@' + member.username ?? 'Nessun username'})</option>
	{/each}
</select>
<div class="button-container">
	{#if selectedMember}
		<Button content="Muta" handleClick={MuteUser} />
		<Button content="Smuta" handleClick={UnmuteUser} />
		<Button content="Imposta vol." handleClick={SetVolume} />
		<Button
			content="{whitelist.includes(selectedMember.id)
				? 'Rimuovi dalla'
				: 'Aggiungi alla'} whitelist"
			handleClick={ToggleUserWhitelist}
		/>
		{#if !whitelist.includes(selectedMember.id)}
			<Button
				content="{forcedMutes.includes(selectedMember.id)
					? 'Rimuovi dai'
					: 'Aggiungi ai'} mute forzati"
				handleClick={ToggleUserForcedmute}
			/>
		{/if}
	{/if}
</div>

<style>
	.select-dropdown {
		width: 200px;
		padding: px;
		border: 1px solid #ccc;
		border-radius: 5px;
		cursor: pointer;
	}

	.button-container {
		display: grid;
		grid-template-columns: repeat(3, 0.5fr);
		grid-gap: 10px;
	}
</style>
