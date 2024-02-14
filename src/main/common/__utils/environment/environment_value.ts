export const getEnvironmentValue = (key: string, defaultValue = ""): string => {
    return process.env[key] ?? defaultValue;
};
