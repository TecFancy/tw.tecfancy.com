'use client';

import {useActionState, useEffect, useState} from "react";
import Form from "next/form";

import { createInstance } from "./actions";
import { updateInstancesToLocalStorage } from "@/app/utils";

import "./styles.css";

import type { ChangeEvent } from "react";

const CreateTwForm = () => {
    const [titleValue, setTitleValue] = useState('');
    const [state, formAction, isPending] = useActionState(createInstance, null);

    const handleTwNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitleValue(e.target.value?.trim());
    };

    useEffect(() => {
        if (state?.data?.instances?.length) {
            updateInstancesToLocalStorage(state.data.instances);
        }
    }, [state]);

    return (
        <Form action={formAction} className="create-tw-form">
            <div className="form-item">
                <label htmlFor="twName" className="required">Title</label>
                <input
                    name="twName"
                    disabled={isPending}
                    onChange={handleTwNameChange}
                    autoComplete="false"
                    placeholder="TiddlyWiki"
                />
            </div>
            <div className="form-item">
                <label htmlFor="twSubtitle">Subtitle</label>
                <input
                    name="twSubtitle"
                    disabled={isPending}
                    autoComplete="false"
                    placeholder="a non-linear personal web notebook"
                />
            </div>
            <button type="submit" disabled={isPending || !titleValue}>{isPending ? 'Creating...' : 'Create'}</button>
        </Form>
    );
};

export default CreateTwForm;
