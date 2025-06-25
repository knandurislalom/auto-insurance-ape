export interface Party {
  id: string;
  name: string;
  licenseNumber?: string;
  contactInfo?: string;
}

export interface ClaimData {
  // Step 1: Parties Involved
  parties: Party[];
  
  // Step 2: Claim Information
  policyNumber: string;
  incidentAddress: string;
  incidentDate: string;
  description: string;
  
  // Step 3: Damage Photos
  damagePhotos: DamagePhoto[];

  // Step 4: Police Report
  policeReport: PoliceReport;
  
  // Step 5: Confirmation
  confirmed: boolean;
}

export interface DamagePhoto {
  id: string;
  location: string; // front, back, left-side, right-side, interior, etc.
  file: File;
  preview: string;
}

export interface PoliceReport {
  id: string;
  reportNumber?: string;
  officerName?: string;
  department?: string;
  file?: File;
  hasReport: boolean; // Whether a police report was filed
  preview?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  imageUrl?: string;
}

export interface ClaimStep {
  step: number;
  title: string;
  completed: boolean;
}

export interface ExistingClaim {
  claim_id: string;
  claim_type: string;
  claimant_name: string;
  date_of_incident: string;
  location: string;
  description: string;
  documents_uploaded: string[];
  estimated_damage: number;
  injuries_reported: boolean;
}

export interface ClaimStatus {
  status: 'submitted' | 'under_review' | 'assessment' | 'approved' | 'denied' | 'closed';
  last_updated: string;
  next_action?: string;
}

// Collision Estimation Types
export interface EstimationOption {
  type: 'adjuster' | 'repair_shop' | 'digital';
  title: string;
  description: string;
  timeline: string;
  benefits: string[];
}

export interface AdjusterVisit {
  location: 'home' | 'incident' | 'custom';
  customAddress?: string;
  preferredDate: string;
  preferredTime: string;
  contactPhone: string;
  contactEmail: string;
}

export interface RepairShop {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  distance: number;
  availability: string;
  certifications: string[];
  directPay: boolean;
  address: string;
  phone: string;
}

export interface DigitalAssessment {
  requiredPhotos: string[];
  completedPhotos: string[];
  additionalPhotos: DamagePhoto[];
}

export interface DamageEstimate {
  id: string;
  type: 'adjuster' | 'repair_shop' | 'digital';
  status: 'pending' | 'submitted' | 'under_review' | 'approved';
  amount?: number;
  breakdown?: {
    parts: number;
    labor: number;
    paint: number;
    other?: number;
  };
  estimatorInfo?: {
    name: string;
    company: string;
    contact: string;
  };
  dateSubmitted?: string;
  notes?: string;
}

export interface CollisionClaimData extends ClaimData {
  isCollision?: boolean;
  estimationMethod?: 'adjuster' | 'repair_shop' | 'digital';
  adjusterVisit?: AdjusterVisit;
  selectedRepairShop?: RepairShop;
  digitalAssessment?: DigitalAssessment;
  damageEstimates: DamageEstimate[];
}
