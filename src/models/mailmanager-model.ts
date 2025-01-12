export type MailListQuery = {
    curPage: number;
    limit: number;
    templateName: string | null;
    templateContent: string | null;
    templateStatus: string;
}

export type MailTemplateInfo = {
    templateId: number | null;
    templateName: string | null;
    templateContent: string | null;
    templateStatus: string | null;
}
