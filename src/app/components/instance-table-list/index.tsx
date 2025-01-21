'use client';

import { Table } from 'antd';
import { useInstances } from "@/app/hooks";
import useDeleteTwInstance from "./use-delete-tw-instance";

const Index = () => {
    const instances = useInstances();
    const { isLoading, deleteInstance } = useDeleteTwInstance();

    const columns = [
        {
            title: 'Instance',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Instance ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Instance Port',
            dataIndex: 'port',
            key: 'port',
        },
        {
            title: 'Actions',
            dataIndex: 'actions',
            key: 'actions',
            render: (_: unknown, item: Instance) => (
                <button disabled={isLoading} onClick={() => deleteInstance({ instanceId: item.id })}>Delete</button>
            ),
        }
    ];

    return (
        <Table<Instance>
            columns={columns}
            dataSource={instances.map(instance => ({
                ...instance,
                key: instance.id,
            }))}
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
