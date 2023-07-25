

export async function GET({ params, request }) {
    const filename = params.filename;

    const res = await fetch("http://127.0.0.1:5589/play/" + filename, {
        method: "POST"
    })

    const data = await res.json()

    return data;
}