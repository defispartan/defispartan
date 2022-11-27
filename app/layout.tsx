import Head from 'next/head';
import '../styles/globals.css'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="[color-scheme:dark]">
            <Head>
                <title>DeFi Spartan&#39;s Homepage</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <body>
                {children}
            </body>
        </html>)
}