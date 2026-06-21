export interface ClinicInfo {
  name: string;
  phone: string;
  email: string;
  address: string;
  hours: string;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  specialist: string;
}

export interface Treatment {
  id: string;
  departmentId: string;
  name: string;
  description: string;
  duration: string;
  recoveryTime: string;
  cost: number;
  safetyInfo: string;
  keywords: string[];
}

export interface FAQ {
  category: string;
  question: string;
  answer: string;
}

export interface ClinicConfig {
  clinic: ClinicInfo;
  departments: Department[];
  treatments: Treatment[];
  faqs: FAQ[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export interface ChatSession {
  sessionId: string;
  messages: ChatMessage[];
  bookingState?: {
    step: 'none' | 'name' | 'phone' | 'concern' | 'date' | 'time' | 'confirming';
    data: Partial<Appointment>;
  };
  recommendations?: {
    department?: Department;
    treatments?: Treatment[];
  };
}

export interface Appointment {
  id: string;
  name: string;
  phone: string;
  concern: string;
  preferredDate: string;
  preferredTime: string;
  departmentId?: string;
  treatmentId?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}
