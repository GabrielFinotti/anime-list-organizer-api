import { Request, Response, NextFunction } from 'express';
import { LoginUseCase } from '../../../application/use-cases/auth/login.use-case.js';
import { LogoutUseCase } from '../../../application/use-cases/auth/logout.use-case.js';
import { LoginInputDTO } from '../../../application/dtos/auth.dto.js';

export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly logoutUseCase: LogoutUseCase,
  ) {}

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const input: LoginInputDTO = {
        email: req.body.email,
        password: req.body.password,
      };

      const result = await this.loginUseCase.execute(input);

      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  logout = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const authHeader = req.headers.authorization;
      const token = authHeader?.split(' ')[1];

      if (token) {
        await this.logoutUseCase.execute({ token });
      }

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default AuthController;
