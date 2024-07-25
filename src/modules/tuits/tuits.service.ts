import { Injectable, NotFoundException } from '@nestjs/common';
import { Tuit } from './tuit.entity';
import { CreateTuitDto, PaginationQueryDto, UpdateTuitDto } from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities';

@Injectable()
export class TuitsService {
  constructor(
    @InjectRepository(Tuit) private readonly tuitRepository: Repository<Tuit>,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async getTuits({ limit, offset }: PaginationQueryDto): Promise<Tuit[]> {
    return await this.tuitRepository.find({
      relations: ['user'],
      skip: limit,
      take: offset,
    });
  }

  async getTuit(id: number): Promise<Tuit> {
    const tuit = await this.tuitRepository.findOne({
      relations: ['user'],
      where: {
        id,
      },
    });

    if (!tuit) {
      throw new NotFoundException('Resource not foud');
    }

    return tuit;
  }

  async createTuit({ message, user }: CreateTuitDto) {
    const tuit = this.tuitRepository.create({ message, user });
    return this.tuitRepository.save(tuit);
  }

  async updateTuit(id: number, { message }: UpdateTuitDto) {
    const tuit = await this.tuitRepository.preload({ id, message });
    if (!tuit) {
      throw new NotFoundException('Resource not foud');
    }

    return tuit;
  }

  async removeTuit(id: number) {
    const [tuit] = await this.tuitRepository.findBy({ id });

    if (!tuit) {
      throw new NotFoundException('Resource not foud');
    }

    this.tuitRepository.remove(tuit);
  }
}
