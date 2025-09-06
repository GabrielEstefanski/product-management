export default function Header() {
  return (
    <header className="bg-gray-900 border-b border-gray-200/60 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
                <div>
                <h1 className="text-xl font-semibold text-white tracking-tight">
                    Product Management System
                </h1>
                </div>
            </div>
            </div>
            
            <div className="flex items-center space-x-6">
            <nav className="hidden md:flex items-center space-x-6">
                <a href="#" className="text-sm font-medium text-white hover:text-blue-200 transition-colors">
                Dashboard
                </a>
                <a href="#" className="text-sm font-medium text-white hover:text-blue-200 transition-colors">
                Produtos
                </a>
                <a href="#" className="text-sm font-medium text-white hover:text-blue-200 transition-colors">
                Categorias
                </a>
                <a href="#" className="text-sm font-medium text-white hover:text-blue-200 transition-colors">
                Relatórios
                </a>
            </nav>
            
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                </div>
            </div>
            </div>
        </div>
        </div>
    </header>
  );
}