function Features() {
  const features = [
    {
      title: "Professional Templates",
      description: "Choose from a variety of professionally designed templates that suit your industry and style.",
      icon: "🎨",
      color: "bg-[#B7E0FF]",
      darkColor: "dark:bg-blue-900/30"
    },
    {
      title: "Easy Customization",
      description: "Customize every aspect of your CV with our intuitive editor. Change colors, fonts, and layouts with ease.",
      icon: "⚙️",
      color: "bg-[#FFF5CD]",
      darkColor: "dark:bg-yellow-900/30"
    },
    {
      title: "ATS Friendly",
      description: "Our CVs are optimized for Applicant Tracking Systems, helping you get past automated screening.",
      icon: "📊",
      color: "bg-[#FFCFB3]",
      darkColor: "dark:bg-orange-900/30"
    },
    {
      title: "Export Options",
      description: "Download your CV in multiple formats including PDF, Word, and more.",
      icon: "📥",
      color: "bg-[#E78F81]",
      darkColor: "dark:bg-red-900/30"
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-bold text-[#2c3e50] dark:text-white mb-6">
            Why Choose Our CV Builder?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Create a professional CV in minutes with our easy-to-use builder
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative"
            >
              <div className={`absolute inset-0 ${feature.color} ${feature.darkColor} opacity-10 rounded-xl transform group-hover:scale-105 transition-all duration-300`}></div>
              <div className="relative p-8 text-center">
                <div className="text-5xl mb-6 mx-auto">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[#2c3e50] dark:text-white mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 max-w-4xl mx-auto bg-gradient-to-r from-[#B7E0FF] to-[#FFCFB3] dark:from-blue-900/40 dark:to-orange-900/40 rounded-2xl p-1">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-[#2c3e50] dark:text-white mb-4">
              Ready to Build Your Professional CV?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Join thousands of job seekers who have successfully landed their dream jobs
            </p>
            <button className="bg-[#E78F81] dark:bg-[#d36e62] text-white px-8 py-3 rounded-lg hover:bg-[#d36e62] dark:hover:bg-[#c65c50] transition-all transform hover:scale-105 font-semibold">
              Start Building Now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features; 