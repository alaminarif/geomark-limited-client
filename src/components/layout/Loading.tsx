const Loading = () => {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
      <div className="relative h-14 w-14">
        {/* soft pulsing ring */}
        <div className="absolute inset-0 rounded-full bg-primary/15 animate-ping" />
        {/* main spinner */}
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary border-r-primary" />
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-medium text-foreground/80">Loading</span>
        <span className="flex gap-1">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
        </span>
      </div>
    </div>
  );
};

export default Loading;

// export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const Loading = () => {
//   return (
//     <div className="mx-auto flex min-h-[60vh] w-full flex-col items-center justify-center gap-4">
//       <div className="relative h-16 w-16">
//         <div className="absolute inset-0 rounded-full border border-primary/20" />
//         <div className="absolute inset-2 rounded-full border border-primary/20" />

//         <div className="absolute inset-0 animate-[spin_1.1s_linear_infinite]">
//           <div className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_18px_hsl(var(--primary))]" />
//         </div>

//         <div className="absolute inset-2 animate-[spin_1.6s_linear_infinite_reverse]">
//           <div className="absolute left-1/2 top-0 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-primary/70" />
//         </div>

//         <div className="absolute inset-0 grid place-items-center">
//           <div className="h-7 w-7 animate-pulse rounded-full bg-primary/15" />
//         </div>
//       </div>

//       <div className="flex items-center gap-2 text-sm text-muted-foreground">
//         <span>Please wait</span>
//         <span className="flex gap-1">
//           <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
//           <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
//           <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
//         </span>
//       </div>
//     </div>
//   );
// };

// export default Loading;
