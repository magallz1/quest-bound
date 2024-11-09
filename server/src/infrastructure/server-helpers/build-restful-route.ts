import { Express, Request, Response } from 'express';
import { RestfulResponse } from '../rest/types';
import { restfulAuthorizer } from '../authorization';
import { RestfulAuthContext } from '../types';

interface BuildRestfulRouteParams {
  app: Express;
  path: string;
  method?: 'get' | 'post' | 'put' | 'delete';
  handler: (params: any, auth: RestfulAuthContext) => Promise<RestfulResponse>;
  authRequired?: boolean;
}

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

    const response = await handler(req.body, authContext);
    res.status(response.statusCode).send(response.body);
  };

  switch (method) {
    case 'post':
      app.post(`/${path}`, routeHandler);
    case 'put':
      app.put(`/${path}`, routeHandler);
    case 'delete':
      app.delete(`/${path}`, routeHandler);
    default:
      app.get(`/${path}`, routeHandler);
  }
};

export const buildRestfulRoutes = (routes: BuildRestfulRouteParams[]) => {
  routes.forEach((route) => buildRestfulRoute(route));
};
