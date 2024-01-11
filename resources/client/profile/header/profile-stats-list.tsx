import {User} from '@common/auth/user';
import React, {
  Children,
  Fragment,
  ReactElement,
  ReactNode,
  useContext,
} from 'react';
import {SiteConfigContext} from '@common/core/settings/site-config-context';
import {Trans} from '@common/i18n/trans';
import {Link} from 'react-router-dom';
import {FormattedNumber} from '@common/i18n/formatted-number';

interface Props {
  user: User;
}
export function ProfileStatsList({user}: Props) {
  const {
    auth: {getUserProfileLink},
  } = useContext(SiteConfigContext);
  const profileLink = getUserProfileLink!(user);

  return (
    <StatsItems>
      <StatsItem
        label={<Trans message="Followers" />}
        value={user.followers_count || 0}
        link={`${profileLink}/followers`}
      />
      <StatsItem
        label={<Trans message="Following" />}
        value={user.followed_users_count || 0}
        link={`${profileLink}/following`}
      />
      <StatsItem
        label={<Trans message="Lists" />}
        value={user.lists_count || 0}
        link={`${profileLink}/lists`}
      />
    </StatsItems>
  );
}

interface StatsItemsProps {
  children: ReactNode;
}
function StatsItems(props: StatsItemsProps) {
  const children = Children.toArray(props.children);
  return (
    <div className="flex items-center">
      {children.map((child, index) => (
        <Fragment key={index}>
          {child}
          {index < children.length - 1 && (
            <div className="h-34 w-1 bg-divider mx-10" />
          )}
        </Fragment>
      ))}
    </div>
  );
}

interface StatsItemProps {
  label: ReactElement;
  value: number;
  link: string;
}
function StatsItem({label, value, link}: StatsItemProps) {
  return (
    <Link to={link} className="block text-center group">
      <div className="text-lg font-bold">
        <FormattedNumber value={value} />
      </div>
      <div className="text-xs text-muted uppercase group-hover:text-primary transition-colors">
        {label}
      </div>
    </Link>
  );
}
