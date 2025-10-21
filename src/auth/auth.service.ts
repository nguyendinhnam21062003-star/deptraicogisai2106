import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async validateGoogleUser(profile: any) {
    const { id, displayName, emails, photos } = profile;
    const email = emails?.[0]?.value;

    let user = await this.prisma.users.findUnique({ where: { email } });
    if (!user) {
      user = await this.prisma.users.create({
        data: {
          full_name: displayName,
          email,
          google_id: id,
          avatar_url: photos?.[0]?.value || null,
        },
      });
    }

    return user;
  }

  async generateJwt(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
