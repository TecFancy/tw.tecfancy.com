type Instance = {
    id: string;
    pid: string;
    port: number;
    dataDir: string;
    title: string;
    deleted?: boolean;
};

type Instances = Instance[];
