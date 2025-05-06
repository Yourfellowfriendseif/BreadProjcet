const requiredVars = ["VITE_API_BASE_URL", "VITE_GOOGLE_MAPS_API_KEY"];

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

  get googleMapsApiKey() {
    return import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  }

  get isDevelopment() {
    return import.meta.env.MODE === "development";
  }

  get isProduction() {
    return import.meta.env.MODE === "production";
  }
}

export const config = new Config();
