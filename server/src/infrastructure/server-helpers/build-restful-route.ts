import { Express, Request, Response } from 'express';
import { RestfulResponse } from '../rest/types';
import { restfulAuthorizer } from '../authorization';
import { RestfulAuthContext } from '../types';
import multer from 'multer';
import { storageDir } from '../rest/services/storage/file-upload';

interface BuildRestfulRouteParams {
  app: Express;
  path: string;
  method?: 'get' | 'post' | 'put' | 'delete' | 'upload';
  handler: (
    params: any,
    auth: RestfulAuthContext,
    file?: Express.Multer.File,
  ) => Promise<RestfulResponse>;
  authRequired?: boolean;
}

const upload = multer({ dest: `${storageDir}/uploads` });

export const buildRestfulRoute = ({
  app,
  method = 'get',
  authRequired = true,
  path,
  handler,
}: BuildRestfulRouteParams) => {
  const routeHandler = async (req: Request, res: Response) => {
    const authContext: RestfulAuthContext = {
      id: '',
      email: '',
    };

    if (authRequired) {
      const authorized = await restfulAuthorizer({ token: req.get('Authorization') });
      if (!authorized) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      authContext.id = authorized.id;
      authContext.email = authorized.email;
    }

    const response = await handler(req.body, authContext, req.file);
    res.status(response.statusCode).send(response.body);
  };

  switch (method) {
    case 'post':
      app.post(`/${path}`, routeHandler);
    case 'put':
      app.put(`/${path}`, routeHandler);
    case 'delete':
      app.delete(`/${path}`, routeHandler);
    case 'upload':
      app.post(`/${path}`, upload.single('file'), routeHandler);
    default:
      app.get(`/${path}`, routeHandler);
  }
};

export const buildRestfulRoutes = (routes: BuildRestfulRouteParams[]) => {
  routes.forEach((route) => buildRestfulRoute(route));
};
