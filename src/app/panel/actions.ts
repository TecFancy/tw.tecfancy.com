'use server';

export async function createInstance(_prevState: unknown, formData: FormData) {
    const res = await fetch('http://localhost:8080/panel/api', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ twName: formData.get('twName') }),
    });
    if (res.ok) {
        return await res.json();
    } else {
        return null;
    }
}
