'use server';

export const createInstance = async (prevState: unknown, formData: FormData) => {
    console.log('createInstance', formData);
    const res = await fetch('http://localhost:8080/api', {
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
