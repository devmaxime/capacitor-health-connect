export interface HealthConnectPlugin {
  checkAvailability(): Promise<{ availability: HealthConnectAvailability }>;

  requestPermissions(options: { read: RecordType[]; write: RecordType[] }): Promise<PermissionsResponse>;

  getGrantedPermissions(): Promise<PermissionsResponse>;

  revokePermissions(): Promise<void>;

  /**
   * Reads records of the specified type within a time range.
   *
   * When pageToken is not provided, automatic pagination is used to retrieve ALL records
   * within the specified time range. This may take longer for large datasets but ensures
   * complete data retrieval.
   *
   * When pageToken is provided, manual pagination is used and only a single page of
   * results is returned along with a nextPageToken for retrieving subsequent pages.
   */
  readRecords(options: {
    start: string;
    end: string;
    type: RecordType;
    pageSize?: number;
    pageToken?: string;
  }): Promise<ReadRecordsResponse>;
}

export type HealthConnectAvailability = 'Available' | 'NotSupported' | 'NotInstalled';

export type RecordType = 'Steps' | 'Weight' | 'ActivitySession' | 'SleepSession' | 'RestingHeartRate';

/**
 * Response from reading health records.
 *
 * When using automatic pagination (no pageToken provided), all records are returned
 * and nextPageToken will be undefined.
 *
 * When using manual pagination (pageToken provided), nextPageToken will contain
 * the token for the next page, or undefined if this is the last page.
 */
export interface ReadRecordsResponse {
  records: any[];
  nextPageToken?: string;
}

export interface PermissionsResponse {
  read: RecordType[];
  write: RecordType[];
}
