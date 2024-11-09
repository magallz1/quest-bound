import React from 'react';
import { Link, LinkProps } from 'react-router-dom';

/**
 * Pass to Button to render an as <a> tag and use React Router.
 */
export const ClientSideLink = React.forwardRef<
  HTMLAnchorElement,
  Omit<LinkProps, 'to'> & { href: LinkProps['to'] }
>((props, ref) => <Link ref={ref} to={props.href} {...props} />);
