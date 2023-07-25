

export async function POST({ params, request }) {
    const fileName = params.filename;

    const res = await fetch("http://127.0.0.1:5589/play/duration/" + fileName, {
        method: "POST"
    })

    const data = await res.json()

    return data;
}