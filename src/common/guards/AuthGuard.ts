import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class _AuthGuard extends AuthGuard('local') {}
