

export async function POST({ params, request }) {
    const body = await request.json();
    const action = body.action;

    const res = await fetch(`http://127.0.0.1:5589/forcedmutes/action/${params.id}?action=${action}`, {
        method: "POST"
    })

    const data = await res.json()

    return data;
}