import './globals.css';

export const metadata = {
  title: 'Nigoh',
  description: 'Nigoh platformasi Next.js formatiga ko‘chirildi.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" className="dark">
      <body>{children}</body>
    </html>
  );
}
