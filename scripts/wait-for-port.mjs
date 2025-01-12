import isPortOpen from "./is-port-open.mjs";

// Helper function: wait for a port to open
const waitForPort = async (port, host, retries = 10, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
        const open = await isPortOpen(port, host);
        if (open) {
            return true;
        }
        await new Promise(res => setTimeout(res, delay));
    }
    return false;
};

export default waitForPort;
