export type CreateGroupArgs = {
    name: string
    description: string
    display_image: string
    cover_image: string
}

export type UpdateGroupArgs = {
    name?: string
    description?: string
    display_image?: string
    cover_image?: string
}
