import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreatePostDTO } from './dto/create-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {

  constructor(
    private postsService: PostsService
  ) {}

  @Post()
  createPost(@Body() post: CreatePostDTO) {
    return this.postsService.createPost(post);
  }

  @Get()
  getPosts() {
    this.postsService.getPosts();
  }

}
