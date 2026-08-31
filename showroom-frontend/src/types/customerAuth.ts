export interface CustomerUser {
  id: number;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  role: "CUSTOMER";
}

export interface CustomerAuthResponse {
  token: string;
  id: number;
  name: string;
  email?: string;
  phone: string;
  address?: string;
  role: "CUSTOMER";
}

export interface SendOtpRequest {
  phone: string;
}

export interface VerifyOtpRequest {
  phone: string;
  otp: string;
}

export interface CustomerRegisterRequest {
  name: string;
  phone: string;
  email?: string;
  password?: string;
  address?: string;
  otp?: string;
}

export interface CustomerLoginRequest {
  identifier: string;
  password?: string;
  otp?: string;
}
