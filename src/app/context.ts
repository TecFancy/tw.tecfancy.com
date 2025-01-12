import { createContext, Dispatch } from 'react';
import { InstancesActionType } from './reducer';

export const InstancesContext = createContext<Instances>([]);
export const InstancesDispatchContext = createContext<Dispatch<InstancesActionType> | null>(null);
