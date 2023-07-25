

export async function PATCH({ params, request }) {

    const res = await fetch("http://127.0.0.1:5589/play/resume", {
        method: "PATCH"
    })

    const data = await res.json()

    return data;
}