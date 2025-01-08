'use client';

import LeftToolBarPage from "@/app/components/letf-tool-bar";
import "./styles.css";

import type { FC, ReactNode } from "react";

interface Props {
    children: ReactNode;
    id?: string;
}
const GlobalClientLayout: FC<Props> = ({ children, id }) => {
    return (
        <main className="global-client-layout">
            <LeftToolBarPage id={id} />
            <div className="content">
                {children}
            </div>
        </main>
);
};

export default GlobalClientLayout;