
// import React from 'react'
// import { Bar, BarChart, Legend, Tooltip, XAxis, YAxis } from 'recharts'

// function BarChartDashboard({budgetList}) {
//   return (
//     <div className='border rounded-lg p-6'>
//       <h2 className='font-bold text-lg'>Activity</h2>
//       <BarChart width={500} height={300} data={budgetList} 
//       // margin = {{
//       //   top:5,
//       //   right:5,
//       //   left:5,
//       //   bottom:5
//       // }} 
//       >
//         <XAxis dataKey='name'/>
//         <YAxis/>
//         <Tooltip/>
//         <Legend/>
//         <Bar dataKey='totalSpend' stackId="a" fill='#4845d2'/>
//         <Bar dataKey='amount' stackId="a" fill='#C3C2FF'/>

//       </BarChart>
//     </div>
//   )
// }

// export default BarChartDashboard

"use client"; // Ensure this file is client-side only
import dynamic from "next/dynamic";
import React from "react";
import { Bar, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Dynamically import BarChart with SSR disabled
const BarChart = dynamic(() => import("recharts").then((mod) => mod.BarChart), { ssr: false });

function BarChartDashboard({ budgetList }) {
  return (
    <div className="border rounded-lg p-6">
      <h2 className="font-bold text-lg">Activity</h2>
      <ResponsiveContainer width={'80%'} height={300}>
      <BarChart data={budgetList}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="totalSpend" stackId="a" fill="#4845d2" />
        <Bar dataKey="amount" stackId="a" fill="#C3C2FF" />
      </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartDashboard;
