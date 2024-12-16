"use client";

import Link from 'next/link';

export default function InstructionPage() {
   
    return(
       <div>
       
       
         <h2 className="text-xl font-semibold mb-4 text-blue-800"> Instructions </h2>
         <ul className="list-disc list-inside space-y-2">
           <li>Try to guess the word in  maxattempts or less</li>
           <li>Each guess must be a valid letter word</li>
           <li>After each guess, the color of the tiles will change to show how close your guess was</li>
         </ul>
         <div>
         
         <div className="mt-6">
               
                <Link href="/game">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                    <button
                        className="px-6 py-2 bg-green-600 text-white text-lg rounded hover:bg-green-700 transition"
                        aria-label="Start the game"
                    >
                        Start Game
                    </button>
                </Link>
            </div>
        
        </div>
        
       </div>
    );
}



  
