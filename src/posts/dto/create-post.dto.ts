export class CreatePostDto {
  authorId?: number;
  relatedCommentsCount?: number;
  message: string;
}
