/* eslint-disable @typescript-eslint/no-explicit-any */
import Loading from "@/components/layout/Loading";
import { useGetAllEmployeesQuery } from "@/redux/features/employee/employee.api";
// import { useNavigate } from "react-router";

const EmployeePage = () => {
  // const Navigate = useNavigate();

  const { data, isLoading } = useGetAllEmployeesQuery({ sort: "createdAt" });
  // const services = data?.data || [];

  if (isLoading) return <Loading />;
  return (
    <section className="container mx-auto">
      <div className="px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 ">
        <div className="grid  grid-cols-12  gap-8 md:gap-16">
          <div className="col-span-12  lg:col-span-4 bg-accent p-2  ">
            {/* {services.map((service: any) => (
              <ul className="bg-transparent">
                <li className="text-md my-2">{service.name}</li>
              </ul>
            ))} */}
          </div>
          <div className=" grid col-span-12  lg:col-span-8 justify-center bg-accent">
            {data?.data.map((employee: any) => (
              <>
                <p>{employee.name}</p>
                <p className="mb-4">{employee.designation}</p>
              </>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmployeePage;
