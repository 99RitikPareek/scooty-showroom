export interface Brand {
  id: number;
  name: string;
  logoUrl: string | null;
  active: boolean;
}

export interface BrandRequest {
  name: string;
  logoUrl?: string;
}