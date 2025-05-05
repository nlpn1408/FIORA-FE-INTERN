import { createResponse } from '@/shared/lib/responseUtils/createResponse';
import { UserUSeCaseInstance } from '@/features/auth/application/use-cases/userUseCase';
import RESPONSE_CODE from '@/shared/constants/RESPONSE_CODE';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    return POST(req, res);
  }
  if (req.method === 'PATCH') {
    return PATCH(req, res);
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const body = await req.body;
    const { email, password } = body;

    const userCreationRes = await UserUSeCaseInstance.execute(email, password);
    if (!userCreationRes) {
      return res
        .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
        .json({ message: 'Cannot create user' });
    }

    return res
      .status(RESPONSE_CODE.CREATED)
      .json(
        createResponse(RESPONSE_CODE.CREATED, 'You have registered for an account successfully!'),
      );
  } catch (error) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createResponse(
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          (error as Error).message || 'An error has occured',
        ),
      );
  }
}

export async function PATCH(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
      return res
        .status(RESPONSE_CODE.BAD_REQUEST)
        .json(createResponse(RESPONSE_CODE.BAD_REQUEST, 'Email is required and must be a string'));
    }

    const userFound = await UserUSeCaseInstance.verifyEmail(email);

    if (userFound) {
      return res.status(RESPONSE_CODE.NOT_ACCEPTABLE).json({ message: 'Email already exists' });
    }

    return res.status(RESPONSE_CODE.OK).json({ message: 'Email is available' });
  } catch (error: any) {
    return res
      .status(RESPONSE_CODE.INTERNAL_SERVER_ERROR)
      .json(
        createResponse(
          RESPONSE_CODE.INTERNAL_SERVER_ERROR,
          error.message || 'An error has occured',
        ),
      );
  }
}
