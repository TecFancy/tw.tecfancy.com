'use server';

const env = process.env;
const protocol = env.NEXT_PUBLIC_PROTOCOL || 'http';
const domain = env.NEXT_PUBLIC_DOMAIN || 'localhost';
const port = env.PORT || '3000';

export const createInstance = async (prevState: unknown, formData: FormData) => {
    const res = await fetch(`${protocol}://${domain}:${port}/api`, {
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
