import { Card, CardBody, Typography } from "@material-tailwind/react";
import { GenericTableProps } from "@/types/ui";

export default function GenericTable<T>({
  data,
  columns,
  getRowKey,
}: GenericTableProps<T>) {
  return (
    <Card>
      <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
        <table className="w-full min-w-[640px] table-auto">
          <thead>
            <tr>
              {columns.map(col => (
                <th
                  key={col.key}
                  style={{ width: col.width }}
                  className="border-b border-blue-gray-50 py-3 px-5 text-center text-xs"
                >
                  <Typography
                    variant="small"
                    className="font-bold uppercase text-blue-gray-400 text-xs"
                  >
                    {col.label}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row) => (
              <tr key={getRowKey(row)}>
                {columns.map(col => (
                  <td
                    key={col.key}
                    className="py-3 px-5 text-center border-b border-blue-gray-50 text-xs text-blue-gray-600"
                  >
                    {col.render
                      ? col.render(row)
                      : 
                        (row as any)[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </CardBody>
    </Card>
  );
}