import { useContext } from 'react';
import { InstancesContext, InstancesDispatchContext } from './context';
import { InstancesActionType } from './reducer';
import type { Dispatch } from 'react';

export const useInstances = () => {
    const context = useContext(InstancesContext);
    if (context === undefined) {
        throw new Error('useInstances must be used within a GlobalLayout');
    }
    return context;
};

export const useInstancesDispatch = (): Dispatch<InstancesActionType> => {
    const context = useContext(InstancesDispatchContext);
    if (context === null) {
        throw new Error('useInstancesDispatch must be used within a GlobalLayout');
    }
    return context;
};
