<script lang="ts">
	import { onMount } from 'svelte';
	import Loading from '$lib/Loading.svelte';
	import LimitHandler from '$lib/dashboard/LimitHandler.svelte';
	import { getAuthCookie, makeAPIReq } from '$lib/APIManager';
	import MemberManager from '$lib/dashboard/MemberManager.svelte';
	import VcManager from '$lib/dashboard/VCManager.svelte';
	import AudioManager from '$lib/dashboard/AudioManager.svelte';
	let Authorization = '';
	let loaded = false;
	let currlimit = 0;
	let memberList: {
		name: string;
		surname?: string;
		id: number;
		username: string;
	}[] = [];

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

		memberList = users.map((user: any) => ({
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
			loaded = true;
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
					{#if memberList.length > 0}
						<MemberManager {Authorization} members={memberList} />
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
