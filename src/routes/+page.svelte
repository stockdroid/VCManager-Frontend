<script lang="ts">
	import { onMount } from 'svelte';
	import Loading from '$lib/Loading.svelte';
	import Button from '$lib/Button.svelte';
	import { getAuthCookie, makeAPIReq } from '$lib/APIManager';
	let Authorization = '';
	let loaded = false;
	let isInVc = false;
	let vcExists = false;
	onMount(async () => {
		// get cf_authorization cookie

		Authorization = getAuthCookie()!;

		const isVcOn = await makeAPIReq('POST', '/voicechat/info', Authorization);

		if (isVcOn.error === 'GROUPCALL_NOT_EXIST') {
			vcExists = false;
			loaded = true;
		} else {
			vcExists = true;
			const botStatus = await makeAPIReq('GET', '/voicechat/invc', Authorization);
			isInVc = botStatus.vcpresent;
			loaded = true;
			//if (isInVc) window.location.href = '/vc';
		}
	});
	function startVc() {
		makeAPIReq('POST', '/voicechat/create', Authorization)
			.then(() => {
				window.location.href = '/vc';
			})
			.catch((err) => {
				console.error(err);
			});
	}
</script>

<svelte:head>
	<meta name="darkreader" content="auto" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
	<meta charset="utf-8" />
	<meta name="darkreader-lock" />
</svelte:head>

{#if !loaded}
	<Loading />
{:else}
	<main>
		{#if !isInVc && !vcExists}
			<div class="imgtitle">
				<img
					src="/favicon.png"
					height="256"
					width="256"
					alt="Logo de IL VILLAGGIO DEI CRISATICI VC MANAGER"
					class="vcmanagerimg"
				/>
				<h1>Vc Manager: The game</h1>
				<p>
					Buonasera moderatore, sembra che sei pronto per una nuova avventura piena di underage
					fissati con Ordissimo
				</p>
				<p>Il tuo obiettivo è quello di sterminarli tutti, e che nessuno rimanga vivo.</p>
			</div>
			<div class="center-button">
				<Button content="SEI PRONTO? DAI INIZIO AI BAN!" handleClick={startVc} />
			</div>
		{:else} 
		 			<div class="imgtitle">
				<img
					src="/favicon.png"
					height="256"
					width="256"
					alt="Logo de IL VILLAGGIO DEI CRISATICI VC MANAGER"
					class="vcmanagerimg"
				/>
				<h1>Vc Manager: The game</h1>
				<p>
					Buonasera moderatore, il divertimento è già incominciato, che stai aspettando?
				</p>
				<p>Ricorda: Il tuo obiettivo è quello di sterminare tutti gli underage, e che nessuno rimanga vivo.</p>
			</div>
			
			<div class="center-button">
				<Button content="SEI PRONTO? DAI INIZIO AI BAN!" handleClick={() => {window.location.href = "/vc"}} />
			</div>
		{/if}
	</main>
{/if}

<style>
	.vcmanagerimg {
		display: block;
		margin: 0 auto;
		width: 256px;
		height: 256px;
		border-radius: 80%;
	}

	.imgtitle {
		text-align: center;
		margin-top: 40px;
	}

	.imgtitle h1 {
		margin-top: 20px;
	}

	.center-button {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}
</style>
