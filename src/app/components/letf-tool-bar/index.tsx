'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { fetchInstances } from "./actions";
import './styles.css';
import classNames from "classnames";

const LeftToolBarPage = () => {
    const params = useParams();
    const [instances, setInstances] = useState<Instances>([]);

    const getInstances = async () => {
        try {
            setInstances(await fetchInstances());
        } catch (error) {
            setInstances([]);
            console.error('getInitializedInstances error', error);
        }
    };

    useEffect(() => {
        getInstances();
    }, []);

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
