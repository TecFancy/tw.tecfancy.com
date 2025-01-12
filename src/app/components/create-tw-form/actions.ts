'use server';

export const createInstance = async (_prevState: unknown, formData: FormData) => {
    const res = await fetch(`http://localhost:4236/api`, {
        method: 'POST',
        body: JSON.stringify(Object.fromEntries(formData)),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (res.ok) {
        return await res.json();
    } else {
        return null;
    }
};
