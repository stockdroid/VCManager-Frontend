<script lang="ts">
    import Button from '$lib/Button.svelte';
    import { makeAPIReq } from '$lib/APIManager';

    let IsRecording = false;
    (async () => {
        const data = await makeAPIReq('POST', '/voicechat/info');
        IsRecording = data.info.record_video_active;
    })

    function ChangeTitle() {
        const newTitle = prompt('Inserisci il nuovo titolo della VC: ');

        if (!newTitle) return;



        makeAPIReq('POST', '/voicechat/title?title=' + newTitle).then((data) => {
            if (data.newtitle) {
                alert('Titolo cambiato a ' + data.newtitle + '!');
            }
        });
    }

    function ToggleRecord() {
        if (IsRecording) {
            const confirmStop = confirm('Vuoi davvero terminare la registrazione?');

            if (!confirmStop) return;

            makeAPIReq('POST', '/voicechat/record?start=false').then((data) => {
                if (!data.record) {
                    alert('Registrazione terminata!');
                    IsRecording = false;
                }
            });
            return;
        }
        const video = confirm('Vuoi registrare il video della VC?');

        const confirmation = confirm('Vuoi davvero iniziare la registrazione?');

        if (!confirmation) return;

        makeAPIReq('POST', '/voicechat/record?start=true&video=' + video).then((data) => {
            if (data.record) {
                alert('Registrazione iniziata!');
                IsRecording = true;
            }
        });
    }

    function EndVC() {
        const confirmEnd = confirm('Vuoi davvero terminare la VC?');

        if (!confirmEnd) return;

        makeAPIReq('POST', '/voicechat/end').then((data) => {
            if (data.left) {
                window.location.href = '/';
            }
        });
    }
</script>

<Button content="Cambia Titolo VC" handleClick={ChangeTitle}/>
<div style="margin-bottom: 10px;"></div>
<Button content="{IsRecording ? 'Termina la registrazione della' : 'Registra la'} VC" handleClick={ToggleRecord} />
<div style="margin-bottom: 10px;"></div>
<!-- make the button red-->
<Button content="Termina la VC" handleClick={EndVC} color="red" />