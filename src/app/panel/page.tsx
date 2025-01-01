'use client';

import React, { useState } from 'react';

interface PannelProps {
  [key: string]: unknown;
}

const Panel = (props: PannelProps) => {
  console.log('props', props);

  const [creating, setCreating] = useState(false);

  const handleCreate = async () => {
    setCreating(true);
    const res = await fetch('./panel/api', {
      method: 'POST',
    });

    if (res.ok) {
      const data = await res.json();
      console.log('data', data);
      alert('实例创建成功');
    } else {
      const error = await res.json();
      alert(`创建失败: ${error.error}`);
    }
    setCreating(false);
  };

  return (
    <div>
      <button onClick={handleCreate} disabled={creating}>
        {creating ? '创建中...' : '创建新实例'}
      </button>
    </div>
  );
};

export default Panel;
