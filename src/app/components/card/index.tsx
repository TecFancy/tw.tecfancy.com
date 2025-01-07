import "./styles.css";

import type { ReactNode } from "react";

interface Props {
    children: ReactNode;
}

const Card = (props: Props) => {
    return (
        <div className="card shadow-md">{props.children}</div>
    );
};

export default Card;
