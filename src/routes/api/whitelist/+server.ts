

export async function GET({ params, request }) {

    const res = await fetch("http://127.0.0.1:5589/whitelist")

    const data = await res.json()

    return data;
}



export async function POST({ request }) {
    const body = await request.body();

    const res = await fetch("http://127.0.0.1:5589/voicechat/status", {
        method: "POST",
        body: body ? JSON.stringify(body.value) : null,
        headers: {
            "Content-Type": "application/json"
        }
    });

    const data = await res.json();

    return new Response(JSON.stringify({
        success: true,
        data: data
    }), {
        headers: {
            "Content-Type": "application/json"
        }
    });
}