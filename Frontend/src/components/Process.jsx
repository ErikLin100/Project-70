import React from 'react';

const steps = [
  { title: 'Upload', description: 'Upload your video to our platform via Youtube-link' },
  { title: 'Analyze', description: 'AI analyzes content for viral potential' },
  { title: 'Curate', description: 'Receive AI-curated video clips' },
  { title: 'Share', description: 'Share clips and watch them go viral' }
];

function Process() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-opensans text-center mb-12 bg-main-gradient from-main-start to-main-end text-transparent bg-clip-text leading-relaxed">
          How HiLight.AI Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center pb-6">
              <div className="bg-main-gradient from-main-start to-main-end text-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                {index + 1}
              </div>
              <h3 className="text-xl font-opensans font-bold mb-3 bg-main-gradient from-main-start to-main-end text-transparent bg-clip-text">{step.title}</h3>
              <p className="font-semibold font-opensans mb-4 text-[#313030] px-2">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Process;