export const URL = 'http://localhost:8080';

export async function Ping() {
    let ans = await fetch(`${URL}/ping`);
    let data = await ans.json();
    return data;
}

//base fetch request
export function BaseFetch(path: string,
    method: "GET" | "POST" | "DELETE" | "PUT",
    body: any) {
    if (method === 'GET') {
        return fetch(URL + path);
    }
    return fetch(URL + path, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
}