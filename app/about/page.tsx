export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-4">关于 ScholarInsight</h1>
          <p className="text-xl text-primary-100">
            深度分析知名学者的学术贡献、影响力与合作网络
          </p>
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* 项目介绍 */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-academic-900 mb-6">项目背景</h2>
              <div className="prose prose-lg text-academic-700">
                <p className="mb-4">
                  ScholarInsight 是一个现代化的学者信息分析平台，旨在为学术界和研究机构提供深度、全面的学者分析服务。
                  我们致力于通过数据驱动的方法，揭示学者的学术贡献、影响力模式以及合作网络结构。
                </p>
                <p className="mb-4">
                  在当今快速发展的学术环境中，了解学者的研究轨迹、影响力分布和合作模式对于学术决策、
                  研究规划和人才评估具有重要意义。我们的平台通过整合多源数据，构建了完整的学者画像体系。
                </p>
              </div>
            </section>

            {/* 核心功能 */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-academic-900 mb-6">核心功能</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card">
                  <h3 className="text-xl font-semibold text-academic-900 mb-3">📊 学术影响力分析</h3>
                  <p className="text-academic-700">
                    通过H-index、引用量、论文数量等多维度指标，全面评估学者的学术影响力。
                    结合时间序列分析，展示影响力的发展趋势。
                  </p>
                </div>
                
                <div className="card">
                  <h3 className="text-xl font-semibold text-academic-900 mb-3">🔗 合作网络可视化</h3>
                  <p className="text-academic-700">
                    使用先进的网络可视化技术，展示学者之间的合作关系网络。
                    节点大小代表影响力，连线粗细表示合作强度。
                  </p>
                </div>
                
                <div className="card">
                  <h3 className="text-xl font-semibold text-academic-900 mb-3">📝 深度报告生成</h3>
                  <p className="text-academic-700">
                    基于标准化的分析框架，生成结构化的学者分析报告。
                    涵盖学术档案、贡献分析、思想画像等多个维度。
                  </p>
                </div>
                
                <div className="card">
                  <h3 className="text-xl font-semibold text-academic-900 mb-3">💡 智能批注系统</h3>
                  <p className="text-academic-700">
                    支持用户对报告内容进行个性化批注和笔记。
                    提供协作功能，促进学术交流和知识分享。
                  </p>
                </div>
              </div>
            </section>

            {/* 技术特色 */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-academic-900 mb-6">技术特色</h2>
              <div className="bg-academic-50 rounded-lg p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <h3 className="text-lg font-semibold text-academic-900 mb-2">数据驱动</h3>
                    <p className="text-academic-600 text-sm">
                      基于多源学术数据，确保分析的准确性和全面性
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔬</span>
                    </div>
                    <h3 className="text-lg font-semibold text-academic-900 mb-2">科学方法</h3>
                    <p className="text-academic-600 text-sm">
                      采用标准化的分析框架，确保结果的可比性和可靠性
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <h3 className="text-lg font-semibold text-academic-900 mb-2">技术创新</h3>
                    <p className="text-academic-600 text-sm">
                      运用最新的Web技术和可视化技术，提供优秀的用户体验
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 应用场景 */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-academic-900 mb-6">应用场景</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-academic-900 mb-2">学术机构人才评估</h3>
                    <p className="text-academic-700">
                      为高校和研究机构提供客观的学者评估数据，支持人才引进、职称评定和资源配置决策。
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-academic-900 mb-2">研究合作发现</h3>
                    <p className="text-academic-700">
                      通过合作网络分析，帮助学者发现潜在的合作机会，促进跨学科和跨机构的研究合作。
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-academic-900 mb-2">学术趋势分析</h3>
                    <p className="text-academic-700">
                      追踪学者的研究轨迹和影响力变化，为学术发展趋势分析提供数据支持。
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-academic-900 mb-2">学术交流平台</h3>
                    <p className="text-academic-700">
                      为学术界提供信息分享和交流的平台，促进学术思想的传播和讨论。
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 发展愿景 */}
            <section className="mb-12">
              <h2 className="text-3xl font-bold text-academic-900 mb-6">发展愿景</h2>
              <div className="card bg-gradient-to-r from-primary-50 to-primary-100 border-primary-200">
                <p className="text-lg text-academic-800 leading-relaxed">
                  我们致力于成为全球领先的学者信息分析平台，通过持续的技术创新和数据积累，
                  为学术界提供更加精准、全面的分析服务。我们相信，通过数据驱动的学术分析，
                  可以更好地促进学术交流、推动科研合作，最终推动整个学术界的进步和发展。
                </p>
              </div>
            </section>

            {/* 联系我们 */}
            <section>
              <h2 className="text-3xl font-bold text-academic-900 mb-6">联系我们</h2>
              <div className="card">
                <p className="text-academic-700 mb-4">
                  如果您对我们的平台有任何建议或合作意向，欢迎与我们联系。
                </p>
                <div className="flex items-center space-x-4 text-academic-600">
                  <span>📧 Email: contact@scholarinsight.com</span>
                  <span>🌐 Website: www.scholarinsight.com</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <div className="bg-academic-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© 2024 ScholarInsight. All Rights Reserved.</p>
        </div>
      </div>
    </div>
  )
}
