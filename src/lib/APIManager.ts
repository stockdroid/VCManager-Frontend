export const apiBaseUrl = "https://vcapi.stockdroid.it";

export async function makeAPIReq(method: "POST" | "GET" | "PATCH" | "DELETE" | "PUT", path: string, authorization: string, body?: any) {
    const options: {
        method: "POST" | "GET" | "PATCH" | "DELETE" | "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: string
        },
        body?: string
    } = {
        method,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authorization}`
        }
    }

    if (body) {
        options.body = JSON.stringify(body);
    } else {
        delete options.body;
    }


    const res = await fetch(apiBaseUrl + path, options)

    if (res.status === 401) {
        return {
            error: "Unauthorized"
        }
    } else if (res.status === 500) {
        if (document) alert("Qualcosa è andato storto nel bot/server, avvisa chicchi")
        return {
            error: "Internal Server Error"
        }
    }

    return await res.json();
}

export function getAuthCookie() {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [cookieName, cookieValue] = cookie.split('=');
        if (cookieName === "CF_Authorization") {
            return cookieValue;
        }
    }
    return null;
}