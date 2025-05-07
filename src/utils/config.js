const requiredVars = ["VITE_API_BASE_URL"];

class Config {
  constructor() {
    this.validateEnv();
  }

  validateEnv() {
    const missingVars = requiredVars.filter(
      (varName) => !import.meta.env[varName]
    );

    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}`
      );
    }
  }

  get apiUrl() {
    return import.meta.env.VITE_API_BASE_URL;
  }

  get isDevelopment() {
    return import.meta.env.MODE === "development";
  }

  get isProduction() {
    return import.meta.env.MODE === "production";
  }
}

export const config = new Config();
