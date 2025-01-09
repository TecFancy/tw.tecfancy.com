export type InstancesActionType =
    | { type: 'instances/initial'; instances: Instances }
    | { type: 'instances/add'; instance: Instance }
    | { type: 'instances/remove'; id: string }

export const initialInstances: Instances = [];
export function instancesReducer(instances: Instances, action: InstancesActionType) {
    switch (action.type) {
        case "instances/initial": {
            return action.instances;
        }
        case "instances/add": {
            return [...instances, action.instance];
        }
        case "instances/remove": {
            return instances.filter((instance: Instance) => instance.id !== action.id);
        }
        default: {
            throw new Error(`Unknown action: ${action}`);
        }
    }
}
