/* eslint-disable @typescript-eslint/no-explicit-any */
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import Loading from "@/components/layout/Loading";
import ProjectFilter from "@/components/modules/Project/ProjectFilter";
import { useGetAllProjectsQuery } from "@/redux/features/project/project.api";
import { useNavigate, useSearchParams } from "react-router";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useState } from "react";
import ProjectCard from "@/components/modules/Project/ProjectCard";

type ViewMode = "card" | "table";

const ProjectPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(3);
  const [searchParams] = useSearchParams();

  const title = searchParams.get("title") || undefined;
  const status = searchParams.get("status") || undefined;

  const { data: projects, isLoading } = useGetAllProjectsQuery({ title, status, page: currentPage, limit });

  const totalPage = projects?.meta?.totalPage || 1;
  console.log(totalPage);

  if (isLoading) return <Loading />;

  const handleProjectDetails = (id: string) => {
    navigate(`/project/${id}`);
  };

  return (
    <section className="container mx-auto">
      <div className="mx-6">
        <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-12 lg:items-end ">
          {/* 9/12 width */}
          <div className="lg:col-span-9">
            <ProjectFilter />
          </div>

          {/* 3/12 width */}
          <div className="lg:col-span-3 flex justify-start lg:justify-end">
            <Button
              variant="outline"
              size="sm"
              className="w-auto h-9 px-3"
              onClick={() => setViewMode((prev) => (prev === "card" ? "table" : "card"))}
            >
              {viewMode === "card" ? "Table View" : "Card View"}
            </Button>
          </div>
        </div>

        {/* CARD VIEW */}
        {viewMode === "card" && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects?.data?.map((item: any) => (
              <ProjectCard key={item?._id} item={item} onView={handleProjectDetails} />
            ))}
          </div>
        )}

        {/*  TABLE VIEW */}
        {viewMode === "table" && (
          <Table className="border border-muted rounded-4xl mt-6">
            <TableHeader>
              <TableRow>
                <TableHead className="text-center font-bold">Image</TableHead>
                <TableHead className="text-center font-bold">Project Name</TableHead>
                <TableHead className="text-center font-bold">Period</TableHead>
                <TableHead className="text-center font-bold">Status</TableHead>
                <TableHead className="text-center font-bold">Sector</TableHead>
                <TableHead className="text-center font-bold">Client</TableHead>
                <TableHead className="text-right font-bold">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {projects?.data?.map((item: any) => (
                <TableRow key={item?._id}>
                  <TableCell className="font-medium">
                    <img src={item.picture} className="w-25 h-20 rounded-xl" />
                  </TableCell>

                  <TableCell className="font-medium">
                    <p className="font-medium whitespace-normal wrap-break-word">{item.name}</p>
                  </TableCell>

                  <TableCell>
                    <p>{item?.startDate ? format(new Date(item.startDate), "PPP") : "-"}</p>
                  </TableCell>

                  <TableCell>
                    <p>{item.status}</p>
                  </TableCell>

                  <TableCell>
                    <p className="whitespace-normal wrap-break-word">{item.title}</p>
                  </TableCell>

                  <TableCell>
                    <p>{item?.client?.name}</p>
                  </TableCell>

                  <TableCell className="font-medium text-right">
                    <Button onClick={() => handleProjectDetails(item?._id)} variant="outline" className="text-destructive">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {totalPage > 1 && (
          <div className="flex justify-end mt-4">
            <div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage((prev) => prev - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {Array.from({ length: totalPage }, (_, index) => index + 1).map((page) => (
                    <PaginationItem key={page} onClick={() => setCurrentPage(page)}>
                      <PaginationLink isActive={currentPage === page}>{page}</PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage((prev) => prev + 1)}
                      className={currentPage === totalPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProjectPage;
