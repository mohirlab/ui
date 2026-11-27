import { createContext, useContext, useId, type ComponentPropsWithRef, type ReactNode } from 'react';
import { iconChevronDown } from '@mohirlab/icons';
import { cx } from '../../utils/cx';
import { Icon } from '../icon';
import * as styles from './accordion.css';

const AccordionContext = createContext<{ name?: string }>({});

export interface AccordionProps extends ComponentPropsWithRef<'div'> {
  /** `single`: opening one item closes the others. `multiple` (default): independent. */
  type?: 'single' | 'multiple';
  children: ReactNode;
}

/**
 * Collapsible sections on native `<details>`/`<summary>`: keyboard support, screen reader
 * semantics and find-in-page (which opens the matching item) come from the browser.
 */
export function Accordion({ type = 'multiple', className, ...rest }: AccordionProps) {
  const id = useId();
  return (
    <AccordionContext.Provider value={{ name: type === 'single' ? `ml-accordion-${id}` : undefined }}>
      <div {...rest} className={cx(styles.accordion, className)} />
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps extends Omit<ComponentPropsWithRef<'details'>, 'title'> {
  /** The always-visible heading of the item. */
  title: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function AccordionItem({ title, defaultOpen, className, children, ...rest }: AccordionItemProps) {
  const { name } = useContext(AccordionContext);
  return (
    <details {...rest} name={name} open={defaultOpen} className={cx(styles.item, className)}>
      <summary className={styles.summary}>
        {title}
        <Icon icon={iconChevronDown} className={styles.chevron} />
      </summary>
      <div className={styles.content}>{children}</div>
    </details>
  );
}
