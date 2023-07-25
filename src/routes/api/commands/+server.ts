

export async function GET({ params, request }) {

    const res = await fetch("http://127.0.0.1:5589/commands")

    const data = await res.json()

    return data;
}