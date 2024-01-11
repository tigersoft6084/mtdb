import React, {
  cloneElement,
  isValidElement,
  Key,
  ReactElement,
  ReactNode,
  useId,
  useRef,
} from 'react';
import clsx from 'clsx';
import {AnimatePresence, m} from 'framer-motion';
import {useControlledState} from '@react-stately/utils';
import {FocusScope, useFocusManager} from '@react-aria/focus';
import {KeyboardArrowDownIcon} from '../../icons/material/KeyboardArrowDown';
import {AccordionAnimation} from '@common/ui/accordion/accordtion-animation';

type Props = {
  variant?: 'outline' | 'default' | 'minimal';
  children?: ReactNode;
  mode?: 'single' | 'multiple';
  expandedValues?: Key[];
  defaultExpandedValues?: Key[];
  onExpandedChange?: (key: Key[]) => void;
  className?: string;
  isLazy?: boolean;
};
export const Accordion = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      variant = 'default',
      mode = 'single',
      children,
      className,
      isLazy,
      ...other
    },
    ref
  ) => {
    const [expandedValues, setExpandedValues] = useControlledState(
      other.expandedValues,
      other.defaultExpandedValues || [],
      other.onExpandedChange
    );

    return (
      <div
        className={clsx(variant === 'outline' && 'space-y-10', className)}
        ref={ref}
        role="presentation"
      >
        <AnimatePresence>
          <FocusScope>
            {React.Children.map(children, (child, index) => {
              if (!isValidElement<ClonedItemProps>(child)) return null;
              return cloneElement<ClonedItemProps>(child, {
                key: child.key || index,
                value: child.props.value || index,
                mode,
                variant,
                expandedValues,
                setExpandedValues,
                isLazy,
              });
            })}
          </FocusScope>
        </AnimatePresence>
      </div>
    );
  }
);

interface AccordionItemProps {
  children: ReactNode;
  disabled?: boolean;
  label: ReactNode;
  description?: ReactNode;
  value?: Key;
  bodyClassName?: string;
  labelClassName?: string;
  buttonPadding?: string;
  chevronPosition?: 'left' | 'right';
  startIcon?: ReactElement;
  endAppend?: ReactElement;
}
interface ClonedItemProps extends AccordionItemProps {
  variant?: 'outline' | 'default' | 'minimal';
  expandedValues: Key[];
  setExpandedValues: (keys: Key[]) => void;
  mode: 'single' | 'multiple';
  value: Key;
  isLazy?: boolean;
}
export function AccordionItem({
  children,
  label,
  disabled,
  bodyClassName,
  labelClassName,
  buttonPadding = 'py-10 pl-14 pr-10',
  startIcon,
  description,
  endAppend,
  chevronPosition = 'right',
  ...other
}: AccordionItemProps) {
  const {expandedValues, setExpandedValues, variant, value, mode, isLazy} =
    other as ClonedItemProps;
  const ref = useRef<HTMLButtonElement>(null);
  const isExpanded = !disabled && expandedValues.includes(value);
  const wasExpandedOnce = useRef(false);
  if (isExpanded) {
    wasExpandedOnce.current = true;
  }
  const focusManager = useFocusManager();
  const id = useId();
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case 'ArrowDown':
        focusManager.focusNext();
        break;
      case 'ArrowUp':
        focusManager.focusPrevious();
        break;
      case 'Home':
        focusManager.focusFirst();
        break;
      case 'End':
        focusManager.focusLast();
        break;
    }
  };

  const toggle = () => {
    const i = expandedValues.indexOf(value);
    if (i > -1) {
      const newKeys = [...expandedValues];
      newKeys.splice(i, 1);
      setExpandedValues(newKeys);
    } else if (mode === 'single') {
      setExpandedValues([value]);
    } else {
      setExpandedValues([...expandedValues, value]);
    }
  };

  const chevron = (
    <div className={clsx(variant === 'minimal' && '')}>
      <KeyboardArrowDownIcon
        aria-hidden="true"
        size="md"
        className={clsx(
          disabled ? 'text-disabled' : 'text-muted',
          isExpanded && 'rotate-180 transition-transform'
        )}
      />
    </div>
  );

  return (
    <div
      className={clsx(
        variant === 'default' && 'border-b',
        variant === 'outline' && 'rounded border',
        disabled && 'text-disabled'
      )}
    >
      <h3
        className={clsx(
          'flex w-full items-center justify-between text-sm',
          disabled && 'pointer-events-none',
          isExpanded && variant !== 'minimal'
            ? 'border-b'
            : 'border-b border-b-transparent',
          variant === 'outline'
            ? isExpanded
              ? 'rounded-t'
              : 'rounded'
            : undefined
        )}
      >
        <button
          disabled={disabled}
          aria-expanded={isExpanded}
          id={buttonId}
          aria-controls={panelId}
          type="button"
          ref={ref}
          onKeyDown={onKeyDown}
          onClick={() => {
            if (!disabled) {
              toggle();
            }
          }}
          className={clsx(
            'flex flex-auto items-center gap-10 text-left outline-none hover:bg-hover focus-visible:bg-primary/focus',
            buttonPadding
          )}
        >
          {chevronPosition === 'left' && chevron}
          {startIcon &&
            cloneElement(startIcon, {
              size: 'md',
              className: clsx(
                startIcon.props.className,
                disabled ? 'text-disabled' : 'text-muted'
              ),
            })}
          <div className="flex-auto overflow-hidden overflow-ellipsis">
            <div className={labelClassName} data-testid="accordion-label">
              {label}
            </div>
            {description && (
              <div className="text-xs text-muted">{description}</div>
            )}
          </div>
          {chevronPosition === 'right' && chevron}
        </button>
        {endAppend && (
          <div className="flex-shrink-0 px-4 text-sm text-muted">
            {endAppend}
          </div>
        )}
      </h3>
      <m.div
        aria-labelledby={id}
        role="region"
        variants={AccordionAnimation.variants}
        transition={AccordionAnimation.transition}
        initial={false}
        animate={isExpanded ? 'open' : 'closed'}
      >
        <div className={clsx('p-16', bodyClassName)}>
          {!isLazy || wasExpandedOnce ? children : null}
        </div>
      </m.div>
    </div>
  );
}
