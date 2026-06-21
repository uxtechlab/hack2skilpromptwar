import { Request, Response } from 'express';
import { appointmentService } from '../services/appointmentService';
import { validationResult } from 'express-validator';

export const appointmentController = {
  /**
   * Create appointment via standard API submission (direct form booking)
   */
  createAppointment(req: Request, res: Response) {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, phone, concern, preferredDate, preferredTime, departmentId, treatmentId } = req.body;
      
      const newApt = appointmentService.create({
        name,
        phone,
        concern,
        preferredDate,
        preferredTime,
        departmentId,
        treatmentId
      });

      return res.status(201).json({
        message: 'Appointment successfully scheduled!',
        appointment: newApt
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      return res.status(500).json({ error: 'Internal server error while saving appointment.' });
    }
  },

  /**
   * List all appointments (for Admin views)
   */
  getAppointments(req: Request, res: Response) {
    try {
      const appointments = appointmentService.getAll();
      return res.status(200).json(appointments);
    } catch (error) {
      console.error('Error listing appointments:', error);
      return res.status(500).json({ error: 'Internal server error fetching appointments.' });
    }
  },

  /**
   * Update appointment status (Admin action)
   */
  updateStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status || !['pending', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ error: 'Valid status (pending, confirmed, cancelled) is required.' });
      }

      const updated = appointmentService.updateStatus(id, status);
      if (!updated) {
        return res.status(404).json({ error: 'Appointment not found.' });
      }

      return res.status(200).json({
        message: 'Appointment status updated.',
        appointment: updated
      });
    } catch (error) {
      console.error('Error updating appointment:', error);
      return res.status(500).json({ error: 'Internal server error updating status.' });
    }
  }
};
