'use client';

import { useParams } from "next/navigation";
import { useInstances } from "@/app/hooks";
import './styles.css';

const WikiIFramePage = () => {
    const { id } = useParams();
    const instancesStore = useInstances();
    const currentInstance = instancesStore.find((instance) => instance.id === id);

    if (!currentInstance) return 'TiddlyWiki Instance not found ;-(';

    return (
        <iframe
            className="wiki-iframe"
            title={currentInstance?.twName}
            src={`http://localhost:${currentInstance?.port}`}
        />
    );
};

export default WikiIFramePage;
