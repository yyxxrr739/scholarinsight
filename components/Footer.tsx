export default function Footer() {
  return (
    <footer className="bg-black/90 backdrop-blur-sm text-white py-6 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              <span className="text-lg font-semibold">ScholarInsight</span>
            </div>
          </div>
          
          <div className="text-gray-400 text-xs space-y-1 text-center md:text-right">
            <div>© 2024 ScholarInsight. All Rights Reserved.</div>
            <div>ICP备案号：京ICP备XXXXXXXX号</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
