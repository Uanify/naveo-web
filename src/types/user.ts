export interface Company {
    id: string;
    business_name: string;
    fleet_code: string;
    wallet_balance: number;
    subscription_active: boolean;
    subscription_expiry: string | null;
}

export interface UserProfile {
    id: string;
    full_name: string;
    phone: string;
    role: 'admin' | 'driver';
    company_id: string;
    email?: string;
    companies?: Company | Company[];
}

export interface ProfileFormData {
    id?: string;
    full_name: string;
    phone: string;
    email: string;
    role: string;
    company_id: string;
    business_name: string;
    fleet_code: string;
    wallet_balance: number;
    subscription_active: boolean;
    subscription_expiry: string | null;
}