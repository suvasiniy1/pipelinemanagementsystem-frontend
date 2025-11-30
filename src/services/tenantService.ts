import { BaseService } from './BaseService';
import { Tenant, TenantFormValues } from '../models/tenant';

export class TenantService extends BaseService<Tenant> {
  
  constructor() {
    super('Tenant', 'Tenant', null);
  }

  async getItems(): Promise<Tenant[]> {
    return this.getItemsBySubURL('GetAllTenant');
  }

  async getTenants(): Promise<Tenant[]> {
    return this.getItems();
  }

  async getTenant(id: number): Promise<Tenant> {
    return this.getItem(id);
  }

  async createTenant(tenant: TenantFormValues): Promise<Tenant> {
    return this.postItemBySubURL(tenant as any, 'AddTenant');
  }

  async updateTenant(id: number, tenant: TenantFormValues): Promise<Tenant> {
    return this.putItemBySubURL({ ...tenant, id } as any, `${id}`);
  }

  async deleteTenant(id: number): Promise<void> {
    return this.delete(id);
  }

  async toggleTenantStatus(id: number, isActive: boolean): Promise<void> {
    return this.putItemBySubURL({ isActive }, `${id}/status`);
  }
}