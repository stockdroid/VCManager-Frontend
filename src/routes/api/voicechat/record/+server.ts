

export async function POST({ params, request }) {
    const body = await request.json();
    const video = body.video;
    const start = body.start;

    const res = await fetch(`http://127.0.0.1:5589/voicechat/record?video=${video}&start=${start}`, {
        method: "POST"
    })

    const data = await res.json()

    return data;
}