'use client';

import { Table } from 'antd';
import { useInstances } from "@/app/hooks";

const Index = () => {
    const instances = useInstances();

    const columns = [
        {
            title: 'Instance',
            dataIndex: 'twName',
            key: 'twName',
        },
        {
            title: 'Instance ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Instance PID',
            dataIndex: 'pid',
            key: 'pid',
        },
        {
            title: 'Instance Port',
            dataIndex: 'port',
            key: 'port',
        },
    ];

    return (
        <Table<Instance>
            columns={columns}
            dataSource={instances}
            size="middle"
            bordered
            scroll={{ x: '100%' }}
            pagination={{
                defaultPageSize: 10,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
                showQuickJumper: true,
                showTotal: (total) => `Total ${total} items`,
            }}
        />
    );
};

export default Index;
