import {Link, LinkProps} from 'react-router-dom';
import clsx from 'clsx';
import React, {ReactNode, useMemo} from 'react';
import {getBootstrapData} from '@common/core/bootstrap-data/use-backend-bootstrap-data';
import {NewsArticle} from '@app/titles/models/news-article';

interface Props extends Omit<LinkProps, 'to'> {
  article: NewsArticle;
  className?: string;
  children?: ReactNode;
  color?: 'primary' | 'inherit';
}
export function NewsArticleLink({
  article,
  className,
  children,
  color = 'inherit',
  ...linkProps
}: Props) {
  const finalUri = useMemo(() => {
    return getNewsArticleLink(article);
  }, [article]);

  return (
    <Link
      {...linkProps}
      className={clsx(
        color === 'primary'
          ? 'text-primary hover:text-primary-dark'
          : 'text-inherit',
        'hover:underline outline-none focus-visible:underline overflow-x-hidden overflow-ellipsis transition-colors',
        className
      )}
      to={finalUri}
    >
      {children ?? article.title}
    </Link>
  );
}

export function getNewsArticleLink(
  article: NewsArticle,
  {absolute}: {absolute?: boolean} = {}
): string {
  let link = `/news/${article.id}`;
  if (absolute) {
    link = `${getBootstrapData().settings.base_url}${link}`;
  }
  return link;
}
