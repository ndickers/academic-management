/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Res, HttpStatus, HttpException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Prisma } from 'generated/prisma';
import { v4 as uuid } from 'uuid';
import * as bcrypt from 'bcrypt';
import { MailServiceService } from 'src/mail-service/mail-service.service';
import * as jwt from "jsonwebtoken";
import { Response } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService, private readonly mailService: MailServiceService) { }

  @Post("register")
  async create(@Body() newUser: Prisma.UserCreateInput) {
    const { email } = newUser;

    const userExist: any = await this.authService.findOne(email);
    if (userExist) {
      throw new ConflictException("User already exist")
    } else {
      const confirmationToken: string = uuid();
      const password: string = await bcrypt.hash(newUser.password, 8);

      const createUser = await this.authService.create({ ...newUser, password, confirmationToken, isVerified: false })

      if (createUser) {
        try {
          const res = await this.mailService.send(`${process.env.CLIENT_URL}/auth/verification?token=${confirmationToken}`, "Confirm Registration", email);
          if (res) {
            return ({ message: "Confirmation email sent" })
          }
        } catch (error: unknown) {
          throw new HttpException(
            {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
              error: 'Failed to send email',
              details: error,
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
    }
  }


  @Post("login")
  async loginUser(@Res() res: Response, @Body() credentials: { email: string, password: string }) {
    const { email } = credentials;
    const userExist = await this.authService.findOne(email);

    if (userExist) {
      const compare = await bcrypt.compare(credentials.password, userExist.password);
      if (!compare) {
        return res.status(400).json({ message: "Incorrect email or password" })
      }
      const accessToken = jwt.sign({ email, role: userExist.role, id: userExist.id }, process.env.SECRET as string)
      const { password, confirmationToken, ...user } = userExist;
      return res.status(200).json({ accessToken, user });
    } else {
      return res.status(404).json({ message: "User does not exist" }).redirect("/auth/register")
    }

  }

  @Post("verification")
  async confirmRegistration(@Body() verifyToken: { token: string }) {
    if (verifyToken) {
      const token = verifyToken.token;
      const confirmToken = await this.authService.getToken(token);
      if (confirmToken) {
        const verified = await this.authService.verifyUser(token);

        console.log(verified);

        if (verified) {
          return { message: "Verification Successfull" };
        } else {
          throw new InternalServerErrorException("Verification failed")
        }
      } else {
        return { message: "User is verified" }
      }
    }
  }
}
