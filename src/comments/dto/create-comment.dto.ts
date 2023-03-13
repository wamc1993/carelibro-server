export class CreateCommentDto {
  authorId?: number;
  postId: number;
  fatherId?: number;
  message: string;
  isActive?: number;
}
