import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UsersService } from 'src/users/users.service';
import { Post } from './post.entity';
import { Repository } from 'typeorm';
import { CreatePostDTO } from './dto/create-post.dto';

@Injectable()
export class PostsService {

  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private usersService: UsersService
  ) {}

  async createPost(post: CreatePostDTO) {
    const userFound = await this.usersService.getUser(post.authorId);

    if (!userFound) {
      throw new HttpException("User not found",  HttpStatus.NOT_FOUND);
    }

    const newPost = this.postRepository.create(post);
    return await this.postRepository.save(newPost);
  }

  getPosts() {
    return this.postRepository.find();
  }

}
