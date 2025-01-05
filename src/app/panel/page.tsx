'use client';

import React, { useState } from 'react';

const Panel = () => {
  const [twName, setTwName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTwName(e?.target?.value || '');
  };

  const handleCreate = async () => {
    setCreating(true);
    const res = await fetch('./panel/api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ twName }),
    });

    if (res.ok) {
      const result = await res.json();
      console.log('handleCreate: result', result);
      alert('实例创建成功');
    } else {
      const error = await res.json();
      alert(`创建失败: ${error.error}`);
    }
    setCreating(false);
  };

  return (
    <div>
      <input value={twName} onChange={handleChange} />
      <button onClick={handleCreate} disabled={creating}>
        {creating ? '创建中...' : '创建新实例'}
      </button>
    </div>
  );
};

export default Panel;
