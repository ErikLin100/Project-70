import React from 'react';
import { HiLightningBolt, HiAnnotation, HiPhotograph, HiShare, HiCalendar } from 'react-icons/hi';

const features = [
  { icon: HiLightningBolt, title: 'AI Highlight Detection', description: 'Automatically find viral moments in long videos' },
  { icon: HiAnnotation, title: 'Animated Captions', description: 'Add engaging animated captions to your clips' },
  { icon: HiPhotograph, title: 'Custom Thumbnails', description: 'Generate eye-catching thumbnails for each highlight' },
  { icon: HiShare, title: 'Multi-Platform Export', description: 'Export clips optimized for various social platforms' },
  { icon: HiCalendar, title: 'Scheduled Sharing', description: 'Plan and automate your content distribution' }
];

function Features() {
  return (
    <section className="py-16 ">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-opensans text-center mb-12 bg-main-gradient from-main-start to-main-end text-transparent bg-clip-text">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <feature.icon className="w-12 h-12 mb-4 text-main-start" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;