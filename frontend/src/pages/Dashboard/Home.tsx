import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  const whoIsLoggedIn = "admin"; // Change this value to "teacher" or "admin" to test different views

  return (
    <>
      <PageMeta
        title="Learning Management System Dashboard"
        description="This is the dashboard page for the Learning Management System"
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        {whoIsLoggedIn === "student" && (
          <>
            <div className="col-span-12 space-y-6 xl:col-span-7">
              <EcommerceMetrics />
              <MonthlySalesChart />
            </div>
            <div className="col-span-12 space-y-6 xl:col-span-7">
              <StatisticsChart />
            </div>
          </>
        )}

        {whoIsLoggedIn === "teacher" && (
          <>
            <div className="col-span-12 xl:col-span-5">
              <MonthlyTarget />
            </div>
            <div className="col-span-12 xl:col-span-7">
              <RecentOrders />
            </div>
          </>
        )}

        {whoIsLoggedIn === "admin" && (
          <>
            <div className="col-span-12 xl:col-span-5">
              <DemographicCard />
            </div>
            <div className="col-span-12">
              <StatisticsChart />
            </div>
          </>
        )}
      </div>
    </>
  );
}
