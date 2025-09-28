import * as bcrypt from 'bcrypt'
import * as jwt from 'jsonwebtoken'
import ms from 'ms'
import { BadRequestError, UnAuthorizedError } from '@src/errors/http.error'
import { BaseService, CatchServiceError } from './base.service'
import moment from 'moment'
import { normalizeUnit } from '@src/helpers/normalize-unit'
import { User } from '@src/entity/User'

interface LoginPayload {
  username: string
  password: string
}

export class AuthService extends BaseService {
  async login({ username, password }: LoginPayload) {
    const user = await this.userRepository
      .createQueryBuilder('U')
      .addSelect('U.PASSWORD_HASH')
      .where('U.USERNAME = :username ', { username })
      .leftJoinAndSelect('U.STAFF', 'STAFF')
      .getOne()

    if (!user) {
      throw new UnAuthorizedError('Usuario o contraseña incorrectos')
    }

    const business = await this.getBusinessInfo([
      'BUSINESS_ID',
      'ADDRESS',
      'NAME',
      'PHONE',
      'RNC',
    ])

    const isPasswordValid = await bcrypt.compare(
      password,
      user?.PASSWORD_HASH as string
    )
    if (!isPasswordValid) {
      throw new UnAuthorizedError('Usuario o contraseña incorrectos')
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      throw new BadRequestError('JWT_SECRET no configurado')
    }

    const token = jwt.sign(
      {
        username,
        userId: user.USER_ID,
      },
      secret,
      {
        expiresIn: (process.env.SESSION_EXPIRATION_TIME +
          process.env.SESSION_EXPIRATION_MAGNITUDE) as ms.StringValue,
      }
    )

    await this.loginLog(user)

    return this.success({
      data: {
        username,
        userId: user.USER_ID,
        name: `${user.STAFF.NAME} ${user.STAFF.LAST_NAME}`,
        avatar: user.AVATAR,
        business,
        sessionCookie: {
          expiration: this.getSessionExpirationDate(),
          token,
        },
      },
    })
  }

  private getSessionExpirationDate(): string {
    const date = moment()
    const magnitude = normalizeUnit(
      process.env.SESSION_EXPIRATION_MAGNITUDE as ms.Unit
    )

    const expiration = date.add(
      Number(process.env.SESSION_EXPIRATION_TIME),
      magnitude
    )

    return expiration.toISOString()
  }

  @CatchServiceError()
  private async loginLog(user: User): Promise<void> {
    const current = typeof user.LOGIN_COUNT === 'number' ? user.LOGIN_COUNT : 0
    await this.userRepository.update(user, {
      LOGIN_COUNT: current + 1,
      LAST_LOGIN: new Date(),
    })
  }
}
