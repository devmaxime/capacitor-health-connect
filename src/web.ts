import { WebPlugin } from '@capacitor/core';

import type { HealthConnectPlugin, PermissionsResponse, RecordType, AggregateRecordType, AggregateResponse, AggregateGroupBy } from './definitions';

export class HealthConnectWeb extends WebPlugin implements HealthConnectPlugin {
  async checkAvailability(): Promise<{ availability: 'Available' | 'NotSupported' | 'NotInstalled' }> {
    console.warn('HealthConnect is not available on the web');

    return { availability: 'NotSupported' };
  }

  async requestPermissions(options: { read: RecordType[]; write: RecordType[] }): Promise<PermissionsResponse> {
    console.warn('HealthConnect is not available on the web', options);

    return { read: [], write: [] };
  }

  async getGrantedPermissions(): Promise<PermissionsResponse> {
    console.warn('HealthConnect is not available on the web');

    return { read: [], write: [] };
  }

  async revokePermissions(): Promise<void> {
    console.warn('HealthConnect is not available on the web');
  }

  async readRecords(options: { start: string; end: string; type: RecordType }): Promise<any> {
    console.warn('HealthConnect is not available on the web', options);
  }

  async aggregateRecords(options: { start: string; end: string; type: AggregateRecordType; groupBy?: AggregateGroupBy }): Promise<AggregateResponse> {
    console.warn('HealthConnect is not available on the web', options);
    
    return { aggregates: [] };
  }
}
