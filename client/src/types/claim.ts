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
  
  // Step 4: Confirmation
  confirmed: boolean;
}

export interface DamagePhoto {
  id: string;
  location: string; // front, back, left-side, right-side, interior, etc.
  file: File;
  preview: string;
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
