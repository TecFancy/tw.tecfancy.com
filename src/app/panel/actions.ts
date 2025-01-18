'use server';

export async function createInstance(_prevState: unknown, formData: FormData) {
    const res = await fetch('http://localhost:4236/api/tiddlywiki', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: formData.get('title') }),
    });
    if (res.ok) {
        return await res.json();
    } else {
        return null;
    }
}
