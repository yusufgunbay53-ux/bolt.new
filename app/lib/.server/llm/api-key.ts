import { env } from 'node:process';

export function getAPIKey(envOverrides: any) {
  return env.ANTHROPIC_API_KEY || envOverrides?.ANTHROPIC_API_KEY;
}
