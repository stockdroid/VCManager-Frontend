

export async function POST({ params, request }) {

    const res = await fetch("http://127.0.0.1:5589/voicechat/status", {
        method: "POST"
    })

    const data = await res.json()

    return data;
}