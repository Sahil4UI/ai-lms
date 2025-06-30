import { type LucideProps, GraduationCap } from 'lucide-react';

export const Icons = {
  logo: (props: LucideProps) => <GraduationCap {...props} />,
  google: (props: LucideProps) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fill="currentColor"
        d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.62 1.9-4.73 1.9-3.37 0-6.13-2.5-6.13-5.5s2.76-5.5 6.13-5.5c1.88 0 3.13.8 3.85 1.5l2.4-2.4C16.97 3.9 15 .3 12.48.3c-4.12 0-7.48 3.05-7.48 7.15s3.36 7.15 7.48 7.15c2.43 0 4.13-.82 5.6-2.28 1.5-1.5 2.04-3.5 2.04-5.54 0-.6-.05-1.18-.15-1.72z"
      />
    </svg>
  ),
};
