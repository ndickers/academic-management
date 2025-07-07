import { getEnrolledStudent } from "@/api/enrollment/page";
import { useAppSelector } from "@/lib/hooks";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import useSWR from "swr";

export default function Component() {
  const { token } = useAppSelector((state) => state.auth);
  const { data, error, isLoading } = useSWR(
    ["enrollment", token],
    getEnrolledStudent
  );

  console.log({ Enroo: data });

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHead>
          <TableRow>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Course</TableHeadCell>
            <TableHeadCell>Status</TableHeadCell>
            <TableHeadCell>
              <span className="sr-only">Edit</span>
            </TableHeadCell>
          </TableRow>
        </TableHead>
        <TableBody className="divide-y">
          {isLoading ? (
            <p>Fetching...</p>
          ) : data ? (
            data.map(
              ({
                status,
                student,
                course,
              }: {
                status: string;
                student: { email: string };
                course: { title: string };
              }) => (
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell>{student.email}</TableCell>
                  <TableCell>{course.title}</TableCell>
                  <TableCell>{status}</TableCell>
                  <TableCell>
                    <a
                      href="#"
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                    >
                      Edit
                    </a>
                  </TableCell>
                </TableRow>
              )
            )
          ) : (
            <p>No data</p>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
