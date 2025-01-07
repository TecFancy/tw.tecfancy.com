'use client';

import './styles.css';

const CreateBtn = () => {
    const handleClick = () => {
        alert('Create TiddlyWiki Instance');
    };

    return (
        <button className="create" title="Create TiddlyWiki Instance" onClick={handleClick}>
            <i className="iconfont">&#xe6df;</i>
        </button>
    );
};

export default CreateBtn;
