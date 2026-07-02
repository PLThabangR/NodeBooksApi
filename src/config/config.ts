import fs from 'fs';
import path from 'path';

/**
 * Parses the application.properties file and loads it into a structured config object.
 */
export function loadProperties(): Record<string, string> {
  const filePath = path.join(__dirname, 'application.properties');
  const properties: Record<string, string> = {};

  if (fs.existsSync(filePath)) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split(/\r?\n/);

    for (const line of lines) {
      if (line.trim() === '' || line.trim().startsWith('#')) continue;
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        properties[key.trim()] = valueParts.join('=').trim();
      }
    }
  }
  return properties;
}

const props = loadProperties();

// Export structured configuration
export const config = {
  port: parseInt(props['server.port'] || '5000', 10),
  env: props['server.env'] || 'development',
  database: {
    uri: props['db.uri'] || 'mongodb://localhost:27017/harvestai_db',
  },
  jwt: {
    secret: props['jwt.secret'] || 'default_secret',
    expiresIn: props['jwt.expiresIn'] || '7d',
  }
};