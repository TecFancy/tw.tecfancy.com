'use client';

import { useActionState, useState } from "react";
import Form from "next/form";
import { createInstance } from "./actions";
import "./styles.css";

import type { ChangeEvent } from "react";

const CreateTwForm = () => {
    const [inputValue, setInputValue] = useState('');
    const [, formAction, isPending] = useActionState(createInstance, null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value?.trim());
    };

    return (
        <Form action={formAction} className="create-tw-form">
            <input name="twName" placeholder="Input a name to create" onChange={handleChange} />
            <button type="submit" disabled={isPending || !inputValue}>{isPending ? 'Creating...' : 'Create'}</button>
        </Form>
    );
};

export default CreateTwForm;
