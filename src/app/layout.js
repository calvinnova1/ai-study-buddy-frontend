import { Inter } from 'next/font/google';
import Link from 'next/link';
import '../styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Study Buddy - Smart Note Summarizer & Quiz Generator',
  description: 'Upload your notes and get AI-powered summaries and quizzes instantly',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {/* Navigation Bar */}
          <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                {/* Logo/Brand */}
                <Link href="/" className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-xl">AI</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900">Study Buddy</span>
                </Link>

                {/* Navigation Links */}
                <div className="flex space-x-8">
                  <Link 
                    href="/" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Upload
                  </Link>
                  <Link 
                    href="/summary" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Summary
                  </Link>
                  <Link 
                    href="/quiz" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Quiz
                  </Link>
                  <Link 
                    href="/progress" 
                    className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition"
                  >
                    Progress
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="text-center text-gray-600 text-sm">
                <p>&copy; 2025 AI Study Buddy. Powered by Gemini AI.</p>
                <p className="mt-1">Made with ❤️ for students everywhere</p>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}