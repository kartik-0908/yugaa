import Chart from "./peakInteraction";
import RecentChat from "./recentChats";
import TotalInteraction from "./totalInteraction";

export default async function Home() {
  return (
    <div className="mt-4 space-y-4 md:mt-6 md:space-y-6 2xl:mt-7.5 2xl:space-y-7.5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 2xl:gap-7.5">
        <Chart />
        <TotalInteraction />
      </div>
      <div className="col-span-1 md:col-span-2">
          <RecentChat />
      </div>
    </div>
  );
}