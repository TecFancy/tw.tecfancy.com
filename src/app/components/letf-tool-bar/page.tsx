import Link from "next/link";

import './styles.css';

const LeftToolBarPage = () => {
    return (
        <div className="left-tool-bar">
            <Link className="home" href="/" title="Home">
                <i className="iconfont">&#xe61d;</i>
            </Link>
            <button className="create" title="Create TiddlyWiki Instance">
                <i className="iconfont">&#xe6df;</i>
            </button>
        </div>
    );
};

export default LeftToolBarPage;
