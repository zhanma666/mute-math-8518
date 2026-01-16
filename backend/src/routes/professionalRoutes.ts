import { Router } from 'express';
import { pool } from '../utils/db';
import { ProfessionalDAO } from '../models/Professional';

const router = Router();
const professionalDAO = new ProfessionalDAO(pool);

// Get all professionals
router.get('/', async (req, res) => {
  try {
    const professionals = await professionalDAO.getAll();
    res.json({
      success: true,
      data: professionals
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch professionals',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get a professional by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const professional = await professionalDAO.getById(id);
    
    if (professional) {
      res.json({
        success: true,
        data: professional
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Professional with ID ${id} not found`
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch professional',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create a new professional
router.post('/', async (req, res) => {
  try {
    const professional = req.body;
    
    if (!professional.id || !professional.name || !professional.description) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: id, name, description'
      });
    }
    
    const newProfessional = await professionalDAO.create(professional);
    res.status(201).json({
      success: true,
      data: newProfessional,
      message: 'Professional created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create professional',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update a professional
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedProfessional = await professionalDAO.update(id, updates);
    
    if (updatedProfessional) {
      res.json({
        success: true,
        data: updatedProfessional,
        message: 'Professional updated successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Professional with ID ${id} not found`
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update professional',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete a professional
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await professionalDAO.delete(id);
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Professional deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Professional with ID ${id} not found`
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete professional',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;