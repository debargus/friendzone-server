export type User = {
    id: string
    created_at: string
    updated_at: string
    email: string
    email_verified: boolean
    username: string
    password: string
    name: string
    avatar: string | null
}

export type UserRegisterArgs = {
    name: string
    username: string
    email: string
    password: string
}

export type UserLoginArgs = {
    username: string
    password: string
}
