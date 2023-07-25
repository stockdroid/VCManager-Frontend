

export async function POST({ params, request }) {
    const body = await request.json();
    const title = body.title;

    const res = await fetch("http://127.0.0.1:5589/voicechat/title?title=" + title, {
        method: "POST"
    })

    const data = await res.json()

    return data;
}