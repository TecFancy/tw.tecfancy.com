import {createContext, Dispatch} from 'react';
import { InstancesActionType } from './reducer'; // 确保路径正确

export const InstancesContext = createContext<Instances>([]);
export const InstancesDispatchContext = createContext<Dispatch<InstancesActionType> | null>(null);
