export interface IJwtPayload {
  user: IUserJWT;
  iat: number;
  exp: number;
}

export interface IUserJWT {
  email: string;
  role: string;
  name: string;
}
