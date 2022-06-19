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
    cover_image: string
    description: string
    dob: Date
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

export type ProfileUpdateArgs = {
    name?: string
    username?: string
    avatar?: string
    cover_image?: string
    description?: string
    dob?: Date
}
