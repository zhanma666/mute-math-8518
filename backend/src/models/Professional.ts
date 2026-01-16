export interface Professional {
  id: string;
  name: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Professional data access object
export class ProfessionalDAO {
  private db: any;

  constructor(db: any) {
    this.db = db;
  }

  // Get all professionals
  async getAll(): Promise<Professional[]> {
    const [rows] = await this.db.execute('SELECT * FROM professionals ORDER BY name');
    return rows as Professional[];
  }

  // Get a professional by ID
  async getById(id: string): Promise<Professional | null> {
    const [rows] = await this.db.execute('SELECT * FROM professionals WHERE id = ?', [id]);
    const professionals = rows as Professional[];
    return professionals.length > 0 ? professionals[0] : null;
  }

  // Create a new professional
  async create(professional: Omit<Professional, 'createdAt' | 'updatedAt'>): Promise<Professional> {
    const [result] = await this.db.execute(
      'INSERT INTO professionals (id, name, description) VALUES (?, ?, ?)',
      [professional.id, professional.name, professional.description]
    );
    return this.getById(professional.id) as Promise<Professional>;
  }

  // Update a professional
  async update(id: string, professional: Partial<Omit<Professional, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Professional | null> {
    const fields = Object.keys(professional);
    const values = Object.values(professional);
    const setClause = fields.map(field => `${field} = ?`).join(', ');
    
    if (fields.length === 0) {
      return this.getById(id);
    }

    await this.db.execute(
      `UPDATE professionals SET ${setClause} WHERE id = ?`,
      [...values, id]
    );
    
    return this.getById(id);
  }

  // Delete a professional
  async delete(id: string): Promise<boolean> {
    const [result] = await this.db.execute('DELETE FROM professionals WHERE id = ?', [id]);
    return (result as any).affectedRows > 0;
  }
}