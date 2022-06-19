export type CreatePostArgs = {
	content: string
	group_id: string
	is_public?: boolean
}

export type UpdatePostArgs = {
	content?: string
	is_public?: boolean
}
