

export async function POST({ request }) {
    const body = await request.json();
    const limit = body.limit;


    const res = await fetch("http://127.0.0.1:5589/limits", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "limit": limit,
        })
    })

    const data = await res.json()

    return data;

}

export async function GET() {

    const res = await fetch("http://127.0.0.1:5589/limits")

    const data = await res.json()

    return data as  {
        currlimit: number,
        deflimit: number
    };
}
