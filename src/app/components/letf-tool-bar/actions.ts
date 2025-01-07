'use server';

import { getInstances } from "@/lib";

export const fetchInstances = async () => {
    return getInstances();
};