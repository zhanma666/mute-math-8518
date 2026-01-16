export interface Topic {
  id: number;
  content: string;
  professional: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Topic data access object
export class TopicDAO {
  private db: any;

  constructor(db: any) {
    this.db = db;
  }

  // Get all topics
  async getAll(): Promise<Topic[]> {
    const [rows] = await this.db.execute('SELECT * FROM topics ORDER BY professional, id');
    return rows as Topic[];
  }

  // Get topics by professional ID
  async getByProfessional(professionalId: string): Promise<Topic[]> {
    const [rows] = await this.db.execute(
      'SELECT * FROM topics WHERE professional = ? ORDER BY RAND()',
      [professionalId]
    );
    return rows as Topic[];
  }

  // Get a random topic by professional ID
  async getRandomByProfessional(professionalId: string): Promise<Topic | null> {
    const [rows] = await this.db.execute(
      'SELECT * FROM topics WHERE professional = ? ORDER BY RAND() LIMIT 1',
      [professionalId]
    );
    const topics = rows as Topic[];
    return topics.length > 0 ? topics[0] : null;
  }

  // Create a new topic
  async create(topic: Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>): Promise<Topic> {
    const [result] = await this.db.execute(
      'INSERT INTO topics (content, professional) VALUES (?, ?)',
      [topic.content, topic.professional]
    );
    const [newRows] = await this.db.execute(
      'SELECT * FROM topics WHERE id = ?',
      [(result as any).insertId]
    );
    return (newRows as Topic[])[0];
  }

  // Update a topic
  async update(id: number, topic: Partial<Omit<Topic, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Topic | null> {
    const fields = Object.keys(topic);
    const values = Object.values(topic);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    if (fields.length === 0) {
      const [rows] = await this.db.execute('SELECT * FROM topics WHERE id = ?', [id]);
      const topics = rows as Topic[];
      return topics.length > 0 ? topics[0] : null;
    }

    await this.db.execute(
      `UPDATE topics SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    
    const [rows] = await this.db.execute('SELECT * FROM topics WHERE id = ?', [id]);
    const topics = rows as Topic[];
    return topics.length > 0 ? topics[0] : null;
  }

  // Delete a topic
  async delete(id: number): Promise<boolean> {
    const [result] = await this.db.execute('DELETE FROM topics WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  }

  // Count topics by professional
  async countByProfessional(professionalId: string): Promise<number> {
    const [rows] = await this.db.execute(
      'SELECT COUNT(*) as count FROM topics WHERE professional = ?',
      [professionalId]
    );
    return (rows as any)[0].count;
  }
}