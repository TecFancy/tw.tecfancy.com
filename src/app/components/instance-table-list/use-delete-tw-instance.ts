import { useState } from 'react';
import { useEnv, useInstancesDispatch } from "@/app/hooks";

const useDeleteTwInstance = () => {
    const envContext = useEnv();
    const { protocol, domain, port } = envContext;
    const dispatch = useInstancesDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const deleteInstance = async ({ instanceId }: { instanceId: string }) => {
        try {
            setIsLoading(true);
            const res = await fetch(`${protocol}://${domain}:${port}/api`, {
                method: 'DELETE',
                body: JSON.stringify({ id: instanceId, envContext }),
            });
            if (res.ok) {
                dispatch({ type: 'instances/delete', id: instanceId });
            } else {
                console.error('deleteInstance error', res.statusText);
            }
        } catch (error) {
            console.error('deleteInstance error', error);
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, deleteInstance };
};

export default useDeleteTwInstance;
