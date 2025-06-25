// API service for handling claims
const API_BASE_URL = 'http://localhost:8002/api';

export interface CreateClaimRequest {
  policy_number: string;
  claimant_name: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_vin?: string;
  driver_present?: boolean;
  driver_name?: string;
  driver_license?: string;
  incident_date?: string;
  incident_time?: string;
  incident_location?: string;
  weather_conditions?: string;
  damage_description?: string;
  estimated_damage: number;
  injuries_reported?: boolean;
  status?: string;
  files?: File[];
}

export interface CreateClaimResponse {
  id: number;
  policy_number: string;
  claimant_name: string;
  vehicle_make?: string;
  vehicle_model?: string;
  vehicle_year?: number;
  vehicle_vin?: string;
  driver_present?: boolean;
  driver_name?: string;
  driver_license?: string;
  incident_date?: string;
  incident_time?: string;
  incident_location?: string;
  weather_conditions?: string;
  damage_description?: string;
  estimated_damage: number;
  injuries_reported?: boolean;
  status: string;
  submission_date: string;
  documents: any[];
  inconsistencies: any[];
}

export class ClaimsAPIService {
  private static async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 
          `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  static async createClaim(claimData: CreateClaimRequest): Promise<CreateClaimResponse> {
    // Create FormData for multipart form submission
    const formData = new FormData();
    
    // Add all claim fields to FormData
    formData.append('policy_number', claimData.policy_number);
    formData.append('claimant_name', claimData.claimant_name);
    formData.append('estimated_damage', claimData.estimated_damage.toString());
    
    // Add optional fields if they exist
    if (claimData.vehicle_make) formData.append('vehicle_make', claimData.vehicle_make);
    if (claimData.vehicle_model) formData.append('vehicle_model', claimData.vehicle_model);
    if (claimData.vehicle_year) formData.append('vehicle_year', claimData.vehicle_year.toString());
    if (claimData.vehicle_vin) formData.append('vehicle_vin', claimData.vehicle_vin);
    if (claimData.driver_present !== undefined) formData.append('driver_present', claimData.driver_present.toString());
    if (claimData.driver_name) formData.append('driver_name', claimData.driver_name);
    if (claimData.driver_license) formData.append('driver_license', claimData.driver_license);
    if (claimData.incident_date) formData.append('incident_date', claimData.incident_date);
    if (claimData.incident_time) formData.append('incident_time', claimData.incident_time);
    if (claimData.incident_location) formData.append('incident_location', claimData.incident_location);
    if (claimData.weather_conditions) formData.append('weather_conditions', claimData.weather_conditions);
    if (claimData.damage_description) formData.append('damage_description', claimData.damage_description);
    if (claimData.injuries_reported !== undefined) formData.append('injuries_reported', claimData.injuries_reported.toString());
    if (claimData.status) formData.append('claim_status', claimData.status);
    
    // Add files if they exist
    if (claimData.files && claimData.files.length > 0) {
      claimData.files.forEach((file) => {
        formData.append('files', file);
      });
    }

    const url = `${API_BASE_URL}/claims/`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        // Don't set Content-Type header - let browser set it with boundary for multipart
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.detail || 
          `HTTP error! status: ${response.status}`
        );
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for /claims/:`, error);
      throw error;
    }
  }

  static async uploadDocument(
    claimId: number,
    file: File,
    fileType?: string
  ): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    if (fileType) {
      formData.append('file_type', fileType);
    }

    return this.makeRequest(`/documents/upload`, {
      method: 'POST',
      headers: {}, // Don't set Content-Type for FormData
      body: formData,
    });
  }

  static async addDocumentToClaim(
    claimId: number,
    filename: string,
    filePath: string,
    fileType?: string,
    fileSize?: number,
    extractedData?: any
  ): Promise<any> {
    return this.makeRequest(`/claims/${claimId}/documents`, {
      method: 'POST',
      body: JSON.stringify({
        filename,
        file_path: filePath,
        file_type: fileType,
        file_size: fileSize,
        extracted_data: extractedData,
      }),
    });
  }

  static async getClaims(params?: {
    skip?: number;
    limit?: number;
    status?: string;
    claimant_name?: string;
    policy_number?: string;
  }): Promise<any> {
    const searchParams = new URLSearchParams();
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = `/claims/${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest(endpoint);
  }

  static async getClaimById(claimId: number): Promise<CreateClaimResponse> {
    return this.makeRequest<CreateClaimResponse>(`/claims/${claimId}`);
  }
}
