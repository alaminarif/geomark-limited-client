import Loading from "@/components/layout/Loading";
import { useGetSingleEmployeeQuery } from "@/redux/features/employee/employee.api";
import { useParams } from "react-router";

const EmployeeDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetSingleEmployeeQuery(id as string);
  if (isLoading) {
    return <Loading />;
  }

  console.log(data);
  return (
    <div>
      <h1>EMPLOYEE Details for ID: {id}</h1>
    </div>
  );
};

export default EmployeeDetails;
