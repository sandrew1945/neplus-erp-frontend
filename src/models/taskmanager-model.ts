// import { date } from 'quasar';

export type TaskListQuery = {
    curPage: number;
    limit: number;
    clientName: string | null;
    clientType: string;
    taskType: string;
    dateRange: object,
    startFrom: string | null;
    endWith: string | null;
    taskStatus: string;
}

export type TaskInfo = {
  taskId: number | null;
  clientName: string | null;
  clientType: string;
  clientEmail: string | null;
  clientMobile: string | null;
  clientTel: string | null;
  optName: string | null;
  approveName: string | null;
  taskType: string;
  taskStatus: string;
  docFile: string | null;
  docArchiveDate: Date | null;
  bankNotesFile: string | null;
  bankNotesArchiveDate: Date | null;
  selfExamFile: string | null;
  selfExamArchiveDate: Date | null;
  draftFile: string | null;
  draftCreateDate: Date | null;
  dirRejDate: Date | null;
  dirRejCmnt: Date | null;
  cliRejDate: Date | null;
  cliRejCmnt: Date | null;
}
