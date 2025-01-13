export type ClientListQuery = {
    curPage: number;
    limit: number;
    clientName: string | null;
    declareType: string;
    clientType: string;
    clientStatus: string;
}

export type ClientInfo = {
    clientId: number | null;
    clientName: string | null;
    clientType: string | null;
    declarePeriod: string | null;
    optId: number | null;
    approveId: number | null;
    clientIct: string | null;
    clientVat: string | null;
    serviceStart: string | null;
    serviceEnd: string | null;
    clientTaxNo: string | null;
    clientKbk: string | null;
    clientEmail: string | null;
    clientFee: string | null;
    clientMobile: string | null;
    clientLinkman: string | null;
    clientAddress: string | null;
    clientPostcode: string | null;
    clientCity: string | null;
    description: string | null;
}
