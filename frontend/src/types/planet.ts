/**
 * Planet interfaces matching planet.py backend schema.
 */

export interface Planet {
  id: string; // 'earth', 'moon', 'mars'
  name: string;
  description?: string | null;
  radius_km?: number | null;
  created_at: string;
  updated_at: string;
}
