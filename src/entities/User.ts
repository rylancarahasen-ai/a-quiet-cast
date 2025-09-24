// Mock User entity for the fishing game
export interface UserData {
  email: string;
  name?: string;
}

export class User {
  static async me(): Promise<UserData> {
    // Mock implementation - returns a guest user
    return {
      email: 'guest@fishingGame.com',
      name: 'Guest Player'
    };
  }
}