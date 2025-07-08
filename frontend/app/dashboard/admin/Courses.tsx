import { getAllCourses } from "@/api/courseApi/page";
import { confirmEnrollment } from "@/api/enrollment/page";
import { assignLec, getAllLecturer } from "@/api/usersApi/page";
import BasicModal from "@/components/Modal";
import { useAppSelector } from "@/lib/hooks";
import {
  Select,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";

export default function Component() {
  const { token } = useAppSelector((state) => state.auth);
  const { data, error, isLoading } = useSWR(["courses", token], getAllCourses);
  const [courseId, setCourseId] = useState<number | null>(null);
  const [selectedLecturer, setSelectedLecturer] = useState<{
    id: number;
    email: string;
  } | null>(null);

  const {
    data: lecturers,
    error: lecError,
    isLoading: lecIsLoading,
  } = useSWR(["users", selectedLecturer?.id, token], getAllLecturer);
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const handleAssign = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const assigned = await assignLec({
      id: Number(courseId),
      accessToken: token as string,
      data: {
        lecturerId: Number(selectedLecturer?.id),
      },
    });
    if (assigned) {
      setLoading(false);
      setOpen(false);
      if ("statusText" in assigned && assigned.statusText === "OK") {
        mutate(["courses", token]);
        setSelectedLecturer((prevData: any) => ({
          ...prevData,
          id: assigned.data.lecId,
        }));
        toast.success(assigned.data.message, {
          toastId: "approved",
        });
      } else {
        toast.error(assigned?.data.message || "Something went wrong", {
          toastId: "error",
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="overflow-x-auto w-full">
      <Table className="max-w-[1000px] mx-auto">
        <TableHead>
          <TableRow>
            <TableHeadCell>Course</TableHeadCell>
            <TableHeadCell>Credit</TableHeadCell>
            <TableHeadCell>Syllabus</TableHeadCell>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Assign Lec</TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {isLoading ? (
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell className="text-center">Fetching...</TableCell>
            </TableRow>
          ) : data ? (
            data.map(
              ({
                id,
                credits,
                lecturer,
                syllabus,
                title,
              }: {
                id: number;
                credits: string;
                syllabus: string;
                lecturer: { email: string; id: number };
                title: string;
              }) => (
                <TableRow
                  key={id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell>{title}</TableCell>
                  <TableCell>{credits}</TableCell>
                  <TableCell>
                    <Link
                      className="my-auto text-xs underline text-blue-600"
                      href={`${process.env.NEXT_PUBLIC_IMAGE}/${syllabus}`}
                    >
                      View syllabus
                    </Link>
                  </TableCell>
                  <TableCell>{lecturer.email}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => {
                        setOpen(true);
                        setCourseId(id);
                        setSelectedLecturer({
                          id: lecturer.id,
                          email: lecturer.email,
                        });
                      }}
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Assign
                    </button>
                  </TableCell>
                </TableRow>
              )
            )
          ) : (
            <p>No data</p>
          )}
        </TableBody>
      </Table>
      <BasicModal
        open={open}
        setOpen={setOpen}
        setUpdateDetails={setSelectedLecturer as any}
      >
        <div>
          <h2 className="text-center font-bold">Assign course</h2>

          <div className="flex items-center justify-between mt-5">
            <form action="" className="w-full" onSubmit={handleAssign}>
              <Select
                className=""
                onChange={(e) => {
                  const obj = JSON.parse(e.target.value);
                  setSelectedLecturer(obj);
                }}
              >
                <option
                  key={selectedLecturer?.id}
                  value={JSON.stringify(selectedLecturer)}
                >
                  {selectedLecturer?.email}
                </option>
                {lecIsLoading ? (
                  <option>Fetching...</option>
                ) : (
                  lecturers &&
                  lecturers.map(
                    ({ email, id }: { email: string; id: number }) => (
                      <option key={id} value={JSON.stringify({ id, email })}>
                        {email}
                      </option>
                    )
                  )
                )}
              </Select>
              <button className="text-center mx-auto mt-4 bg-green-500 p-1 w-[6rem] font-semibold rounded-sm justify-center flex flex-nowrap gap-2">
                Assign
                {loading && (
                  <Spinner
                    color="warning"
                    aria-label="Small  spinner example"
                    size="sm"
                  />
                )}
              </button>
            </form>
          </div>
        </div>
      </BasicModal>
    </div>
  );
}
