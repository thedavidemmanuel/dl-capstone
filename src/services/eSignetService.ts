// eSignet Integration Service for National ID Authentication
export interface NationalIdData {
  nationalId: string;
  fullName: string;
  dateOfBirth: string;
  address: string;
  phoneNumber: string;
  email?: string;
  photo?: string;
}

export interface AuthRequest {
  nationalId: string;
  transactionId?: string;
}

export interface OtpRequest {
  nationalId: string;
  otp: string;
  transactionId: string;
}

export interface AuthResponse {
  success: boolean;
  transactionId?: string;
  message: string;
  userData?: NationalIdData;
  error?: string;
}

class ESignetService {
  private baseUrl: string;
  private mockIdentityUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_ESIGNET_API_URL || 'http://localhost:8089';
    this.mockIdentityUrl = process.env.NEXT_PUBLIC_MOCK_IDENTITY_URL || 'http://localhost:8088';
  }

  // Register a mock identity for testing
  async registerMockIdentity(userData: NationalIdData): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.mockIdentityUrl}/identity/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: userData.nationalId,
          fullName: userData.fullName,
          dateOfBirth: userData.dateOfBirth,
          address: userData.address,
          phoneNumber: userData.phoneNumber,
          email: userData.email || '',
          photo: userData.photo || '',
          status: 'ACTIVE'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }      await response.json();
      return {
        success: true,
        message: 'Mock identity registered successfully'
      };
    } catch (error) {
      console.error('Error registering mock identity:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      };
    }
  }

  // Step 1: Initiate authentication with National ID
  async initiateAuth(nationalId: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/authorize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientId: 'digital-license-app',
          scope: 'openid profile',
          responseType: 'code',
          redirectUri: `${window.location.origin}/auth/callback`,
          claims: {
            userinfo: {
              individual_id: { essential: true, value: nationalId }
            }
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        transactionId: data.transactionId,
        message: 'Authentication initiated successfully'
      };
    } catch (error) {
      console.error('Error initiating auth:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Authentication initiation failed'
      };
    }
  }

  // Step 2: Send OTP request
  async sendOtp(request: AuthRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: request.transactionId,
          individualId: request.nationalId,
          otpChannels: ['PHONE'] // Can also include 'EMAIL'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        transactionId: data.transactionId,
        message: 'OTP sent successfully to registered phone number'
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'OTP sending failed'
      };
    }
  }

  // Step 3: Verify OTP and get user data
  async verifyOtp(request: OtpRequest): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: request.transactionId,
          individualId: request.nationalId,
          challengeList: [
            {
              authFactorType: 'OTP',
              challenge: request.otp,
              format: 'alpha-numeric'
            }
          ]
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.authStatus === 'SUCCESS') {
        // Get user details from the identity system
        const userDataResponse = await this.getUserData(request.nationalId);
        
        return {
          success: true,
          message: 'Authentication successful',
          userData: userDataResponse.userData,
          transactionId: data.transactionId
        };
      } else {
        return {
          success: false,
          message: 'OTP verification failed'
        };
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'OTP verification failed'
      };
    }
  }

  // Get user data from mock identity system
  async getUserData(nationalId: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.mockIdentityUrl}/identity/${nationalId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('National ID not found in the system');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        success: true,
        message: 'User data retrieved successfully',
        userData: {
          nationalId: data.id,
          fullName: data.fullName,
          dateOfBirth: data.dateOfBirth,
          address: data.address,
          phoneNumber: data.phoneNumber,
          email: data.email,
          photo: data.photo
        }
      };
    } catch (error) {
      console.error('Error getting user data:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to retrieve user data'
      };
    }
  }

  // Mock OTP validation for development (use 123456)
  async validateMockOtp(otp: string): Promise<boolean> {
    // In development, accept 123456 as valid OTP
    return otp === '123456';
  }

  // Health check for eSignet services
  async healthCheck(): Promise<{ esignet: boolean; mockIdentity: boolean }> {
    const checks = await Promise.allSettled([
      fetch(`${this.baseUrl}/health`),
      fetch(`${this.mockIdentityUrl}/health`)
    ]);

    return {
      esignet: checks[0].status === 'fulfilled' && (checks[0].value as Response).ok,
      mockIdentity: checks[1].status === 'fulfilled' && (checks[1].value as Response).ok
    };
  }
}

export const eSignetService = new ESignetService();
