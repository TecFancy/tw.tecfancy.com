import { useState } from 'react';
import { useInstancesDispatch } from "@/app/hooks";

const useDeleteTwInstance = () => {
    const dispatch = useInstancesDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const deleteInstance = async ({ instanceId }: { instanceId: string }) => {
        try {
            setIsLoading(true);
            const res = await fetch('http://localhost:8080/api', {
                method: 'DELETE',
                body: JSON.stringify({ id: instanceId }),
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
