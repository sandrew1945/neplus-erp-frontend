export type UserListQuery = {
    curPage: number;
    limit: number;
    userCode: string;
    userName: string;
    userStatus: string;
}

export type UserInfo = {
    userId: string;
    userCode: string;
    userName: string;
    password: string;
    phone: string;
    mobile: string;
    email: string;
    sex: string;
    birthday: string;
    avatar: string;
    userStatus: string;
    emailToken: string | null;
}
