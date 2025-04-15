import React from 'react'

function Body() {
  return (
    <div>{/*
        Heads up! 👋
      
        This component comes with some `rtl` classes. Please remove them if they are not needed in your project.
      */}
      
      <section
        className="relative bg-[url(https://images.pexels.com/photos/5632353/pexels-photo-5632353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2)] bg-cover bg-center bg-no-repeat"
      >
        <div
          className="absolute inset-0 bg-gray-900/75 sm:bg-transparent sm:from-gray-900/95 sm:to-gray-900/25 ltr:sm:bg-gradient-to-r rtl:sm:bg-gradient-to-l"
        ></div>
      
        <div
          className="relative mx-auto max-w-screen-xl px-4 py-32 sm:px-6 lg:flex lg:h-screen lg:items-center lg:px-8"
        >
          <div className="max-w-xl text-center ltr:sm:text-left rtl:sm:text-right">
            <h1 className="text-3xl font-extrabold text-rose-500 sm:text-5xl">
              Manage Your Expense
      
              <strong className="block font-extrabold text-white"> Control your Money </strong>
            </h1>
      
            <p className="mt-4 max-w-lg text-slate-950 sm:text-xl/relaxed">
              Start Creating your budget and save Money 
            </p>
      
            <div className="mt-8 flex flex-wrap gap-4 text-center">
              <a
                href="/dashboard"
                className="block w-full rounded-sm bg-rose-600 px-12 py-3 text-sm font-medium text-white shadow-sm hover:bg-rose-700 focus:ring-3 focus:outline-hidden sm:w-auto"
              >
                Get Started
              </a>
      
              <a
                href="#"
                className="block w-full rounded-sm bg-white px-12 py-3 text-sm font-medium text-rose-600 shadow-sm hover:text-rose-700 focus:ring-3 focus:outline-hidden sm:w-auto"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>
      </div>
  )
}

export default Body