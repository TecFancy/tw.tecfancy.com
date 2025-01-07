import Link from "next/link";
import { getInstances } from "@/lib";

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
                    <Link key={instance.id} href={`/wiki/${instance.id}`} title={instance.twName} target="_blank" className="instance">
                        {instance.twName}
                    </Link>
                ))}
            </section>
            <button className="create" title="Create TiddlyWiki Instance">
                <i className="iconfont">&#xe6df;</i>
            </button>
        </div>
    );
};

export default LeftToolBarPage;
