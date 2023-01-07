import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
  ) {}

  async createEstimate(
    estimateDto: GetEstimateDto,
  ): Promise<{ price: number | null }> {
    const { make, model, year, lat, lng, mileage } = estimateDto;

    return this.reportsRepository
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .orderBy('mileage -:mileage', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }

  async create(createReportDto: CreateReportDto, user: User): Promise<Report> {
    const report = this.reportsRepository.create(createReportDto);
    report.user = user;
    return this.reportsRepository.save(report);
  }

  async changeApproval(id: string, approvalStatus: boolean) {
    const report = await this.reportsRepository.findOne({
      where: {
        id: parseInt(id),
      },
    });

    if (!report) {
      throw new NotFoundException('Report not found!');
    }

    report.approved = approvalStatus;
    return this.reportsRepository.save(report);
  }
}
