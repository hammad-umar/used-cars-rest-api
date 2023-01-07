import {
  Controller,
  Post,
  Patch,
  Get,
  Query,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { User } from '../users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { AuthGuard } from '../guards/auth.guard';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from '../guards/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() getEstimateDto: GetEstimateDto) {
    return this.reportsService.createEstimate(getEstimateDto);
  }

  @Post()
  @Serialize(ReportDto)
  @UseGuards(AuthGuard)
  createReport(
    @Body() createReportDto: CreateReportDto,
    @CurrentUser() user: User,
  ) {
    return this.reportsService.create(createReportDto, user);
  }

  @Patch('/:id')
  @UseGuards(AdminGuard)
  changeReportApproval(
    @Param('id') id: string,
    @Body() approveReportDto: ApproveReportDto,
  ) {
    return this.reportsService.changeApproval(id, approveReportDto.approved);
  }
}
