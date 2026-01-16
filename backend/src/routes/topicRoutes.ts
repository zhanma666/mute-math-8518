import { Router } from 'express';
import { pool } from '../utils/db';
import { TopicDAO } from '../models/Topic';

const router = Router();
const topicDAO = new TopicDAO(pool);

// Get all topics
router.get('/', async (req, res) => {
  try {
    const topics = await topicDAO.getAll();
    res.json({
      success: true,
      data: topics
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get topics by professional ID
router.get('/professional/:professionalId', async (req, res) => {
  try {
    const { professionalId } = req.params;
    const topics = await topicDAO.getByProfessional(professionalId);
    
    res.json({
      success: true,
      data: topics,
      count: topics.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch topics by professional',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get a random topic by professional ID
router.get('/random/:professionalId', async (req, res) => {
  try {
    const { professionalId } = req.params;
    const topic = await topicDAO.getRandomByProfessional(professionalId);
    
    if (topic) {
      res.json({
        success: true,
        data: topic
      });
    } else {
      res.status(404).json({
        success: false,
        message: `No topics found for professional ${professionalId}`
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch random topic',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Create a new topic
router.post('/', async (req, res) => {
  try {
    const topic = req.body;
    
    if (!topic.content || !topic.professional) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: content, professional'
      });
    }
    
    const newTopic = await topicDAO.create(topic);
    res.status(201).json({
      success: true,
      data: newTopic,
      message: 'Topic created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create topic',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Update a topic
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const updatedTopic = await topicDAO.update(parseInt(id, 10), updates);
    
    if (updatedTopic) {
      res.json({
        success: true,
        data: updatedTopic,
        message: 'Topic updated successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Topic with ID ${id} not found`
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update topic',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete a topic
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await topicDAO.delete(parseInt(id, 10));
    
    if (deleted) {
      res.json({
        success: true,
        message: 'Topic deleted successfully'
      });
    } else {
      res.status(404).json({
        success: false,
        message: `Topic with ID ${id} not found`
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete topic',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Count topics by professional
router.get('/count/:professionalId', async (req, res) => {
  try {
    const { professionalId } = req.params;
    const count = await topicDAO.countByProfessional(professionalId);
    
    res.json({
      success: true,
      data: {
        professionalId,
        count
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to count topics',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;