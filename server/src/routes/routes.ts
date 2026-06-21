import { Router, Request, Response } from 'express';
import { chatController } from '../controllers/chatController';
import { appointmentController } from '../controllers/appointmentController';
import { validateAppointment } from '../middleware/validation.middleware';
import { clinicService } from '../services/clinicService';

const router = Router();

// Chat session endpoints
router.post('/chat', chatController.sendMessage);
router.get('/chat/history/:sessionId', chatController.getSessionHistory);
router.delete('/chat/session/:sessionId', chatController.clearSession);

// Appointment endpoints
router.post('/appointments', validateAppointment, appointmentController.createAppointment);
router.get('/appointments', appointmentController.getAppointments);
router.patch('/appointments/:id/status', appointmentController.updateStatus);

// Catalog / Directory endpoints
router.get('/services', (req: Request, res: Response) => {
  try {
    const config = clinicService.getConfig();
    return res.status(200).json({
      clinic: config.clinic,
      departments: config.departments,
      treatments: config.treatments
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch services config.' });
  }
});

router.get('/faqs', (req: Request, res: Response) => {
  try {
    const faqs = clinicService.getFAQs();
    return res.status(200).json(faqs);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch FAQs.' });
  }
});

// Admin configuration endpoints (to modify services.json on the fly)
router.post('/admin/treatments', (req: Request, res: Response) => {
  try {
    const { name, departmentId, description, duration, recoveryTime, cost, safetyInfo, keywords } = req.body;
    
    if (!name || !departmentId || !description || !cost) {
      return res.status(400).json({ error: 'Name, departmentId, description, and cost are required.' });
    }

    const added = clinicService.addTreatment({
      name,
      departmentId,
      description,
      duration: duration || '30 mins',
      recoveryTime: recoveryTime || 'Immediate',
      cost: Number(cost),
      safetyInfo: safetyInfo || 'Safe for most skin/body types.',
      keywords: keywords || [name.toLowerCase()]
    });

    if (!added) {
      return res.status(409).json({ error: 'Treatment already exists or failed to save.' });
    }

    return res.status(201).json({ message: 'Treatment added successfully!', treatment: added });
  } catch (error) {
    console.error('Error adding treatment:', error);
    return res.status(500).json({ error: 'Internal server error adding treatment.' });
  }
});

router.post('/admin/faqs', (req: Request, res: Response) => {
  try {
    const { category, question, answer } = req.body;

    if (!category || !question || !answer) {
      return res.status(400).json({ error: 'Category, question, and answer are required.' });
    }

    const added = clinicService.addFAQ({ category, question, answer });
    if (!added) {
      return res.status(409).json({ error: 'FAQ already exists or failed to save.' });
    }

    return res.status(201).json({ message: 'FAQ added successfully!', faq: added });
  } catch (error) {
    console.error('Error adding FAQ:', error);
    return res.status(500).json({ error: 'Internal server error adding FAQ.' });
  }
});

export default router;
