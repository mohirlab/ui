import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { themes } from '@mohirlab/themes';
import { iconHeart } from '@mohirlab/icons';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Box,
  Button,
  CardMedia,
  Field,
  Heading,
  Icon,
  Input,
  ThemeScope,
} from './index';

afterEach(cleanup);

describe('Button', () => {
  it('defaults to type="button" so it never submits a form by accident', () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole('button', { name: 'Save' }).getAttribute('type')).toBe('button');
  });

  it('stays focusable but inert while loading', () => {
    const onClick = vi.fn<() => void>();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button.hasAttribute('disabled')).toBe(false);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.getAttribute('aria-disabled')).toBe('true');
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies different classes per variant', () => {
    render(
      <>
        <Button>A</Button>
        <Button tone="danger" appearance="outline">
          B
        </Button>
      </>,
    );
    const [a, b] = screen.getAllByRole('button');
    expect(a!.className).not.toBe(b!.className);
  });
});

describe('Field', () => {
  it('labels the control and links hint and error', () => {
    render(
      <Field label="Email" hint="We never share it." error="Enter a valid address.">
        <Input type="email" />
      </Field>,
    );
    const input = screen.getByLabelText('Email');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    const described = input.getAttribute('aria-describedby')!.split(' ');
    const texts = described.map((id) => document.getElementById(id)?.textContent);
    expect(texts).toEqual(['Enter a valid address.', 'We never share it.']);
  });

  it('keeps aria-describedby the caller passes', () => {
    render(
      <Field label="Name" hint="Full name">
        <Input aria-describedby="extra" />
      </Field>,
    );
    expect(screen.getByLabelText('Name').getAttribute('aria-describedby')).toMatch(/-hint extra$/);
  });

  it('passes required and disabled down to the control', () => {
    render(
      <Field label="Code" required disabled>
        <Input />
      </Field>,
    );
    const input = screen.getByLabelText('Code') as HTMLInputElement;
    expect(input.required).toBe(true);
    expect(input.disabled).toBe(true);
  });
});

describe('Box', () => {
  it('turns sprinkles props into classes and forwards the rest', () => {
    render(<Box as="section" padding="4" display={{ mobile: 'block', desktop: 'flex' }} data-testid="box" />);
    const box = screen.getByTestId('box');
    expect(box.tagName).toBe('SECTION');
    expect(box.getAttribute('padding')).toBeNull();
    expect(box.className.split(' ').length).toBeGreaterThanOrEqual(6);
  });
});

describe('ThemeScope', () => {
  it('applies the mode class and marks the mode', () => {
    render(
      <ThemeScope mode="dark" data-testid="scope">
        <Badge>hi</Badge>
      </ThemeScope>,
    );
    const scope = screen.getByTestId('scope');
    expect(scope.classList.contains(themes.dark)).toBe(true);
    expect(scope.dataset.mlMode).toBe('dark');
  });
});

describe('Heading', () => {
  it('uses the semantic level independent of the visual variant', () => {
    render(
      <Heading level={3} variant="display">
        Big but third
      </Heading>,
    );
    expect(screen.getByRole('heading', { level: 3, name: 'Big but third' })).toBeTruthy();
  });
});

describe('Avatar', () => {
  it('names the person and falls back to a generated tile when the photo fails', () => {
    render(<Avatar name="Courtney Henry" src="https://example.invalid/me.jpg" />);
    const img = screen.getByRole('img', { name: 'Courtney Henry' });
    expect(img.getAttribute('src')).toBe('https://example.invalid/me.jpg');
    fireEvent.error(img);
    expect(img.getAttribute('src')).toMatch(/^data:image\/svg\+xml/);
    expect(decodeURIComponent(img.getAttribute('src')!)).toContain('>CH</text>');
  });

  it('groups avatars and counts the people not shown', () => {
    render(
      <AvatarGroup max={3} total={2140}>
        <Avatar name="A One" />
        <Avatar name="B Two" />
        <Avatar name="C Three" />
        <Avatar name="D Four" />
      </AvatarGroup>,
    );
    expect(screen.getAllByRole('img')).toHaveLength(3);
    expect(screen.getByText(/^\+2[.,]1K$/)).toBeTruthy();
  });
});

describe('Icon', () => {
  it('is hidden from assistive tech unless labelled', () => {
    const { container } = render(<Icon icon={iconHeart} />);
    expect(container.querySelector('svg')!.getAttribute('aria-hidden')).toBe('true');
    render(<Icon icon={iconHeart} label="Like" />);
    expect(screen.getByRole('img', { name: 'Like' }).querySelector('path')).toBeTruthy();
  });
});

describe('CardMedia', () => {
  it('generates stable artwork when there is no image', () => {
    const { container, rerender } = render(<CardMedia seed="post-1" />);
    const first = container.querySelector('img')!.getAttribute('src');
    rerender(<CardMedia seed="post-1" />);
    expect(container.querySelector('img')!.getAttribute('src')).toBe(first);
    expect(container.querySelector('img')!.getAttribute('alt')).toBe('');
  });
});
