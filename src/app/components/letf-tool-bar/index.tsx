'use client';

import { useEffect, useState } from "react";
import classNames from "classnames";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchInstances } from "./actions";
import { useInstances, useInstancesDispatch } from "@/app/hooks";
import './styles.css';

const LeftToolBarPage = () => {
    const params = useParams();
    const instancesStore = useInstances();
    const dispatch = useInstancesDispatch();
    const [instances, setInstances] = useState<Instances>([]);

    const bootstrap = async () => {
        try {
            const result = await fetchInstances();
            setInstances(result);
            dispatch({ type: 'instances/initial', instances: result });
        } catch (error) {
            console.error('getInitializedInstances error', error);
            setInstances([]);
        }
    };

    useEffect(() => {
        bootstrap();
    }, []);

    useEffect(() => {
        setInstances(instancesStore);
    }, [instancesStore]);

    return (
        <div className="left-tool-bar">
            <Link className="home" href="/" title="Home">
                <i className="iconfont">&#xe61d;</i>
            </Link>
            <section className="section">
                {instances?.length > 0 && instances.map((instance) => (
                    <Link
                        key={instance.id}
                        href={`/wiki/${instance.id}`}
                        title={instance.twName}
                        className={classNames("instance", { active: params?.id === instance.id })}
                    >
                        {instance.twName?.[0]}
                    </Link>
                ))}
            </section>
        </div>
    );
};

export default LeftToolBarPage;
