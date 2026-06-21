import { loadClinicConfig, saveClinicConfig } from '../config/config';
import { ClinicConfig, Department, Treatment, FAQ, ClinicInfo } from '../types/clinic.types';

export class ClinicService {
  /**
   * Get the current complete configuration
   */
  public getConfig(): ClinicConfig {
    return loadClinicConfig();
  }

  /**
   * Get clinic metadata
   */
  public getClinicInfo(): ClinicInfo {
    return this.getConfig().clinic;
  }

  /**
   * List all departments
   */
  public getDepartments(): Department[] {
    return this.getConfig().departments;
  }

  /**
   * Get department by ID
   */
  public getDepartmentById(id: string): Department | undefined {
    return this.getDepartments().find(d => d.id.toLowerCase() === id.toLowerCase());
  }

  /**
   * Get all treatments, optionally filtered by department
   */
  public getTreatments(departmentId?: string): Treatment[] {
    const config = this.getConfig();
    if (departmentId) {
      return config.treatments.filter(
        t => t.departmentId.toLowerCase() === departmentId.toLowerCase()
      );
    }
    return config.treatments;
  }

  /**
   * Find specific treatment by ID
   */
  public getTreatmentById(id: string): Treatment | undefined {
    return this.getTreatments().find(t => t.id.toLowerCase() === id.toLowerCase());
  }

  /**
   * Get FAQ list
   */
  public getFAQs(): FAQ[] {
    return this.getConfig().faqs;
  }

  /**
   * Add a new treatment (admin action)
   */
  public addTreatment(treatment: Omit<Treatment, 'id'> & { id?: string }): Treatment | null {
    const config = this.getConfig();
    
    // Generate id if not provided
    const newId = treatment.id || treatment.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Check if duplicate
    if (config.treatments.some(t => t.id === newId)) {
      return null;
    }

    const newTreatment: Treatment = {
      ...treatment,
      id: newId,
      keywords: treatment.keywords || [treatment.name.toLowerCase()]
    };

    config.treatments.push(newTreatment);
    
    const success = saveClinicConfig(config);
    return success ? newTreatment : null;
  }

  /**
   * Add a new FAQ (admin action)
   */
  public addFAQ(faq: FAQ): FAQ | null {
    const config = this.getConfig();
    
    // Avoid exact duplicate question
    if (config.faqs.some(f => f.question.toLowerCase() === faq.question.toLowerCase())) {
      return null;
    }

    config.faqs.push(faq);
    const success = saveClinicConfig(config);
    return success ? faq : null;
  }
}

export const clinicService = new ClinicService();
