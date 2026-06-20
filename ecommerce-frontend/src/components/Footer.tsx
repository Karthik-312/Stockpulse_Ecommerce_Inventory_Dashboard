export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-purple-600 rounded-md flex items-center justify-center">
              <span className="text-white font-bold text-[10px]">SP</span>
            </div>
            <span className="text-white font-semibold text-sm">StockPulse</span>
          </div>
          <p className="text-xs text-center sm:text-right">
            Real-time inventory powered by StockPulse API
          </p>
        </div>
      </div>
    </footer>
  )
}
