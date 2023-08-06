<script lang="ts">
	import { onMount } from 'svelte';
	import Loading from '$lib/Loading.svelte';
	import LimitHandler from '$lib/dashboard/LimitHandler.svelte';
	import { apiBaseUrl, getAuthCookie, makeAPIReq } from '$lib/APIManager';
	import MemberManager from '$lib/dashboard/MemberManager.svelte';
	import VcManager from '$lib/dashboard/VCManager.svelte';
	import AudioManager from '$lib/dashboard/AudioManager.svelte';
	import { Globals, WebsocketEvents, WebsocketResponses } from '$lib/Globals';
	let Authorization = '';
	let loaded = false;
	let currlimit = 0;

	async function fetchMembers() {
		const members = await makeAPIReq('GET', '/participants', Authorization);
		let userids = '';
		for (let member of members.participants) {
			if (member.is_self) continue;
			userids += member.peer.user_id + ',';
		}
		userids = userids.slice(0, -1);
		if (userids == '') return;
		const users = await makeAPIReq('GET', '/massinfo/' + userids, Authorization);

		Globals.members = users.map((user: any) => ({
			name: user.info.first_name,
			surname: user.info.last_name ?? '',
			id: user.user_id,
			username: user.info.username
		}));
	}

	onMount(async () => {
		Authorization = getAuthCookie()!;

		const isInVc = await makeAPIReq('GET', '/voicechat/invc', Authorization);
		const isVcOn = await makeAPIReq('POST', '/voicechat/info', Authorization);

		if (isVcOn.error === 'GROUPCALL_NOT_EXIST') {
			window.location.href = '/';
		} else {
			if (!isInVc.vcpresent) {
				await makeAPIReq('POST', '/voicechat/join', Authorization);
			}
			const vcLimit = await makeAPIReq('GET', '/limits', Authorization);
			currlimit = vcLimit.currlimit;
			await fetchMembers();
			const ws = new WebSocket(apiBaseUrl.replace("https://", "wss://") +'/stream?authorization=' + Authorization);

			ws.addEventListener('message', async (raw) => {

				const data = JSON.parse(raw.data.toString());

				switch (data.action) {
					case WebsocketEvents.Introduction: {
						console.log('Connected to WS!');
						break;
					}
					case WebsocketResponses.ParticipantsError: {
						if (data.data.SPECIFIC === 'NoCall' && window.location.href === '/vc') {
							ws.close();
							window.location.href = '/';
						}
						break;
					}
					case WebsocketEvents.UserJoin: {
						if (!Globals.members.find((member) => member.id === data.data.user_id)) {
							Globals.members.push({
								id: data.data.user_id,
								username: data.data.username,
								name: data.data.first_name,
								surname: data.data.last_name,
								muted: true
							});
						}
						break;
					}
					case WebsocketEvents.UserQuit: {
						if (Globals.members.find((member) => member.id === data.data.user_id)) {
							Globals.members = Globals.members.filter((member) => member.id !== data.data.user_id);
						}
						break;
					}
					case WebsocketEvents.NetworkChange: {
						if (!data.data.connected) {
							const req = await makeAPIReq('GET', '/voicechat/info', Authorization!);
							if (req.error === 'GROUPCALL_NOT_EXIST') {
								alert('La chat vocale è stata terminata, verrai reindirizzato alla homepage.');
								window.location.href = '/';
								break;
							}
							await makeAPIReq('POST', '/voicechat/join', Authorization!);
						}
						break;
					}
					case WebsocketEvents.UserMuted: {
						if (Globals.members.find((member) => member.id === data.data.user_id)) {
							Globals.members.find((member) => member.id === data.data.user_id)!.muted = true;
						}
						break;
					}
					case WebsocketEvents.UserUnmuted: {
						if (Globals.members.find((member) => member.id === data.data.user_id)) {
							Globals.members.find((member) => member.id === data.data.user_id)!.muted = true;
						}
						break;
					}
					case WebsocketEvents.AudioStateUpdate: {
						Globals.selectedAudio = data.data.filename;
						Globals.currentlyPlayingAudio = {
							filename: Globals.selectedAudio,
							state: data.data.state === 'PLAY' || data.data.state === 'RESUME' ? 'PLAY' : 'PAUSE',
							seconds: Number(data.data.seconds.toFixed(2))
						};
					}
				}
			});
			ws.addEventListener("open", () => {
				console.log("Initiated WS Connection.")
				loaded = true;
			})
		}
	});
</script>

{#if !loaded}
	<Loading />
{:else}
	<main>
		<h2 style="text-align: center;">VC Manager</h2>
		<div class="dashboard">
			<div class="settings-container">
				<div class="setting">
					<div class="setting-title">Limite VC</div>
					<div class="setting-params">Limite di persone che possono parlare</div>
					<LimitHandler {currlimit} {Authorization} />
				</div>

				<div class="setting">
					<div class="setting-title">Utenti</div>
					<div class="setting-params">Gestione utenti</div>
					{#if Globals.members.length > 0}
						<MemberManager {Authorization} />
					{:else}
						<p>Non ci sono utenti in VC</p>
					{/if}
				</div>
				<div class="setting">
					<div class="setting-title">VC</div>
					<div class="setting-params">Gestione VC</div>
					<VcManager {Authorization} />
				</div>
				<div class="setting">
					<div class="setting-title">Audio</div>
					<div class="setting-params">Riproduzione audio</div>
					<AudioManager {Authorization} />
				</div>
			</div>
		</div>
	</main>
{/if}

<style>
	.dashboard {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
	.settings-container {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		grid-gap: 10rem;
		max-width: 800px;
		width: 100%;
		padding: 20px;
		margin: 0 auto;
	}

	.setting {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 5px;
		border-radius: 8px;
		width: 100%;
	}

	.setting-title {
		font-weight: bold;
		margin-bottom: 5px;
	}

	.setting-params {
		color: #666;
		padding-bottom: 20px;
	}
</style>
