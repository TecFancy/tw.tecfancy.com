'use server';

export const createInstance = async (_prevState: unknown, formData: FormData) => {
    const bodyData = {
        title: formData.get('title'),
        subtitle: formData.get('subtitle'),
    };

    const res = await fetch('http://localhost:4236/api/tiddlywiki', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
    });
    if (res.ok) {
        return await res.json();
    } else {
        return null;
    }
};
