const getEnvVar = (name: string) => process.env[`${name.toUpperCase()}`];

export default getEnvVar;
