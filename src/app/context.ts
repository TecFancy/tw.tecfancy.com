import { createContext, Dispatch } from 'react';
import { initialEnv, InstancesActionType } from './reducer';

export const EnvContext = createContext(initialEnv);
export const InstancesContext = createContext<Instances>([]);
export const InstancesDispatchContext = createContext<Dispatch<InstancesActionType> | null>(null);
