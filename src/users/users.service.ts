import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from "./user.entity";
import { Repository } from 'typeorm';
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { CreateProfileDTO } from './dto/create-profile.dto';
import { Profile } from './profile.entity';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Profile) private  profileRepository: Repository<Profile>
  ) {}

  async createUser(user: CreateUserDTO) {

    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username,
      }
    });

    if (userFound) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }

  getUsers() {
    return this.userRepository.find();
  }

  async getUser(id: number) {
    const userFound = await this.userRepository.findOne({
      where: {
        id
      }
    });

    if( !userFound ) {
      throw new HttpException("User not found",  HttpStatus.NOT_FOUND);
    }

    return userFound;
  }

  async deleteUser(id: number) {
    const userFound = await this.userRepository.findOne({
      where: {
        id
      }
    });

    if( !userFound ) {
      throw new HttpException("User not found",  HttpStatus.NOT_FOUND);
    }

    return this.userRepository.delete({ id });

    /**
     * *** Another way to do it ***
     * const result = await this.userRepository.delete({ id });
     * if (result.affected === 0) {
     *  throw new HttpException("User not found",  HttpStatus.NOT_FOUND);
     * }
     * return result;
     */
  }

  async updateUser(id: number, user: UpdateUserDTO) {
    // return this.userRepository.update({  id }, user);

    const result = await this.userRepository.update({ id }, user);

    if (result.affected === 0) {
      throw new HttpException("User not found",  HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async createProfile(id: number, profile: CreateProfileDTO) {
    const userFound = await this.userRepository.findOne({
      where: {
        id
      }
    });

    if( !userFound ) {
      throw new HttpException("User not found",  HttpStatus.NOT_FOUND);
    }

    const newProfile = this.profileRepository.create(profile);
    const savedProfile = await this.profileRepository.save(newProfile);

    userFound.profile = savedProfile;
    return this.userRepository.save(userFound);
  }

}
