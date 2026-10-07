import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoPanel from '@/components/DemoPanel';

export const metadata: Metadata = {
  title: 'VeriChain — Blockchain-Based Tamper-Proof Record Verification',
  description: 'GitHub for Trusted Documents — Issue, Version, Verify and Audit Official Records.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-sky-500 selection:text-white">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
        <DemoPanel />
      </body>
    </html>
  );
}
