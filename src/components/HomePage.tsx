import { motion } from "motion/react";
import { Upload, Zap, Building2, Sparkles } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://cdn.coverr.co/videos/coverr-building-information-modeling-9273/1080p.mp4" type="video/mp4" />
        {/* Fallback for browsers that don't support video */}
      </video>
      
      {/* Blue Overlay with 45% transparency */}
      <div className="absolute inset-0 bg-[#3C73AD] opacity-45"></div>

      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <h1 className="text-[#F3EEE8]" style={{ fontSize: '3.5rem', fontWeight: 700, lineHeight: 1.2 }}>
                Turn your scans into smart 3D models.
              </h1>
              <p className="text-[#AEE1FE]" style={{ fontSize: '1.25rem', lineHeight: 1.6 }}>
                VizTwin uses AI to convert point clouds into accurate, interactive building models — no technical background needed.
              </p>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => onNavigate('dashboard')}
                  className="bg-[#FFE2EE] text-[#79274B] px-8 py-4 rounded-xl hover:bg-[#FFE2EE]/90 transition-all transform hover:scale-105 shadow-lg"
                  style={{ fontWeight: 600 }}
                >
                  Upload Your Scan
                </button>
                <button className="bg-transparent border-2 border-[#AEE1FE] text-[#AEE1FE] px-8 py-4 rounded-xl hover:bg-[#AEE1FE]/10 transition-all">
                  Watch Demo
                </button>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1684450471771-b70596cf13dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzRCUyMGFyY2hpdGVjdHVyYWwlMjBibHVlcHJpbnR8ZW58MXx8fHwxNzYwMDIyODIwfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="3D Building Scan"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#3C73AD]/80 to-transparent"></div>
                
                {/* Floating Animation */}
                <motion.div
                  className="absolute top-4 right-4 bg-[#FFE2EE] p-4 rounded-xl shadow-lg"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-6 h-6 text-[#79274B]" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#F3EEE8]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-[#3C73AD] mb-4" style={{ fontSize: '2.5rem', fontWeight: 600 }}>
              Why Choose VizTwin?
            </h2>
            <p className="text-[#3C73AD]/70 max-w-2xl mx-auto" style={{ fontSize: '1.125rem' }}>
              Transform your building scans into actionable insights with AI-powered precision.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="bg-[#AEE1FE] w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Upload className="w-7 h-7 text-[#3C73AD]" />
              </div>
              <h3 className="text-[#3C73AD] mb-3">Easy Upload</h3>
              <p className="text-[#3C73AD]/70">
                Simply drag and drop your point cloud files. We support all major scan formats.
              </p>
            </motion.div>

            {/* Feature 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="bg-[#FFE2EE] w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-7 h-7 text-[#79274B]" />
              </div>
              <h3 className="text-[#3C73AD] mb-3">AI-Powered Processing</h3>
              <p className="text-[#3C73AD]/70">
                Our advanced AI automatically identifies walls, doors, ceilings, and architectural elements.
              </p>
            </motion.div>

            {/* Feature 3 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="bg-[#AEE1FE] w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                <Building2 className="w-7 h-7 text-[#3C73AD]" />
              </div>
              <h3 className="text-[#3C73AD] mb-3">Interactive Models</h3>
              <p className="text-[#3C73AD]/70">
                Explore your building in 3D with intuitive controls. Export to popular formats.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#3C73AD] to-[#2a5a8a]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[#F3EEE8] mb-6" style={{ fontSize: '2.5rem', fontWeight: 600 }}>
              Ready to get started?
            </h2>
            <p className="text-[#AEE1FE] mb-8" style={{ fontSize: '1.125rem' }}>
              Join thousands of building owners transforming their scans into smart models.
            </p>
            <button 
              onClick={() => onNavigate('dashboard')}
              className="bg-[#FFE2EE] text-[#79274B] px-10 py-4 rounded-xl hover:bg-[#FFE2EE]/90 transition-all transform hover:scale-105 shadow-lg"
              style={{ fontWeight: 600, fontSize: '1.125rem' }}
            >
              Start Your First Scan
            </button>
          </motion.div>
        </div>
      </section>
      </div>
    </div>
  );
}
