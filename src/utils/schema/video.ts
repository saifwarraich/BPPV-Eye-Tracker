export interface IVideoDetailPayload {
  patientName: string;
  dateOfBirth?: string;
  gernder?: string;
  label: Array<{
    id: string;
    start: number;
    end: number;
    label: string;
    comment?: string;
  }>;
  headMovementData: {
    timestamp: number;
    sensorData: number[];
    angleValues: number[];
  }[];
  videoStartTime: number;
}
