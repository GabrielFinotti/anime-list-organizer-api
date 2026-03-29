export type UserInputDTO = {
    username: string;
    email: string;
    password: string;
    phoneNumber: string;
    dateOfBirth: string;
    role?: string;
}

export type UpdateUserProfileDTO = {
    username?: string;
    imageUrl?: string;
    bio?: string;
}

export type UpdateUserAccountDTO = {
    email?: string;
    password?: string;
    phoneNumber?: string;
}

export type UpdateUserRoleDTO = {
    role: string;
}