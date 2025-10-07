export interface Achievement {
  id?: string;
  achievementId: string;
  title: string;
  description: string;
  unlockedQuote: string;
  unlocked: boolean;
  unlockedAt?: number;
  created_by?: string;
}

export class Achievement {
  static async create(data: Partial<Achievement>): Promise<Achievement> {
    const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    const user = JSON.parse(localStorage.getItem('currentUser') || '{"email":"local-user"}');
    const newAchievement: Achievement = {
      achievementId: data.achievementId || '',
      title: data.title || '',
      description: data.description || '',
      unlockedQuote: data.unlockedQuote || '',
      unlocked: data.unlocked || false,
      unlockedAt: data.unlockedAt,
      id: Date.now().toString(),
      created_by: user.email,
    };
    achievements.push(newAchievement);
    localStorage.setItem('achievements', JSON.stringify(achievements));
    return newAchievement;
  }

  static async list(): Promise<Achievement[]> {
    const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    return achievements;
  }

  static async filter(criteria: { created_by?: string; achievementId?: string }): Promise<Achievement[]> {
    const achievements = await this.list();
    return achievements.filter((a: Achievement) => {
      if (criteria.created_by && a.created_by !== criteria.created_by) return false;
      if (criteria.achievementId && a.achievementId !== criteria.achievementId) return false;
      return true;
    });
  }

  static async update(id: string, updates: Partial<Achievement>): Promise<Achievement> {
    const achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    const index = achievements.findIndex((a: Achievement) => a.id === id);
    if (index !== -1) {
      achievements[index] = { ...achievements[index], ...updates };
      localStorage.setItem('achievements', JSON.stringify(achievements));
      return achievements[index];
    }
    throw new Error('Achievement not found');
  }
}
