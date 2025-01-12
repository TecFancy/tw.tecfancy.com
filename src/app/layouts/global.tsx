'use client';

import { FC, ReactNode, useReducer } from "react";
import LeftToolBarPage from "@/app/components/letf-tool-bar";
import { EnvContext, InstancesContext, InstancesDispatchContext } from "@/app/context";
import { initialEnv, initialInstances, instancesReducer } from "@/app/reducer";
import "./styles.css";

interface Props {
    children: ReactNode;
}

const GlobalLayout: FC<Props> = ({ children }) => {
    const [instances, dispatch] = useReducer(instancesReducer, initialInstances);

    return (
        <EnvContext.Provider value={initialEnv}>
            <InstancesContext.Provider value={instances}>
                <InstancesDispatchContext.Provider value={dispatch}>
                    <main className="global-client-layout">
                        <LeftToolBarPage />
                        <div className="content">
                            {children}
                        </div>
                    </main>
                </InstancesDispatchContext.Provider>
            </InstancesContext.Provider>
        </EnvContext.Provider>
);
};

export default GlobalLayout;