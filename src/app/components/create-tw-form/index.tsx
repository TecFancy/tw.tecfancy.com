'use client';

import { ChangeEvent, useActionState, useEffect, useState } from "react";
import Form from "next/form";
import { createInstance } from "./actions";
import { useInstancesDispatch } from "@/app/hooks";
import "./styles.css";

const CreateTwForm = () => {
    const [titleValue, setTitleValue] = useState('');
    const [state, formAction, isPending] = useActionState(createInstance, null);
    const dispatch = useInstancesDispatch();

    const handleTwNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setTitleValue(e.target.value?.trim());
    };

    useEffect(() => {
        if (state?.data?.instances?.length) {
            dispatch({ type: 'instances/add', instance: state.data.instance });
        }
    }, [dispatch, state]);

    return (
        <Form action={formAction} className="create-tw-form">
            <div className="form-item">
                <label htmlFor="title" className="required">Title</label>
                <input
                    name="title"
                    disabled={isPending}
                    onChange={handleTwNameChange}
                    autoComplete="false"
                    placeholder="TiddlyWiki"
                />
            </div>
            <div className="form-item">
                <label htmlFor="subtitle">Subtitle</label>
                <input
                    name="subtitle"
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
