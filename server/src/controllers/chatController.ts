import { Request, Response } from 'express';
import { ChatSession } from '../types/clinic.types';
import { decisionEngine } from '../services/decisionEngine';
import { appointmentService } from '../services/appointmentService';

// In-memory chat sessions storage
const sessions = new Map<string, ChatSession>();

export const chatController = {
  /**
   * Handle incoming chat message
   */
  async sendMessage(req: Request, res: Response) {
    try {
      const { sessionId, message } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message is required and must be a string.' });
      }

      const activeSessionId = sessionId || 'session-' + Math.random().toString(36).substring(2, 9);
      
      // Get or create session
      let session = sessions.get(activeSessionId);
      if (!session) {
        session = {
          sessionId: activeSessionId,
          messages: [],
          bookingState: {
            step: 'none',
            data: {}
          }
        };
        sessions.set(activeSessionId, session);
      }

      // Process message with Decision Engine
      const result = await decisionEngine.processMessage(session, message);

      // Save updated session
      sessions.set(activeSessionId, result.session);

      // If booking was completed during the flow, create actual record
      let savedAppointment = null;
      if (result.appointmentReady) {
        const aptData = result.appointmentReady;
        savedAppointment = appointmentService.create({
          name: aptData.name || 'Anonymous',
          phone: aptData.phone || 'N/A',
          concern: aptData.concern || 'General consultation',
          preferredDate: aptData.preferredDate || new Date().toISOString().split('T')[0],
          preferredTime: aptData.preferredTime || '10:00 AM',
          departmentId: result.recommendations?.department?.id,
          treatmentId: result.recommendations?.treatments?.[0]?.id
        });
      }

      return res.status(200).json({
        sessionId: activeSessionId,
        reply: result.reply,
        messages: result.session.messages,
        bookingState: result.session.bookingState,
        recommendations: result.recommendations,
        suggestedFaq: result.suggestedFaq,
        appointmentConfirmed: !!savedAppointment,
        appointment: savedAppointment
      });
    } catch (error) {
      console.error('Error in chat controller:', error);
      return res.status(500).json({ error: 'Internal server error processing chat message.' });
    }
  },

  /**
   * Get chat history for a session
   */
  getSessionHistory(req: Request, res: Response) {
    const { sessionId } = req.params;
    const session = sessions.get(sessionId);
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found.' });
    }
    
    return res.status(200).json(session);
  },

  /**
   * Clear session state
   */
  clearSession(req: Request, res: Response) {
    const { sessionId } = req.params;
    if (sessions.has(sessionId)) {
      sessions.delete(sessionId);
    }
    return res.status(200).json({ message: 'Session cleared.' });
  }
};
