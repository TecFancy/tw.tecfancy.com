'use client';

import { useActionState } from "react";
import Form from "next/form";
import { createInstance } from "./actions";

const CreateInstance = () => {
    const [, formAction, isPending] = useActionState(createInstance, null);

    return (
        <Form action={formAction}>
            <input name="twName" />
            <button type="submit" disabled={isPending}>{isPending ? 'Creating...' : 'Create TiddlyWiki Instance'}</button>
        </Form>
    );
};

export default CreateInstance;
