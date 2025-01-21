'use client';

import { useCallback, useEffect, useState } from "react";
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

    const getTiddlywikiTitle = (instance: Instance) => {
        const title = instance.title;
        const arr = title.split(' ');
        if (arr.length >= 2) {
            return `${arr[0][0]}${arr[1][0]}`;
        } else {
            return arr[0][0];
        }
    };

    const bootstrap = useCallback(async () => {
        try {
            const result = await fetchInstances();
            setInstances(result);
            dispatch({ type: 'instances/initial', instances: result });
        } catch (error) {
            console.error('getInitializedInstances error', error);
            setInstances([]);
        }
    }, [dispatch]);

    useEffect(() => {
        bootstrap();
    }, [bootstrap]);

    useEffect(() => {
        setInstances(instancesStore);
    }, [instancesStore]);

    return (
        <div className="left-tool-bar">
            <Link className="home" href="/" title="Home">
                <i className="iconfont">&#xe61d;</i>
            </Link>
            <section className="section">
                {instances?.length > 0 && instances.filter((inst) => !inst.deleted).map((instance) => (
                    <Link
                        key={instance.id}
                        href={`/wiki/${instance.id}`}
                        title={instance.title}
                        className={classNames("instance", { active: params?.id === instance.id })}
                    >
                        {getTiddlywikiTitle(instance)}
                    </Link>
                ))}
            </section>
        </div>
    );
};

export default LeftToolBarPage;
