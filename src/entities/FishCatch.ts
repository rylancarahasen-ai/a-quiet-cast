// Mock FishCatch entity for the fishing game
export interface FishCatchData {
  id?: string;
  fishType: string;
  size: number;
  weather: string;
  timestamp: number;
  created_by?: string;
}

export class FishCatch {
  static async filter(filters: { created_by?: string }, orderBy?: string): Promise<FishCatchData[]> {
    // Mock implementation - could be replaced with real database calls
    const savedCatches = localStorage.getItem('fishingGameCatches');
    const catches = savedCatches ? JSON.parse(savedCatches) : [];
    
    // Filter by created_by if provided
    let filteredCatches = catches;
    if (filters.created_by) {
      filteredCatches = catches.filter((fishCatch: FishCatchData) => fishCatch.created_by === filters.created_by);
    }
    
    // Sort by timestamp descending if orderBy is '-timestamp'
    if (orderBy === '-timestamp') {
      filteredCatches.sort((a: FishCatchData, b: FishCatchData) => b.timestamp - a.timestamp);
    }
    
    return filteredCatches;
  }

  static async create(data: FishCatchData): Promise<FishCatchData> {
    const newCatch = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      created_by: 'guest@fishingGame.com'
    };
    
    // Get existing catches
    const savedCatches = localStorage.getItem('fishingGameCatches');
    const catches = savedCatches ? JSON.parse(savedCatches) : [];
    
    // Add new catch
    catches.push(newCatch);
    
    // Save back to localStorage
    localStorage.setItem('fishingGameCatches', JSON.stringify(catches));
    
    return newCatch;
  }
}