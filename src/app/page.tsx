import React from 'react';
import Panel from '@/app/panel/page';
import Wikis from "@/app/wikis";

const Home = () => {
  return (
      <div>
          <h1>多实例 TiddlyWiki 管理</h1>
          <Panel/>
          <Wikis/>
      </div>
  );
};

export default Home;
