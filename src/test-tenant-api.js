// Simple test to verify tenant API integration
// This file can be deleted after testing

import { TenantService } from './services/tenantService';

const testTenantAPI = async () => {
  try {
    const tenantService = new TenantService();
    console.log('Testing Tenant API...');
    
    const tenants = await tenantService.getTenants();
    console.log('Tenants fetched successfully:', tenants);
    
    // Expected structure based on API response:
    // [
    //   {
    //     "id": 1,
    //     "name": "Transform US",
    //     "isActive": true,
    //     "theamCode": "#f3949e",
    //     "logo": "Logo12",
    //     "emailCLinetId": "58f8d840-1215-4e4f-8901-da06f1dba5ac",
    //     "port": "857",
    //     "smtpUsername": "Testtest@transforminglives.co.uk",
    //     "smtpPassword": "Transformingy1@1234",
    //     "createdDate": "2025-11-27T14:00:17.963",
    //     "createdBy": 107,
    //     "modifiedBy": 0,
    //     "modifiedDate": "2025-11-27T08:28:33.957"
    //   }
    // ]
    
    return tenants;
  } catch (error) {
    console.error('Error testing tenant API:', error);
    throw error;
  }
};

export default testTenantAPI;