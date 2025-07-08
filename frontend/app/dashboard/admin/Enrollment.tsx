import { confirmEnrollment, getEnrolledStudent } from "@/api/enrollment/page";
import BasicModal from "@/components/Modal";
import { useAppSelector } from "@/lib/hooks";
import {
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { useState } from "react";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";

export default function Component() {
  const { token } = useAppSelector((state) => state.auth);
  const { data, error, isLoading } = useSWR(
    ["enrollment", token],
    getEnrolledStudent
  );
  const [open, setOpen] = useState(false);
  const [enrollId, setEnrollId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const handleReject = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const rejected = await confirmEnrollment({
      id: enrollId as number,
      accessToken: token as string,
      data: {
        status: "REJECTED",
      },
    });
    if (rejected) {
      setLoading(false);
      setOpen(false);
      if ("statusText" in rejected && rejected.statusText === "OK") {
        mutate(["enrollment", token]);
        toast.success(`Enrollement ${rejected.data.status.toLowerCase()}`, {
          toastId: "rejected",
        });
      } else {
        toast.error(rejected?.data.message || "Something went wrong", {
          toastId: "error",
        });
      }
    }
    setLoading(false);
  };

  const handleApprove = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const approved = await confirmEnrollment({
      id: enrollId as number,
      accessToken: token as string,
      data: {
        status: "APPROVED",
      },
    });
    if (approved) {
      setLoading(false);
      setOpen(false);
      if ("statusText" in approved && approved.statusText === "OK") {
        mutate(["enrollment", token]);
        toast.success(`Enrollement ${approved.data.status.toLowerCase()}`, {
          toastId: "approved",
        });
      } else {
        toast.error(approved?.data.message || "Something went wrong", {
          toastId: "error",
        });
      }
    }
    setLoading(false);
  };

  return (
    <div className="overflow-x-auto w-full">
      <Table className="max-w-[800px] mx-auto">
        <TableHead>
          <TableRow>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Course</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>Modify</TableHeadCell>
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
                status,
                student,
                course,
              }: {
                id: number;
                status: string;
                student: { email: string };
                course: { title: string };
              }) => (
                <TableRow
                  key={id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{status}</TableCell>
                  <TableCell>
                    <button
                      onClick={() => {
                        setOpen(true);
                        setEnrollId(id);
                      }}
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Edit
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
        setUpdateDetails={setEnrollId as any}
      >
        <div>
          <h2 className="text-center font-bold">Approve Enrollement</h2>

          <div className="flex items-center justify-between px-6 mt-5">
            <form action="" onSubmit={handleReject}>
              <button className="bg-red-500 text-center w-[6rem] p-1 font-semibold rounded-sm justify-center flex flex-nowrap gap-2">
                Reject
                {loading && (
                  <Spinner
                    color="warning"
                    aria-label="Small  spinner example"
                    size="sm"
                  />
                )}
              </button>
            </form>
            <form action="" onSubmit={handleApprove}>
              <button className="text-center bg-green-500 p-1 w-[6rem] font-semibold rounded-sm justify-center flex flex-nowrap gap-2">
                Approve
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
