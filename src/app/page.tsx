'use client';

import React from 'react';
import Card from "@/app/components/card";
import CreateTwForm from "@/app/components/create-tw-form";
import InstanceTableList from "@/app/components/instance-table-list";
import {useInstances} from "@/app/hooks";

const Home = () => {
    const instances = useInstances();

    const renderInstanceTableList = () => {
        if (instances.length <= 0) return;
        return (
            <Card>
                <InstanceTableList />
            </Card>
        );
    }

    return (
        <>
            <Card>
                <CreateTwForm />
            </Card>
            {renderInstanceTableList()}
        </>
    );
};

export default Home;
