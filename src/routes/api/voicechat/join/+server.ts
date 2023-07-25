

export async function POST() {

    const res = await fetch("http://127.0.0.1:5589/voicechat/join", {
        method: "POST"
    })

    const data = await res.json()

    return data;
}