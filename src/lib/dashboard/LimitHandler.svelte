<script lang="ts">
	import { makeAPIReq } from '$lib/APIManager';
	import Button from '$lib/Button.svelte';
	export let currlimit = 0;

	function ApplyVCLimit() {
		const input = document.getElementById('currlimit')! as HTMLInputElement;
		makeAPIReq('POST', '/limits', { currlimit: parseInt(input.value) }).then(
			(data) => {
				if (data.exlimit) {
					currlimit = parseInt(input.value);
					alert('Limite cambiato a ' + input.value + ' persone!');
				}
			}
		);
	}
</script>

<div class="input-container">
	<input type="number" placeholder={currlimit.toString()} id="currlimit" style="margin-bottom: 10px;" />
	<div class="but">
		<Button content="Applica" handleClick={() => ApplyVCLimit()} />
	</div>
</div>

<style>
	.input-container {
		position: relative;
	}

	input {
		padding: 10px 15px;
		font-size: 16px;
		border: 1px solid #ccc;
		border-radius: 5px;
		outline: none;
		transition: border-color 0.3s ease-in-out;
		width: 100%;
		box-sizing: border-box;
	}

	input:focus {
		border-color: #007bff;
	}

    .but {
        position: absolute;
        right: 0;
        left: 30%
    }
</style>
