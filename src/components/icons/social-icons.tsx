import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

export function GoogleIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.67-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.93 6.93 0 0 1 0-4.2V7.06H2.18a10.98 10.98 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52Z"
      />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M13.5 21v-8.2h2.75l.4-3.2h-3.15V7.5c0-.93.26-1.56 1.6-1.56h1.7V3.1C15.94 3.03 14.9 2.94 13.7 2.94c-2.5 0-4.2 1.53-4.2 4.33v2.34H6.75v3.2h2.75V21h4Z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M16.5 3c.3 1.9 1.6 3.4 3.5 3.7v2.7c-1.3 0-2.5-.4-3.5-1.1v6.4c0 3-2.4 5.3-5.4 5.3S5.7 17.7 5.7 14.7c0-2.9 2.3-5.2 5.1-5.3v2.8c-1.3.1-2.3 1.2-2.3 2.5 0 1.4 1.1 2.5 2.5 2.5s2.6-1.1 2.6-2.5V3h2.9Z" />
    </svg>
  );
}

export function YoutubeIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.6 7.7c-.2-1-1-1.8-2-2C17.9 5.3 12 5.3 12 5.3s-5.9 0-7.6.4c-1 .2-1.8 1-2 2C2 9.4 2 12 2 12s0 2.6.4 4.3c.2 1 1 1.8 2 2 1.7.4 7.6.4 7.6.4s5.9 0 7.6-.4c1-.2 1.8-1 2-2 .4-1.7.4-4.3.4-4.3s0-2.6-.4-4.3ZM10 15.2V8.8l5.5 3.2-5.5 3.2Z" />
    </svg>
  );
}

export function PinterestIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2C6.5 2 3 5.9 3 10.3c0 2.4 1.3 4.3 3.1 5-.05-.4-.1-1.1.02-1.6.1-.5.9-3.7.9-3.7s-.2-.5-.2-1.2c0-1.2.7-2 1.6-2 .7 0 1.1.6 1.1 1.3 0 .8-.5 2-.8 3.1-.2 1 .5 1.7 1.5 1.7 1.7 0 3-1.9 3-4.5 0-2.4-1.7-4-4.1-4-2.8 0-4.5 2.1-4.5 4.3 0 .8.3 1.7.7 2.1.08.1.1.16.06.26l-.25 1c-.04.16-.13.2-.3.12-1.1-.5-1.8-2.1-1.8-3.4 0-2.8 2-5.3 5.9-5.3 3.1 0 5.5 2.2 5.5 5.2 0 3.1-2 5.6-4.7 5.6-.9 0-1.8-.5-2.1-1l-.6 2.2c-.2.9-.8 2-1.2 2.7.9.3 1.9.4 2.9.4 5.5 0 9.9-4.4 9.9-9.9C21.9 6.4 17.5 2 12 2Z" />
    </svg>
  );
}

export function LinkedinIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M6.9 8.4H3.6V20h3.3V8.4ZM5.3 3.2A1.9 1.9 0 1 0 5.3 7a1.9 1.9 0 0 0 0-3.8ZM20.4 20h-3.3v-6.1c0-1.5-.5-2.5-1.8-2.5-1 0-1.6.7-1.9 1.3-.1.2-.1.6-.1.9V20H10s.05-10.6 0-11.6h3.3v1.6c.4-.7 1.2-1.7 3-1.7 2.2 0 3.9 1.4 3.9 4.5V20Z" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.9 3H22l-7.2 8.3L23 21h-6.6l-5.2-6.4L5.2 21H2l7.7-8.8L2 3h6.7l4.7 5.9L18.9 3Zm-1.1 16h1.8L7.3 4.9H5.4L17.8 19Z" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M17.5 14.4c-.3-.1-1.6-.8-1.9-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.4.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.4-.1-.1-.6-1.4-.8-1.9-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-1 1-1 2.3 0 1.4 1 2.7 1.1 2.9.1.2 2 3.1 4.9 4.2.7.3 1.2.4 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.6-.7 1.9-1.3.2-.6.2-1.1.2-1.3-.1-.1-.3-.2-.6-.3ZM12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 20.2 12 8.2 8.2 0 0 1 12 20.2Z" />
    </svg>
  );
}
