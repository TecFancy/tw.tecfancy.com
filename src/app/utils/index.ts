export const updateInstancesToLocalStorage = (instances: Instance[]) => {
    localStorage.setItem('instances', JSON.stringify(instances));
};
