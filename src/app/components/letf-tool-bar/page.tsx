import Link from "next/link";
import { getInstances } from "@/lib";
import CreateBtn from "./create-btn";

import './styles.css';

const LeftToolBarPage = () => {
    const instances = getInstances();

    return (
        <div className="left-tool-bar">
            <Link className="home" href="/" title="Home">
                <i className="iconfont">&#xe61d;</i>
            </Link>
            <section className="section">
                {instances?.length > 0 && instances.map((instance) => (
                    <Link key={instance.id} href={`/wiki/${instance.id}`} title={instance.twName} className="instance">
                        {instance.twName?.[0]}
                    </Link>
                ))}
            </section>
            <CreateBtn />
        </div>
    );
};

export default LeftToolBarPage;
