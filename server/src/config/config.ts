import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { ClinicConfig } from '../types/clinic.types';

// Load environment variables
dotenv.config();

export const PORT = process.env.PORT || 5000;
export const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

const distServicesJsonPath = path.resolve(__dirname, '../data/services.json');
const srcServicesJsonPath = path.resolve(__dirname, '../../src/data/services.json');

// Ensure that distServicesJsonPath's parent directory exists
function ensureDirectoryExistence(filePath: string) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExistence(dirname);
  fs.mkdirSync(dirname);
}

/**
 * Loads clinic configuration from services.json file.
 * Reading dynamically allows runtime updates (admin operations) without rebuilding.
 */
export function loadClinicConfig(): ClinicConfig {
  let servicesJsonPath = distServicesJsonPath;
  
  if (!fs.existsSync(distServicesJsonPath)) {
    if (fs.existsSync(srcServicesJsonPath)) {
      console.log('Copying services.json from src to dist...');
      try {
        ensureDirectoryExistence(distServicesJsonPath);
        fs.copyFileSync(srcServicesJsonPath, distServicesJsonPath);
      } catch (err) {
        console.error('Failed to copy services.json, reading from src directly:', err);
        servicesJsonPath = srcServicesJsonPath;
      }
    }
  }

  try {
    const rawData = fs.readFileSync(servicesJsonPath, 'utf-8');
    return JSON.parse(rawData) as ClinicConfig;
  } catch (error) {
    console.error('Error reading clinic configuration:', error);
    // Return a basic fallback if file is missing
    return {
      clinic: {
        name: "Clinic AI Assistant",
        phone: "",
        email: "",
        address: "",
        hours: ""
      },
      departments: [],
      treatments: [],
      faqs: []
    };
  }
}

/**
 * Saves the clinic configuration back to services.json.
 * Useful for admin configurations.
 */
export function saveClinicConfig(config: ClinicConfig): boolean {
  let success = true;
  try {
    ensureDirectoryExistence(distServicesJsonPath);
    fs.writeFileSync(distServicesJsonPath, JSON.stringify(config, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving clinic configuration to dist:', error);
    success = false;
  }

  try {
    if (fs.existsSync(srcServicesJsonPath)) {
      fs.writeFileSync(srcServicesJsonPath, JSON.stringify(config, null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Error saving clinic configuration to src:', error);
  }

  return success;
}
