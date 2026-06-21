import fs from 'fs';
import path from 'path';
import { Appointment } from '../types/clinic.types';

const appointmentsJsonPath = path.resolve(__dirname, '../data/appointments.json');

export class AppointmentService {
  private appointments: Appointment[] = [];

  constructor() {
    this.loadAppointments();
  }

  /**
   * Load appointments from JSON file if it exists, otherwise initialize empty list
   */
  private loadAppointments() {
    try {
      if (fs.existsSync(appointmentsJsonPath)) {
        const rawData = fs.readFileSync(appointmentsJsonPath, 'utf-8');
        this.appointments = JSON.parse(rawData) as Appointment[];
      } else {
        this.saveToFile();
      }
    } catch (error) {
      console.error('Error loading appointments:', error);
      this.appointments = [];
    }
  }

  /**
   * Save appointments to JSON file
   */
  private saveToFile(): boolean {
    try {
      // Ensure directory exists
      const dir = path.dirname(appointmentsJsonPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(appointmentsJsonPath, JSON.stringify(this.appointments, null, 2), 'utf-8');
      return true;
    } catch (error) {
      console.error('Error saving appointments:', error);
      return false;
    }
  }

  /**
   * Get all appointments
   */
  public getAll(): Appointment[] {
    this.loadAppointments();
    return this.appointments;
  }

  /**
   * Create a new appointment
   */
  public create(data: Omit<Appointment, 'id' | 'status' | 'createdAt'>): Appointment {
    const newAppointment: Appointment = {
      id: 'apt-' + Math.random().toString(36).substring(2, 9),
      name: data.name,
      phone: data.phone,
      concern: data.concern,
      preferredDate: data.preferredDate,
      preferredTime: data.preferredTime,
      departmentId: data.departmentId,
      treatmentId: data.treatmentId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    this.appointments.push(newAppointment);
    this.saveToFile();
    return newAppointment;
  }

  /**
   * Get appointment by ID
   */
  public getById(id: string): Appointment | undefined {
    this.loadAppointments();
    return this.appointments.find(a => a.id === id);
  }

  /**
   * Update appointment status
   */
  public updateStatus(id: string, status: 'pending' | 'confirmed' | 'cancelled'): Appointment | null {
    const aptIndex = this.appointments.findIndex(a => a.id === id);
    if (aptIndex === -1) return null;

    this.appointments[aptIndex].status = status;
    this.saveToFile();
    return this.appointments[aptIndex];
  }
}

export const appointmentService = new AppointmentService();
