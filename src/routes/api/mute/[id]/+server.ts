

export async function POST({ params, request }) {
    const userId = params.id;

    const res = await fetch("http://127.0.0.1:5589/mute/" + userId, {
        method: "POST"
    })

    const data = await res.json()

    return data;
}