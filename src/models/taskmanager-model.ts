// import { date } from 'quasar';

export type TaskListQuery = {
    curPage: number;
    limit: number;
    // clientName: string | null;
    taskName: string | null;
    clientType: string;
    taskType: string;
    startFrom: string | null;
    endWith: string | null;
    taskStatus: [];
}

export type TaskInfo = {
  taskId: number | null;
  clientName: string | null;
  taskName: string | null;
  clientType: string;
  clientEmail: string | null;
  clientMobile: string | null;
  // clientTel: string | null;
  optName: string | null;
  approveName: string | null;
  taskType: string;
  taskStatus: string;
  createDate: Date | null;
}


export type TaskProcess = {
  processId: number | null;
  taskId: number | null;
  optDate: Date | null;
  optBy: number | null;
  optName: string | null;
  taskStatusFrom: string;
  taskStatusTo: string;
  comment: string | null;
  fileId: number | null;
  fileName: string | null;
  filePath: string | null;
}
