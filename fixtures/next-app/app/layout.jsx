import '@mohirlab/themes/styles.css';
import '@mohirlab/sprinkles/styles.css';
import '@mohirlab/motion/styles.css';
import '@mohirlab/react/styles.css';

export const metadata = { title: 'Mohirlab fixture' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
