import React from 'react';
import Panel from '@/app/panel/page';
import Wikis from "@/app/wikis";
import LeftToolBarPage from "@/app/components/letf-tool-bar/page";

import './layout.css';

const Home = () => {
  return (
    <main>
        <LeftToolBarPage />
        <div className="content">
            <h1>多实例 TiddlyWiki 管理</h1>
            <Panel/>
            <Wikis/>
        </div>
    </main>
  );
};

export default Home;
