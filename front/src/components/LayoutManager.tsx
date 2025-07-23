// "use client";

// import { useRef, useState, useEffect } from "react";
// import ExcludedWrapper from "../components/ExcludedWrapper";
// import { useOutsideClick } from "../hooks/useOutsideClick";
// import clsx from "clsx";

// interface LayoutManagerProps {
//   children: React.ReactNode;
//   showContainer?: boolean;
// }

// export default function LayoutManager({
//   children,
//   showContainer = true,
// }: LayoutManagerProps) {
//   const [isSidebarCollapsed, setSidebarCollapsed] = useState(true);
//   const [isMobileOverlay, setIsMobileOverlay] = useState(false);

//   const sidebarRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const handleResize = () => {
//       if (window.innerWidth < 1024) {
//         setSidebarCollapsed(true);
//       }
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   useEffect(() => {
//     const isMobile = window.innerWidth < 1024;
//     setIsMobileOverlay(!isSidebarCollapsed && isMobile);
//   }, [isSidebarCollapsed]);

//   useOutsideClick(sidebarRef, () => {
//     if (window.innerWidth < 1024 && !isSidebarCollapsed) {
//       setSidebarCollapsed(true);
//     }
//   });

//   return (
//     <>
//       {isMobileOverlay && (
//         <div className="fixed inset-0 bg-black opacity-50 z-30" />
//       )}

//       <div
//         className={clsx(
//           "transition-all duration-300 w-full",
//           isSidebarCollapsed ? "lg:ml-16" : "lg:ml-72"
//         )}
//       >
//         <ExcludedWrapper>
//           {showContainer ? (
//             <main>
//               {children}
//             </main>
//           ) : (
//             children
//           )}
//         </ExcludedWrapper>
//       </div>
//     </>
//   );
// }
