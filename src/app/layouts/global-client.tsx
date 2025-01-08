'use client';

import LeftToolBarPage from "@/app/components/letf-tool-bar";
import "./styles.css";

import type { FC, ReactNode } from "react";

interface Props {
    children: ReactNode;
}
const GlobalClientLayout: FC<Props> = ({ children }) => {
    return (
        <main className="global-client-layout">
            <LeftToolBarPage/>
            <div className="content">
                {children}
            </div>
        </main>
);
};

export default GlobalClientLayout;